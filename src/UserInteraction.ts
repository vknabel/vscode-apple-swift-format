import * as vscode from "vscode";
import * as path from "path";
import Current from "./Current";

enum FormatErrorInteraction {
  configure = "Configure",
  reset = "Reset"
}

enum UnknownErrorInteraction {
  reportIssue = "Report issue"
}

const stdinIncompatibleSwiftSyntaxErrorRegex = /<stdin>((:\d+:\d+: error)?: SwiftSyntax parser library isn't compatible)/;
const stdinErrorRegex = /<stdin>((:\d+:\d+: error)?: [^.]+.)/;

export async function handleFormatError(
  error: any,
  document: vscode.TextDocument
) {
  if (error.code === "ENOENT") {
    const selection = await Current.editor.showErrorMessage(
      `Could not find apple/swift-format: ${Current.config.swiftFormatPath(
        document
      )}`,
      FormatErrorInteraction.reset,
      FormatErrorInteraction.configure
    );
    switch (selection) {
      case FormatErrorInteraction.reset:
        Current.config.resetSwiftFormatPath();
        break;
      case FormatErrorInteraction.configure:
        Current.config.configureSwiftFormatPath();
        break;
    }
  } else if (error.code === "EPIPE") {
    await Current.editor.showErrorMessage(
      `apple/swift-format was closed. ${error.stderr || ""}`
    );
  } else if (error.status === 70) {
    await Current.editor.showErrorMessage(
      `apple/swift-format failed. ${error.stderr || ""}`
    );
  } else if (
    error.status === 1 &&
    stdinIncompatibleSwiftSyntaxErrorRegex.test(error.message)
  ) {
    const selection = await Current.editor.showWarningMessage(
      `apple/swift-format does not fit your Swift version. Do you need to update it?`,
      "How?"
    );
    if (selection == "How?") {
      await Current.editor.openURL(
        "https://github.com/vknabel/vscode-apple-swift-format#appleswift-format-for-vs-code"
      );
    }
  } else if (error.status === 1 && stdinErrorRegex.test(error.message)) {
    const execArray = stdinErrorRegex.exec(error.message)!;
    Current.editor.showWarningMessage(
      `${path.basename(document.fileName)}${execArray[1]}`
    );
  } else {
    const unknownErrorSelection = await Current.editor.showErrorMessage(
      `An unknown error occurred. ${error.message || ""}`,
      UnknownErrorInteraction.reportIssue
    );
    if (unknownErrorSelection === UnknownErrorInteraction.reportIssue) {
      await Current.editor.reportIssueForError(error);
    }
  }
}
