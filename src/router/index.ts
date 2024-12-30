import { createRouter, createWebHistory } from 'vue-router'
// import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import LoginPage from '../components/PageLogin.vue';
import CriarContaPage from '../components/PageCriarConta.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/criar_conta',
      name: 'criar_conta',
      component: CriarContaPage
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    }
  ]
})

export default router
