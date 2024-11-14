import { createRouter, createWebHistory } from 'vue-router'
// import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import EntrarPage from '../components/PageEntrar.vue';
import CriarContaPage from '../components/PageCriarConta.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'login',
    //   component: LoginView
    // },
    {
      path: '/entrar',
      name: 'entrar',
      component: EntrarPage
    },
    {
      path: '/criar-conta',
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
