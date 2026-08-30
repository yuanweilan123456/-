<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { categoryCopy, tools } from '../features/tools/catalog'
import { categoryPageContent } from '../features/tools/content'
import type { ToolCategory } from '../features/tools/types'

const props = defineProps<{ category: ToolCategory }>()
const { locale } = useI18n()
const language = computed<'en' | 'zh'>(() => (locale.value === 'zh' ? 'zh' : 'en'))
const isZh = computed(() => language.value === 'zh')
const content = computed(() => categoryPageContent[props.category][language.value])
const category = computed(() => categoryCopy[props.category])
const categoryTools = computed(() => tools.filter((tool) => tool.category === props.category))
</script>

<template>
  <div class="page-wrap category-page">
    <nav class="breadcrumbs" :aria-label="isZh ? '面包屑导航' : 'Breadcrumb'">
      <RouterLink to="/">{{ isZh ? '全部工具' : 'All tools' }}</RouterLink>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
      <span aria-current="page">{{ category.title[language] }}</span>
    </nav>

    <header class="category-hero">
      <div>
        <p class="eyebrow"><span class="eyebrow-dot"></span>{{ category.title[language] }}</p>
        <h1>{{ content.heading }}</h1>
        <p>{{ content.lead }}</p>
        <a class="primary-button category-cta" href="#category-tools">
          {{ isZh ? `查看 ${categoryTools.length} 个工具` : `Browse ${categoryTools.length} tools` }}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
        </a>
      </div>
      <aside class="category-stat" aria-label="Category summary">
        <strong>{{ categoryTools.length }}</strong>
        <span>{{ isZh ? '个免费工具' : 'free tools' }}</span>
        <p>{{ isZh ? '本地处理 · 无需注册' : 'Local processing · No sign-up' }}</p>
      </aside>
    </header>

    <section id="category-tools" class="category-tools" :aria-labelledby="`${props.category}-tools-title`">
      <div class="section-heading compact-heading">
        <p class="section-kicker">{{ isZh ? '可用工具' : 'AVAILABLE TOOLS' }}</p>
        <h2 :id="`${props.category}-tools-title`">
          {{ isZh ? `选择一个${category.title.zh}` : 'Choose a tool for your task' }}
        </h2>
      </div>
      <div class="tool-catalog">
        <RouterLink v-for="tool in categoryTools" :key="tool.id" :to="tool.path" class="tool-card">
          <div class="tool-card-top">
            <span class="tool-type">{{ tool.badge }}</span>
            <span class="tool-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M5 19 19 5M9 5h10v10" /></svg>
            </span>
          </div>
          <h3>{{ tool.title[language] }}</h3>
          <p>{{ tool.description[language] }}</p>
          <span class="tool-card-action">{{ tool.action[language] }}</span>
        </RouterLink>
      </div>
    </section>

    <section class="category-overview" aria-labelledby="category-overview-title">
      <div>
        <p class="section-kicker">{{ isZh ? '使用场景' : 'BUILT FOR REAL TASKS' }}</p>
        <h2 id="category-overview-title">{{ content.overviewTitle }}</h2>
        <p>{{ content.overview }}</p>
      </div>
      <ul>
        <li v-for="(useCase, index) in content.useCases" :key="useCase">
          <span aria-hidden="true">0{{ index + 1 }}</span
          >{{ useCase }}
        </li>
      </ul>
    </section>

    <section class="category-faq" aria-labelledby="category-faq-title">
      <div class="section-heading compact-heading">
        <p class="section-kicker">FAQ</p>
        <h2 id="category-faq-title">{{ isZh ? '开始前常见问题' : 'Questions before you start' }}</h2>
      </div>
      <div class="faq-list compact-faq">
        <details v-for="item in content.faq" :key="item.question">
          <summary>{{ item.question }}</summary>
          <p>{{ item.answer }}</p>
        </details>
      </div>
    </section>

    <aside class="category-final-cta">
      <div>
        <strong>{{ isZh ? '文件准备好了吗？' : 'Have a file ready?' }}</strong>
        <p>
          {{
            isZh
              ? '选择上方工具即可开始，文件不会上传到我们的服务器。'
              : 'Choose a tool above and start. Your file is not uploaded to our servers.'
          }}
        </p>
      </div>
      <RouterLink class="secondary-button" to="/">{{ isZh ? '返回全部工具' : 'See all tools' }}</RouterLink>
    </aside>
  </div>
</template>
