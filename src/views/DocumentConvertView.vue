<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { getTool, tools } from '../features/tools/catalog'
import { getToolPageContent } from '../features/tools/content'
import { resultToBlob } from '../features/tools/result'
import {
  convertDocument,
  validateConversionFile,
  type ConversionId,
  type ConversionOptions,
  type ConversionOutput,
  type ConversionProgress,
} from '../features/documents/conversion'

const props = defineProps<{ type: ConversionId }>()
const { locale } = useI18n()
const zh = computed(() => locale.value === 'zh')
const language = computed(() => (zh.value ? 'zh' : 'en'))
const tool = computed(() => getTool(props.type)!)
const content = computed(() => getToolPageContent(tool.value, language.value))
const related = computed(() => tools.filter((item) => item.category === 'pdf' && item.id !== props.type).slice(0, 6))
const file = shallowRef<File>()
const input = ref<HTMLInputElement>()
const busy = ref(false)
const dragging = ref(false)
const error = ref('')
const output = shallowRef<ConversionOutput>()
const previewUrl = ref('')
const downloadUrl = ref('')
const options = ref<ConversionOptions>({ pages: '', password: '', mode: 'text', quality: 'standard' })
const progress = ref<ConversionProgress>({ stage: 'reading', current: 0, total: 0 })
let controller: AbortController | undefined
const isWord = computed(() => props.type === 'word-to-pdf')
const size = (bytes: number) =>
  bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
const progressLabel = computed(() =>
  progress.value.stage === 'reading'
    ? zh.value
      ? '正在读取文档…'
      : 'Reading your document…'
    : progress.value.stage === 'packing'
      ? zh.value
        ? '正在生成下载文件…'
        : 'Preparing your download…'
      : zh.value
        ? `正在转换 ${progress.value.current} / ${progress.value.total} 页`
        : `Converting page ${progress.value.current} of ${progress.value.total}`,
)
const notice = computed(() => {
  if (isWord.value)
    return zh.value
      ? '生成图片型 PDF，文字不可选择。复杂表格、字体和分页可能与 Word 不同。'
      : 'Creates an image-based PDF, without selectable text. Complex tables, fonts, and pagination may differ from Word.'
  if (props.type === 'pdf-to-word')
    return options.value.mode === 'text'
      ? zh.value
        ? '提取文字为可编辑段落，不还原表格或图片。纯扫描页面将保留为图片；不含 OCR。'
        : 'Extracts editable paragraphs, not table layouts or pictures. Image-only pages are kept as pictures; no OCR.'
      : zh.value
        ? '每页保存为 Word 中的图片，保留外观，但文字不可编辑。'
        : 'Each page becomes a picture in Word. Appearance is preserved; text is not editable.'
  return props.type === 'pdf-to-text'
    ? zh.value
      ? '仅提取已有文字层。扫描件没有文字层时无法提取，不含 OCR。'
      : 'Extracts an existing text layer only. Scans without text need OCR, which is not included.'
    : zh.value
      ? '整页转为 JPG 图片，不是提取 PDF 中的原始图片。'
      : 'Renders whole pages as JPG images; does not extract the original embedded pictures.'
})
const messages: Record<string, [string, string]> = {
  empty_file: ['The file is empty. Choose another document.', '文件为空，请选择其他文档。'],
  file_too_large: ['Choose a file smaller than 50 MB.', '请选择小于 50 MB 的文件。'],
  legacy_doc: [
    'Legacy .doc is not supported. Save it as .docx in Word first.',
    '暂不支持旧版 .doc，请先在 Word 中另存为 .docx。',
  ],
  wrong_format: ['Choose the file format shown above.', '请选择上方提示的文件格式。'],
  invalid_pdf: ['This is not a readable PDF. Check the original file.', '文件不是有效的 PDF，请检查原文件。'],
  invalid_docx: [
    'This DOCX is damaged, encrypted, or not a Word document.',
    'DOCX 已损坏、已加密或不是有效的 Word 文档。',
  ],
  too_many_pages: ['Select at most 100 pages per conversion.', '每次最多转换 100 页，请缩小页码范围或拆分文档。'],
  invalid_page_range: ['Use valid page numbers, for example 1,3-5.', '请输入文件内有效的页码，例如 1,3-5。'],
  no_text: [
    'No text layer was found. Use PDF to Word → Page appearance to keep scanned pages.',
    '未找到文字层。请使用 PDF 转 Word 的“保留外观”模式保存扫描页面。',
  ],
  PasswordException: ['Enter the correct opening password and try again.', '请输入正确的 PDF 打开密码后重试。'],
  InvalidPDFException: [
    'The PDF is damaged or unsupported. Try a fresh copy.',
    'PDF 损坏或不受支持，请使用有效副本重试。',
  ],
  multiple_files: ['Choose one document at a time.', '每次请选择一个文档。'],
  render_failed: [
    'Could not render this document. Try a simpler document or a smaller page range.',
    '无法渲染此文档，请尝试简化文档或减少页数。',
  ],
}
const errorText = computed(() => (messages[error.value] ?? messages.render_failed)[zh.value ? 1 : 0])

function clearOutput() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value)
  previewUrl.value = ''
  downloadUrl.value = ''
  output.value = undefined
}
function reset() {
  controller?.abort()
  controller = undefined
  busy.value = false
  clearOutput()
  file.value = undefined
  error.value = ''
  dragging.value = false
  options.value = { pages: '', password: '', mode: 'text', quality: 'standard' }
  if (input.value) input.value.value = ''
}
function select(list: FileList | null) {
  if (busy.value || !list?.length) return
  error.value = ''
  if (list.length !== 1) {
    error.value = 'multiple_files'
    return
  }
  try {
    validateConversionFile(list[0], props.type)
    clearOutput()
    file.value = list[0]
    options.value.password = ''
    options.value.pages = ''
  } catch (cause) {
    error.value = (cause as Error).message
  }
}
function drop(event: DragEvent) {
  dragging.value = false
  select(event.dataTransfer?.files ?? null)
}
async function convert() {
  if (!file.value || busy.value) return
  clearOutput()
  error.value = ''
  busy.value = true
  const run = new AbortController()
  controller = run
  try {
    const result = await convertDocument(file.value, props.type, { ...options.value }, run.signal, (value) => {
      progress.value = value
    })
    if (run.signal.aborted) return
    output.value = result
    if (result.preview) previewUrl.value = URL.createObjectURL(result.preview)
    downloadUrl.value = URL.createObjectURL(resultToBlob(result.result)!)
  } catch (cause) {
    if (!run.signal.aborted) {
      const failure = cause as Error
      error.value = messages[failure.message] ? failure.message : failure.name
    }
  } finally {
    if (controller === run) {
      busy.value = false
      controller = undefined
    }
  }
}
watch(
  options,
  () => {
    if (!busy.value) {
      clearOutput()
      error.value = ''
    }
  },
  { deep: true },
)
watch(() => props.type, reset)
onBeforeUnmount(reset)
</script>

<template>
  <div class="page-wrap converter-page">
    <nav class="converter-breadcrumb" :aria-label="zh ? '导航路径' : 'Breadcrumb'">
      <RouterLink to="/">FileTools</RouterLink><span>/</span
      ><RouterLink to="/tools/pdf">{{ zh ? 'PDF 工具' : 'PDF tools' }}</RouterLink
      ><span>/</span><span>{{ tool.title[language] }}</span>
    </nav>
    <header class="converter-heading">
      <span class="converter-badge">{{ tool.badge }}</span>
      <h1>{{ tool.title[language] }}</h1>
      <p>{{ tool.description[language] }}</p>
      <div class="converter-trust">
        <span>{{ zh ? '无需上传' : 'No uploads' }}</span
        ><span>{{ zh ? '无需注册' : 'No account' }}</span
        ><span>{{ zh ? '免费本地转换' : 'Free & local' }}</span>
      </div>
    </header>
    <ol class="converter-steps" :aria-label="zh ? '转换流程' : 'Conversion steps'">
      <li :class="{ active: !file }"><span>1</span>{{ zh ? '选择文件' : 'Choose a file' }}</li>
      <li :class="{ active: file && !output }"><span>2</span>{{ zh ? '设置并转换' : 'Convert locally' }}</li>
      <li :class="{ active: output }"><span>3</span>{{ zh ? '下载结果' : 'Download' }}</li>
    </ol>
    <div class="converter-workspace" :aria-busy="busy">
      <section
        class="converter-document"
        :class="{ dragging }"
        @dragover.prevent="dragging = !busy"
        @dragleave.prevent="dragging = false"
        @drop.prevent="drop"
      >
        <input
          ref="input"
          type="file"
          hidden
          :accept="tool.accept"
          :disabled="busy"
          @change="select(($event.target as HTMLInputElement).files)"
        />
        <template v-if="!file">
          <div class="converter-file-icon" aria-hidden="true">
            <svg viewBox="0 0 64 64"><path d="M16 6h22l12 12v40H16zM38 6v14h12M24 34h18M24 42h12" /></svg>
          </div>
          <h2>{{ zh ? '从你的文档开始' : 'Start with your document' }}</h2>
          <button class="primary-button converter-select" type="button" @click="input?.click()">
            {{ isWord ? (zh ? '选择 Word 文档' : 'Select Word document') : zh ? '选择 PDF 文件' : 'Select PDF file' }}
            <span aria-hidden="true">＋</span>
          </button>
          <p>{{ zh ? '或将文件拖到这里' : 'or drag and drop a file here' }}</p>
          <small
            >{{ isWord ? '.DOCX' : '.PDF' }} ·
            {{ zh ? '最大 50 MB · 最多转换 100 页' : 'Up to 50 MB · 100 pages per conversion' }}</small
          >
        </template>
        <template v-else>
          <div class="converter-file-row">
            <div>
              <strong>{{ file.name }}</strong
              ><small>{{ size(file.size) }} · {{ zh ? '保存在你的设备上' : 'Stays on your device' }}</small>
            </div>
            <button type="button" class="text-button" :disabled="busy" @click="reset">
              {{ zh ? '移除' : 'Remove' }}
            </button>
          </div>
          <div v-if="previewUrl" class="converter-preview">
            <img :src="previewUrl" :alt="zh ? '转换结果第一页预览' : 'First converted page preview'" /><small>{{
              zh ? '第一页预览 · 下载后检查全部页面' : 'First page preview · Check all pages after download'
            }}</small>
          </div>
          <textarea
            v-else-if="output?.result.text"
            class="converter-text-preview"
            :aria-label="zh ? '提取文字预览' : 'Extracted text preview'"
            :value="output.result.text"
            readonly
            rows="12"
          ></textarea>
          <div v-else class="converter-ready">
            <span class="converter-file-stamp" aria-hidden="true">{{ isWord ? 'W' : 'PDF' }}</span>
            <h2>
              {{ busy ? (zh ? '正在本地处理' : 'Working on your device') : zh ? '准备好转换了' : 'Ready when you are' }}
            </h2>
            <p>{{ zh ? '选择右侧选项，然后开始转换。' : 'Choose your options, then start the conversion.' }}</p>
          </div>
          <div v-if="busy" class="converter-progress" role="status" aria-live="polite">
            <span>{{ progressLabel }}</span
            ><progress :value="progress.total ? progress.current : undefined" :max="progress.total || 1"></progress>
          </div>
          <div v-if="output" class="converter-result" role="status">
            <strong>✓ {{ zh ? '转换完成' : 'Your file is ready' }}</strong>
            <p>
              {{ output.result.filename }} · {{ output.pageCount }} {{ zh ? '页' : 'pages' }} ·
              {{ size(resultToBlob(output.result)?.size ?? 0) }}
            </p>
            <a class="primary-button" :href="downloadUrl" :download="output.result.filename"
              >{{ zh ? '下载文件' : 'Download file' }} ↓</a
            ><button class="text-button" type="button" @click="reset">
              {{ zh ? '转换另一个文件' : 'Convert another file' }}
            </button>
            <p v-if="output.warnings.length" class="converter-warning">
              {{
                zh
                  ? `第 ${output.warnings.map((item) => item.split(':')[1]).join(', ')} 页未检测到文字层。扫描页面不能直接变成可编辑文字。`
                  : `No text layer on page(s) ${output.warnings.map((item) => item.split(':')[1]).join(', ')}. Scanned pages cannot become editable text without OCR.`
              }}
            </p>
          </div>
        </template>
      </section>
      <aside class="converter-options">
        <h2>{{ zh ? '转换选项' : 'Make it yours' }}</h2>
        <fieldset :disabled="busy">
          <template v-if="type === 'pdf-to-word'"
            ><legend>{{ zh ? 'Word 输出模式' : 'Word output mode' }}</legend>
            <label class="converter-mode" :class="{ selected: options.mode === 'text' }"
              ><input v-model="options.mode" type="radio" value="text" name="word-mode" /><span
                ><strong>{{ zh ? '可编辑文字' : 'Editable text' }}</strong
                ><small>{{ zh ? '方便复制、修改段落' : 'Reuse and edit paragraphs' }}</small></span
              ></label
            ><label class="converter-mode" :class="{ selected: options.mode === 'appearance' }"
              ><input v-model="options.mode" type="radio" value="appearance" name="word-mode" /><span
                ><strong>{{ zh ? '保留页面外观' : 'Page appearance' }}</strong
                ><small>{{ zh ? '整页图片，不可编辑文字' : 'Page images, not editable text' }}</small></span
              ></label
            ></template
          >
          <template v-if="!isWord"
            ><label class="converter-field"
              >{{ zh ? '页码范围' : 'Pages to convert'
              }}<input
                v-model="options.pages"
                type="text"
                :placeholder="zh ? '全部页面，或 1,3-5' : 'All pages, or 1,3-5'"
              /><small>{{ zh ? '留空表示全部，最多 100 页。' : 'Leave blank for all, up to 100 pages.' }}</small></label
            >
            <details class="converter-password">
              <summary>{{ zh ? 'PDF 有打开密码？' : 'Password-protected PDF?' }}</summary>
              <label class="converter-field"
                >{{ zh ? '打开密码（仅本地使用）' : 'Opening password (local only)'
                }}<input v-model="options.password" type="password" autocomplete="off"
              /></label></details
          ></template>
          <label v-if="type !== 'pdf-to-text'" class="converter-field"
            >{{ zh ? '渲染画质' : 'Rendering quality'
            }}<select v-model="options.quality">
              <option value="standard">{{ zh ? '标准 · 文件更小' : 'Standard · smaller files' }}</option>
              <option value="high">{{ zh ? '清晰 · 文件更大' : 'Sharp · larger files' }}</option>
            </select></label
          >
        </fieldset>
        <p class="converter-notice">{{ notice }}</p>
        <button
          class="primary-button converter-submit"
          type="button"
          :disabled="!file"
          @click="busy ? controller?.abort() : convert()"
        >
          {{ busy ? (zh ? '取消转换' : 'Cancel conversion') : tool.action[language] }}
          <span aria-hidden="true">{{ busy ? '×' : '→' }}</span>
        </button>
        <p class="converter-local">
          {{ zh ? '文件与密码只在此浏览器中处理。' : 'Files and passwords stay in this browser.' }}
        </p>
      </aside>
    </div>
    <p v-if="error" class="error-message converter-error" role="alert">{{ errorText }}</p>
    <section class="converter-guide">
      <div>
        <p class="section-kicker">{{ zh ? '使用指南' : 'A BETTER WAY TO WORK' }}</p>
        <h2>{{ zh ? '转换前，了解你的文件' : 'The right result for your document' }}</h2>
        <p>{{ content.editorial.overview }}</p>
      </div>
      <div class="converter-guide-grid">
        <article>
          <h3>{{ zh ? '适用场景' : 'Best for' }}</h3>
          <p>{{ content.editorial.bestFor }}</p>
        </article>
        <article>
          <h3>{{ zh ? '支持的文件' : 'What goes in' }}</h3>
          <p>{{ content.editorial.input }}</p>
        </article>
        <article>
          <h3>{{ zh ? '输出结果' : 'What comes out' }}</h3>
          <p>{{ content.editorial.output }}</p>
        </article>
      </div>
      <details open>
        <summary>{{ zh ? '已知限制' : 'Known limitations' }}</summary>
        <p>{{ content.editorial.limitation }}</p>
      </details>
      <details>
        <summary>{{ zh ? '获得更好的转换结果' : 'Tips for a better conversion' }}</summary>
        <ul>
          <li v-for="tip in content.editorial.tips" :key="tip">{{ tip }}</li>
        </ul>
      </details>
    </section>
    <section class="related-tools">
      <h2>{{ zh ? '继续处理你的文件' : 'Keep your workflow moving' }}</h2>
      <div class="related-tool-grid">
        <RouterLink v-for="item in related" :key="item.id" :to="item.path"
          ><span>{{ item.badge }}</span
          ><strong>{{ item.title[language] }}</strong>
          <p>{{ item.description[language] }}</p></RouterLink
        >
      </div>
    </section>
  </div>
</template>

<style scoped>
.converter-page {
  padding-top: 28px;
  padding-bottom: 64px;
  max-width: 1200px;
}
.converter-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--muted);
  font-size: 13px;
}
.converter-breadcrumb a:hover {
  color: var(--primary);
}
.converter-heading {
  text-align: center;
  padding: 42px 16px 26px;
}
.converter-badge {
  display: inline-block;
  background: var(--primary-soft);
  color: var(--primary);
  padding: 9px 16px;
  border: 1px solid color-mix(in srgb, var(--primary) 18%, transparent);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
}
.converter-heading h1 {
  font-size: clamp(32px, 5vw, 54px);
  margin: 18px 0 12px;
  letter-spacing: -0.04em;
  line-height: 1.15;
}
.converter-heading > p {
  color: var(--muted);
  font-size: 17px;
  line-height: 1.6;
  max-width: 650px;
  margin: 0 auto;
}
.converter-trust {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 22px;
  font-size: 12px;
  color: var(--muted);
}
.converter-trust span:before {
  content: '✓';
  color: var(--success);
  margin-right: 6px;
}
.converter-steps {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 36px;
  padding: 0;
  margin: 10px 0 28px;
  color: var(--muted);
  font-size: 13px;
}
.converter-steps li {
  display: flex;
  gap: 9px;
  align-items: center;
}
.converter-steps li > span {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border: 1px solid var(--line);
  border-radius: 50%;
  font-size: 11px;
}
.converter-steps .active {
  color: var(--primary);
  font-weight: 700;
}
.converter-steps .active > span {
  background: var(--primary);
  color: var(--surface);
  border-color: transparent;
}
.converter-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  border: 1px solid var(--line);
  border-radius: 24px;
  overflow: hidden;
  background: var(--surface);
  box-shadow: var(--shadow-lg);
}
.converter-document {
  padding: 36px;
  text-align: center;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  border: 2px solid transparent;
  transition:
    background 0.2s,
    border-color 0.2s;
}
.converter-document.dragging {
  background: var(--primary-soft);
  border-color: var(--primary);
}
.converter-document h2 {
  font-size: 22px;
  letter-spacing: -0.02em;
}
.converter-document p,
.converter-document small {
  color: var(--muted);
  line-height: 1.6;
}
.converter-document > small {
  font-size: 12px;
}
.converter-file-icon {
  width: 86px;
  height: 100px;
  background: var(--primary-soft);
  border: 1px solid var(--line);
  border-radius: 16px;
  transform: rotate(-6deg);
  display: grid;
  place-items: center;
  margin-bottom: 10px;
  box-shadow: var(--shadow);
}
.converter-file-icon svg {
  width: 52px;
  height: 52px;
  fill: none;
  stroke: var(--primary);
  stroke-width: 2.5;
  stroke-linejoin: round;
}
.converter-select {
  padding: 17px 28px;
  gap: 25px;
  min-height: 56px;
}
.converter-options {
  padding: 28px;
  background: color-mix(in srgb, var(--surface-muted) 40%, var(--surface));
  border-left: 1px solid var(--line);
}
.converter-options h2 {
  font-size: 18px;
  margin: 0 0 22px;
}
.converter-options fieldset {
  padding: 0;
  border: 0;
  margin: 0;
  min-width: 0;
}
.converter-options legend {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 12px;
}
.converter-mode {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 13px;
  margin-bottom: 10px;
  cursor: pointer;
  background: var(--surface);
}
.converter-mode.selected {
  border-color: var(--primary);
  background: var(--primary-soft);
}
.converter-mode input {
  accent-color: var(--primary);
}
.converter-mode strong {
  display: block;
  font-size: 13px;
}
.converter-mode small {
  display: block;
  color: var(--muted);
  font-size: 11px;
  margin-top: 4px;
}
.converter-field {
  display: grid;
  gap: 9px;
  font-size: 13px;
  font-weight: 600;
  margin: 18px 0;
}
.converter-field input,
.converter-field select {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  border-radius: 10px;
  padding: 11px;
  font-size: 13px;
}
.converter-field small {
  font-size: 11px;
  color: var(--muted);
  font-weight: 400;
  line-height: 1.5;
}
.converter-password summary {
  font-size: 12px;
  color: var(--muted);
  cursor: pointer;
}
.converter-notice {
  font-size: 12px;
  line-height: 1.7;
  padding: 14px;
  border-radius: 10px;
  background: var(--primary-soft);
  color: var(--muted);
}
.converter-submit {
  width: 100%;
  min-height: 50px;
  justify-content: space-between;
  font-size: 14px;
}
.converter-local {
  font-size: 11px;
  text-align: center;
  color: var(--muted);
  line-height: 1.6;
}
.converter-file-row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  text-align: left;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
}
.converter-file-row strong {
  overflow-wrap: anywhere;
  font-size: 14px;
}
.converter-file-row small {
  display: block;
  font-size: 11px;
  margin-top: 5px;
}
.converter-file-row button {
  flex-shrink: 0;
}
.converter-ready {
  padding: 40px 0;
}
.converter-file-stamp {
  display: inline-grid;
  place-items: center;
  width: 70px;
  height: 85px;
  background: var(--primary-soft);
  border: 1px solid var(--line);
  border-radius: 12px;
  color: var(--primary);
  font-size: 20px;
  font-weight: 800;
}
.converter-preview {
  padding: 24px 0 16px;
  width: 100%;
}
.converter-preview img {
  max-width: 100%;
  max-height: 360px;
  object-fit: contain;
  box-shadow: var(--shadow);
  background: white;
  border: 1px solid var(--line);
}
.converter-preview small {
  display: block;
  font-size: 11px;
  margin-top: 12px;
}
.converter-text-preview {
  width: 100%;
  background: var(--surface-muted);
  color: var(--text);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 16px;
  margin: 20px 0;
  resize: vertical;
}
.converter-progress {
  display: grid;
  gap: 12px;
  width: 100%;
  font-size: 13px;
  color: var(--muted);
}
.converter-progress progress {
  width: 100%;
  height: 8px;
  accent-color: var(--primary);
}
.converter-result {
  width: 100%;
  padding-top: 12px;
}
.converter-result > strong {
  color: var(--success);
  font-size: 19px;
}
.converter-result > p {
  font-size: 12px;
  overflow-wrap: anywhere;
}
.converter-result > a {
  display: inline-flex;
  gap: 30px;
}
.converter-result > button {
  display: block;
  margin: 14px auto 0;
}
.converter-warning {
  background: var(--primary-soft);
  padding: 12px;
  border-radius: 8px;
}
.converter-error {
  padding: 16px;
  margin-top: 16px;
  border: 1px solid var(--danger);
  border-radius: 12px;
}
.converter-guide {
  margin: 58px 0;
  padding: 30px 0;
  border-top: 1px solid var(--line);
}
.converter-guide h2 {
  font-size: 26px;
  letter-spacing: -0.03em;
}
.converter-guide p,
.converter-guide li {
  color: var(--muted);
  line-height: 1.8;
  font-size: 14px;
}
.converter-guide-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin: 28px 0;
}
.converter-guide-grid article {
  border: 1px solid var(--line);
  background: var(--surface);
  padding: 22px;
  border-radius: 14px;
}
.converter-guide h3 {
  font-size: 15px;
  margin-top: 0;
}
.converter-guide details {
  padding: 18px 0;
  border-top: 1px solid var(--line);
}
.converter-guide summary {
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
}
@media (max-width: 760px) {
  .converter-workspace {
    grid-template-columns: 1fr;
  }
  .converter-options {
    border-left: 0;
    border-top: 1px solid var(--line);
  }
  .converter-document {
    padding: 24px;
    min-height: 350px;
  }
  .converter-guide-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .converter-steps {
    gap: 14px;
    font-size: 11px;
  }
  .converter-heading {
    padding-top: 30px;
  }
  .converter-trust {
    gap: 12px;
  }
  .converter-file-row {
    align-items: flex-start;
  }
  .converter-options {
    padding: 22px;
  }
  .converter-heading > p {
    font-size: 15px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .converter-document {
    transition: none;
  }
}
</style>
