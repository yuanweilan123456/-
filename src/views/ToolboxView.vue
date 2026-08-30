<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { categoryCopy, categoryOrder, tools } from '../features/tools/catalog'
import type { ToolCategory } from '../features/tools/types'

const { locale, t } = useI18n()
const query = ref('')
const activeCategory = ref<ToolCategory | 'all'>('all')
const isZh = computed(() => locale.value === 'zh')
const language = computed(() => (isZh.value ? 'zh' : 'en'))
const filteredTools = computed(() => {
  const term = query.value.trim().toLocaleLowerCase()
  return tools.filter((tool) => {
    const categoryMatches = activeCategory.value === 'all' || tool.category === activeCategory.value
    const text = `${tool.title.en} ${tool.title.zh} ${tool.description.en} ${tool.description.zh}`.toLocaleLowerCase()
    return categoryMatches && (!term || text.includes(term))
  })
})
const groups = computed(() =>
  categoryOrder
    .map((category) => ({ category, tools: filteredTools.value.filter((tool) => tool.category === category) }))
    .filter((group) => group.tools.length),
)

function clearFilters() {
  query.value = ''
  activeCategory.value = 'all'
}
</script>

<template>
  <div class="page-wrap toolbox-page">
    <section class="toolbox-heading" aria-labelledby="toolbox-title">
      <p class="eyebrow"><span class="eyebrow-dot"></span>PIXELFORGE FILE TOOLBOX</p>
      <h1 id="toolbox-title">
        {{ isZh ? '你需要的文件工具，都在这里。' : 'Every file tool you need, in one place.' }}
      </h1>
      <p>
        {{
          isZh
            ? '在浏览器本地处理图片、PDF、文档、演示文稿、压缩包和数据，无需注册。'
            : 'Work with images, PDFs, documents, presentations, archives, and data locally in your browser.'
        }}
      </p>
      <div class="toolbox-summary">
        <span>{{
          isZh
            ? `${tools.length} 个可用工具 · 本地处理 · 无需注册`
            : `${tools.length} working tools · Local processing · No sign-up`
        }}</span>
        <RouterLink class="secondary-button" to="/tools/image/studio"
          >{{ isZh ? '打开图片工作台' : 'Open image studio'
          }}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg
        ></RouterLink>
        <RouterLink class="secondary-button" to="/guides"
          >{{ isZh ? '查看使用指南' : 'Read the guides'
          }}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg
        ></RouterLink>
      </div>
    </section>

    <section class="tool-directory" aria-labelledby="directory-title">
      <div class="directory-toolbar">
        <div>
          <p class="section-kicker">{{ isZh ? '工具目录' : 'TOOL DIRECTORY' }}</p>
          <h2 id="directory-title">{{ isZh ? '按类型查找工具' : 'Find a tool by category' }}</h2>
        </div>
        <label class="tool-search"
          ><span class="visually-hidden">{{ isZh ? '搜索工具' : 'Search tools' }}</span
          ><svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" /></svg
          ><input v-model="query" type="search" :placeholder="isZh ? '搜索 PDF、ZIP、JSON…' : 'Search PDF, ZIP, JSON…'"
        /></label>
      </div>
      <div class="category-filters" role="group" :aria-label="isZh ? '工具分类' : 'Tool categories'">
        <button type="button" :class="{ active: activeCategory === 'all' }" @click="activeCategory = 'all'">
          {{ isZh ? '全部' : 'All' }} <span>{{ tools.length }}</span>
        </button>
        <button
          v-for="category in categoryOrder"
          :key="category"
          type="button"
          :class="{ active: activeCategory === category }"
          @click="activeCategory = category"
        >
          {{ categoryCopy[category].title[language] }}
          <span>{{ tools.filter((tool) => tool.category === category).length }}</span>
        </button>
      </div>

      <div v-if="groups.length" class="tool-groups">
        <section
          v-for="group in groups"
          :key="group.category"
          class="tool-group"
          :aria-labelledby="`category-${group.category}`"
        >
          <header>
            <div>
              <h3 :id="`category-${group.category}`">{{ categoryCopy[group.category].title[language] }}</h3>
              <p>{{ categoryCopy[group.category].description[language] }}</p>
            </div>
            <span>{{ group.tools.length }}</span>
          </header>
          <div class="tool-catalog">
            <RouterLink
              v-for="tool in group.tools"
              :key="tool.id"
              :to="tool.path"
              class="tool-card"
              :class="`tool-${tool.category}`"
            >
              <div class="tool-card-top">
                <span class="tool-type">{{ tool.badge }}</span
                ><span class="tool-arrow" aria-hidden="true"
                  ><svg viewBox="0 0 24 24"><path d="M5 19 19 5M9 5h10v10" /></svg
                ></span>
              </div>
              <h4>{{ tool.title[language] }}</h4>
              <p>{{ tool.description[language] }}</p>
              <span class="tool-card-action">{{ tool.action[language] }}</span>
            </RouterLink>
          </div>
        </section>
      </div>
      <div v-else class="empty-tool-search">
        <strong>{{ isZh ? '没有找到匹配工具' : 'No matching tools' }}</strong>
        <p>{{ isZh ? '尝试更换关键词或选择“全部”。' : 'Try another search term or select All.' }}</p>
        <button type="button" @click="clearFilters">
          {{ isZh ? '清除筛选' : 'Clear filters' }}
        </button>
      </div>
    </section>

    <section id="why" class="trust-section toolbox-principles" aria-labelledby="toolbox-principles-title">
      <div class="section-heading">
        <p class="eyebrow">PIXELFORGE PRINCIPLES</p>
        <h2 id="toolbox-principles-title">{{ t('trust.title') }}</h2>
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
