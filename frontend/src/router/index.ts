import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import LoginView from '@/views/LoginView.vue'
import AdminView from '@/views/AdminView.vue'
import UserView from '@/views/UserView.vue'
import AdminBooksView from '@/views/AdminBooksView.vue'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', name: 'login', component: LoginView },
      { path: 'admin', name: 'admin', component: AdminView },
      { path: 'dashboard', name: 'dashboard', component: UserView },
      { path: 'admin/books', name: 'admin-books', component: AdminBooksView },
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const store = useUserStore()

  if (!store.isAuthenticated) {
    await store.fetchUser()
  }

  const user = store.user

  if (!user && to.name !== 'login') {
    return { name: 'login' }
  }

  if (to.name === 'admin' && user?.role !== 'ADMIN') {
    return { name: 'login' }
  }

  if (to.name === 'dashboard' && user?.role !== 'USER') {
    return { name: 'login' }
  }
  if (['admin', 'admin-books'].includes(to.name as string) && user?.role !== 'ADMIN') {
  return { name: 'login' }
}
  return true
})
