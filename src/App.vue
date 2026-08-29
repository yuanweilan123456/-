<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, RouterView } from 'vue-router'

const { locale, t } = useI18n()
const isDark = ref(false)

const themeIconLabel = computed(() => (isDark.value ? 'Use light theme' : 'Use dark theme'))

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

onMounted(() => {
  const savedTheme = window.localStorage.getItem('pixelforge-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(savedTheme === 'dark' || (savedTheme === null && prefersDark))
  document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'
})

watch(locale, (value) => {
  document.documentElement.lang = value === 'zh' ? 'zh-CN' : 'en'
})
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/" aria-label="PixelForge Image Tools home">
        <span class="brand-mark" aria-hidden="true">P</span>
        <span class="brand-name">PixelForge</span>
      </RouterLink>

      <nav class="site-nav" :aria-label="t('nav.tools')">
        <RouterLink class="nav-link active" to="/">{{ t('nav.tools') }}</RouterLink>
        <RouterLink class="nav-link" to="/toolbox">{{ t('nav.toolbox') }}</RouterLink>
        <a class="nav-link" href="#why">{{ t('nav.howItWorks') }}</a>
      </nav>

      <div class="header-actions">
        <button class="icon-button" type="button" :aria-label="themeIconLabel" :title="themeIconLabel" @click="toggleTheme">
          <svg v-if="!isDark" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" /></svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 15.5A8.5 8.5 0 0 1 8.5 3.6 8.5 8.5 0 1 0 20.4 15.5Z" /></svg>
        </button>
        <button class="language-button" type="button" :aria-label="t('nav.language')" @click="toggleLocale">
          <span aria-hidden="true">文 / A</span>
          <span>{{ locale === 'zh' ? '中文' : 'EN' }}</span>
        </button>
      </div>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <div>
          <div class="footer-brand">PixelForge</div>
          <p>{{ t('footer.tagline') }}</p>
        </div>
        <div class="footer-links">
          <RouterLink to="/privacy">{{ t('footer.privacy') }}</RouterLink>
          <RouterLink to="/terms">{{ t('footer.terms') }}</RouterLink>
        </div>
        <div class="footer-copy">{{ t('footer.copyright') }}</div>
      </div>
    </footer>
  </div>
</template>
