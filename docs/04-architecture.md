# 技术架构与工程基线

## 1. 推荐技术栈

- 前端：Vue 3、TypeScript、Vite。
- 样式：普通 CSS 或轻量 CSS Modules，使用语义化设计令牌。
- 路由：Vue Router；若后续选择纯静态多页面，可保留清晰的页面入口。
- 国际化：Vue I18n，默认英文并允许用户切换中文，记忆用户选择。
- 主题：CSS 语义令牌 + `prefers-color-scheme`，用户手动选择优先于系统设置。
- 图片处理：浏览器 Canvas、Blob、Web Worker；批量压缩包使用成熟且体积可控的 ZIP 库。
- 测试：Vitest、Vue Test Utils、Playwright。
- 部署：优先 Cloudflare Pages 或同类静态托管；域名、HTTPS、缓存和回滚纳入发布流程。
- 监测：隐私友好的访问统计 + 错误监控，第三方脚本异步加载。

## 2. 模块划分

```text
src/
├── features/tools/          统一工具目录、类型和结果模型
├── features/image/          图片处理
├── features/pdf/            PDF 页面工具
├── features/documents/      DOCX/文本工具
├── features/presentations/  PPTX 生成工具
├── features/archives/       ZIP 工具
├── features/data/           JSON/CSV 工具
├── features/utilities/      校验值和 Base64 工具
├── workers/                 非阻塞图片处理 Worker
├── views/                   首页、工具页、内容页和政策页
└── router/                  分类化 URL 与旧地址兼容跳转
```

## 3. 数据流

```text
本地文件
  → 校验
  → 创建任务模型
  → Worker 解码/处理
  → Blob 结果
  → 结果摘要
  → 下载
  → 释放临时资源
```

默认不建立用户数据库。统计只发送不含图片内容的事件，例如 `tool_opened`、`processing_started`、`processing_completed` 和 `processing_failed`。

## 4. 关键技术决策

- 处理逻辑和 UI 状态解耦，方便单元测试和未来替换处理引擎。
- 图片处理通过服务接口抽象，首期实现本地处理，未来可增加后端处理而不重写页面状态层。
- 文件工具按能力拆分并懒加载格式库，避免 PDF、DOCX、PPTX 依赖进入图片工具首屏。
- 高保真互转采用未来可替换的远端处理适配器，必须在用户明确同意后上传文件。
- 不把第三方广告 SDK 直接写入核心组件；由 `AdSlot` 适配器统一注入。
- 大文件限制和浏览器能力通过 feature detection 判断，不用 UA 字符串硬编码。
- 下载文件名须清洗路径字符，避免把用户输入当作路径处理。
- 代码、内容、广告和分析脚本均支持按环境变量开关。

## 5. 配置项

```text
VITE_APP_NAME
VITE_MAX_FILE_SIZE_MB
VITE_MAX_BATCH_COUNT
VITE_MAX_PIXEL_COUNT
VITE_ADS_ENABLED
VITE_ANALYTICS_ENABLED
VITE_ANALYTICS_ID
VITE_SITE_URL
```
