<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const props = defineProps<{ type: 'privacy' | 'terms' }>()
const { locale } = useI18n()
const isZh = computed(() => locale.value === 'zh')

const content = computed(() => {
  if (props.type === 'privacy') {
    return isZh.value ? {
      eyebrow: 'PIXELFORGE / 隐私', title: '隐私政策', intro: '本政策说明 PixelForge 当前如何处理你选择的文件，以及未来启用统计或广告服务时会遵循的原则。', updated: '最后更新：2026 年 8 月', back: '返回工具', sections: [
        { heading: '文件处理', body: ['图片、PDF、DOCX 和 PPTX 的当前处理流程在你的浏览器中完成。我们不会把文件内容上传到 PixelForge 服务器，也不会建立文件云端副本。', '如果你刷新或关闭页面，当前任务可能丢失；浏览器下载的结果由你的设备和浏览器管理。'] },
        { heading: '本地存储与偏好', body: ['我们只在浏览器本地保存主题和语言偏好，用于下次打开时恢复界面设置。'] },
        { heading: '未来的第三方服务', body: ['如果接入广告、统计或错误监控服务，我们会在启用前更新本政策，说明收集范围、用途、供应商和必要的同意方式。'] },
      ],
    } : {
      eyebrow: 'PIXELFORGE / PRIVACY', title: 'Privacy policy', intro: 'This policy explains how PixelForge currently handles the files you choose and the principles we will follow if analytics or advertising is enabled.', updated: 'Last updated: August 2026', back: 'Back to tools', sections: [
        { heading: 'File processing', body: ['The current processing flow for images, PDFs, DOCX, and PPTX runs in your browser. We do not upload file contents to PixelForge servers or create cloud copies.', 'Refreshing or closing the page may clear the current task. Downloaded results are managed by your device and browser.'] },
        { heading: 'Local preferences', body: ['We only save theme and language preferences in your browser so the interface can restore those settings next time.'] },
        { heading: 'Future third-party services', body: ['If advertising, analytics, or error monitoring is added, we will update this policy before activation with the collection scope, purpose, providers, and required consent choices.'] },
      ],
    }
  }

  return isZh.value ? {
    eyebrow: 'PIXELFORGE / 条款', title: '使用条款', intro: '使用 PixelForge 即表示你理解并接受以下使用范围和责任边界。', updated: '最后更新：2026 年 8 月', back: '返回工具', sections: [
      { heading: '允许的使用', body: ['请只处理你有权使用的文件，并遵守适用的法律、平台规则和第三方权利。'] },
      { heading: '工具限制', body: ['工具按现状提供。处理结果可能因文件结构、浏览器能力、设备内存和文件大小而异。DOCX 转 HTML 不保证复杂排版完全还原。', '在删除原文件或依赖处理结果前，请先确认下载文件可以正常打开。'] },
      { heading: '禁止行为', body: ['不得使用本服务处理违法、侵权、欺诈、恶意软件或危害他人的内容，也不得试图干扰服务正常运行。'] },
    ],
  } : {
    eyebrow: 'PIXELFORGE / TERMS', title: 'Terms of use', intro: 'By using PixelForge, you understand and accept the following scope and responsibility boundaries.', updated: 'Last updated: August 2026', back: 'Back to tools', sections: [
      { heading: 'Permitted use', body: ['Only process files that you have the right to use, and follow applicable laws, platform rules, and third-party rights.'] },
      { heading: 'Tool limitations', body: ['The tools are provided as-is. Results may vary with file structure, browser capability, device memory, and file size. DOCX to HTML does not guarantee exact reproduction of complex layouts.', 'Before deleting an original file or relying on a result, confirm that the downloaded file opens correctly.'] },
      { heading: 'Prohibited behavior', body: ['Do not use the service for illegal, infringing, fraudulent, malware-related, or harmful content, and do not interfere with normal service operation.'] },
    ],
  }
})
</script>

<template>
  <div class="page-wrap content-page policy-page">
    <p class="eyebrow"><span class="eyebrow-dot"></span>{{ content.eyebrow }}</p>
    <h1>{{ content.title }}</h1>
    <p class="content-lead">{{ content.intro }}</p>
    <p class="policy-updated">{{ content.updated }}</p>

    <div class="policy-sections">
      <section v-for="section in content.sections" :key="section.heading" class="policy-block">
        <h2>{{ section.heading }}</h2>
        <p v-for="paragraph in section.body" :key="paragraph">{{ paragraph }}</p>
      </section>
    </div>

    <RouterLink class="secondary-button inline-button" to="/">{{ content.back }}</RouterLink>
  </div>
</template>
