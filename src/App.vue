<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { updateSeo, type SeoContent } from './seo'
import { getSeoPage } from './seo-pages'
import { categoryCopy, categoryOrder } from './features/tools/catalog'

const { locale, t } = useI18n()
const route = useRoute()
const isDark = ref(false)
const mainRef = ref<HTMLElement | null>(null)
const mobileMenuRef = ref<HTMLDetailsElement | null>(null)

const themeIconLabel = computed(() => (isDark.value ? t('nav.themeLight') : t('nav.themeDark')))

const seoContent = computed(() => {
  const language = locale.value === 'zh' ? 'zh' : 'en'
  const page = getSeoPage(route.path, language)
  if (page) return page

  return {
    title: t('seo.notFoundTitle'),
    description: t('seo.notFoundDescription'),
    pageType: 'page',
    index: false,
  } satisfies SeoContent
})

function applyTheme(dark: boolean) {
  isDark.value = dark
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  window.localStorage.setItem('pixelforge-theme', dark ? 'dark' : 'light')
}

function toggleTheme() {
  applyTheme(!isDark.value)
}

function toggleLocale() {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  window.localStorage.setItem('pixelforge-locale', locale.value)
  document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'
}

function focusMainContent() {
  nextTick(() => mainRef.value?.focus())
}

onMounted(() => {
  const savedTheme = window.localStorage.getItem('pixelforge-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(savedTheme === 'dark' || (savedTheme === null && prefersDark))
  document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'
})

watch(locale, (value) => {
  document.documentElement.lang = value === 'zh' ? 'zh-CN' : 'en'
})

watchEffect(() => updateSeo(seoContent.value))

watch(
  () => route.fullPath,
  async () => {
    if (mobileMenuRef.value) mobileMenuRef.value.open = false
    await nextTick()
    mainRef.value?.focus()
  },
)
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content" @click="focusMainContent">{{ t('a11y.skipToContent') }}</a>
    <div class="header-bar">
      <header class="site-header">
        <RouterLink class="brand" to="/" :aria-label="t('a11y.home')">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <path d="M8 8.5h10.5a5.5 5.5 0 0 1 0 11H13v5H8v-16Z" />
              <path d="M13 13h5.2a1.5 1.5 0 1 1 0 3H13v-3Z" />
            </svg>
          </span>
          <span class="brand-copy">
            <span class="brand-name">PixelForge</span>
            <span class="brand-tagline">File Tools</span>
          </span>
        </RouterLink>

        <nav class="site-nav" :aria-label="t('nav.main')">
          <RouterLink class="nav-link" to="/">{{ t('nav.toolbox') }}</RouterLink>
          <RouterLink class="nav-link" to="/tools/image/studio">{{ t('nav.tools') }}</RouterLink>
          <RouterLink class="nav-link" to="/#why">{{ t('nav.howItWorks') }}</RouterLink>
          <RouterLink class="nav-link" to="/faq">{{ t('nav.faq') }}</RouterLink>
          <RouterLink class="nav-link" to="/guides">{{ t('nav.guides') }}</RouterLink>
          <RouterLink class="nav-link" to="/about">{{ t('nav.about') }}</RouterLink>
        </nav>

        <div class="header-actions">
          <button
            class="icon-button"
            type="button"
            :aria-label="themeIconLabel"
            :title="themeIconLabel"
            @click="toggleTheme"
          >
            <svg v-if="!isDark" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path
                d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"
              />
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.4 15.5A8.5 8.5 0 0 1 8.5 3.6 8.5 8.5 0 1 0 20.4 15.5Z" />
            </svg>
          </button>
          <button class="language-button" type="button" :aria-label="t('nav.language')" @click="toggleLocale">
            <span aria-hidden="true">文 / A</span>
            <span>{{ locale === 'zh' ? 'EN' : '中文' }}</span>
          </button>
          <details ref="mobileMenuRef" class="mobile-nav">
            <summary :aria-label="locale === 'zh' ? '打开导航菜单' : 'Open navigation menu'">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </summary>
            <nav :aria-label="t('nav.main')">
              <RouterLink to="/">{{ t('nav.toolbox') }}</RouterLink>
              <RouterLink to="/tools/image/studio">{{ t('nav.tools') }}</RouterLink>
              <RouterLink to="/#why">{{ t('nav.howItWorks') }}</RouterLink>
              <RouterLink to="/faq">{{ t('nav.faq') }}</RouterLink>
              <RouterLink to="/guides">{{ t('nav.guides') }}</RouterLink>
              <RouterLink to="/about">{{ t('nav.about') }}</RouterLink>
              <div class="mobile-menu-actions">
                <button type="button" @click="toggleTheme">
                  <svg v-if="!isDark" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2 12h2M20 12h2" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.4 15.5A8.5 8.5 0 0 1 8.5 3.6 8.5 8.5 0 1 0 20.4 15.5Z" />
                  </svg>
                  {{ isDark ? t('nav.themeLight') : t('nav.themeDark') }}
                </button>
                <button type="button" @click="toggleLocale">
                  <span aria-hidden="true">文 / A</span>
                  {{ locale === 'zh' ? 'English' : '中文' }}
                </button>
              </div>
            </nav>
          </details>
        </div>
      </header>
    </div>

    <main id="main-content" ref="mainRef" tabindex="-1">
      <RouterView />
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <div>
          <div class="footer-brand">PixelForge</div>
          <p>{{ t('footer.tagline') }}</p>
        </div>
        <nav class="footer-links" :aria-label="t('footer.linksLabel')">
          <RouterLink to="/about">{{ t('footer.about') }}</RouterLink>
          <RouterLink to="/faq">{{ t('footer.faq') }}</RouterLink>
          <RouterLink to="/guides">{{ t('footer.guides') }}</RouterLink>
          <RouterLink to="/how-we-test">{{ t('footer.testing') }}</RouterLink>
          <RouterLink to="/contact">{{ t('footer.contact') }}</RouterLink>
          <RouterLink to="/privacy">{{ t('footer.privacy') }}</RouterLink>
          <RouterLink to="/terms">{{ t('footer.terms') }}</RouterLink>
        </nav>
        <nav class="footer-categories" :aria-label="locale === 'zh' ? '工具分类' : 'Tool categories'">
          <RouterLink v-for="category in categoryOrder" :key="category" :to="`/tools/${category}`">
            {{ categoryCopy[category].title[locale === 'zh' ? 'zh' : 'en'] }}
          </RouterLink>
        </nav>
        <div class="footer-copy">{{ t('footer.copyright') }}</div>
      </div>
    </footer>
  </div>
</template>
