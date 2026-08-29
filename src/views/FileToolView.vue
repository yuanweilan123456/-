<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import JSZip from 'jszip'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { docxToHtml, imagesToPdf, imagesToPptx, mergePdfs, splitPdf, textResultToBlob, type FileToolType, type ToolResult } from '../features/file-tools/file-tools'

const props = defineProps<{ type: FileToolType }>()
const { locale, t } = useI18n()
const input = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])
const isProcessing = ref(false)
const error = ref('')
const result = ref<ToolResult | null>(null)
const splitResults = ref<ToolResult[]>([])
const isZh = computed(() => locale.value === 'zh')

const configs = computed(() => ({
  'pdf-merge': { title: isZh.value ? '合并 PDF' : 'Merge PDFs', description: isZh.value ? '在浏览器本地把多个 PDF 合并成一个文件。' : 'Merge multiple PDFs into one file in your browser.', accept: '.pdf,application/pdf', multiple: true, action: isZh.value ? '合并并下载' : 'Merge and download' },
  'pdf-split': { title: isZh.value ? '拆分 PDF' : 'Split PDF', description: isZh.value ? '把一个 PDF 按页拆成多个文件，并打包下载。' : 'Split a PDF into one file per page and download a ZIP.', accept: '.pdf,application/pdf', multiple: false, action: isZh.value ? '拆分并下载 ZIP' : 'Split and download ZIP' },
  'images-to-pdf': { title: isZh.value ? '图片转 PDF' : 'Images to PDF', description: isZh.value ? '把多张 JPG、PNG 或 WebP 图片生成一个 PDF。' : 'Create one PDF from multiple JPG, PNG, or WebP images.', accept: 'image/jpeg,image/png,image/webp', multiple: true, action: isZh.value ? '生成并下载 PDF' : 'Create and download PDF' },
  'docx-to-html': { title: isZh.value ? 'Word 转 HTML' : 'Word to HTML', description: isZh.value ? '提取 DOCX 的标题、段落、列表和图片内容。复杂排版不保证完全还原。' : 'Extract DOCX headings, paragraphs, lists, and images. Complex layouts may not be reproduced exactly.', accept: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document', multiple: false, action: isZh.value ? '转换并下载 HTML' : 'Convert and download HTML' },
  'images-to-pptx': { title: isZh.value ? '图片生成 PPT' : 'Images to PPT', description: isZh.value ? '每张图片生成一页宽屏 PPTX，在浏览器本地完成。' : 'Create one widescreen PPTX slide per image in your browser.', accept: 'image/jpeg,image/png,image/webp', multiple: true, action: isZh.value ? '生成并下载 PPTX' : 'Create and download PPTX' },
}[props.type]))

function chooseFiles() { input.value?.click() }
function onChange(event: Event) { const target = event.target as HTMLInputElement; if (target.files) files.value = Array.from(target.files); target.value = ''; error.value = ''; result.value = null; splitResults.value = [] }
function clear() { files.value = []; error.value = ''; result.value = null; splitResults.value = [] }
function download(toolResult: ToolResult) { const blob = toolResult.blob ?? textResultToBlob(toolResult); if (!blob) return; const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = toolResult.filename; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000) }
async function run() {
  if (files.value.length === 0 || isProcessing.value) return
  isProcessing.value = true; error.value = ''; result.value = null; splitResults.value = []
  try {
    if (props.type === 'pdf-merge') result.value = await mergePdfs(files.value)
    if (props.type === 'pdf-split') splitResults.value = await splitPdf(files.value[0])
    if (props.type === 'images-to-pdf') result.value = await imagesToPdf(files.value)
    if (props.type === 'docx-to-html') result.value = await docxToHtml(files.value[0])
    if (props.type === 'images-to-pptx') result.value = await imagesToPptx(files.value)
    if (result.value) download(result.value)
    if (splitResults.value.length) { const zip = new JSZip(); splitResults.value.forEach((item) => { if (item.blob) zip.file(item.filename, item.blob) }); const blob = await zip.generateAsync({ type: 'blob' }); download({ blob, filename: 'pixelforge-split-pages.zip', mimeType: 'application/zip' }) }
  } catch (cause) { error.value = cause instanceof Error ? cause.message : (isZh.value ? '处理失败，请重试。' : 'Processing failed. Please try again.') }
  finally { isProcessing.value = false }
}

onBeforeUnmount(clear)
</script>

<template>
  <div class="page-wrap file-tool-page">
    <RouterLink class="back-link" to="/"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>{{ isZh ? '返回工具箱' : 'Back to toolbox' }}</RouterLink>
    <p class="eyebrow"><span class="eyebrow-dot"></span>PIXELFORGE FILE TOOLBOX</p>
    <h1 id="file-tool-title">{{ configs.title }}</h1>
    <p class="file-tool-description">{{ configs.description }}</p>
    <section class="file-tool-panel" aria-labelledby="file-tool-title">
      <input ref="input" class="visually-hidden" type="file" :accept="configs.accept" :multiple="configs.multiple" :aria-label="isZh ? '选择文件' : 'Choose files'" @change="onChange" />
      <div class="file-drop" :class="{ 'has-files': files.length }" @click="chooseFiles">
        <div class="upload-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg></div>
        <h2>{{ files.length ? (isZh ? `已选择 ${files.length} 个文件` : `${files.length} file(s) selected`) : (isZh ? '选择或拖入文件' : 'Choose or drop files') }}</h2>
        <p>{{ isZh ? '文件只在浏览器内处理，不上传到服务器。' : 'Files are processed in your browser and never uploaded.' }}</p>
        <button class="primary-button" type="button" @click.stop="chooseFiles">{{ isZh ? '选择文件' : 'Choose files' }}</button>
      </div>
      <div v-if="files.length" class="file-tool-actions"><button class="process-button" type="button" :disabled="isProcessing" @click="run">{{ isProcessing ? (isZh ? '处理中…' : 'Processing…') : configs.action }}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg></button><button class="text-button" type="button" :disabled="isProcessing" @click="clear">{{ isZh ? '清空' : 'Clear' }}</button></div>
      <p v-if="error" class="error-message" role="alert">{{ error }}</p>
      <div v-if="result || splitResults.length" class="file-tool-result" aria-live="polite"><strong>{{ isZh ? '处理完成' : 'Ready to download' }}</strong><button v-if="result" class="secondary-button" type="button" @click="download(result)">{{ isZh ? '再次下载' : 'Download again' }}</button><span v-if="splitResults.length">{{ isZh ? `已生成 ${splitResults.length} 个 PDF 页面` : `${splitResults.length} PDF pages created` }}</span></div>
    </section>
    <div class="ad-slot" :aria-label="t('a11y.advertisement')"><span>{{ isZh ? '广告位预留 · 上线后启用' : 'Ad space reserved · Enabled after launch' }}</span></div>
  </div>
</template>
