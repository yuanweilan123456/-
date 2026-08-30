import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { categoryOrder, fileTools } from '../features/tools/catalog'

const imageRoutes: RouteRecordRaw[] = [
  {
    path: '/tools/image/compress',
    name: 'image-compress',
    component: () => import('../views/ToolLandingView.vue'),
    props: { type: 'compress' },
  },
  {
    path: '/tools/image/convert',
    name: 'image-convert',
    component: () => import('../views/ToolLandingView.vue'),
    props: { type: 'convert' },
  },
  {
    path: '/tools/image/resize',
    name: 'image-resize',
    component: () => import('../views/ToolLandingView.vue'),
    props: { type: 'resize' },
  },
  {
    path: '/tools/image/rotate',
    name: 'image-rotate',
    component: () => import('../views/ToolLandingView.vue'),
    props: { type: 'rotate' },
  },
  {
    path: '/tools/image/flip',
    name: 'image-flip',
    component: () => import('../views/ToolLandingView.vue'),
    props: { type: 'flip' },
  },
]

const fileToolRoutes: RouteRecordRaw[] = fileTools.map((tool) => ({
  path: tool.path,
  name: tool.id,
  component: () => import('../views/FileToolView.vue'),
  props: { type: tool.id },
}))

const categoryRoutes: RouteRecordRaw[] = categoryOrder.map((category) => ({
  path: `/tools/${category}`,
  name: `category-${category}`,
  component: () => import('../views/CategoryView.vue'),
  props: { category },
  meta: { category },
}))

const legacyRedirects: RouteRecordRaw[] = [
  { path: '/toolbox', redirect: '/' },
  { path: '/image-tools', redirect: '/tools/image/studio' },
  { path: '/compress-image', redirect: '/tools/image/compress' },
  { path: '/convert-image', redirect: '/tools/image/convert' },
  { path: '/resize-image', redirect: '/tools/image/resize' },
  { path: '/pdf/merge', redirect: '/tools/pdf/merge' },
  { path: '/pdf/split', redirect: '/tools/pdf/split' },
  { path: '/pdf/images-to-pdf', redirect: '/tools/pdf/images-to-pdf' },
  { path: '/word/to-html', redirect: '/tools/document/docx-to-html' },
  { path: '/ppt/images-to-pptx', redirect: '/tools/presentation/images-to-pptx' },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/ToolboxView.vue') },
    { path: '/tools/image/studio', name: 'image-studio', component: () => import('../views/HomeView.vue') },
    ...imageRoutes,
    ...fileToolRoutes,
    ...categoryRoutes,
    ...legacyRedirects,
    { path: '/faq', name: 'faq', component: () => import('../views/FaqView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    { path: '/guides', name: 'guides', component: () => import('../views/GuidesView.vue') },
    { path: '/guides/:slug', name: 'guide', component: () => import('../views/GuideView.vue'), props: true },
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
