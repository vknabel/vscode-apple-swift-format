import * as vscode from "vscode";
import * as childProcess from "child_process";
import Current from "./Current";
import { handleFormatError } from "./UserInteraction";
import { existsSync } from "fs";
import { resolve } from "path";

const wholeDocumentRange = new vscode.Range(
  0,
  0,
  Number.MAX_SAFE_INTEGER,
  Number.MAX_SAFE_INTEGER
);

function userDefinedFormatOptionsForDocument(
  document: vscode.TextDocument
): string[] {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
  const rootPath =
    (workspaceFolder && workspaceFolder.uri.fsPath) ||
    vscode.workspace.rootPath ||
    "./";
  const searchPaths = Current.config
    .formatConfigSearchPaths()
    .map(current => resolve(rootPath, current));
  const existingConfig = searchPaths.find(existsSync);
  return existingConfig != null ? ["--configuration", existingConfig] : [];
}

function format(request: {
  document: vscode.TextDocument;
  parameters?: string[];
  range?: vscode.Range;
  formatting: vscode.FormattingOptions;
}) {
  try {
    const input = request.document.getText(request.range);
    if (input.trim() === "") return [];
    const userDefinedParams = userDefinedFormatOptionsForDocument(
      request.document
    );
    const newContents = childProcess.execFileSync(
      Current.config.swiftFormatPath(request.document),
      [...userDefinedParams, ...(request.parameters || [])],
      {
        encoding: "utf8",
        input
      }
    );
    return newContents !== request.document.getText(request.range)
      ? [
          vscode.TextEdit.replace(
            request.document.validateRange(request.range || wholeDocumentRange),
            newContents
          )
        ]
      : [];
  } catch (error) {
    handleFormatError(error, request.document);
    return [];
  }
}

export class SwiftFormatEditProvider
  implements
    vscode.DocumentRangeFormattingEditProvider,
    vscode.DocumentFormattingEditProvider {
  provideDocumentRangeFormattingEdits(
    document: vscode.TextDocument,
    range: vscode.Range,
    formatting: vscode.FormattingOptions
  ) {
    return format({
      document,
      parameters: [],
      range,
      formatting
    });
  }
  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    formatting: vscode.FormattingOptions
  ) {
    return format({ document, formatting });
  }
}
