import { createRouter, createWebHistory } from 'vue-router'
import TransactionIndexView from '@/views/transaction/IndexView.vue'
import TransactionCreateView from '@/views/transaction/CreateView.vue'
import TransactionShowView from '@/views/transaction/ShowView.vue'
import LoginIndexView from '@/views/login/IndexView.vue'
import { useAuthStore } from '@/stores/auth'
import { SweetAlertUtil } from '@/utils/SweetAlertUtil'
import NProgress from 'nprogress'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      children: [
        {
          path: '',
          name: 'login.index',
          component: LoginIndexView,
        },
      ],
    },
    {
      path: '/transaction',
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
      meta: {
        requiresAuth: true,
        requiresRoles: ['admin'],
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresRoles = to.meta.requiresRoles as string[] | undefined

  if (requiresAuth && !sessionStorage.getItem('token')) {
    await authStore.logout()
    SweetAlertUtil.errorAlert('unauthorized')
    next('/')
  } else if (requiresRoles && !(await authStore.hasRoleAdmin(requiresRoles))) {
    authStore.unauthorized()
    SweetAlertUtil.errorAlert('unauthorized')
    next('/')
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
