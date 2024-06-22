# apple/swift-format for VS Code

Non-official VS Code extension to prettify your Swift code automatically via [apple/swift-format](https://github.com/apple/swift-format). You can
use apple/swift-format installed globally or via the Swift Package Manager.

> There are two formatters for Swift code. Use this extension if you wish to use [apple/swift-format](https://github.com/apple/swift-format).
> Use [SwiftFormat](https://github.com/vknabel/vscode-swiftformat) if you want to use [nicklockwood/SwiftFormat](https://github.com/nicklockwood/SwiftFormat).

### Global Installation

You can [install](https://github.com/apple/swift-format#matching-swift-format-to-your-swift-version) apple/swift-format globally using [Homebrew](https://brew.sh), [Mint](https://github.com/yonaskolb/Mint) or manually.

```bash
# Using Mint
$ mint install apple/swift-format@release/5.8
# Using Homebrew
$ brew install swift-format
# Manually
$ git clone -b release/5.8 https://github.com/apple/swift-format.git
$ swift build -c release
```

> **Attention:** Pick the same branch name to install `apple/swift-format` as your Swift version! E.g. `swift-5.5-branch` for Swift `5.5` and `release/5.6` for `5.6`. For a complete and up-to-date mapping, see [apple/swift-format#Matching Swift Format to your Swift version](https://github.com/apple/swift-format#matching-swift-format-to-your-swift-version).

### Local Installation

Add the package to your dependencies in `Package.swift`:

```diff
// swift-tools-version:5.8

import PackageDescription

let package = Package(
    name: "Komondor",
    products: [ ... ],
    dependencies: [
        // My dependencies
        .package(url: "https://github.com/orta/PackageConfig.git", from: "0.0.1"),
        // Dev deps
        .package(url: "https://github.com/orta/Komondor.git", from: "0.0.1"),
+        .package(url: "https://github.com/apple/swift-format.git", branch:("release/5.8")),
    ],
    targets: [...]
)
```

> **Attention:** Pick the same branch name to install `apple/swift-format` as your Swift version! E.g. `swift-5.5-branch` for Swift `5.5` and `release/5.6` for `5.6`. For a complete and up-to-date mapping, see [apple/swift-format#Matching Swift Format to your Swift version](https://github.com/apple/swift-format#matching-swift-format-to-your-swift-version).

## Configuration

| Config                                           | Type       | Default             | Description                                                   |                                                                                                         |
| ------------------------------------------------ | ---------- | ------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `apple-swift-format.enable`                      | `Bool`     | `true`              | Whether apple/swift-format should actually do something.      |                                                                                                         |
| `apple-swift-format.onlyEnableOnSwiftPMProjects` | `Bool`     | `false`             | Requires and uses a apple/swift-format as SwiftPM dependency. |                                                                                                         |
| `apple-swift-format.onlyEnableWithConfig`        | `Bool`     | `false`             | Only format if config present.                                |                                                                                                         |
| `apple-swift-format.path`                        | `[String]  | String`             | `swift-format`                                                | The location of the globally installed SwiftFormat (resolved with the current path if only a filename). |
| `apple-swift-format.configSearchPaths`           | `[String]` | `[".swift-format"]` | Possible paths for apple/swift-format config.                 |                                                                                                         |

## FAQs

### How do I enable formatting on type?

To enable formatting on while typing code without saving, simply enable the setting `"editor.formatOnType": true`.
In case you only want to enable it when editing Swift files, you can override as [`[swift]` language specific setting](https://code.visualstudio.com/docs/getstarted/settings#_language-specific-editor-settings).

## License

vscode-apple-swift-format is available under the [MIT](./LICENSE) license.
