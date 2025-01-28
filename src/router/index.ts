import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import TransactionIndexView from '@/views/transaction/IndexView.vue'
import TransactionCreateView from '@/views/transaction/CreateView.vue'
import TransactionShowView from '@/views/transaction/ShowView.vue'
import LoginIndexView from '@/views/login/IndexView.vue'
import UserIndexView from '@/views/user/IndexView.vue'
import UserCreateView from '@/views/user/CreateView.vue'
import CustomerIndexView from '@/views/customer/IndexView.vue'
import CustomerCreateView from '@/views/customer/CreateView.vue'
import CustomerShowView from '@/views/customer/ShowView.vue'
import UserShowView from '@/views/user/ShowView.vue'
import RoleIndexView from '@/views/role/IndexView.vue'
import RoleCreateView from '@/views/role/CreateView.vue'
import RoleShowView from '@/views/role/ShowView.vue'
import ItemIndexView from '@/views/item/IndexView.vue'
import ItemCreateView from '@/views/item/CreateView.vue'
import ItemShowView from '@/views/item/ShowView.vue'
import { useAuthStore } from '@/stores/auth'
import { SweetAlertUtil } from '@/utils/SweetAlertUtil'

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
      path: '/item',
      children: [
        {
          path: '',
          name: 'item.index',
          component: ItemIndexView,
        },
        {
          path: 'create',
          name: 'item.create',
          component: ItemCreateView,
        },
        {
          path: ':itemId',
          name: 'item.show',
          component: ItemShowView,
        },
      ],
      meta: {
        requiresAuth: true,
        requiresRoles: ['admin'],
      },
    },
    {
      path: '/role',
      children: [
        {
          path: '',
          name: 'role.index',
          component: RoleIndexView,
        },
        {
          path: 'create',
          name: 'role.create',
          component: RoleCreateView,
        },
        {
          path: ':roleId',
          name: 'role.show',
          component: RoleShowView,
        },
      ],
      meta: {
        requiresAuth: true,
        requiresRoles: ['admin'],
      },
    },
    {
      path: '/customer',
      children: [
        {
          path: '',
          name: 'customer.index',
          component: CustomerIndexView,
        },
        {
          path: 'create',
          name: 'customer.create',
          component: CustomerCreateView,
        },
        {
          path: ':customerId',
          name: 'customer.show',
          component: CustomerShowView,
        },
      ],
      meta: {
        requiresAuth: true,
        requiresRoles: ['admin'],
      },
    },
    {
      path: '/user',
      children: [
        {
          path: '',
          name: 'user.index',
          component: UserIndexView,
        },
        {
          path: 'create',
          name: 'user.create',
          component: UserCreateView,
        },
        {
          path: ':userId',
          name: 'user.show',
          component: UserShowView,
        },
      ],
      meta: {
        requiresAuth: true,
        requiresRoles: ['admin'],
      },
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
        requiresRoles: ['admin', 'teller'],
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
