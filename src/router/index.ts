import { createRouter, createWebHistory } from 'vue-router'
import TransactionIndexView from '@/views/transaction/IndexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TransactionIndexView,
    },
  ],
})

export default router
