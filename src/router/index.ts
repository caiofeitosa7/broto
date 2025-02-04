import { createRouter, createWebHistory } from 'vue-router'
// import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import LoginPage from '../components/PageLogin.vue';
import PerfilPage from '../components/PagePerfil.vue';
import FavoritosView from '../views/FavoritosView.vue';
import PublicacoesView from '../views/PublicacoesView.vue';
import CriarContaPage from '../components/PageCriarConta.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
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
      path: '/perfil',
      name: 'perfil',
      component: PerfilPage
    },
    {
      path: '/minhas_publicacoes',
      name: 'minhas_publicacoes',
      component: PublicacoesView
    },
    {
      path: '/meus_favoritos',
      name: 'meus_favoritos',
      component: FavoritosView
    },
  ]
})

export default router
