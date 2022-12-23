import * as vscode from "vscode";
import * as path from "path";
import Current from "./Current";

enum FormatErrorInteraction {
  configure = "Configure",
  reset = "Reset",
  howTo = "How?",
}

enum UnknownErrorInteraction {
  reportIssue = "Report issue",
}

const stdinIncompatibleSwiftSyntaxErrorRegex =
  /<stdin>((:\d+:\d+: error)?: SwiftSyntax parser library isn't compatible)/;
const stdinErrorRegex = /((:\d+:\d+: error)?: [^.]+.)/;

export async function handleFormatError(
  error: any,
  document: vscode.TextDocument
) {
  function matches(...codeOrStatus: Array<number | string>) {
    return codeOrStatus.some((c) => c === error.code || c === error.status);
  }
  if (matches("ENOENT", 127)) {
    const selection = await Current.editor.showErrorMessage(
      `Could not find apple/swift-format: ${Current.config.swiftFormatPath(
        document
      )}`,
      FormatErrorInteraction.reset,
      FormatErrorInteraction.configure,
      FormatErrorInteraction.howTo
    );
    switch (selection) {
      case FormatErrorInteraction.reset:
        Current.config.resetSwiftFormatPath();
        break;
      case FormatErrorInteraction.configure:
        Current.config.configureSwiftFormatPath();
        break;
      case FormatErrorInteraction.howTo:
        await Current.editor.openURL(
          "https://github.com/vknabel/vscode-apple-swift-format#global-installation"
        );
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
    (stdinIncompatibleSwiftSyntaxErrorRegex.test(error.message) ||
      ("stderr" in error &&
        typeof error.stderr === "string" &&
        error.stderr.includes("_InternalSwiftSyntaxParser")))
  ) {
    const selection = await Current.editor.showWarningMessage(
      `apple/swift-format does not fit your Swift version. Do you need to update and recompile it?`,
      "How?"
    );
    if (selection == "How?") {
      await Current.editor.openURL(
        "https://github.com/vknabel/vscode-apple-swift-format#appleswift-format-for-vs-code"
      );
    }
  } else if (error.status === 1 && stdinErrorRegex.test(error.stderr)) {
    const execArray = stdinErrorRegex.exec(error.stderr)!;
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
