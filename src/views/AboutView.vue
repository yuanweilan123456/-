<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { locale } = useI18n()
const isZh = computed(() => locale.value === 'zh')
const content = computed(() =>
  isZh.value
    ? {
        eyebrow: '关于 FILETOOLS',
        title: '小而可靠的本地文件工具箱。',
        description:
          'FileTools 面向需要快速处理文件、又不希望上传到陌生服务器的人。我们把常用操作放回浏览器，让隐私和效率同时成为默认设置。',
        cards: [
          {
            label: '01 / 隐私',
            title: '文件留在你的设备',
            text: '当前版本使用浏览器本地能力处理文件，不建立账号，不保存文件内容。',
          },
          {
            label: '02 / 体验',
            title: '每一步都说清楚',
            text: '工具页会说明支持格式、处理结果和已知限制，帮助你在下载前做出判断。',
          },
          {
            label: '03 / 方向',
            title: '从高频需求开始',
            text: '先做好图片、PDF、Word 和 PPT 的常用场景，再根据真实需求扩展更复杂的转换。',
          },
        ],
        storyTitle: '这个项目为什么存在',
        story: [
          '很多临时文件任务并不需要注册账号或把材料交给远程服务器。FileTools 希望把这些高频操作做成可以直接打开、看懂并完成的浏览器工具，同时诚实说明格式兼容和设备性能边界。',
          '这是一个持续维护的独立工具项目。网站内容、工具实现和问题记录保存在公开代码仓库中；每次发布都经过自动化检查，重要流程还会在真实浏览器中复核。',
        ],
        standardsTitle: '我们的内容与产品原则',
        standards: [
          { title: '任务优先', text: '一页解决一个明确任务，不用重复页面或夸张承诺制造数量。' },
          { title: '限制透明', text: '明确说明支持格式、结果差异、内存限制和不适用场景。' },
          { title: '持续验证', text: '工具、指南和公开页面随实现一起测试和更新。' },
          { title: '保护源文件', text: '鼓励用户保留原文件，并在正式使用前打开下载结果检查。' },
        ],
        testing: '查看质量与测试方法',
        contact: '联系与反馈',
        toolbox: '查看全部工具',
        source: '查看公开源代码与更新记录',
      }
    : {
        eyebrow: 'ABOUT FILETOOLS',
        title: 'A small, dependable local file toolbox.',
        description:
          'FileTools is for people who need quick file tasks without sending documents to an unfamiliar server. We keep common operations in the browser, making privacy and speed the default.',
        cards: [
          {
            label: '01 / PRIVACY',
            title: 'Files stay on your device',
            text: 'The current version uses browser-local processing with no accounts and no storage of file contents.',
          },
          {
            label: '02 / CLARITY',
            title: 'Every step is explained',
            text: 'Tool pages show supported formats, results, and known limitations before you download.',
          },
          {
            label: '03 / FOCUS',
            title: 'Start with frequent tasks',
            text: 'We are starting with practical image, PDF, Word, and PPT workflows, then expanding from real demand.',
          },
        ],
        storyTitle: 'Why this project exists',
        story: [
          'Many temporary file tasks do not require an account or a remote server. FileTools turns frequent workflows into browser tools that people can open, understand, and complete directly, while being honest about format compatibility and device limits.',
          'This is an independently maintained tools project. Site content, tool implementation, and issue history live in a public code repository. Every release passes automated checks, and important workflows are reviewed in a real browser.',
        ],
        standardsTitle: 'Our content and product principles',
        standards: [
          {
            title: 'Task first',
            text: 'One page solves one clear job without duplicate pages or exaggerated promises.',
          },
          {
            title: 'Visible limits',
            text: 'Supported formats, result differences, memory limits, and unsuitable cases are stated clearly.',
          },
          {
            title: 'Continuous checks',
            text: 'Tools, guides, and public pages are tested and updated with the implementation.',
          },
          {
            title: 'Protect originals',
            text: 'Users are encouraged to keep source files and open every result before relying on it.',
          },
        ],
        testing: 'Read our quality and testing method',
        contact: 'Contact and feedback',
        toolbox: 'Explore the toolbox',
        source: 'View source code and release history',
      },
)
</script>

<template>
  <div class="page-wrap content-page about-page">
    <p class="eyebrow"><span class="eyebrow-dot"></span>{{ content.eyebrow }}</p>
    <h1>{{ content.title }}</h1>
    <p class="content-lead">{{ content.description }}</p>

    <section class="principle-grid" :aria-label="content.eyebrow">
      <article v-for="card in content.cards" :key="card.label" class="principle-card">
        <p class="section-kicker">{{ card.label }}</p>
        <h2>{{ card.title }}</h2>
        <p>{{ card.text }}</p>
      </article>
    </section>

    <section class="about-story">
      <div>
        <p class="section-kicker">{{ isZh ? '我们的目的' : 'OUR PURPOSE' }}</p>
        <h2>{{ content.storyTitle }}</h2>
      </div>
      <div>
        <p v-for="paragraph in content.story" :key="paragraph">{{ paragraph }}</p>
      </div>
    </section>

    <section class="about-standards">
      <p class="section-kicker">{{ isZh ? '工作原则' : 'WORKING PRINCIPLES' }}</p>
      <h2>{{ content.standardsTitle }}</h2>
      <div>
        <article v-for="standard in content.standards" :key="standard.title">
          <h3>{{ standard.title }}</h3>
          <p>{{ standard.text }}</p>
        </article>
      </div>
    </section>

    <div class="about-actions">
      <RouterLink class="primary-button" to="/">{{ content.toolbox }}</RouterLink>
      <RouterLink class="secondary-button" to="/how-we-test">{{ content.testing }}</RouterLink>
      <a
        class="secondary-button"
        href="https://github.com/yuanweilan123456/-"
        target="_blank"
        rel="noopener noreferrer"
        >{{ content.source }}</a
      >
      <RouterLink class="text-link" to="/contact">{{ content.contact }}</RouterLink>
    </div>
  </div>
</template>
