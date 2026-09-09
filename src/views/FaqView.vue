<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { locale } = useI18n()
const isZh = computed(() => locale.value === 'zh')
const content = computed(() =>
  isZh.value
    ? {
        eyebrow: '帮助中心',
        title: '开始之前，先解决常见问题。',
        description: '了解文件处理方式、浏览器限制和各工具的适用范围。',
        back: '开始使用工具',
        items: [
          {
            question: '我的文件会上传到服务器吗？',
            answer:
              '不会。当前工具在浏览器本地读取和处理文件，文件不会发送到 PixelForge 服务器。刷新或关闭页面后，当前任务也不会保留。',
          },
          {
            question: '支持哪些文件类型？',
            answer:
              '图片工具支持 JPG、PNG 和 WebP；文件工具目前支持 PDF、DOCX，以及由图片生成 PDF 或 PPTX。每个工具页会显示更具体的限制。',
          },
          {
            question: '为什么复杂的 Word 排版可能变化？',
            answer:
              'DOCX 转 HTML 会提取标题、段落、列表和图片。复杂的字体、页眉页脚、浮动对象和分页布局不保证完全还原。',
          },
          {
            question: '手机上可以使用吗？',
            answer:
              '可以。页面针对移动端设计，但大文件处理会受到手机内存、浏览器能力和电量的影响。建议使用最新版 Chrome、Edge、Safari 或 Firefox。',
          },
          {
            question: '处理结果是否一定和原文件完全一致？',
            answer:
              '不一定。PDF 页面外观通常能够保留，但交互表单、签名、书签和批注可能变化；DOCX 的复杂分页、浮动对象和字体也不保证完全还原。请保留原文件并打开下载结果检查。',
          },
          {
            question: 'PixelForge 如何测试这些工具？',
            answer:
              '每次发布会运行类型检查、代码规范、单元测试、生产构建和可抓取页面校验。重要页面还会在桌面、移动端、深色和浅色模式中进行真实浏览器检查。完整方法可以在“质量与测试”页面查看。',
          },
          {
            question: '遇到错误应该提供哪些信息？',
            answer:
              '请提供工具名称、浏览器及版本、操作步骤、预期结果和实际结果。不要在公开反馈中上传包含身份、财务、医疗或其他敏感内容的真实文件。',
          },
        ],
      }
    : {
        eyebrow: 'HELP CENTER',
        title: 'Common questions, answered clearly.',
        description: 'Learn how local processing works, what browsers support, and when to use each tool.',
        back: 'Open the tools',
        items: [
          {
            question: 'Are my files uploaded to a server?',
            answer:
              'No. The current tools read and process files in your browser. Files are not sent to PixelForge servers. Refreshing or closing the page also clears the current task.',
          },
          {
            question: 'Which file types are supported?',
            answer:
              'Image tools support JPG, PNG, and WebP. The toolbox also supports PDF and DOCX, plus creating PDF or PPTX files from images. Each tool page lists its specific limits.',
          },
          {
            question: 'Why can complex Word layouts change?',
            answer:
              'DOCX to HTML extracts headings, paragraphs, lists, and images. Complex fonts, headers, footers, floating objects, and pagination are not guaranteed to match exactly.',
          },
          {
            question: 'Can I use PixelForge on a phone?',
            answer:
              'Yes. The layout is mobile-friendly, but large files depend on device memory, browser capabilities, and battery. Use the latest Chrome, Edge, Safari, or Firefox.',
          },
          {
            question: 'Will a result always match the source perfectly?',
            answer:
              'Not always. PDF page appearance is usually preserved, but interactive forms, signatures, bookmarks, and annotations may change. Complex DOCX pagination, floating objects, and fonts are also not guaranteed. Keep the original and open every downloaded result.',
          },
          {
            question: 'How does PixelForge test the tools?',
            answer:
              'Every release runs type checks, code-quality rules, unit tests, a production build, and crawlable-page verification. Important pages are also checked in a real browser on desktop and mobile, in light and dark themes. The full method is documented on the Quality & testing page.',
          },
          {
            question: 'What information helps when reporting a problem?',
            answer:
              'Include the tool name, browser and version, steps, expected result, and actual result. Never attach a real file containing identity, financial, medical, or other sensitive information to a public report.',
          },
        ],
      },
)
</script>

<template>
  <div class="page-wrap content-page faq-page">
    <p class="eyebrow"><span class="eyebrow-dot"></span>{{ content.eyebrow }}</p>
    <h1>{{ content.title }}</h1>
    <p class="content-lead">{{ content.description }}</p>

    <section class="faq-list" :aria-label="content.eyebrow">
      <details v-for="(item, index) in content.items" :key="item.question" :open="index === 0">
        <summary>
          <span>{{ item.question }}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </summary>
        <p>{{ item.answer }}</p>
      </details>
    </section>

    <div class="faq-actions">
      <RouterLink class="primary-button" to="/">{{ content.back }}</RouterLink>
      <RouterLink class="secondary-button" to="/how-we-test">{{
        isZh ? '查看质量与测试方法' : 'Read how we test'
      }}</RouterLink>
      <RouterLink class="text-link" to="/contact">{{ isZh ? '联系与反馈' : 'Contact and feedback' }}</RouterLink>
    </div>
  </div>
</template>
