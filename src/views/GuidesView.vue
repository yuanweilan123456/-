<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { guides } from '../guide-content'

const { locale, t } = useI18n()
const isZh = computed(() => locale.value === 'zh')
</script>

<template>
  <div class="page-wrap content-page guides-page">
    <p class="eyebrow"><span class="eyebrow-dot"></span>{{ isZh ? 'PIXELFORGE 使用指南' : 'PIXELFORGE GUIDES' }}</p>
    <h1>{{ isZh ? '先理解方法，再选择工具。' : 'Understand the task, then choose the tool.' }}</h1>
    <p class="content-lead">
      {{
        isZh
          ? '围绕图片、PDF、Word 和 PPT 的常见任务，提供清晰的步骤、格式说明和本地处理建议。'
          : 'Clear steps, format notes, and local-processing advice for common image, PDF, Word, and PPT tasks.'
      }}
    </p>

    <section class="guide-grid" aria-labelledby="guide-list-title">
      <h2 id="guide-list-title" class="visually-hidden">{{ t('guides.listTitle') }}</h2>
      <article v-for="guide in guides" :key="guide.slug" class="guide-card">
        <div class="guide-card-meta">
          <span>{{ guide.readingTime }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ isZh ? '实用指南' : 'Practical guide' }}</span>
        </div>
        <h2>{{ isZh ? guide.zh.title : guide.en.title }}</h2>
        <p>{{ isZh ? guide.zh.description : guide.en.description }}</p>
        <RouterLink class="secondary-button" :to="`/guides/${guide.slug}`">
          {{ isZh ? '阅读指南' : 'Read guide' }}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
        </RouterLink>
      </article>
    </section>
  </div>
</template>
