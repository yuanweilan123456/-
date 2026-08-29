<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { locale } = useI18n()
const isZh = computed(() => locale.value === 'zh')
const content = computed(() =>
  isZh.value
    ? {
        eyebrow: '关于 PIXELFORGE',
        title: '小而可靠的本地文件工具箱。',
        description:
          'PixelForge 面向需要快速处理文件、又不希望上传到陌生服务器的人。我们把常用操作放回浏览器，让隐私和效率同时成为默认设置。',
        cards: [
          {
            label: '01 / 隐私',
            title: '文件留在你的设备',
            text: '当前版本使用浏览器本地能力处理文件，不建立账号，不保存文件内容。',
          },
          {
            label: '02 / 体验',
            title: '每一步都说清楚',
            text: '工具页会说明支持格式、处理结果和已知限制，帮助你在下载前做出判断。',
          },
          {
            label: '03 / 方向',
            title: '从高频需求开始',
            text: '先做好图片、PDF、Word 和 PPT 的常用场景，再根据真实需求扩展更复杂的转换。',
          },
        ],
        toolbox: '查看全部工具',
      }
    : {
        eyebrow: 'ABOUT PIXELFORGE',
        title: 'A small, dependable local file toolbox.',
        description:
          'PixelForge is for people who need quick file tasks without sending documents to an unfamiliar server. We keep common operations in the browser, making privacy and speed the default.',
        cards: [
          {
            label: '01 / PRIVACY',
            title: 'Files stay on your device',
            text: 'The current version uses browser-local processing with no accounts and no storage of file contents.',
          },
          {
            label: '02 / CLARITY',
            title: 'Every step is explained',
            text: 'Tool pages show supported formats, results, and known limitations before you download.',
          },
          {
            label: '03 / FOCUS',
            title: 'Start with frequent tasks',
            text: 'We are starting with practical image, PDF, Word, and PPT workflows, then expanding from real demand.',
          },
        ],
        toolbox: 'Explore the toolbox',
      },
)
</script>

<template>
  <div class="page-wrap content-page about-page">
    <p class="eyebrow"><span class="eyebrow-dot"></span>{{ content.eyebrow }}</p>
    <h1>{{ content.title }}</h1>
    <p class="content-lead">{{ content.description }}</p>

    <section class="principle-grid" :aria-label="content.eyebrow">
      <article v-for="card in content.cards" :key="card.label" class="principle-card">
        <p class="section-kicker">{{ card.label }}</p>
        <h2>{{ card.title }}</h2>
        <p>{{ card.text }}</p>
      </article>
    </section>

    <RouterLink class="primary-button inline-button" to="/toolbox"
      >{{ content.toolbox }} <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg
    ></RouterLink>
  </div>
</template>
