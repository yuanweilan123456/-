<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { categoryCopy, categoryOrder, tools } from '../features/tools/catalog'
import type { ToolCategory, ToolDefinition } from '../features/tools/types'

const { locale, t } = useI18n()
const query = ref('')
const activeCategory = ref<ToolCategory | 'all'>('all')
const isZh = computed(() => locale.value === 'zh')
const language = computed(() => (isZh.value ? 'zh' : 'en'))
const popularToolIds = ['pdf-merge', 'image-compress', 'images-to-pdf', 'docx-to-html', 'zip-create', 'json-format']
const popularTools = computed(() =>
  popularToolIds
    .map((id) => tools.find((tool) => tool.id === id))
    .filter((tool): tool is ToolDefinition => Boolean(tool)),
)
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
      <div class="toolbox-hero-copy">
        <p class="eyebrow"><span class="eyebrow-dot"></span>PIXELFORGE FILE TOOLBOX</p>
        <h1 id="toolbox-title">
          {{
            isZh
              ? '免费的在线文件工具，文件始终留在你的设备上。'
              : 'Free online file tools that keep your files private.'
          }}
        </h1>
        <p>
          {{
            isZh
              ? '无需上传或注册，即可处理图片、PDF、Word、PPT、ZIP、JSON 和 CSV。打开工具，完成任务，然后下载结果。'
              : 'Work with images, PDFs, Word, PowerPoint, ZIP, JSON, and CSV without uploading files or creating an account.'
          }}
        </p>
        <div class="toolbox-hero-actions">
          <a class="primary-button" href="#tool-directory">
            {{ isZh ? `浏览 ${tools.length} 个免费工具` : `Browse ${tools.length} free tools` }}
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
          </a>
          <RouterLink class="secondary-button" to="/tools/image/studio">
            {{ isZh ? '打开图片工作台' : 'Open image studio' }}
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </RouterLink>
        </div>
        <ul class="toolbox-proof" :aria-label="isZh ? '服务特点' : 'Service highlights'">
          <li><span aria-hidden="true"></span>{{ isZh ? '不上传文件' : 'No file uploads' }}</li>
          <li><span aria-hidden="true"></span>{{ isZh ? '无需注册' : 'No sign-up' }}</li>
          <li><span aria-hidden="true"></span>{{ isZh ? '支持手机与电脑' : 'Works on mobile and desktop' }}</li>
        </ul>
      </div>
      <aside class="toolbox-hero-panel" aria-label="Toolbox summary">
        <div class="hero-panel-number">{{ tools.length }}</div>
        <strong>{{ isZh ? '个现在就能使用的工具' : 'tools ready to use now' }}</strong>
        <div class="hero-panel-categories">
          <RouterLink v-for="category in categoryOrder" :key="category" :to="`/tools/${category}`">
            {{ categoryCopy[category].title[language] }}
            <span>{{ tools.filter((tool) => tool.category === category).length }}</span>
          </RouterLink>
        </div>
      </aside>
    </section>

    <section class="popular-tools" aria-labelledby="popular-tools-title">
      <div class="section-heading compact-heading">
        <p class="section-kicker">{{ isZh ? '热门工具' : 'POPULAR TOOLS' }}</p>
        <h2 id="popular-tools-title">{{ isZh ? '从最常见的任务开始' : 'Start with a common task' }}</h2>
      </div>
      <div class="popular-tool-grid">
        <RouterLink v-for="tool in popularTools" :key="tool.id" :to="tool.path" class="popular-tool-link">
          <span class="tool-type">{{ tool.badge }}</span>
          <strong>{{ tool.title[language] }}</strong>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
        </RouterLink>
      </div>
    </section>

    <section id="tool-directory" class="tool-directory" aria-labelledby="directory-title">
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
              <h3 :id="`category-${group.category}`">
                <RouterLink :to="`/tools/${group.category}`">{{
                  categoryCopy[group.category].title[language]
                }}</RouterLink>
              </h3>
              <p>{{ categoryCopy[group.category].description[language] }}</p>
            </div>
            <RouterLink
              class="category-count-link"
              :to="`/tools/${group.category}`"
              :aria-label="`${categoryCopy[group.category].title[language]}: ${group.tools.length}`"
            >
              {{ group.tools.length }}
            </RouterLink>
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
