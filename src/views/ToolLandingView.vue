<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { categoryCopy, tools } from '../features/tools/catalog'

const props = defineProps<{ type: 'compress' | 'convert' | 'resize' | 'rotate' | 'flip' }>()
const { locale } = useI18n()

const content = computed(() => {
  const zh = {
    compress: {
      title: '在线压缩图片',
      description: '在浏览器本地压缩 JPG、PNG 和 WebP 图片，减少文件体积，不需要上传或注册。',
      keyword: '图片压缩',
    },
    convert: {
      title: '在线转换图片格式',
      description: '在 JPG、PNG 和 WebP 之间转换图片格式。文件在你的设备上处理，简单、快速、私密。',
      keyword: '图片格式转换',
    },
    resize: {
      title: '在线调整图片尺寸',
      description: '输入目标宽度，按比例调整图片尺寸，适合上传网站、表单和社交平台。',
      keyword: '图片尺寸调整',
    },
    rotate: {
      title: '在线旋转图片',
      description: '将 JPG、PNG 和 WebP 图片旋转 90、180 或 270 度，文件无需上传。',
      keyword: '图片旋转',
    },
    flip: {
      title: '在线翻转图片',
      description: '在浏览器本地水平或垂直翻转图片，快速生成新文件。',
      keyword: '图片翻转',
    },
  }
  const en = {
    compress: {
      title: 'Compress images online',
      description: 'Compress JPG, PNG, and WebP images locally in your browser. No upload and no sign-up required.',
      keyword: 'Image compression',
    },
    convert: {
      title: 'Convert image formats online',
      description: 'Convert images between JPG, PNG, and WebP on your device. Simple, fast, and private.',
      keyword: 'Image format conversion',
    },
    resize: {
      title: 'Resize images online',
      description: 'Set a target width and resize images proportionally for websites, forms, and social platforms.',
      keyword: 'Image resizing',
    },
    rotate: {
      title: 'Rotate images online',
      description: 'Rotate JPG, PNG, and WebP images by 90, 180, or 270 degrees without uploading them.',
      keyword: 'Image rotation',
    },
    flip: {
      title: 'Flip images online',
      description: 'Flip images horizontally or vertically, processed locally in your browser.',
      keyword: 'Image flipping',
    },
  }
  return (locale.value === 'zh' ? zh : en)[props.type]
})

const isZh = computed(() => locale.value === 'zh')
const language = computed<'en' | 'zh'>(() => (isZh.value ? 'zh' : 'en'))
const currentTool = computed(() => tools.find((tool) => tool.id === `image-${props.type}`)!)
const relatedTools = computed(() =>
  tools.filter((tool) => tool.category === 'image' && tool.id !== currentTool.value.id).slice(0, 3),
)
</script>

<template>
  <div class="page-wrap landing-page">
    <nav class="breadcrumbs" :aria-label="isZh ? '面包屑导航' : 'Breadcrumb'">
      <RouterLink to="/">{{ isZh ? '全部工具' : 'All tools' }}</RouterLink>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
      <RouterLink to="/tools/image">{{ categoryCopy.image.title[language] }}</RouterLink>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
      <span aria-current="page">{{ content.title }}</span>
    </nav>
    <p class="eyebrow"><span class="eyebrow-dot"></span>{{ content.keyword }}</p>
    <h1>{{ content.title }}</h1>
    <p class="landing-description">{{ content.description }}</p>
    <RouterLink class="primary-button landing-cta" to="/tools/image/studio"
      >{{ isZh ? '开始使用工具' : 'Open the tool' }}
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg
    ></RouterLink>

    <section class="landing-content" :aria-label="content.title">
      <div>
        <p class="section-kicker">01</p>
        <h2>{{ isZh ? '选择图片' : 'Choose images' }}</h2>
        <p>
          {{
            isZh
              ? '拖拽或选择 JPG、PNG、WebP 文件。图片不会离开你的设备。'
              : 'Drop or choose JPG, PNG, or WebP files. Your images stay on your device.'
          }}
        </p>
      </div>
      <div>
        <p class="section-kicker">02</p>
        <h2>{{ isZh ? '调整参数' : 'Adjust settings' }}</h2>
        <p>
          {{
            isZh
              ? '选择输出格式、质量和目标宽度，实时准备你的处理任务。'
              : 'Choose the output format, quality, and target width for your task.'
          }}
        </p>
      </div>
      <div>
        <p class="section-kicker">03</p>
        <h2>{{ isZh ? '下载结果' : 'Download results' }}</h2>
        <p>
          {{
            isZh
              ? '逐个下载，或一次性打包下载所有成功处理的图片。'
              : 'Download files individually or as one ZIP archive.'
          }}
        </p>
      </div>
    </section>
    <aside v-if="props.type === 'compress'" class="related-guide">
      <div>
        <p class="section-kicker">{{ isZh ? '相关指南' : 'RELATED GUIDE' }}</p>
        <p>
          {{
            isZh
              ? '了解图片格式、尺寸和质量之间的取舍，获得更适合网页和表单的文件。'
              : 'Learn how format, dimensions, and quality affect the right image for websites and forms.'
          }}
        </p>
      </div>
      <RouterLink class="secondary-button" to="/guides/compress-images-without-upload">
        {{ isZh ? '阅读压缩指南' : 'Read the compression guide' }}
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
      </RouterLink>
    </aside>

    <section class="related-tools" aria-labelledby="related-image-tools-title">
      <div class="section-heading compact-heading">
        <p class="section-kicker">{{ isZh ? '继续处理' : 'KEEP WORKING' }}</p>
        <h2 id="related-image-tools-title">{{ isZh ? '相关图片工具' : 'Related image tools' }}</h2>
      </div>
      <div class="related-tool-grid">
        <RouterLink v-for="tool in relatedTools" :key="tool.id" :to="tool.path">
          <span>{{ tool.badge }}</span>
          <strong>{{ tool.title[language] }}</strong>
          <p>{{ tool.description[language] }}</p>
        </RouterLink>
      </div>
    </section>

    <div class="ad-slot landing-ad" aria-label="Advertisement placeholder">
      <span>{{ isZh ? '广告位预留 · 上线后启用' : 'Ad space reserved · Enabled after launch' }}</span>
    </div>
  </div>
</template>
