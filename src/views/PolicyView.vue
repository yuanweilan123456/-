<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const props = defineProps<{ type: 'privacy' | 'terms' }>()
const { locale } = useI18n()
const isZh = computed(() => locale.value === 'zh')

const content = computed(() => {
  if (props.type === 'privacy') {
    return isZh.value
      ? {
          eyebrow: 'PIXELFORGE / 隐私',
          title: '隐私政策',
          intro: '本政策说明 PixelForge 当前如何处理你选择的文件、界面偏好和广告服务。',
          updated: '最后更新：2026 年 9 月 19 日',
          back: '返回工具',
          sections: [
            {
              heading: '文件处理',
              body: [
                '图片、PDF、DOCX 和 PPTX 的当前处理流程在你的浏览器中完成。我们不会把文件内容上传到 PixelForge 服务器，也不会建立文件云端副本。',
                '如果你刷新或关闭页面，当前任务可能丢失；浏览器下载的结果由你的设备和浏览器管理。',
              ],
            },
            {
              heading: '本地存储与偏好',
              body: [
                '我们在浏览器本地保存主题和语言偏好，用于下次打开时恢复界面设置。这些偏好保存在你的设备上，你可以通过浏览器设置清除。',
                'PixelForge 当前不提供用户账号，不会要求你提交姓名、地址或文件内容。若你通过第三方平台联系我们，该平台会按照自己的政策处理你主动提供的信息。',
              ],
            },
            {
              heading: 'Google 广告 Cookie 与第三方服务',
              body: [
                '网站已加载 Google AdSense 脚本用于网站验证；在网站通过审核并启用广告后，页面可能展示 Google 提供的广告。包括 Google 在内的第三方供应商会使用 Cookie，根据用户此前访问本网站或其他网站的情况投放广告。',
                'Google 使用广告 Cookie，使其及其合作伙伴可以根据用户对本网站或互联网上其他网站的访问情况投放广告。用户可以访问 Google 广告设置，选择退出个性化广告。',
                'PixelForge 不会把你选择的图片、PDF、DOCX 或 PPTX 文件内容发送给 PixelForge 服务器或 Google。正式展示广告前，应根据广告服务和访问者所在地区完成必要的隐私同意设置。',
              ],
              links: [
                { label: 'Google 广告设置', href: 'https://adssettings.google.com/' },
                {
                  label: 'Google 如何使用合作伙伴网站信息',
                  href: 'https://policies.google.com/technologies/partner-sites',
                },
                { label: 'Google 隐私权与条款', href: 'https://policies.google.com/privacy' },
              ],
            },
            {
              heading: '数据保留、儿童与政策变更',
              body: [
                '由于文件不会上传到 PixelForge 服务器，我们不会在服务器上保留你的源文件或处理结果。浏览器下载记录和本地文件由你的设备管理。',
                '本服务面向能够独立使用通用文件工具的用户，不以儿童为主要受众。如果政策或第三方服务发生实质变化，我们会更新本页日期和相关说明。',
              ],
            },
          ],
        }
      : {
          eyebrow: 'PIXELFORGE / PRIVACY',
          title: 'Privacy policy',
          intro:
            'This policy explains how PixelForge currently handles your files, interface preferences, and advertising services.',
          updated: 'Last updated: September 19, 2026',
          back: 'Back to tools',
          sections: [
            {
              heading: 'File processing',
              body: [
                'The current processing flow for images, PDFs, DOCX, and PPTX runs in your browser. We do not upload file contents to PixelForge servers or create cloud copies.',
                'Refreshing or closing the page may clear the current task. Downloaded results are managed by your device and browser.',
              ],
            },
            {
              heading: 'Local preferences',
              body: [
                'We save theme and language preferences in your browser so the interface can restore those settings next time. These preferences remain on your device and can be cleared through browser settings.',
                'PixelForge currently has no user accounts and does not ask you to submit a name, address, or file contents. If you contact us through a third-party platform, that platform handles the information you choose to provide under its own policy.',
              ],
            },
            {
              heading: 'Google advertising cookies and third parties',
              body: [
                'The site loads the Google AdSense script for site verification. After the site is approved and ads are enabled, pages may display advertising provided by Google. Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites.',
                'Google’s use of advertising cookies enables it and its partners to serve ads based on visits to this site and other sites on the Internet. Users can visit Google Ads Settings to opt out of personalized advertising.',
                'PixelForge does not send the contents of selected images, PDFs, DOCX files, or PPTX files to PixelForge servers or Google. Before serving ads, required consent settings should be completed based on the advertising service and visitor location.',
              ],
              links: [
                { label: 'Google Ads Settings', href: 'https://adssettings.google.com/' },
                {
                  label: 'How Google uses information from partner sites',
                  href: 'https://policies.google.com/technologies/partner-sites',
                },
                { label: 'Google Privacy & Terms', href: 'https://policies.google.com/privacy' },
              ],
            },
            {
              heading: 'Retention, children, and policy changes',
              body: [
                'Because files are not uploaded to a PixelForge server, we do not retain source files or processed results on a server. Browser download history and local files are controlled by your device.',
                'This service is intended for people who can independently use general file utilities and is not directed primarily at children. If the policy or third-party services materially change, we will update the date and relevant explanation on this page.',
              ],
            },
          ],
        }
  }

  return isZh.value
    ? {
        eyebrow: 'PIXELFORGE / 条款',
        title: '使用条款',
        intro: '使用 PixelForge 即表示你理解并接受以下使用范围和责任边界。',
        updated: '最后更新：2026 年 9 月 19 日',
        back: '返回工具',
        sections: [
          { heading: '允许的使用', body: ['请只处理你有权使用的文件，并遵守适用的法律、平台规则和第三方权利。'] },
          {
            heading: '工具限制',
            body: [
              '工具按现状提供。处理结果可能因文件结构、浏览器能力、设备内存和文件大小而异。DOCX 转 HTML 不保证复杂排版完全还原。',
              '在删除原文件或依赖处理结果前，请先确认下载文件可以正常打开。',
            ],
          },
          {
            heading: '禁止行为',
            body: ['不得使用本服务处理违法、侵权、欺诈、恶意软件或危害他人的内容，也不得试图干扰服务正常运行。'],
          },
        ],
      }
    : {
        eyebrow: 'PIXELFORGE / TERMS',
        title: 'Terms of use',
        intro: 'By using PixelForge, you understand and accept the following scope and responsibility boundaries.',
        updated: 'Last updated: September 19, 2026',
        back: 'Back to tools',
        sections: [
          {
            heading: 'Permitted use',
            body: [
              'Only process files that you have the right to use, and follow applicable laws, platform rules, and third-party rights.',
            ],
          },
          {
            heading: 'Tool limitations',
            body: [
              'The tools are provided as-is. Results may vary with file structure, browser capability, device memory, and file size. DOCX to HTML does not guarantee exact reproduction of complex layouts.',
              'Before deleting an original file or relying on a result, confirm that the downloaded file opens correctly.',
            ],
          },
          {
            heading: 'Prohibited behavior',
            body: [
              'Do not use the service for illegal, infringing, fraudulent, malware-related, or harmful content, and do not interfere with normal service operation.',
            ],
          },
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
        <div v-if="'links' in section && section.links?.length" class="policy-links">
          <a
            v-for="link in section.links"
            :key="link.href"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            >{{ link.label }}</a
          >
        </div>
      </section>
    </div>

    <div class="policy-actions">
      <RouterLink class="secondary-button" to="/">{{ content.back }}</RouterLink>
      <RouterLink class="text-link" to="/contact">{{ isZh ? '联系与反馈' : 'Contact and feedback' }}</RouterLink>
    </div>
  </div>
</template>
