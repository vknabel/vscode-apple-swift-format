# Changelog

## 1.4.3

- fix: windows support

## 1.4.1

- fix: improved error message when apple/swift-format is not installed #19

## 1.4.0

- Added: `apple-swift-format.path` can now be an array of strings and defaults to `[/usr/bin/env, swift-format]` [vknabel/vscode-apple-swift-format#17](https://github.com/vknabel/vscode-apple-swift-format/issues/17)

## 1.3.1

- Fixed: correctly display syntax errors #16
- Fixed: link apple/swift-format binary #12

## 1.3.0

- Added: build swift-format if needed #12

## 1.2.0

- Added: `apple-swift-format.onlyEnableWithConfig` to only enable SwiftLint with a config [vknabel/vscode-swiftformat#20](https://github.com/vknabel/vscode-swiftformat/issues/20)
- Fixed: `apple-swift-format.onlyEnableOnSwiftPMProjects` didn't work correctly

# 1.1.4

- Proper error message for \_InternalSwiftSyntaxParser error #9 #13 #14 - [@vknabel](https://github.com/vknabel/)

# 1.1.3

- Explicitly handle EPIPE errors #8 - [@vknabel](https://github.com/vknabel/)

# 1.1.2

[CVE-2021-28789](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-28789): Fixes vulnerability which allowed malicous workspaces to execute code when opened by providing. Now the vulnerable configs cannot be overrided in workspaces anymore: `apple-swift-format.path`. Reported by [@Ry0taK](https://github.com/Ry0taK).

# 1.1.1

- Fixed: Error messages for incompatible SwiftSyntax #3 - [@vknabel](https://github.com/vknabel/)

# 1.1.0

- Improved: Error message for syntax errors #2 - [@vknabel](https://github.com/vknabel/)

# 1.0.2

- Fixed: `configSearchPaths` did not support `~` vknabel/vscode-swiftlint#8 - [@vknabel](https://github.com/vknabel/)

# 1.0.1

- End of newline was always stripped. vknabel/vscode-swiftformat#13 - [@vknabel](https://github.com/vknabel/)

# 1.0.0

- Initial release
