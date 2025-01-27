import { createRouter, createWebHistory } from 'vue-router'
import TransactionIndexView from '@/views/transaction/IndexView.vue'
import TransactionCreateView from '@/views/transaction/CreateView.vue'
import TransactionShowView from '@/views/transaction/ShowView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      children: [
        {
          path: '',
          name: 'transaction.index',
          component: TransactionIndexView,
        },
        {
          path: 'create',
          name: 'transaction.create',
          component: TransactionCreateView,
        },
        {
          path: ':transactionId',
          name: 'transaction.show',
          component: TransactionShowView,
        },
      ],
    },
  ],
})

export default router
