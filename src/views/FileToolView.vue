<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import JSZip from 'jszip'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { createZip, extractZip } from '../features/archives/archive-tools'
import { csvTextToJson, formatJson, jsonTextToCsv } from '../features/data/data-tools'
import { docxToHtml, docxToText, textToDocx } from '../features/documents/document-tools'
import {
  extractPdfPages,
  imagesToPdf,
  mergePdfs,
  removePdfPages,
  rotatePdfPages,
  splitPdf,
} from '../features/pdf/pdf-tools'
import { imagesToPptx, textToPptx } from '../features/presentations/presentation-tools'
import { categoryCopy, getTool, tools } from '../features/tools/catalog'
import { getToolPageContent } from '../features/tools/content'
import { resultToBlob } from '../features/tools/result'
import type { FileToolId, ToolResult } from '../features/tools/types'
import { base64ToFile, calculateChecksum, fileToBase64, type HashAlgorithm } from '../features/utilities/file-utilities'

const props = defineProps<{ type: FileToolId }>()
const { locale } = useI18n()
const input = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])
const textInput = ref('')
const isDragging = ref(false)
const isProcessing = ref(false)
const error = ref('')
const result = ref<ToolResult | null>(null)
const batchResults = ref<ToolResult[]>([])
const pageSelection = ref('all')
const pageRotation = ref<90 | 180 | 270>(90)
const hashAlgorithm = ref<HashAlgorithm>('SHA-256')
const minifyJson = ref(false)
const decodedFilename = ref('decoded-file.bin')
const decodedMimeType = ref('application/octet-stream')
const copied = ref(false)

const isZh = computed(() => locale.value === 'zh')
const tool = computed(() => getTool(props.type)!)
const language = computed(() => (isZh.value ? 'zh' : 'en'))
const title = computed(() => tool.value.title[language.value])
const description = computed(() => tool.value.description[language.value])
const action = computed(() => tool.value.action[language.value])
const pageContent = computed(() => getToolPageContent(tool.value, language.value))
const categoryTitle = computed(() => categoryCopy[tool.value.category].title[language.value])
const relatedTools = computed(() =>
  tools.filter((item) => item.category === tool.value.category && item.id !== tool.value.id).slice(0, 3),
)
const needsPages = computed(() => ['pdf-extract-pages', 'pdf-remove-pages', 'pdf-rotate-pages'].includes(props.type))
const acceptsText = computed(() => tool.value.input === 'text' || tool.value.input === 'base64')
const canRun = computed(() => (acceptsText.value ? Boolean(textInput.value.trim()) : files.value.length > 0))
const textPlaceholder = computed(() => {
  const values: Partial<Record<FileToolId, { en: string; zh: string }>> = {
    'text-to-docx': { en: 'Type or paste the document text…', zh: '输入或粘贴文档文本…' },
    'text-to-pptx': {
      en: 'Slide title\nFirst point\nSecond point\n\nNext slide\nAnother point',
      zh: '幻灯片标题\n第一条内容\n第二条内容\n\n下一页标题\n另一条内容',
    },
    'json-format': { en: '{\n  "name": "PixelForge"\n}', zh: '{\n  "name": "PixelForge"\n}' },
    'json-to-csv': { en: '[{"name":"Ada","score":98}]', zh: '[{"name":"小明","score":98}]' },
    'base64-to-file': { en: 'Paste Base64 or a data URL…', zh: '粘贴 Base64 或 Data URL…' },
  }
  return values[props.type]?.[language.value] ?? ''
})

const errorMessages: Record<string, { en: string; zh: string }> = {
  invalid_page_range: { en: 'Enter valid page numbers within the PDF range.', zh: '请输入 PDF 页数范围内的有效页码。' },
  cannot_remove_all_pages: { en: 'A PDF must keep at least one page.', zh: 'PDF 至少需要保留一页。' },
  empty_pdf: { en: 'The selected PDF has no pages.', zh: '所选 PDF 没有页面。' },
  empty_archive: { en: 'The ZIP contains no downloadable files.', zh: 'ZIP 压缩包中没有可下载文件。' },
  empty_csv: { en: 'The CSV file is empty.', zh: 'CSV 文件为空。' },
  invalid_csv: { en: 'The CSV contains an unclosed quoted value.', zh: 'CSV 中存在未闭合的引号字段。' },
  json_array_required: { en: 'JSON must be an array of objects.', zh: 'JSON 必须是对象数组。' },
  json_objects_required: { en: 'Every JSON array item must be an object.', zh: 'JSON 数组中的每一项都必须是对象。' },
  empty_json_array: { en: 'The JSON array has no columns to export.', zh: 'JSON 数组中没有可导出的字段。' },
  text_required: { en: 'Enter some text first.', zh: '请先输入文本。' },
  base64_required: { en: 'Paste Base64 data first.', zh: '请先粘贴 Base64 数据。' },
  invalid_base64: { en: 'The Base64 value is invalid.', zh: 'Base64 内容无效。' },
  decode_failed: { en: 'The image could not be decoded.', zh: '无法读取这张图片。' },
  canvas_unavailable: { en: 'Canvas processing is unavailable in this browser.', zh: '当前浏览器不支持 Canvas 处理。' },
  encode_failed: { en: 'The browser could not encode the output.', zh: '浏览器无法生成输出文件。' },
}

watch(() => props.type, clear)

function resetResults() {
  error.value = ''
  result.value = null
  batchResults.value = []
  copied.value = false
}

function chooseFiles() {
  input.value?.click()
}
function setFiles(selected: File[]) {
  files.value = tool.value.multiple ? selected : selected.slice(0, 1)
  resetResults()
}
function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) setFiles(Array.from(target.files))
  target.value = ''
}
function onDrop(event: DragEvent) {
  isDragging.value = false
  if (event.dataTransfer?.files.length) setFiles(Array.from(event.dataTransfer.files))
}
function removeFile(index: number) {
  files.value.splice(index, 1)
  resetResults()
}
function clear() {
  files.value = []
  textInput.value = ''
  pageSelection.value = 'all'
  resetResults()
}
function fileSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}
function download(item: ToolResult) {
  const blob = resultToBlob(item)
  if (!blob) return
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = item.filename
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
async function downloadBatch() {
  const zip = new JSZip()
  batchResults.value.forEach((item) => {
    const blob = resultToBlob(item)
    if (blob) zip.file(item.filename, blob)
  })
  download({
    blob: await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }),
    filename: 'pixelforge-results.zip',
    mimeType: 'application/zip',
  })
}
async function copyResult() {
  if (!result.value?.text) return
  await navigator.clipboard.writeText(result.value.text)
  copied.value = true
  window.setTimeout(() => (copied.value = false), 1800)
}
function messageFor(cause: unknown) {
  if (cause instanceof SyntaxError)
    return isZh.value ? 'JSON 格式无效，请检查语法。' : 'Invalid JSON. Check its syntax.'
  const code = cause instanceof Error ? cause.message : ''
  return (
    errorMessages[code]?.[language.value] ??
    (isZh.value ? '处理失败，请检查文件后重试。' : 'Processing failed. Check the file and try again.')
  )
}
async function run() {
  if (!canRun.value || isProcessing.value) return
  isProcessing.value = true
  resetResults()
  try {
    const file = files.value[0]
    switch (props.type) {
      case 'pdf-merge':
        result.value = await mergePdfs(files.value)
        break
      case 'pdf-split':
        batchResults.value = await splitPdf(file)
        break
      case 'pdf-extract-pages':
        result.value = await extractPdfPages(file, pageSelection.value)
        break
      case 'pdf-remove-pages':
        result.value = await removePdfPages(file, pageSelection.value)
        break
      case 'pdf-rotate-pages':
        result.value = await rotatePdfPages(file, pageSelection.value, pageRotation.value)
        break
      case 'images-to-pdf':
        result.value = await imagesToPdf(files.value)
        break
      case 'docx-to-html':
        result.value = await docxToHtml(file)
        break
      case 'docx-to-text':
        result.value = await docxToText(file)
        break
      case 'text-to-docx':
        result.value = await textToDocx(textInput.value)
        break
      case 'images-to-pptx':
        result.value = await imagesToPptx(files.value)
        break
      case 'text-to-pptx':
        result.value = await textToPptx(textInput.value)
        break
      case 'zip-create':
        result.value = await createZip(files.value)
        break
      case 'zip-extract':
        batchResults.value = await extractZip(file)
        break
      case 'json-format':
        result.value = formatJson(textInput.value, minifyJson.value)
        break
      case 'csv-to-json':
        result.value = csvTextToJson(await file.text(), file.name)
        break
      case 'json-to-csv':
        result.value = jsonTextToCsv(textInput.value)
        break
      case 'file-checksum':
        result.value = await calculateChecksum(file, hashAlgorithm.value)
        break
      case 'file-to-base64':
        result.value = await fileToBase64(file)
        break
      case 'base64-to-file':
        result.value = base64ToFile(textInput.value, decodedFilename.value, decodedMimeType.value)
        break
    }
  } catch (cause) {
    error.value = messageFor(cause)
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="page-wrap file-tool-page">
    <nav class="breadcrumbs" :aria-label="isZh ? '面包屑导航' : 'Breadcrumb'">
      <RouterLink to="/">{{ isZh ? '全部工具' : 'All tools' }}</RouterLink>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
      <RouterLink :to="`/tools/${tool.category}`">{{ categoryTitle }}</RouterLink>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
      <span aria-current="page">{{ title }}</span>
    </nav>
    <header class="file-tool-heading">
      <p class="eyebrow">
        <span class="eyebrow-dot"></span>{{ tool.badge }} · {{ isZh ? '本地工具' : 'BROWSER-LOCAL TOOL' }}
      </p>
      <h1 id="file-tool-title">{{ title }}</h1>
      <p>{{ description }}</p>
      <span class="local-processing-note">{{
        isZh ? '文件仅在此浏览器中处理' : 'Processed only in this browser'
      }}</span>
    </header>

    <section class="file-tool-panel" aria-labelledby="file-tool-title">
      <input
        v-if="!acceptsText"
        ref="input"
        class="visually-hidden"
        type="file"
        :accept="tool.accept"
        :multiple="tool.multiple"
        :aria-label="isZh ? '选择文件' : 'Choose files'"
        @change="onChange"
      />
      <div
        v-if="!acceptsText"
        class="file-drop"
        :class="{ 'has-files': files.length, 'is-dragging': isDragging }"
        role="button"
        tabindex="0"
        @click="chooseFiles"
        @keydown.enter="chooseFiles"
        @keydown.space.prevent="chooseFiles"
        @dragenter.prevent="isDragging = true"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
      >
        <div class="upload-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>
        </div>
        <h2>
          {{
            files.length ? (isZh ? '文件已准备好' : 'Files ready') : isZh ? '拖入或选择文件' : 'Drop or choose files'
          }}
        </h2>
        <p>{{ isZh ? '你的文件不会上传到服务器。' : 'Your files never leave this device.' }}</p>
        <button class="primary-button" type="button" @click.stop="chooseFiles">
          {{ isZh ? '选择文件' : 'Choose files' }}
        </button>
      </div>

      <div v-if="files.length" class="selected-file-list" aria-live="polite">
        <div
          v-for="(file, index) in files"
          :key="`${file.name}-${file.lastModified}-${index}`"
          class="selected-file-row"
        >
          <span class="file-badge" aria-hidden="true">{{ tool.badge }}</span>
          <span class="selected-file-name"
            ><strong>{{ file.name }}</strong
            ><small>{{ fileSize(file.size) }}</small></span
          >
          <button type="button" :aria-label="`${isZh ? '移除' : 'Remove'} ${file.name}`" @click="removeFile(index)">
            ×
          </button>
        </div>
      </div>

      <label v-if="acceptsText" class="tool-text-field"
        ><span>{{ isZh ? '输入内容' : 'Input' }}</span
        ><textarea
          v-model="textInput"
          rows="12"
          :placeholder="textPlaceholder"
          spellcheck="false"
          @input="resetResults"
        ></textarea>
      </label>

      <div
        v-if="
          needsPages ||
          props.type === 'file-checksum' ||
          props.type === 'json-format' ||
          props.type === 'base64-to-file'
        "
        class="tool-options"
      >
        <label v-if="needsPages"
          ><span>{{ isZh ? '页面范围' : 'Page range' }}</span
          ><input v-model="pageSelection" type="text" inputmode="numeric" aria-describedby="page-range-hint" /><small
            id="page-range-hint"
            >{{ isZh ? '例如：1-3, 5；输入 all 表示全部页面。' : 'Example: 1-3, 5. Use “all” for every page.' }}</small
          ></label
        >
        <label v-if="props.type === 'pdf-rotate-pages'"
          ><span>{{ isZh ? '旋转角度' : 'Rotation' }}</span
          ><select v-model="pageRotation">
            <option :value="90">90°</option>
            <option :value="180">180°</option>
            <option :value="270">270°</option>
          </select></label
        >
        <label v-if="props.type === 'file-checksum'"
          ><span>{{ isZh ? '算法' : 'Algorithm' }}</span
          ><select v-model="hashAlgorithm">
            <option>SHA-256</option>
            <option>SHA-384</option>
            <option>SHA-512</option>
          </select></label
        >
        <label v-if="props.type === 'json-format'" class="checkbox-option"
          ><input v-model="minifyJson" type="checkbox" /><span>{{
            isZh ? '压缩 JSON（移除空格）' : 'Minify JSON (remove whitespace)'
          }}</span></label
        >
        <label v-if="props.type === 'base64-to-file'"
          ><span>{{ isZh ? '输出文件名' : 'Output filename' }}</span
          ><input v-model="decodedFilename" type="text"
        /></label>
        <label v-if="props.type === 'base64-to-file'"
          ><span>{{ isZh ? '备用 MIME 类型' : 'Fallback MIME type' }}</span
          ><input v-model="decodedMimeType" type="text"
        /></label>
      </div>

      <div class="file-tool-actions">
        <button class="process-button" type="button" :disabled="!canRun || isProcessing" @click="run">
          {{ isProcessing ? (isZh ? '处理中…' : 'Processing…') : action
          }}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
        </button>
        <button
          v-if="files.length || textInput"
          class="text-button"
          type="button"
          :disabled="isProcessing"
          @click="clear"
        >
          {{ isZh ? '清空' : 'Clear' }}
        </button>
      </div>
      <p v-if="error" class="error-message" role="alert">{{ error }}</p>

      <section v-if="result" class="file-tool-result" aria-live="polite">
        <div>
          <strong>{{ isZh ? '处理完成' : 'Your file is ready' }}</strong
          ><span>{{ result.filename }}</span>
        </div>
        <div class="result-actions">
          <button v-if="result.text" class="secondary-button" type="button" @click="copyResult">
            {{ copied ? (isZh ? '已复制' : 'Copied') : isZh ? '复制' : 'Copy' }}</button
          ><button class="primary-button" type="button" @click="download(result)">
            {{ isZh ? '下载结果' : 'Download result' }}
          </button>
        </div>
        <textarea
          v-if="result.text"
          class="result-preview"
          :value="result.text"
          rows="8"
          readonly
          spellcheck="false"
        ></textarea>
      </section>

      <section v-if="batchResults.length" class="file-tool-result batch-result" aria-live="polite">
        <div>
          <strong>{{ isZh ? `已生成 ${batchResults.length} 个文件` : `${batchResults.length} files ready` }}</strong>
        </div>
        <button class="primary-button" type="button" @click="downloadBatch">
          {{ isZh ? '打包下载全部' : 'Download all as ZIP' }}
        </button>
        <div class="batch-result-list">
          <div v-for="item in batchResults" :key="item.filename">
            <span>{{ item.filename }}</span
            ><button type="button" @click="download(item)">{{ isZh ? '下载' : 'Download' }}</button>
          </div>
        </div>
      </section>
    </section>

    <aside class="browser-note">
      <strong>{{ isZh ? '浏览器本地处理' : 'Browser-local processing' }}</strong>
      <p>
        {{
          isZh
            ? '关闭或刷新页面后，所选文件与处理结果会从本页清除。建议及时下载结果。'
            : 'Selected files and results are cleared when you refresh or close this page. Download results before leaving.'
        }}
      </p>
    </aside>

    <section class="tool-explainer" :aria-labelledby="`${tool.id}-steps-title`">
      <div class="section-heading compact-heading">
        <p class="section-kicker">{{ isZh ? '使用方法' : 'HOW IT WORKS' }}</p>
        <h2 :id="`${tool.id}-steps-title`">
          {{ isZh ? `三步完成${title}` : `${title} in three steps` }}
        </h2>
      </div>
      <ol class="tool-step-grid">
        <li v-for="(step, index) in pageContent.steps" :key="step">
          <span aria-hidden="true">0{{ index + 1 }}</span>
          <p>{{ step }}</p>
        </li>
      </ol>
      <div class="tool-why-copy">
        <h2>{{ pageContent.whyTitle }}</h2>
        <p>{{ pageContent.whyText }}</p>
        <RouterLink :to="`/tools/${tool.category}`">
          {{ isZh ? `查看全部${categoryTitle}` : `Explore all ${categoryTitle.toLowerCase()}` }}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
        </RouterLink>
      </div>
    </section>

    <section v-if="relatedTools.length" class="related-tools" aria-labelledby="related-tools-title">
      <div class="section-heading compact-heading">
        <p class="section-kicker">{{ isZh ? '继续处理' : 'KEEP WORKING' }}</p>
        <h2 id="related-tools-title">{{ isZh ? '相关工具' : 'Related tools' }}</h2>
      </div>
      <div class="related-tool-grid">
        <RouterLink v-for="related in relatedTools" :key="related.id" :to="related.path">
          <span>{{ related.badge }}</span>
          <strong>{{ related.title[language] }}</strong>
          <p>{{ related.description[language] }}</p>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
