# Contributing to Blink

我们欢迎所有形式的贡献！无论是 bug 修复、新功能、文档改进还是其他建议，我们都非常感谢。

## 🚀 快速开始

### 1. 设置开发环境

```bash
# 1. Fork 并克隆仓库
git clone https://github.com/yourusername/blink.git
cd blink

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm run tauri:dev
```

### 2. 环境要求

- Node.js >= 18.0.0
- Rust >= 1.70.0
- pnpm (推荐) 或 npm

## 📋 贡献类型

### 🐛 Bug 修复

- 修复现有功能的错误
- 修复性能问题
- 修复用户界面问题

### ✨ 新功能

- 添加新的护眼功能
- 改进用户界面
- 增加自定义选项

### 📚 文档改进

- 更新 README.md
- 添加代码注释
- 改进 API 文档

### 🌍 国际化

- 添加新语言支持
- 完善现有翻译

## 🔧 开发工作流

### 1. 创建功能分支

```bash
git checkout -b feature/your-feature-name
# 或者
git checkout -b fix/your-bug-fix
```

### 2. 开发和测试

```bash
# 开发模式
pnpm run tauri:dev

# 运行代码检查
pnpm run check

# 自动修复代码格式
pnpm run fix
```

### 3. 提交代码

```bash
# 添加更改
git add .

# 提交 (使用语义化提交消息)
git commit -m "feat: add new timer sound options"

# 推送到你的分支
git push origin feature/your-feature-name
```

### 4. 创建 Pull Request

1. 在 GitHub 上打开 Pull Request
2. 填写 PR 模板
3. 等待代码审查
4. 根据反馈进行修改

## 📝 代码规范

### 代码风格

我们使用 ESLint 和 Prettier 来保持代码风格一致：

```bash
# 检查代码风格
pnpm run lint

# 自动格式化
pnpm run format

# 类型检查
pnpm run type-check

# 运行所有检查
pnpm run check
```

### 提交消息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: 新功能
- `fix`: bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构代码
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**Examples:**

```
feat: add sound notification for break reminders
fix: resolve timer display issue on Windows
docs: update installation instructions
style: format code with prettier
refactor: improve timer state management
test: add unit tests for timer logic
chore: update dependencies
```

## 🧪 测试

### 运行测试

```bash
# 运行单元测试 (待实现)
pnpm run test

# 运行端到端测试 (待实现)
pnpm run test:e2e
```

### 添加测试

- 为新功能添加单元测试
- 确保测试覆盖率不降低
- 测试应该清晰且易于理解

## 🔍 代码审查

### 提交 PR 前的检查清单

- [ ] 代码遵循项目风格指南
- [ ] 所有检查都通过 (`pnpm run check`)
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 提交消息符合规范
- [ ] PR 描述清晰明确

### 审查过程

1. 自动化检查 (CI/CD)
2. 代码审查
3. 测试验证
4. 合并到主分支

## 📞 获取帮助

如果你需要帮助或有疑问：

1. 查看 [Issues](https://github.com/yourusername/blink/issues)
2. 创建新的 Issue
3. 在 PR 中 @mention 维护者

## 🎯 优先级

当前我们特别欢迎以下类型的贡献：

1. **Bug 修复** - 提高应用稳定性
2. **性能优化** - 减少资源占用
3. **无障碍功能** - 让更多人能够使用
4. **国际化** - 支持更多语言
5. **文档改进** - 让项目更易于理解

## 📊 贡献者

感谢所有贡献者！

<!-- 这里会自动生成贡献者列表 -->

## 📄 许可证

通过贡献到这个项目，你同意你的贡献将在 MIT 许可证下发布。

---

再次感谢你对 Blink 项目的贡献！ 🙏
