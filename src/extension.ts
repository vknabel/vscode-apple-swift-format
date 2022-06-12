"use strict";

import * as vscode from "vscode";
import { SwiftFormatEditProvider } from "./SwiftFormatEditProvider";
import Current from "./Current";
import { promisify } from "util";
import * as path from "path";
import { exec } from "child_process";

export function activate(context: vscode.ExtensionContext) {
  if (Current.config.isEnabled() === false) {
    return;
  }

  buildSwiftFormatIfNeeded().then(() => {
    const swiftSelector: vscode.DocumentSelector = {
      scheme: "file",
      language: "swift",
    };
    const editProvider = new SwiftFormatEditProvider();
    vscode.languages.registerDocumentRangeFormattingEditProvider(
      swiftSelector,
      editProvider
    );
    vscode.languages.registerDocumentFormattingEditProvider(
      swiftSelector,
      editProvider
    );
  });
}

async function buildSwiftFormatIfNeeded() {
  const manifests = await vscode.workspace.findFiles(
    "**/Package.swift",
    "**/.build/**",
    2
  );
  if (manifests.length == 0) {
    return;
  }
  const buildOperations = manifests.map((manifest) => {
    const manifestPath = manifest.fsPath;
    const manifestDir = path.dirname(manifestPath);
    return promisify(exec)("swift run -c release swift-format --version", {
      cwd: manifestDir,
    });
  });
  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Window,
        title: "Prepare apple/swift-format",
      },
      async () => {
        await Promise.all(buildOperations);
      }
    );
  } catch (error) {
    console.log(error);
  }
}
