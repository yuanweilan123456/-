<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import { categoryCopy, categoryOrder, tools } from '../features/tools/catalog'
import type { ToolCategory, ToolDefinition } from '../features/tools/types'

const { locale, t } = useI18n()
const router = useRouter()
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
    const text =
      `${tool.title.en} ${tool.title.zh} ${tool.description.en} ${tool.description.zh} ${tool.badge}`.toLocaleLowerCase()
    return categoryMatches && (!term || text.includes(term))
  })
})
const quickTools = computed(() =>
  query.value.trim() ? filteredTools.value.slice(0, 5) : popularTools.value.slice(0, 5),
)
const groups = computed(() =>
  categoryOrder
    .map((category) => ({ category, tools: filteredTools.value.filter((tool) => tool.category === category) }))
    .filter((group) => group.tools.length),
)

function clearFilters() {
  query.value = ''
  activeCategory.value = 'all'
}

function openFirstResult() {
  const firstResult = quickTools.value[0]
  if (firstResult) void router.push(firstResult.path)
}

function scrollToDirectory() {
  document.querySelector('#tool-directory')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function selectCategory(category: ToolCategory | 'all') {
  query.value = ''
  activeCategory.value = category
  await nextTick()
  scrollToDirectory()
}
</script>

<template>
  <div class="page-wrap toolbox-page">
    <section class="toolbox-heading" aria-labelledby="toolbox-title">
      <div class="hero-ambient" aria-hidden="true">
        <span class="hero-aurora hero-aurora-one"></span>
        <span class="hero-aurora hero-aurora-two"></span>
        <span class="hero-mesh"></span>
      </div>
      <div class="toolbox-hero-copy">
        <p class="eyebrow">
          <span class="eyebrow-dot"></span>{{ isZh ? '私密 · 本地 · 免费' : 'PRIVATE · LOCAL · FREE' }}
        </p>
        <h1 id="toolbox-title">
          <template v-if="isZh">
            <span>免费的在线</span>
            <span>文件工具，</span>
            <span class="hero-title-accent">私密完成每个任务。</span>
          </template>
          <template v-else>
            <span>Free online file tools,</span>
            <span class="hero-title-accent">private by design.</span>
          </template>
        </h1>
        <p class="toolbox-lead">
          {{
            isZh
              ? '直接在浏览器中处理 PDF、图片、Word、PPT、ZIP 和数据文件。无需上传，无需注册，打开即可使用。'
              : 'Convert, compress, and organize PDFs, images, Word, PowerPoint, ZIP, and data files right in your browser. No uploads. No account.'
          }}
        </p>

        <form class="hero-tool-search" role="search" @submit.prevent="openFirstResult">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <label class="visually-hidden" for="hero-tool-query">{{ isZh ? '搜索文件工具' : 'Search file tools' }}</label>
          <input
            id="hero-tool-query"
            v-model="query"
            type="search"
            autocomplete="off"
            :placeholder="isZh ? '你想处理什么？例如：合并 PDF' : 'What do you need? Try “merge PDF”'"
          />
          <button type="submit" :disabled="!quickTools.length">
            {{ isZh ? '打开' : 'Open' }}
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </button>
        </form>

        <div class="hero-category-links" :aria-label="isZh ? '按类型浏览' : 'Browse by file type'">
          <span>{{ isZh ? '按类型浏览' : 'Browse by type' }}</span>
          <RouterLink v-for="category in categoryOrder" :key="category" :to="`/tools/${category}`">
            {{ categoryCopy[category].title[language].replace(isZh ? '工具' : ' tools', '') }}
          </RouterLink>
        </div>

        <ul class="toolbox-proof" :aria-label="isZh ? '服务特点' : 'Service highlights'">
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg
            >{{ isZh ? '文件不离开设备' : 'Files stay on your device' }}
          </li>
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg
            >{{ isZh ? '永久免费工具' : 'Free to use' }}
          </li>
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg
            >{{ isZh ? '手机电脑均可用' : 'Desktop and mobile' }}
          </li>
        </ul>
      </div>

      <aside class="quick-start-panel" :aria-label="isZh ? '快速开始' : 'Quick start'">
        <div class="quick-live-status">
          <span aria-hidden="true"></span>
          {{ isZh ? '在你的浏览器中实时运行' : 'Live in your browser' }}
        </div>
        <header>
          <div class="quick-start-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="2" />
              <rect x="14" y="3" width="7" height="7" rx="2" />
              <rect x="3" y="14" width="7" height="7" rx="2" />
              <rect x="14" y="14" width="7" height="7" rx="2" />
            </svg>
          </div>
          <div>
            <p>{{ query.trim() ? (isZh ? '搜索结果' : 'SEARCH RESULTS') : isZh ? '快速开始' : 'QUICK START' }}</p>
            <h2>
              {{
                query.trim()
                  ? `${filteredTools.length} ${isZh ? '个匹配工具' : 'matching tools'}`
                  : isZh
                    ? '最常用的工具'
                    : 'Most-used tools'
              }}
            </h2>
          </div>
        </header>

        <div v-if="quickTools.length" class="quick-tool-list">
          <RouterLink
            v-for="(tool, index) in quickTools"
            :key="tool.id"
            :to="tool.path"
            class="quick-tool-link"
            :class="`tool-${tool.category}`"
            :style="{ '--card-index': index }"
          >
            <span class="quick-tool-badge">{{ tool.badge }}</span>
            <span
              ><strong>{{ tool.title[language] }}</strong
              ><small>{{ tool.description[language] }}</small></span
            >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </RouterLink>
        </div>
        <div v-else class="quick-empty">
          <strong>{{ isZh ? '没有匹配的工具' : 'No matching tool yet' }}</strong>
          <button type="button" @click="clearFilters">{{ isZh ? '查看全部工具' : 'View all tools' }}</button>
        </div>

        <button class="quick-panel-footer" type="button" @click="scrollToDirectory">
          <span>{{ isZh ? `浏览全部 ${tools.length} 个工具` : `Explore all ${tools.length} tools` }}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
        </button>
      </aside>
    </section>

    <section class="popular-tools" aria-labelledby="popular-tools-title">
      <div class="section-heading compact-heading">
        <div>
          <p class="section-kicker">{{ isZh ? '热门工作流' : 'POPULAR WORKFLOWS' }}</p>
          <h2 id="popular-tools-title">{{ isZh ? '更快完成常见任务' : 'Finish common tasks faster' }}</h2>
        </div>
        <p>
          {{ isZh ? '无需学习复杂软件，选择任务即可开始。' : 'Skip complex software—choose a task and get it done.' }}
        </p>
      </div>
      <div class="popular-tool-grid">
        <RouterLink
          v-for="(tool, index) in popularTools"
          :key="tool.id"
          :to="tool.path"
          class="popular-tool-link"
          :class="`tool-${tool.category}`"
          :style="{ '--card-index': index }"
        >
          <span class="popular-tool-icon">{{ tool.badge }}</span>
          <span class="popular-tool-copy"
            ><strong>{{ tool.title[language] }}</strong
            ><small>{{ tool.description[language] }}</small></span
          >
          <span class="popular-tool-arrow" aria-hidden="true"
            ><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg
          ></span>
        </RouterLink>
      </div>
    </section>

    <section id="tool-directory" class="tool-directory" aria-labelledby="directory-title">
      <div class="directory-toolbar">
        <div>
          <p class="section-kicker">{{ isZh ? '全部工具' : 'ALL TOOLS' }}</p>
          <h2 id="directory-title">{{ isZh ? '按文件类型查找工具' : 'Find the right tool by file type' }}</h2>
          <p class="directory-result-count">
            {{ isZh ? `显示 ${filteredTools.length} 个工具` : `Showing ${filteredTools.length} tools` }}
          </p>
        </div>
        <label class="tool-search">
          <span class="visually-hidden">{{ isZh ? '搜索工具' : 'Search tools' }}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            v-model="query"
            type="search"
            autocomplete="off"
            :placeholder="isZh ? '搜索 PDF、ZIP、JSON…' : 'Search PDF, ZIP, JSON…'"
            @keydown.enter.prevent="openFirstResult"
          />
          <button v-if="query" type="button" :aria-label="isZh ? '清除搜索' : 'Clear search'" @click="query = ''">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg>
          </button>
        </label>
      </div>

      <div class="category-filters" role="group" :aria-label="isZh ? '工具分类' : 'Tool categories'">
        <button type="button" :class="{ active: activeCategory === 'all' }" @click="selectCategory('all')">
          {{ isZh ? '全部' : 'All' }} <span>{{ tools.length }}</span>
        </button>
        <button
          v-for="category in categoryOrder"
          :key="category"
          type="button"
          :class="{ active: activeCategory === category }"
          @click="selectCategory(category)"
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
              >{{ group.tools.length }}</RouterLink
            >
          </header>
          <div class="tool-catalog">
            <RouterLink
              v-for="(tool, index) in group.tools"
              :key="tool.id"
              :to="tool.path"
              class="tool-card"
              :class="`tool-${tool.category}`"
              :style="{ '--card-index': index }"
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
        <button type="button" @click="clearFilters">{{ isZh ? '清除筛选' : 'Clear filters' }}</button>
      </div>
    </section>

    <section id="why" class="trust-section toolbox-principles" aria-labelledby="toolbox-principles-title">
      <div class="section-heading trust-heading">
        <div>
          <p class="eyebrow">{{ isZh ? 'FILETOOLS 使用原则' : 'FILETOOLS PRINCIPLES' }}</p>
          <h2 id="toolbox-principles-title">{{ t('trust.title') }}</h2>
        </div>
        <p>
          {{
            isZh
              ? '我们把隐私、速度和简单操作放在每一个工具的第一位。'
              : 'Privacy, speed, and simplicity are built into every tool.'
          }}
        </p>
      </div>
      <div class="trust-grid">
        <article class="trust-card">
          <span class="trust-icon"
            ><svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3 5 6v5c0 4.5 2.8 8.1 7 10 4.2-1.9 7-5.5 7-10V6l-7-3Z" />
              <path d="m9 12 2 2 4-4" /></svg
          ></span>
          <h3>{{ t('trust.privateTitle') }}</h3>
          <p>{{ t('trust.privateText') }}</p>
        </article>
        <article class="trust-card">
          <span class="trust-icon"
            ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4" /></svg
          ></span>
          <h3>{{ t('trust.simpleTitle') }}</h3>
          <p>{{ t('trust.simpleText') }}</p>
        </article>
        <article class="trust-card">
          <span class="trust-icon"
            ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg
          ></span>
          <h3>{{ t('trust.fastTitle') }}</h3>
          <p>{{ t('trust.fastText') }}</p>
        </article>
      </div>
    </section>

    <section class="home-resources" aria-labelledby="home-resources-title">
      <div class="section-heading compact-heading">
        <p class="section-kicker">{{ isZh ? '放心使用' : 'USE WITH CONFIDENCE' }}</p>
        <h2 id="home-resources-title">
          {{ isZh ? '开始处理前，先了解方法与边界' : 'Know the method and limits before you begin' }}
        </h2>
      </div>
      <div class="home-resource-grid">
        <RouterLink to="/guides">
          <span>01</span>
          <strong>{{ isZh ? '实用使用指南' : 'Practical guides' }}</strong>
          <p>
            {{
              isZh ? '查看格式建议、具体步骤和结果检查清单。' : 'Get format advice, clear steps, and result checklists.'
            }}
          </p>
        </RouterLink>
        <RouterLink to="/how-we-test">
          <span>02</span>
          <strong>{{ isZh ? '质量与测试方法' : 'Quality and testing' }}</strong>
          <p>
            {{
              isZh
                ? '了解工具如何测试，以及浏览器本地处理的限制。'
                : 'See how tools are tested and where browser-local processing has limits.'
            }}
          </p>
        </RouterLink>
        <RouterLink to="/contact">
          <span>03</span>
          <strong>{{ isZh ? '联系与反馈' : 'Contact and feedback' }}</strong>
          <p>
            {{
              isZh
                ? '报告可复现的问题，或建议新的本地文件功能。'
                : 'Report a reproducible problem or suggest a useful local-file feature.'
            }}
          </p>
        </RouterLink>
      </div>
    </section>

    <section class="home-final-cta" aria-labelledby="home-final-title">
      <div>
        <p class="section-kicker">{{ isZh ? '需要一点帮助？' : 'NEED A HAND?' }}</p>
        <h2 id="home-final-title">
          {{ isZh ? '用简短指南快速解决文件问题' : 'Solve file problems with practical guides' }}
        </h2>
        <p>
          {{
            isZh
              ? '查看格式建议、处理步骤和常见问题。'
              : 'Get format advice, step-by-step workflows, and troubleshooting tips.'
          }}
        </p>
      </div>
      <RouterLink class="primary-button" to="/guides"
        >{{ isZh ? '浏览使用指南' : 'Explore guides'
        }}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg
      ></RouterLink>
    </section>
  </div>
</template>
