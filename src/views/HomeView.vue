<script setup lang="ts">
import JSZip from 'jszip'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  formatBytes,
  MAX_BATCH_COUNT,
  MAX_FILE_SIZE,
  processImage,
  type ImageFormat,
  type ImageProcessSettings,
  type ProcessedImage,
} from '../features/image/image-processor'

type ProcessingStatus = 'pending' | 'processing' | 'success' | 'error'

type LocalImage = {
  id: string
  file: File
  previewUrl: string
  status: ProcessingStatus
  progress: number
  result?: ProcessedImage
  resultUrl?: string
  error?: string
}

const { t, locale } = useI18n()
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isProcessing = ref(false)
const images = ref<LocalImage[]>([])
const errorMessage = ref('')
const outputFormat = ref<ImageFormat>('original')
const quality = ref(82)
const width = ref('')
const keepRatio = ref(true)

const canStart = computed(() => images.value.length > 0 && !isProcessing.value)
const successfulImages = computed(() => images.value.filter((image) => image.status === 'success'))
const processButtonLabel = computed(() =>
  isProcessing.value
    ? t('upload.processing', { current: successfulImages.value.length + 1, total: images.value.length })
    : t('upload.start'),
)

function openFilePicker() {
  fileInput.value?.click()
}

function isSupportedImage(file: File) {
  return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name)
}

function addFiles(fileList: FileList | File[]) {
  errorMessage.value = ''
  const incoming = Array.from(fileList)
  if (images.value.length + incoming.length > MAX_BATCH_COUNT) {
    errorMessage.value = t('upload.tooMany')
    return
  }

  for (const file of incoming) {
    if (!isSupportedImage(file)) {
      errorMessage.value = t('upload.fileNotSupported', { name: file.name })
      continue
    }
    if (file.size > MAX_FILE_SIZE) {
      errorMessage.value = t('upload.fileTooLarge', { name: file.name })
      continue
    }
    images.value.push({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
    })
  }
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files) addFiles(input.files)
  input.value = ''
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  if (event.dataTransfer?.files) addFiles(event.dataTransfer.files)
}

function removeImage(id: string) {
  const image = images.value.find((item) => item.id === id)
  if (!image) return
  URL.revokeObjectURL(image.previewUrl)
  if (image.resultUrl) URL.revokeObjectURL(image.resultUrl)
  images.value = images.value.filter((item) => item.id !== id)
}

function clearImages() {
  images.value.forEach((image) => {
    URL.revokeObjectURL(image.previewUrl)
    if (image.resultUrl) URL.revokeObjectURL(image.resultUrl)
  })
  images.value = []
  errorMessage.value = ''
}

function errorText(error: unknown) {
  const code = error instanceof Error ? error.message : 'processing_failed'
  const messages = {
    zh: {
      too_many_pixels: '图片像素过大，请先缩小图片后重试。',
      decode_failed: '图片无法读取，可能已损坏或格式不受支持。',
      canvas_unavailable: '当前浏览器不支持图片处理，请更换最新版浏览器。',
      encode_failed: '图片导出失败，请调整参数后重试。',
      processing_failed: '处理失败，请重试。',
    },
    en: {
      too_many_pixels: 'This image has too many pixels. Resize it first and try again.',
      decode_failed: 'The image could not be read. It may be damaged or unsupported.',
      canvas_unavailable: 'This browser cannot process images. Try the latest browser version.',
      encode_failed: 'The image could not be exported. Adjust the settings and try again.',
      processing_failed: 'Processing failed. Please try again.',
    },
  }
  const language = locale.value === 'zh' ? 'zh' : 'en'
  return messages[language][code as keyof typeof messages.zh] ?? messages[language].processing_failed
}

function getSettings(): ImageProcessSettings {
  return {
    format: outputFormat.value,
    quality: quality.value,
    width: width.value ? Number(width.value) : undefined,
    keepRatio: keepRatio.value,
  }
}

async function processOne(image: LocalImage) {
  image.status = 'processing'
  image.progress = 0
  image.error = ''
  if (image.resultUrl) URL.revokeObjectURL(image.resultUrl)
  image.result = undefined
  image.resultUrl = undefined
  try {
    const result = await processImage(image.file, getSettings(), (progress) => {
      image.progress = progress
    })
    image.result = result
    image.resultUrl = URL.createObjectURL(result.blob)
    image.status = 'success'
    image.progress = 100
  } catch (error) {
    image.status = 'error'
    image.error = errorText(error)
  }
}

async function startProcessing() {
  if (!canStart.value) return
  isProcessing.value = true
  errorMessage.value = ''
  for (const image of images.value) await processOne(image)
  isProcessing.value = false
}

async function retryImage(image: LocalImage) {
  if (isProcessing.value) return
  isProcessing.value = true
  await processOne(image)
  isProcessing.value = false
}

function downloadResult(image: LocalImage) {
  if (!image.resultUrl || !image.result) return
  const link = document.createElement('a')
  link.href = image.resultUrl
  link.download = image.result.outputName
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(image.resultUrl!), 1000)
}

async function downloadAll() {
  if (successfulImages.value.length === 0) return
  const zip = new JSZip()
  successfulImages.value.forEach((image) => {
    if (image.result) zip.file(image.result.outputName, image.result.blob)
  })
  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'pixelforge-images.zip'
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function statusLabel(status: ProcessingStatus) {
  return t(`upload.${status === 'processing' ? 'working' : status}`)
}

onBeforeUnmount(clearImages)
</script>

<template>
  <div class="page-wrap">
    <section class="hero-section" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="eyebrow-dot"></span>{{ t('hero.eyebrow') }}</p>
        <h1 id="hero-title">{{ t('hero.title') }}</h1>
        <p class="hero-description">{{ t('hero.description') }}</p>
        <RouterLink class="hero-update" to="/guides">
          <span class="hero-update-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 3v18M3 12h18" /></svg>
          </span>
          <span
            ><strong>{{ t('hero.update') }}</strong
            >{{ t('hero.updateText') }}</span
          >
          <svg class="hero-update-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
        </RouterLink>
      </div>
      <div class="hero-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
    </section>

    <section class="tool-layout" :aria-label="t('nav.tools')">
      <div class="tool-main">
        <div
          class="upload-card"
          :class="{ dragging: isDragging, 'has-files': images.length > 0 }"
          @dragenter.prevent="isDragging = true"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onDrop"
        >
          <input
            ref="fileInput"
            class="visually-hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            :aria-label="t('upload.choose')"
            @change="onFileChange"
          />
          <div v-if="images.length === 0" class="upload-empty">
            <div class="upload-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>
            </div>
            <h2>{{ t('upload.title') }}</h2>
            <p class="upload-or">{{ t('upload.or') }}</p>
            <button class="primary-button" type="button" @click="openFilePicker">{{ t('upload.choose') }}</button>
            <p class="upload-formats">{{ t('upload.formats') }}</p>
            <p class="privacy-note">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3 5 6v5c0 4.5 2.9 8.5 7 10 4.1-1.5 7-5.5 7-10V6l-7-3Z" />
                <path d="m9 12 2 2 4-4" /></svg
              >{{ t('upload.privacy') }}
            </p>
          </div>

          <div v-else class="upload-filled">
            <div class="file-summary">
              <div>
                <p class="section-kicker">{{ t('upload.selected', { count: images.length }) }}</p>
                <p class="upload-formats">{{ t('upload.formats') }}</p>
              </div>
              <div class="file-actions">
                <button class="secondary-button" type="button" :disabled="isProcessing" @click="openFilePicker">
                  {{ t('upload.addMore') }}</button
                ><button class="text-button" type="button" :disabled="isProcessing" @click="clearImages">
                  {{ t('upload.clear') }}
                </button>
              </div>
            </div>
            <div class="file-grid">
              <article
                v-for="image in images"
                :key="image.id"
                class="file-tile"
                :class="`status-${image.status}`"
                :aria-label="image.file.name"
              >
                <img :src="image.previewUrl" :alt="image.file.name" />
                <div class="file-tile-meta">
                  <span :title="image.file.name">{{ image.file.name }}</span
                  ><small>{{ formatBytes(image.file.size) }}</small>
                  <div class="file-status">
                    <span>{{ statusLabel(image.status) }}</span
                    ><span v-if="image.status === 'processing'">{{ image.progress }}%</span>
                  </div>
                </div>
                <div v-if="image.status === 'processing'" class="tile-progress">
                  <span :style="{ width: `${image.progress}%` }"></span>
                </div>
                <div v-if="image.status === 'success'" class="tile-result">
                  <span>{{ formatBytes(image.result?.blob.size ?? 0) }}</span
                  ><button class="mini-button" type="button" @click="downloadResult(image)">
                    {{ t('upload.download') }}
                  </button>
                </div>
                <div v-if="image.status === 'error'" class="tile-error">
                  <span>{{ image.error }}</span
                  ><button class="mini-button" type="button" @click="retryImage(image)">{{ t('upload.retry') }}</button>
                </div>
                <button
                  v-if="image.status !== 'processing'"
                  class="remove-button"
                  type="button"
                  :aria-label="t('upload.remove', { name: image.file.name })"
                  @click="removeImage(image.id)"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg>
                </button>
              </article>
            </div>
            <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
            <div v-if="successfulImages.length > 0 && !isProcessing" class="results-bar">
              <span>{{ t('upload.completed') }} · {{ successfulImages.length }}/{{ images.length }}</span
              ><button class="secondary-button" type="button" @click="downloadAll">
                {{ t('upload.downloadAll') }}
              </button>
            </div>
          </div>
        </div>
        <div class="ad-slot" :aria-label="t('a11y.advertisement')">
          <span>{{ t('ad') }}</span>
        </div>
      </div>

      <aside class="settings-card" aria-labelledby="settings-title">
        <div class="settings-header">
          <span class="settings-number">01</span>
          <h2 id="settings-title">{{ t('settings.title') }}</h2>
        </div>
        <label class="field-label" for="format">{{ t('settings.format') }}</label>
        <select id="format" v-model="outputFormat" class="field-control">
          <option value="original">{{ t('settings.original') }}</option>
          <option value="jpeg">JPG</option>
          <option value="png">PNG</option>
          <option value="webp">WebP</option>
        </select>
        <label class="field-label" for="quality"
          >{{ t('settings.quality') }} <output>{{ quality }}%</output></label
        >
        <input id="quality" v-model="quality" class="range-control" type="range" min="10" max="100" step="1" />
        <label class="field-label" for="width">{{ t('settings.width') }}</label>
        <input
          id="width"
          v-model="width"
          class="field-control"
          type="number"
          min="1"
          inputmode="numeric"
          :placeholder="t('settings.widthHint')"
        />
        <label class="checkbox-row"
          ><input v-model="keepRatio" type="checkbox" /><span class="custom-checkbox" aria-hidden="true"></span
          ><span>{{ t('settings.keepRatio') }}</span></label
        >
        <button class="process-button" type="button" :disabled="!canStart" @click="startProcessing">
          {{ processButtonLabel }}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
        </button>
        <p class="coming-soon">{{ t('upload.privacy') }}</p>
      </aside>
    </section>

    <section id="why" class="trust-section" aria-labelledby="trust-title">
      <div class="section-heading">
        <p class="eyebrow">PIXELFORGE PRINCIPLES</p>
        <h2 id="trust-title">{{ t('trust.title') }}</h2>
      </div>
      <div class="trust-grid">
        <article class="trust-card">
          <span class="trust-icon">01</span>
          <h3>{{ t('trust.privateTitle') }}</h3>
          <p>{{ t('trust.privateText') }}</p>
        </article>
        <article class="trust-card">
          <span class="trust-icon">02</span>
          <h3>{{ t('trust.simpleTitle') }}</h3>
          <p>{{ t('trust.simpleText') }}</p>
        </article>
        <article class="trust-card">
          <span class="trust-icon">03</span>
          <h3>{{ t('trust.fastTitle') }}</h3>
          <p>{{ t('trust.fastText') }}</p>
        </article>
      </div>
    </section>
  </div>
</template>
