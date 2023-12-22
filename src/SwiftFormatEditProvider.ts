import * as vscode from "vscode";
import Current from "./Current";
import { handleFormatError } from "./UserInteraction";
import { existsSync } from "fs";
import { resolve } from "path";
import { execShellSync } from "./execShell";

const wholeDocumentRange = new vscode.Range(
  0,
  0,
  Number.MAX_SAFE_INTEGER,
  Number.MAX_SAFE_INTEGER
);

function userDefinedFormatOptionsForDocument(document: vscode.TextDocument): {
  options: string[];
  hasConfig: boolean;
} {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
  const rootPath =
    (workspaceFolder && workspaceFolder.uri.fsPath) ||
    vscode.workspace.rootPath ||
    "./";
  const searchPaths = Current.config
    .formatConfigSearchPaths()
    .map((current) => resolve(rootPath, current));
  const existingConfig = searchPaths.find(existsSync);
  const options =
    existingConfig != null ? ["--configuration", existingConfig] : [];
  return {
    options,
    hasConfig: existingConfig != null,
  };
}

function format(request: {
  document: vscode.TextDocument;
  parameters?: string[];
  range?: vscode.Range;
  formatting: vscode.FormattingOptions;
}): vscode.TextEdit[] {
  try {
    const swiftFormatPath = Current.config.swiftFormatPath(request.document);
    if (swiftFormatPath == null) {
      return [];
    }
    const input = request.document.getText(request.range);
    if (input.trim() === "") return [];
    const userDefinedParams = userDefinedFormatOptionsForDocument(
      request.document
    );
    if (!userDefinedParams.hasConfig && Current.config.onlyEnableWithConfig()) {
      return [];
    }
    const newContents = execShellSync(
      swiftFormatPath[0],
      [
        ...swiftFormatPath.slice(1),
        ...userDefinedParams.options,
        ...(request.parameters || []),
      ],
      {
        encoding: "utf8",
        input,
      }
    );
    return newContents !== request.document.getText(request.range)
      ? [
          vscode.TextEdit.replace(
            request.document.validateRange(request.range || wholeDocumentRange),
            newContents
          ),
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
    vscode.DocumentFormattingEditProvider,
    vscode.OnTypeFormattingEditProvider
{
  provideDocumentRangeFormattingEdits(
    document: vscode.TextDocument,
    range: vscode.Range,
    formatting: vscode.FormattingOptions
  ) {
    return format({
      document,
      parameters: [],
      range,
      formatting,
    });
  }
  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    formatting: vscode.FormattingOptions
  ) {
    return format({ document, formatting });
  }
  provideOnTypeFormattingEdits(
    document: vscode.TextDocument,
    position: vscode.Position,
    ch: string,
    formatting: vscode.FormattingOptions,
  ) {
    // Don't format if user has inserted an empty line
    if (document.lineAt(position.line).text.trim() === "") {
      return [];
    }
    return format({ document, formatting });
  }
}
