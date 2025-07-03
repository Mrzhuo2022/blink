# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial release preparation

## [1.0.0] - 2024-xx-xx

### Added

- 🎯 智能护眼机制 - 两次小憩后强制休息的科学护眼模式
- 👁️ 强制休息保护 - 小憩可跳过，强制休息不可跳过
- 🔄 智能休息周期 - 工作 → 小憩 → 工作 → 小憩 → 工作 → 强制休息
- 🎨 六种护眼色彩主题 - 缓解视觉疲劳
- 🔔 原生系统通知 - 无需浏览器权限
- 🖥️ 全屏休息界面 - 占满全屏并置顶
- 🌙 深色模式支持 - 自适应系统主题
- ⚙️ 高度可定制 - 可调整工作时间、休息时间和护眼周期
- 📱 现代化UI设计 - 基于 Tailwind CSS
- ⚡ 高性能架构 - 基于 Tauri 框架，资源占用极低

### Technical

- React 18 + TypeScript 前端架构
- Tauri 2.0 + Rust 后端架构
- Zustand 状态管理
- Vite 构建工具
- ESLint + Prettier 代码规范
- GitHub Actions 自动构建和发布

### Supported Platforms

- Windows 10/11 (x64)
- macOS 10.15+ (x64, ARM64)
- Linux (x64, ARM64)

[Unreleased]: https://github.com/yourusername/blink/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/blink/releases/tag/v1.0.0
