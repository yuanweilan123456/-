<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { locale } = useI18n()
const isZh = computed(() => locale.value === 'zh')
const content = computed(() =>
  isZh.value
    ? {
        eyebrow: '质量与透明度',
        title: '我们如何构建和测试文件工具',
        intro:
          'PixelForge 是一个浏览器本地文件工具项目。这里公开说明工具使用的处理方式、测试流程、已知边界和问题反馈渠道，帮助你在使用前判断它是否适合自己的文件。',
        updated: '最后复核：2026 年 9 月 9 日',
        sections: [
          {
            number: '01',
            title: '先验证实际任务，再发布工具',
            paragraphs: [
              '每个工具都围绕一个明确任务设计，例如合并 PDF、把 CSV 转成 JSON 或从 DOCX 提取文本。页面会说明输入格式、生成结果和浏览器限制，不把一个功能包装成多个重复页面。',
              '我们使用由项目生成的最小测试文件验证基础流程，同时加入空文件、错误格式、无效页码和重复处理等异常情况。测试的目标是确认结果可打开、顺序正确，并在失败时提供可操作的提示。',
            ],
          },
          {
            number: '02',
            title: '文件处理发生在哪里',
            paragraphs: [
              '当前工具使用浏览器 File API、Canvas、Web Crypto，以及 pdf-lib、Mammoth 和 JSZip 等前端库完成处理。你选择的文件不会发送到 PixelForge 服务器，也不会建立账号或云端任务记录。',
              '本地处理也有代价：大文件会使用设备内存，旧浏览器可能缺少必要能力，受密码保护或结构损坏的文件可能无法读取。因此我们不会承诺所有文件都能完美转换。',
            ],
          },
          {
            number: '03',
            title: '发布前的质量门禁',
            paragraphs: [
              '每次修改都要通过 TypeScript 类型检查、代码规范检查、自动化单元测试和生产构建。网站还会验证每个公开页面的标题、主标题、规范链接和站点地图，避免搜索引擎看到空白或重复页面。',
              '重要界面会在桌面端和 375 像素宽的移动端进行实际浏览器检查，并分别检查深色与浅色模式、键盘焦点、按钮状态和控制台错误。',
            ],
          },
          {
            number: '04',
            title: '如何理解处理结果',
            paragraphs: [
              '浏览器中成功生成文件，只代表技术处理已经完成。正式提交、归档或删除原文件前，请打开下载结果，检查页码、文字、图片方向、特殊字符和文件名。',
              '复杂 Word 排版、交互式 PDF 表单、数字签名、加密压缩包和 OCR 不在当前工具的完整保证范围内。每篇指南会给出更具体的检查清单和常见问题。',
            ],
          },
        ],
        reportTitle: '发现问题或结果异常？',
        reportText:
          '请告诉我们使用的工具、浏览器、文件类型和可复现步骤。不要公开上传包含个人、财务、医疗或其他敏感信息的原文件。',
        report: '查看反馈方式',
        guides: '阅读使用指南',
      }
    : {
        eyebrow: 'QUALITY & TRANSPARENCY',
        title: 'How we build and test file tools',
        intro:
          'PixelForge is a browser-local file tools project. This page explains how the tools process files, how releases are checked, where the limits are, and how to report a problem so you can decide whether a tool fits your task.',
        updated: 'Last reviewed: September 9, 2026',
        sections: [
          {
            number: '01',
            title: 'Start with a real task, then test it',
            paragraphs: [
              'Each tool is built around one clear job, such as merging PDFs, converting CSV to JSON, or extracting text from DOCX. Pages describe the expected input, output, and browser limits instead of presenting one function as several duplicate tools.',
              'We use small project-generated fixtures to verify the main workflow and add cases for empty files, invalid formats, incorrect page ranges, and repeated processing. Tests check that results open, preserve the expected order, and fail with an actionable message.',
            ],
          },
          {
            number: '02',
            title: 'Where file processing happens',
            paragraphs: [
              'The current tools use browser capabilities such as the File API, Canvas, and Web Crypto, together with front-end libraries including pdf-lib, Mammoth, and JSZip. Selected files are not sent to a PixelForge server, and no account or cloud job record is created.',
              'Local processing has practical limits. Large files consume device memory, older browsers can lack required capabilities, and password-protected or damaged files may not open. We therefore do not claim that every file can be converted perfectly.',
            ],
          },
          {
            number: '03',
            title: 'Quality gates before a release',
            paragraphs: [
              'Every change must pass TypeScript checks, code-quality rules, automated unit tests, and a production build. The site also verifies the title, primary heading, canonical link, and sitemap entry for every public page so crawlers do not receive blank or duplicate pages.',
              'Important interfaces are checked in a real browser on desktop and at a 375-pixel mobile width. Light and dark themes, keyboard focus, button states, responsive layout, and console errors are reviewed separately.',
            ],
          },
          {
            number: '04',
            title: 'How to evaluate a result',
            paragraphs: [
              'A successful browser download means the technical process finished; it does not replace your review. Before submitting, archiving, or deleting an original, open the result and check page order, text, image orientation, special characters, and the filename.',
              'Complex Word layouts, interactive PDF forms, digital signatures, encrypted archives, and OCR are outside the current tools’ full guarantee. Each practical guide provides a more specific checklist and troubleshooting notes.',
            ],
          },
        ],
        reportTitle: 'Found a problem or unexpected result?',
        reportText:
          'Tell us which tool, browser, file type, and reproducible steps were involved. Do not publicly attach source files containing personal, financial, medical, or other sensitive information.',
        report: 'See how to report it',
        guides: 'Read practical guides',
      },
)
</script>

<template>
  <div class="page-wrap content-page quality-page">
    <p class="eyebrow"><span class="eyebrow-dot"></span>{{ content.eyebrow }}</p>
    <h1>{{ content.title }}</h1>
    <p class="content-lead">{{ content.intro }}</p>
    <p class="policy-updated">{{ content.updated }}</p>

    <div class="quality-method-grid">
      <section v-for="section in content.sections" :key="section.number" class="quality-method-card">
        <span>{{ section.number }}</span>
        <div>
          <h2>{{ section.title }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
        </div>
      </section>
    </div>

    <aside class="quality-report-card">
      <div>
        <p class="section-kicker">{{ isZh ? '持续改进' : 'CONTINUOUS IMPROVEMENT' }}</p>
        <h2>{{ content.reportTitle }}</h2>
        <p>{{ content.reportText }}</p>
      </div>
      <div class="quality-report-actions">
        <RouterLink class="primary-button" to="/contact">{{ content.report }}</RouterLink>
        <RouterLink class="secondary-button" to="/guides">{{ content.guides }}</RouterLink>
      </div>
    </aside>
  </div>
</template>
