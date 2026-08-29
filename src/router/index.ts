import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PolicyView from '../views/PolicyView.vue'
import ToolLandingView from '../views/ToolLandingView.vue'
import ToolboxView from '../views/ToolboxView.vue'
import FileToolView from '../views/FileToolView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/toolbox', name: 'toolbox', component: ToolboxView },
    { path: '/compress-image', name: 'compress-image', component: ToolLandingView, props: { type: 'compress' } },
    { path: '/convert-image', name: 'convert-image', component: ToolLandingView, props: { type: 'convert' } },
    { path: '/resize-image', name: 'resize-image', component: ToolLandingView, props: { type: 'resize' } },
    { path: '/pdf/merge', name: 'pdf-merge', component: FileToolView, props: { type: 'pdf-merge' } },
    { path: '/pdf/split', name: 'pdf-split', component: FileToolView, props: { type: 'pdf-split' } },
    { path: '/pdf/images-to-pdf', name: 'images-to-pdf', component: FileToolView, props: { type: 'images-to-pdf' } },
    { path: '/word/to-html', name: 'docx-to-html', component: FileToolView, props: { type: 'docx-to-html' } },
    { path: '/ppt/images-to-pptx', name: 'images-to-pptx', component: FileToolView, props: { type: 'images-to-pptx' } },
    { path: '/privacy', name: 'privacy', component: PolicyView, props: { type: 'privacy' } },
    { path: '/terms', name: 'terms', component: PolicyView, props: { type: 'terms' } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
