<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { categoryCopy } from '../features/tools/catalog'
import { getGuide, guides } from '../guide-content'

const props = defineProps<{ slug: string }>()
const { locale } = useI18n()
const guide = computed(() => getGuide(props.slug))
const isZh = computed(() => locale.value === 'zh')
const content = computed(() => {
  const current = guide.value
  return current ? (isZh.value ? current.zh : current.en) : null
})
const relatedGuides = computed(() => {
  const current = guide.value
  if (!current) return []
  return guides.filter((item) => item.category === current.category && item.slug !== current.slug).slice(0, 3)
})
</script>

<template>
  <div v-if="guide && content" class="page-wrap guide-page">
    <nav class="breadcrumbs" :aria-label="isZh ? '面包屑导航' : 'Breadcrumb'">
      <RouterLink to="/">{{ isZh ? '全部工具' : 'All tools' }}</RouterLink>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
      <RouterLink to="/guides">{{ isZh ? '使用指南' : 'Guides' }}</RouterLink>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
      <span aria-current="page">{{ content.title }}</span>
    </nav>
    <article>
      <p class="eyebrow"><span class="eyebrow-dot"></span>{{ isZh ? 'PIXELFORGE 使用指南' : 'PIXELFORGE GUIDE' }}</p>
      <h1>{{ content.title }}</h1>
      <p class="guide-lead">{{ content.intro }}</p>
      <div class="guide-actions">
        <RouterLink class="primary-button" :to="guide.toolPath">
          {{ content.toolLabel }}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
        </RouterLink>
        <span class="guide-reading-time">{{ guide.readingTime }} {{ isZh ? '阅读' : 'read' }}</span>
      </div>

      <section class="guide-steps" :aria-label="isZh ? '使用步骤' : 'Steps'">
        <h2>{{ isZh ? '三步完成' : 'Complete it in three steps' }}</h2>
        <ol>
          <li v-for="step in content.steps" :key="step">{{ step }}</li>
        </ol>
      </section>

      <section v-for="section in content.sections" :key="section.heading" class="guide-section">
        <h2>{{ section.heading }}</h2>
        <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
      </section>

      <section v-if="relatedGuides.length" class="guide-related-section" aria-labelledby="related-guides-title">
        <header>
          <div>
            <p class="section-kicker">{{ isZh ? '继续学习' : 'KEEP LEARNING' }}</p>
            <h2 id="related-guides-title">{{ isZh ? '相关使用指南' : 'Related guides' }}</h2>
          </div>
          <RouterLink :to="`/tools/${guide.category}`">
            {{ categoryCopy[guide.category].title[isZh ? 'zh' : 'en'] }}
          </RouterLink>
        </header>
        <div class="guide-related-grid">
          <RouterLink v-for="item in relatedGuides" :key="item.slug" :to="`/guides/${item.slug}`">
            <span>{{ item.readingTime }}</span>
            <strong>{{ isZh ? item.zh.title : item.en.title }}</strong>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </RouterLink>
        </div>
      </section>
    </article>
  </div>
  <div v-else class="page-wrap not-found-page">
    <p class="not-found-code">404</p>
    <h1>{{ isZh ? '指南不存在' : 'Guide not found' }}</h1>
    <RouterLink class="primary-button" to="/guides">{{ isZh ? '查看全部指南' : 'View all guides' }}</RouterLink>
  </div>
</template>
