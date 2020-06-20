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

const stdinErrorRegex = /<stdin>(:\d+:\d+: error: [^.]+.)/;

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
  } else if (error.status === 70) {
    await Current.editor.showErrorMessage(
      `apple/swift-format failed. ${error.stderr || ""}`
    );
  } else if (error.status === 1 && stdinErrorRegex.test(error.message)) {
    const execArray = stdinErrorRegex.exec(error.message)!
    Current.editor.showWarningMessage(
      `${path.basename(document.fileName)}${execArray[1]}`
    )
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
