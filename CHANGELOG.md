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
