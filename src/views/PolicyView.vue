<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const props = defineProps<{ type: 'privacy' | 'terms' }>()
const { t } = useI18n()
const title = computed(() => (props.type === 'privacy' ? t('policy.privacyTitle') : t('policy.termsTitle')))
const body = computed(() => (props.type === 'privacy' ? t('policy.privacyText') : t('policy.termsText')))
</script>

<template>
  <div class="page-wrap policy-page">
    <p class="eyebrow">PIXELFORGE</p>
    <h1>{{ title }}</h1>
    <p class="policy-placeholder">{{ body }}</p>
    <RouterLink class="secondary-button inline-button" to="/">{{ t('policy.back') }}</RouterLink>
  </div>
</template>
