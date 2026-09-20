<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { categoryCopy } from '../features/tools/catalog'
import { getGuide, guides } from '../guide-content'
import { getGuideDetails } from '../guide-details'

const props = defineProps<{ slug: string }>()
const { locale } = useI18n()
const guide = computed(() => getGuide(props.slug))
const isZh = computed(() => locale.value === 'zh')
const content = computed(() => {
  const current = guide.value
  return current ? (isZh.value ? current.zh : current.en) : null
})
const details = computed(() => getGuideDetails(props.slug)?.[isZh.value ? 'zh' : 'en'])
const reviewedDate = computed(() => {
  const reviewed = getGuideDetails(props.slug)?.reviewed
  if (!reviewed) return ''
  return new Intl.DateTimeFormat(isZh.value ? 'zh-CN' : 'en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${reviewed}T00:00:00Z`))
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
      <p class="eyebrow"><span class="eyebrow-dot"></span>{{ isZh ? 'FILETOOLS 使用指南' : 'FILETOOLS GUIDE' }}</p>
      <h1>{{ content.title }}</h1>
      <p class="guide-lead">{{ content.intro }}</p>
      <div class="guide-byline">
        <span>{{ isZh ? '由' : 'Written and reviewed by' }}</span>
        <RouterLink to="/how-we-test">{{
          isZh ? 'FileTools 质量与测试说明' : 'FileTools quality and testing notes'
        }}</RouterLink>
        <span aria-hidden="true">·</span>
        <span>{{ isZh ? `更新于 ${reviewedDate}` : `Updated ${reviewedDate}` }}</span>
      </div>
      <div class="guide-actions">
        <RouterLink class="primary-button" :to="guide.toolPath">
          {{ content.toolLabel }}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
        </RouterLink>
        <span class="guide-reading-time">{{ guide.readingTime }} {{ isZh ? '阅读' : 'read' }}</span>
      </div>

      <section v-if="details" class="guide-facts" :aria-label="isZh ? '指南概览' : 'Guide overview'">
        <div>
          <span>{{ isZh ? '适合' : 'Best for' }}</span>
          <strong>{{ details.bestFor }}</strong>
        </div>
        <div>
          <span>{{ isZh ? '输入' : 'Input' }}</span>
          <strong>{{ details.input }}</strong>
        </div>
        <div>
          <span>{{ isZh ? '输出' : 'Output' }}</span>
          <strong>{{ details.output }}</strong>
        </div>
      </section>

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

      <section v-if="details" class="guide-section guide-checklist">
        <p class="section-kicker">{{ isZh ? '完成前检查' : 'BEFORE YOU FINISH' }}</p>
        <h2>{{ isZh ? '下载结果前的检查清单' : 'A practical result checklist' }}</h2>
        <ul>
          <li v-for="item in details.checklist" :key="item">{{ item }}</li>
        </ul>
      </section>

      <section v-if="details" class="guide-section guide-troubleshooting" aria-labelledby="guide-questions-title">
        <p class="section-kicker">{{ isZh ? '问题排查' : 'TROUBLESHOOTING' }}</p>
        <h2 id="guide-questions-title">{{ isZh ? '常见问题与解决方法' : 'Common questions and fixes' }}</h2>
        <div class="guide-question-list">
          <details v-for="(item, index) in details.questions" :key="item.question" :open="index === 0">
            <summary>
              <span>{{ item.question }}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <p>{{ item.answer }}</p>
          </details>
        </div>
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
