# apple/swift-format for VS Code

Non-official VS Code extension to prettify your Swift code automatically via [apple/swift-format](https://github.com/apple/swift-format). You can
use apple/swift-format installed globally or via the Swift Package Manager.

> There are two formatters for Swift code. Use this extension if you wish to use [apple/swift-format](https://github.com/apple/swift-format).
> Use [SwiftFormat](https://github.com/vknabel/vscode-swiftformat) if you want to use [nicklockwood/SwiftFormat](https://github.com/nicklockwood/SwiftFormat).

### Global Installation

You can [install](https://github.com/apple/swift-format#matching-swift-format-to-your-swift-version) apple/swift-format globally using [Mint](https://github.com/yonaskolb/Mint) or manually.

```bash
# Using Mint
$ mint install apple/swift-format@swift-5.1-branch
# Manually
$ git clone -b swift-5.1-branch https://github.com/apple/swift-format.git
$ swift build -c release
```

### Local Installation

Add the package to your dependencies in `Package.swift`:

```diff
// swift-tools-version:4.2

import PackageDescription

let package = Package(
    name: "Komondor",
    products: [ ... ],
    dependencies: [
        // My dependencies
        .package(url: "https://github.com/orta/PackageConfig.git", from: "0.0.1"),
        // Dev deps
        .package(url: "https://github.com/orta/Komondor.git", from: "0.0.1"),
+        .package(url: "https://github.com/apple/swift-format.git", .branch("swift-5.1-branch")),
    ],
    targets: [...]
)
```

## Configuration

| Config                                 | Type       | Default                       | Description                                                |
| -------------------------------------- | ---------- | ----------------------------- | ---------------------------------------------------------- |
| `apple-swift-format.enable`            | `Bool`     | `true`                        | Whether apple/swift-format should actually do something.   |
| `apple-swift-format.path`              | `String`   | `/usr/local/bin/swift-format` | The location of the globally installed apple/swift-format. |
| `apple-swift-format.configSearchPaths` | `[String]` | `[".swift-format"]`           | Possible paths for apple/swift-format config.              |

## Contributors

- Valentin Knabel, [@vknabel](https://github.com/vknabel), [@vknabel](https://twitter.com/vknabel) on Twitter

## License

vscode-apple-swift-format is available under the [MIT](./LICENSE) license.
