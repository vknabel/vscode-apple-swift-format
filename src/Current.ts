export interface Current {
  editor: {
    openURL(url: string): Thenable<void>;
    reportIssueForError(
      error: Partial<Error & { code: number }>
    ): Thenable<void>;
    showErrorMessage<T extends string>(
      message: string,
      ...actions: T[]
    ): Thenable<T | undefined>;
    showWarningMessage<T extends string>(
      message: string,
      ...actions: T[]
    ): Thenable<T | undefined>;
  };
  config: {
    isEnabled(): boolean;
    onlyEnableOnSwiftPMProjects(): boolean;
    onlyEnableWithConfig(): boolean;
    swiftFormatPath(document: vscode.TextDocument): string[] | null;
    resetSwiftFormatPath(): void;
    configureSwiftFormatPath(): void;
    formatConfigSearchPaths(): string[];
  };
}

import * as vscode from "vscode";
import { url } from "./UrlLiteral";
import { absolutePath } from "./AbsolutePath";
import { existsSync } from "fs";
import * as paths from "path";
import * as glob from "glob";
import * as os from "os";

export function prodEnvironment(): Current {
  return {
    editor: {
      async openURL(url: string) {
        await vscode.commands.executeCommand(
          "vscode.open",
          vscode.Uri.parse(url)
        );
      },
      async reportIssueForError(error) {
        const title = `Report ${error.code || ""} ${
          error.message || ""
        }`.replace(/\\n/, " ");
        const body = "`" + (error.stack || JSON.stringify(error)) + "`";
        await Current.editor.openURL(
          url`https://github.com/vknabel/vscode-apple-swift-format/issues/new?title=${title}&body=${body}`
        );
      },
      showErrorMessage: <T extends string>(message: string, ...actions: T[]) =>
        vscode.window.showErrorMessage(message, ...actions) as Thenable<
          T | undefined
        >,
      showWarningMessage: <T extends string>(
        message: string,
        ...actions: T[]
      ) =>
        vscode.window.showWarningMessage(message, ...actions) as Thenable<
          T | undefined
        >,
    },
    config: {
      isEnabled: () =>
        vscode.workspace
          .getConfiguration()
          .get("apple-swift-format.enable", true),
      onlyEnableOnSwiftPMProjects: () =>
        vscode.workspace
          .getConfiguration()
          .get("apple-swift-format.onlyEnableOnSwiftPMProjects", false),
      onlyEnableWithConfig: () =>
        vscode.workspace
          .getConfiguration()
          .get("apple-swift-format.onlyEnableWithConfig", false),

      swiftFormatPath: (document: vscode.TextDocument) => {
        // Grab the project root from the local workspace
        const workspace = vscode.workspace.getWorkspaceFolder(document.uri);
        if (workspace == null) {
          return fallbackGlobalSwiftFormatPath();
        }

        // Support running from Swift PM projects
        let possibleLocalPaths = glob.sync(
          "**/.build/{release,debug}/swift-format",
          { maxDepth: 5 },
        );
        for (const path of possibleLocalPaths) {
          const fullPath = paths.resolve(workspace.uri.fsPath, path);

          if (existsSync(fullPath)) {
            return [absolutePath(fullPath)];
          }
        }

        return fallbackGlobalSwiftFormatPath();
      },
      resetSwiftFormatPath: () =>
        vscode.workspace
          .getConfiguration()
          .update("apple-swift-format.path", undefined),
      configureSwiftFormatPath: () =>
        vscode.commands.executeCommand("workbench.action.openSettings"),
      formatConfigSearchPaths: () =>
        vscode.workspace
          .getConfiguration()
          .get("apple-swift-format.configSearchPaths", [".swift-format"])
          .map(absolutePath),
    },
  };
}

const fallbackGlobalSwiftFormatPath = (): string[] | null => {
  if (
    vscode.workspace
      .getConfiguration()
      .get("apple-swift-format.onlyEnableOnSwiftPMProjects", false)
  ) {
    return null;
  }
  var path = vscode.workspace
    .getConfiguration()
    .get<string[] | string | null>("apple-swift-format.path", null);

  if (typeof path === "string") {
    return [path];
  }
  if (!Array.isArray(path) || path.length === 0) {
    path = [os.platform() === "win32" ? "swift-format.exe" : "swift-format"];
  }

  if (os.platform() !== "win32" && !path[0].includes("/")) {
    // Only a binary name, not a path. Search for it in the path (on Windows this is implicit).
    path = ["/usr/bin/env", ...path];
  }

  return path;
};

const Current = prodEnvironment();
export default Current as Current;
