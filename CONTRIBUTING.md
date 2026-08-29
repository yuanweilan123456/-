# Contributing to PixelForge

## 开发环境

- Node.js 20+
- npm 10+

安装依赖并启动开发服务器：

```bash
npm ci
npm run dev
```

## 分支约定

- `main`：可发布分支
- `feat/*`：新功能
- `fix/*`：问题修复
- `docs/*`：文档修改
- `chore/*`：工程维护

## 提交前检查

提交前运行：

```bash
npm run check
```

该命令包含 Prettier 格式检查、ESLint、TypeScript 类型检查、单元测试和生产构建。

## 提交信息

提交信息使用简短的 Conventional Commits 风格，例如：

```text
feat: add PDF split tool
fix: preserve image quality on resize
docs: update deployment notes
chore: update dependencies
```

Pull Request 应说明变更内容、验证方式，以及是否影响隐私、下载行为或广告位。
