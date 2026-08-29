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
            question: '广告什么时候会出现？',
            answer:
              '网站已经加载 Google AdSense 验证脚本，但广告要在网站通过审核、完成账号设置并启用广告后才会展示。需要同意的地区会显示相应的隐私选择。',
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
            question: 'When will ads appear?',
            answer:
              'The site already loads the Google AdSense verification script, but ads will only appear after the site passes review, the account setup is complete, and ads are enabled. Required privacy choices will be shown in applicable regions.',
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

    <RouterLink class="secondary-button inline-button" to="/">{{ content.back }}</RouterLink>
  </div>
</template>
