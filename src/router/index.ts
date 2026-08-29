import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/ToolboxView.vue') },
    { path: '/toolbox', name: 'toolbox', redirect: { name: 'home' } },
    { path: '/image-tools', name: 'image-tools', component: () => import('../views/HomeView.vue') },
    { path: '/faq', name: 'faq', component: () => import('../views/FaqView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    { path: '/guides', name: 'guides', component: () => import('../views/GuidesView.vue') },
    {
      path: '/guides/:slug',
      name: 'guide',
      component: () => import('../views/GuideView.vue'),
      props: true,
    },
    {
      path: '/compress-image',
      name: 'compress-image',
      component: () => import('../views/ToolLandingView.vue'),
      props: { type: 'compress' },
    },
    {
      path: '/convert-image',
      name: 'convert-image',
      component: () => import('../views/ToolLandingView.vue'),
      props: { type: 'convert' },
    },
    {
      path: '/resize-image',
      name: 'resize-image',
      component: () => import('../views/ToolLandingView.vue'),
      props: { type: 'resize' },
    },
    {
      path: '/pdf/merge',
      name: 'pdf-merge',
      component: () => import('../views/FileToolView.vue'),
      props: { type: 'pdf-merge' },
    },
    {
      path: '/pdf/split',
      name: 'pdf-split',
      component: () => import('../views/FileToolView.vue'),
      props: { type: 'pdf-split' },
    },
    {
      path: '/pdf/images-to-pdf',
      name: 'images-to-pdf',
      component: () => import('../views/FileToolView.vue'),
      props: { type: 'images-to-pdf' },
    },
    {
      path: '/word/to-html',
      name: 'docx-to-html',
      component: () => import('../views/FileToolView.vue'),
      props: { type: 'docx-to-html' },
    },
    {
      path: '/ppt/images-to-pptx',
      name: 'images-to-pptx',
      component: () => import('../views/FileToolView.vue'),
      props: { type: 'images-to-pptx' },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PolicyView.vue'),
      props: { type: 'privacy' },
    },
    { path: '/terms', name: 'terms', component: () => import('../views/PolicyView.vue'), props: { type: 'terms' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
  ],
  scrollBehavior: (to) => (to.hash ? { el: to.hash, behavior: 'smooth' } : { top: 0 }),
})

export default router
