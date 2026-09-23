<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { locale } = useI18n()
const isZh = computed(() => locale.value === 'zh')
const content = computed(() =>
  isZh.value
    ? {
        eyebrow: '联系与反馈',
        title: '让问题可以被看见、复现和修复。',
        intro:
          'FileTools 目前通过公开的 GitHub Issues 接收错误报告、功能建议和网站反馈。公开记录能让处理进度和解决方案对其他用户也有帮助。',
        cards: [
          {
            title: '报告工具错误',
            text: '请写明工具名称、浏览器及版本、操作步骤、预期结果和实际结果。可以提供不含敏感信息的示例文件结构，但不要公开真实私密文件。',
          },
          {
            title: '提出功能建议',
            text: '请描述你要完成的任务、常见输入格式、希望得到的输出，以及现有工具为什么不能满足需求。我们会优先考虑可以在浏览器本地安全实现的高频任务。',
          },
          {
            title: '隐私或内容反馈',
            text: '如果你发现隐私说明、指南内容或工具限制描述不准确，请提供对应页面地址和建议修改内容。请勿在公开问题中填写个人身份信息。',
          },
        ],
        before: '提交前请先检查',
        checklist: [
          '确认问题在刷新页面后仍可复现。',
          '删除截图和示例中的姓名、账号及文件内容。',
          '一个问题只描述一个主要任务，便于跟踪。',
        ],
        open: '前往 GitHub Issues',
        privacy: '查看隐私政策',
        note: 'GitHub 是第三方服务，打开后将适用 GitHub 自身的账号和隐私规则。',
        repository: '查看项目更新记录',
        repositoryNote: '项目仓库公开展示更新与问题处理记录；请勿在公开反馈中附上私密文件。',
      }
    : {
        eyebrow: 'CONTACT & FEEDBACK',
        title: 'Make a problem visible, reproducible, and fixable.',
        intro:
          'FileTools currently accepts bug reports, feature requests, and website feedback through public GitHub Issues. A public record helps other users follow progress and reuse a solution.',
        cards: [
          {
            title: 'Report a tool problem',
            text: 'Include the tool name, browser and version, steps, expected result, and actual result. You may describe a non-sensitive sample structure, but never attach a real private source file publicly.',
          },
          {
            title: 'Request a feature',
            text: 'Describe the task, common input formats, desired output, and why an existing tool does not solve it. We prioritize frequent tasks that can be implemented safely with browser-local processing.',
          },
          {
            title: 'Privacy or content feedback',
            text: 'If a privacy statement, guide, or limitation appears inaccurate, include the page address and proposed correction. Do not put personal identifying information in a public issue.',
          },
        ],
        before: 'Check before submitting',
        checklist: [
          'Confirm that the problem still occurs after refreshing the page.',
          'Remove names, account details, and file contents from screenshots or examples.',
          'Keep one primary task in each issue so it can be tracked clearly.',
        ],
        open: 'Open GitHub Issues',
        privacy: 'Read the privacy policy',
        note: 'GitHub is a third-party service. Its own account and privacy terms apply after you open it.',
        repository: 'View project updates',
        repositoryNote:
          'The public repository shows updates and issue history. Do not attach private files to public feedback.',
      },
)
</script>

<template>
  <div class="page-wrap content-page contact-page">
    <p class="eyebrow"><span class="eyebrow-dot"></span>{{ content.eyebrow }}</p>
    <h1>{{ content.title }}</h1>
    <p class="content-lead">{{ content.intro }}</p>

    <section class="contact-option-grid" :aria-label="content.eyebrow">
      <article v-for="(card, index) in content.cards" :key="card.title">
        <span>0{{ index + 1 }}</span>
        <h2>{{ card.title }}</h2>
        <p>{{ card.text }}</p>
      </article>
    </section>

    <section class="contact-checklist">
      <div>
        <p class="section-kicker">{{ isZh ? '保护你的信息' : 'PROTECT YOUR INFORMATION' }}</p>
        <h2>{{ content.before }}</h2>
        <ul>
          <li v-for="item in content.checklist" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div class="contact-actions">
        <a
          class="primary-button"
          href="https://github.com/yuanweilan123456/-/issues"
          target="_blank"
          rel="noopener noreferrer"
          >{{ content.open }}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
        </a>
        <RouterLink class="secondary-button" to="/privacy">{{ content.privacy }}</RouterLink>
        <p>{{ content.note }}</p>
        <a class="text-link" href="https://github.com/yuanweilan123456/-" target="_blank" rel="noopener noreferrer">{{
          content.repository
        }}</a>
        <p>{{ content.repositoryNote }}</p>
      </div>
    </section>
  </div>
</template>
