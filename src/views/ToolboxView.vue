<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { locale } = useI18n()
const isZh = computed(() => locale.value === 'zh')
const tools = computed(() => isZh.value ? [
  { title: '图片压缩', description: '减小 JPG、PNG、WebP 文件体积。', href: '/compress-image', type: 'image', available: true },
  { title: '图片格式转换', description: '在 JPG、PNG、WebP 之间转换。', href: '/convert-image', type: 'image', available: true },
  { title: '图片尺寸调整', description: '按比例调整图片宽度和尺寸。', href: '/resize-image', type: 'image', available: true },
  { title: 'PDF 合并', description: '将多个 PDF 合并成一个文件。', href: '/pdf/merge', type: 'pdf', available: true },
  { title: 'PDF 拆分', description: '按页拆分 PDF，并打包下载。', href: '/pdf/split', type: 'pdf', available: true },
  { title: '图片转 PDF', description: '将多张图片生成一个 PDF。', href: '/pdf/images-to-pdf', type: 'pdf', available: true },
  { title: 'Word 转 HTML', description: '提取 DOCX 内容并转换为 HTML。', href: '/word/to-html', type: 'word', available: true },
  { title: '图片生成 PPT', description: '每张图片生成一页 PPTX。', href: '/ppt/images-to-pptx', type: 'ppt', available: true },
  { title: 'PDF ↔ Word/PPT', description: '高保真双向转换，后续接入专业引擎。', href: '/toolbox', type: 'planned', available: false },
] : [
  { title: 'Compress images', description: 'Reduce JPG, PNG, and WebP file sizes.', href: '/compress-image', type: 'image', available: true },
  { title: 'Convert image format', description: 'Convert between JPG, PNG, and WebP.', href: '/convert-image', type: 'image', available: true },
  { title: 'Resize images', description: 'Resize image width while keeping its ratio.', href: '/resize-image', type: 'image', available: true },
  { title: 'Merge PDFs', description: 'Combine multiple PDFs into one file.', href: '/pdf/merge', type: 'pdf', available: true },
  { title: 'Split PDFs', description: 'Split PDFs by page and download a ZIP.', href: '/pdf/split', type: 'pdf', available: true },
  { title: 'Images to PDF', description: 'Create one PDF from multiple images.', href: '/pdf/images-to-pdf', type: 'pdf', available: true },
  { title: 'Word to HTML', description: 'Extract DOCX content as clean HTML.', href: '/word/to-html', type: 'word', available: true },
  { title: 'Images to PPT', description: 'Create one PPTX slide per image.', href: '/ppt/images-to-pptx', type: 'ppt', available: true },
  { title: 'PDF ↔ Word/PPT', description: 'High-fidelity conversion via a professional engine later.', href: '/toolbox', type: 'planned', available: false },
])
</script>

<template>
  <div class="page-wrap toolbox-page">
    <section class="toolbox-heading"><p class="eyebrow"><span class="eyebrow-dot"></span>{{ isZh ? 'PIXELFORGE FILE TOOLBOX' : 'PIXELFORGE FILE TOOLBOX' }}</p><h1>{{ isZh ? '常用文件工具，集中在一个地方。' : 'Everyday file tools, in one place.' }}</h1><p>{{ isZh ? '图片、PDF、Word 和 PPT 文件都可以在浏览器里处理。' : 'Process images, PDFs, Word documents, and PPT files in your browser.' }}</p></section>
    <div class="tool-catalog">
      <component :is="tool.available ? RouterLink : 'div'" v-for="tool in tools" :key="tool.title" :to="tool.available ? tool.href : undefined" class="tool-card" :class="[`tool-${tool.type}`, { 'is-planned': !tool.available }]">
        <div class="tool-card-top"><span class="tool-type">{{ tool.type === 'image' ? 'IMG' : tool.type === 'pdf' ? 'PDF' : tool.type === 'word' ? 'DOCX' : tool.type === 'ppt' ? 'PPTX' : 'SOON' }}</span><span v-if="tool.available" class="tool-arrow" aria-hidden="true">↗</span></div>
        <h2>{{ tool.title }}</h2><p>{{ tool.description }}</p><span v-if="!tool.available" class="planned-label">{{ isZh ? '规划中' : 'Planned' }}</span>
      </component>
    </div>
  </div>
</template>
