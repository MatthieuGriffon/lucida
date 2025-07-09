import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import LoginView from '@/views/LoginView.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', name: 'login', component: LoginView },
      // D'autres routes à venir ici...
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
