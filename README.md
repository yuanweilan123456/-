# PixelForge File Tools

隐私优先的在线文件工具箱。首期采用 Vue 3 + TypeScript + Vite，在浏览器本地完成图片、PDF、DOCX 和 PPTX 的部分处理，不上传用户文件。

## 当前能力

- 中文/英文切换
- 浅色/深色模式
- 英文默认、中文切换和浅色/深色主题
- 响应式工具目录、搜索和分类筛选
- 拖拽/选择图片入口
- 本地文件预览和移除
- 图片压缩、格式转换、尺寸调整、旋转和翻转
- PDF 合并、拆分、页面提取、页面删除、页面旋转、图片转 PDF
- DOCX 转 HTML/文本、文本生成 DOCX
- 图片/文本生成 PPTX
- ZIP 创建和解压
- JSON 格式化、CSV/JSON 双向转换
- 文件校验值、文件/Base64 双向转换
- 广告位占位容器
- 隐私政策和使用条款路由占位

当前共 24 个可用工具，文件均在浏览器本地处理。高保真 PDF、Word、PPT 双向转换未伪装成本地功能，未来如接入服务端引擎，必须先取得用户明确同意。

## 本地运行

```bash
npm ci
npm run dev
```

打开终端输出的本地地址即可预览。

## 质量检查

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test:unit
npm run build
npm run audit:prod
```

也可以一次执行完整检查：

```bash
npm run check
```

## Git 工作流

主分支为 `main`。日常修改建议使用独立分支，完成后先运行 `npm run check`，再提交并合并：

```bash
git switch -c feat/your-change
npm run check
git add .
git commit -m "feat: describe your change"
git push -u origin feat/your-change
```

仓库包含 GitHub Actions CI，会在推送和 Pull Request 时自动执行类型检查、单元测试和生产构建。

## 目录说明

- `src/views/ToolboxView.vue`：首页工具箱目录
- `src/features/tools/`：统一工具类型、目录和结果模型
- `src/features/{image,pdf,documents,presentations,archives,data,utilities}/`：按能力拆分的本地处理模块
- `src/views/HomeView.vue`：图片处理工作区（`/tools/image/studio`）
- `src/i18n.ts`：中英文语言包
- `src/styles.css`：设计令牌、主题和响应式样式
- `src/router/index.ts`：页面路由
- `docs/`：项目需求、架构、质量和启动决策文档
- `.github/workflows/ci.yml`：持续集成检查
- `CONTRIBUTING.md`：分支、提交和检查约定
