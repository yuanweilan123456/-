<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { categoryCopy, categoryOrder } from '../features/tools/catalog'
import type { ToolCategory } from '../features/tools/types'
import { guides } from '../guide-content'

const { locale, t } = useI18n()
const isZh = computed(() => locale.value === 'zh')
const language = computed(() => (isZh.value ? 'zh' : 'en'))
const activeCategory = ref<ToolCategory | 'all'>('all')
const guideCategories = categoryOrder.filter((category) => guides.some((guide) => guide.category === category))
const visibleGuides = computed(() =>
  activeCategory.value === 'all' ? guides : guides.filter((guide) => guide.category === activeCategory.value),
)
</script>

<template>
  <div class="page-wrap content-page guides-page">
    <p class="eyebrow"><span class="eyebrow-dot"></span>{{ isZh ? 'FILETOOLS 使用指南' : 'FILETOOLS GUIDES' }}</p>
    <h1>{{ isZh ? '先理解方法，再选择工具。' : 'Understand the task, then choose the tool.' }}</h1>
    <p class="content-lead">
      {{
        isZh
          ? '围绕图片、PDF、Word 和 PPT 的常见任务，提供清晰的步骤、格式说明和本地处理建议。'
          : 'Clear steps, format notes, and local-processing advice for common image, PDF, Word, and PPT tasks.'
      }}
    </p>

    <section class="guide-library" aria-labelledby="guide-list-title">
      <header class="guide-library-header">
        <div>
          <p class="section-kicker">{{ isZh ? '按任务浏览' : 'BROWSE BY TASK' }}</p>
          <h2 id="guide-list-title">{{ t('guides.listTitle') }}</h2>
        </div>
        <p>{{ isZh ? `共 ${guides.length} 篇指南` : `${guides.length} practical guides` }}</p>
      </header>

      <div class="guide-filters" role="group" :aria-label="isZh ? '指南分类' : 'Guide categories'">
        <button type="button" :class="{ active: activeCategory === 'all' }" @click="activeCategory = 'all'">
          {{ isZh ? '全部' : 'All' }} <span>{{ guides.length }}</span>
        </button>
        <button
          v-for="category in guideCategories"
          :key="category"
          type="button"
          :class="[`tool-${category}`, { active: activeCategory === category }]"
          @click="activeCategory = category"
        >
          {{ categoryCopy[category].title[language] }}
          <span>{{ guides.filter((guide) => guide.category === category).length }}</span>
        </button>
      </div>

      <div class="guide-grid" aria-live="polite">
        <article v-for="guide in visibleGuides" :key="guide.slug" class="guide-card" :class="`tool-${guide.category}`">
          <div class="guide-card-meta">
            <span class="guide-category-label">{{ categoryCopy[guide.category].title[language] }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ guide.readingTime }}</span>
          </div>
          <h2>{{ isZh ? guide.zh.title : guide.en.title }}</h2>
          <p>{{ isZh ? guide.zh.description : guide.en.description }}</p>
          <RouterLink class="secondary-button" :to="`/guides/${guide.slug}`">
            {{ isZh ? '阅读指南' : 'Read guide' }}
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </RouterLink>
        </article>
      </div>
    </section>
  </div>
</template>
