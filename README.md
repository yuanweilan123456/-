# PixelForge Image Tools

隐私优先的在线文件工具箱。首期采用 Vue 3 + TypeScript + Vite，在浏览器本地完成图片、PDF、DOCX 和 PPTX 的部分处理，不上传用户文件。

## 当前阶段

M0 工程初始化已完成：

- 中文/英文切换
- 浅色/深色模式
- 响应式首页骨架
- 拖拽/选择图片入口
- 本地文件预览和移除
- 输出参数界面骨架
- 文件工具箱目录
- PDF 合并、拆分、图片转 PDF
- DOCX 转 HTML
- 图片生成 PPTX
- 广告位占位容器
- 隐私政策和使用条款路由占位

M1 已完成：图片压缩、格式转换、尺寸调整、批量处理、单项下载和 ZIP 下载均已实现。文件工具箱扩展包含 PDF 合并、PDF 拆分、图片转 PDF、DOCX 转 HTML/文本和图片生成 PPTX。

## 本地运行

```bash
npm install
npm run dev
```

打开终端输出的本地地址即可预览。

## 质量检查

```bash
npm run typecheck
npm run test:unit
npm run build
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

- `src/views/HomeView.vue`：首页和图片入口
- `src/i18n.ts`：中英文语言包
- `src/styles.css`：设计令牌、主题和响应式样式
- `src/router/index.ts`：页面路由
- `docs/`：项目需求、架构、质量和启动决策文档
- `.github/workflows/ci.yml`：持续集成检查
- `CONTRIBUTING.md`：分支、提交和检查约定
