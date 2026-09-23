# FileTools

隐私优先的在线文件工具箱。首期采用 Vue 3 + TypeScript + Vite，在浏览器本地完成图片、PDF、DOCX 和 PPTX 的部分处理，不上传用户文件。

## 当前能力

- 英文默认、中文切换和浅色/深色主题
- 响应式工具目录、搜索和分类筛选
- 拖拽/选择图片入口
- 本地文件预览和移除
- 图片压缩、格式转换、尺寸调整、旋转和翻转
- PDF 合并、拆分、页面提取、页面删除、页面旋转、图片转 PDF
- Word（DOCX）转图片型 PDF；PDF 转 Word（可编辑文字 / 整页图片两种模式）
- PDF 转 JPG（ZIP 下载）、PDF 文字提取；页码范围、打开密码、进度、取消和结果预览
- DOCX 转 HTML/文本、文本生成 DOCX
- 图片/文本生成 PPTX
- ZIP 创建和解压
- JSON 格式化、CSV/JSON 双向转换
- 文件校验值、文件/Base64 双向转换
- 广告位占位容器
- 隐私政策和使用条款路由占位
- 52 个可收录路由的构建期静态 HTML、独立 canonical 与结构化数据
- 自动生成带 `lastmod` 的站点地图，并在主分支通过 IndexNow 通知搜索引擎

当前共 28 个工具，文件均在浏览器本地处理。Word/PDF 互转不等同于服务器 Office 引擎：Word 转 PDF 输出不可选中文字的页面图片；PDF 转 Word 的文字模式不重建表格与图片，扫描页以图片保留，没有 OCR。复杂排版请检查下载结果。单次限制 50 MB、100 页。PDF.js 字体、字符映射、WASM 和 worker 随站点部署，不使用外部转换服务。未来如接入服务端引擎，必须先取得用户明确同意。

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
npm run verify:dist
npm run audit:prod
```

文档转换浏览器回归测试（先构建；本地默认使用已安装的 Chrome，CI 使用 Chromium）：

```bash
npm run build
npm run test:e2e
```

测试涵盖 DOCX 中英文字与表格、多页与自动分页、PDF 文字/图片输出、扫描页回退、错误输入、取消、移动端与深色模式。所有测试文件均在测试过程中生成。未安装 Chrome 时，可运行 `npx playwright install chromium` 并将 `E2E_BROWSER_CHANNEL` 设为 `chromium`。

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

仓库包含 GitHub Actions CI，会在推送和 Pull Request 时自动执行格式、类型、单元测试、生产构建和预渲染检查。主分支检查通过后，还会向 IndexNow 提交站点地图中的规范 URL。

## 目录说明

- `src/views/ToolboxView.vue`：首页工具箱目录
- `src/features/tools/`：统一工具类型、目录和结果模型
- `src/features/{image,pdf,documents,presentations,archives,data,utilities}/`：按能力拆分的本地处理模块
- `src/views/HomeView.vue`：图片处理工作区（`/tools/image/studio`）
- `src/i18n.ts`：中英文语言包
- `src/styles.css`：设计令牌、主题和响应式样式
- `src/router/index.ts`：页面路由
- `src/seo-pages.ts`：前端运行时和构建期共用的 SEO 页面清单
- `scripts/prerender.ts`：构建 52 个无扩展名静态 HTML 页面并刷新站点地图
- `scripts/verify-prerender.ts`：检查标题、canonical、H1 和 sitemap 完整性
- `scripts/submit-indexnow.mjs`：向 Bing 等支持 IndexNow 的搜索引擎通知页面变化
- `docs/`：项目需求、架构、质量和启动决策文档
- `.github/workflows/ci.yml`：持续集成检查
- `CONTRIBUTING.md`：分支、提交和检查约定
