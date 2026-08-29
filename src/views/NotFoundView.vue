<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { locale } = useI18n()
const content = computed(() => locale.value === 'zh' ? {
  code: '404',
  title: '这个页面没有找到。',
  description: '链接可能已经改变，或者你输入的地址不正确。',
  home: '返回首页',
  toolbox: '打开工具箱',
} : {
  code: '404',
  title: 'This page could not be found.',
  description: 'The link may have changed, or the address may be incorrect.',
  home: 'Back home',
  toolbox: 'Open toolbox',
})
</script>

<template>
  <div class="page-wrap not-found-page">
    <p class="not-found-code" aria-hidden="true">{{ content.code }}</p>
    <h1>{{ content.title }}</h1>
    <p class="content-lead">{{ content.description }}</p>
    <div class="not-found-actions">
      <RouterLink class="primary-button" to="/">{{ content.home }}</RouterLink>
      <RouterLink class="secondary-button" to="/toolbox">{{ content.toolbox }}</RouterLink>
    </div>
  </div>
</template>
