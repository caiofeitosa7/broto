<script>
    import { useAuthStore } from "@/stores/auth";
    import { useRouter } from "vue-router";
    import axios from "axios";

    export default {
        setup() {
            const router = useRouter();
            const authStore = useAuthStore();

            return {
                router,
                authStore,
            };
        },
        data() {
            return {
                urlLogout: "http://localhost:5000/logout",
                menuVisivel: false,
            }
        },
        methods: {
            async logout() {
                try {
                    const response = await axios.get(this.urlLogout);
                    this.authStore.logout();
                    this.router.push({ name: "login" });
                } catch (error) {
                    console.error("Erro ao verificar o usuário:", error);
                }
            },
            toggleMenu() {
                this.menuVisivel = !this.menuVisivel;
            },
        }
    };
</script>

<template>
    <nav class="container is-flex is-justify-content-space-between is-align-items-center px-3 py-2">
        <div class="logo">
            <div></div>
        </div>
        <div class="px-5 container-pesquisar">
            <div class="campo-input px-4 py-2">
                <input id="pesquisa" placeholder="Qual planta deseja?">
                <i class="bi bi-search is-clickable"></i>
            </div>
        </div>
        <div id="menu-desktop" class="is-flex is-align-items-center">
            <router-link v-if="!this.authStore.autenticado" class="is-size-7 mr-4" to="/login">
                Entrar
            </router-link>
            <span v-if="this.authStore.autenticado" class="is-size-7 is-clickable mr-4" @click="logout">
                Sair
            </span>
            <!-- <div class="is-clickable is-size-5 mr-4">
                <i class="bi bi-chat-text"></i>
            </div> -->
            <div class="is-clickable is-size-5 mr-4">
                <i class="bi bi-heart"></i>
            </div>
            <router-link class="is-size-4" to="/">
                <i class="bi bi-person-fill"></i>
            </router-link>
        </div>
        <img @click="toggleMenu" id="icone-menu" class="is-clickable" src="@/assets/images/icon-menu.png" alt="Menu">
    </nav>
    <div v-if="menuVisivel" id="menu-mobile" class="is-flex is-align-items-center is-justify-content-center pt-4">
        <ul>
            <li class="is-clickable" :class="{ 'menu-selecionado': secaoAtiva === 'banner-frase' }">
                <a @click="scrollToSection('banner-frase')">HOME</a>
            </li>
            <li class="is-clickable" :class="{ 'menu-selecionado': secaoAtiva === 'container-sobre-nos' }">
                <a @click="scrollToSection('container-sobre-nos')">SOBRE</a>
            </li>
            <li class="is-clickable" :class="{ 'menu-selecionado': secaoAtiva === 'container-projetos' }">
                <a @click="scrollToSection('container-projetos')">PROJETOS</a>
            </li>
            <li class="is-clickable" :class="{ 'menu-selecionado': secaoAtiva === 'container-noticias' }">
                <a @click="scrollToSection('container-noticias')">NOTÍCIAS</a>
            </li>
            <li class="is-clickable" :class="{ 'menu-selecionado': secaoAtiva === 'container-contato' }">
                <a @click="scrollToSection('container-contato')">CONTATO</a>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    nav.container {
        position: sticky;
        top: 0; /* Fixa o elemento no topo ao rolar */
        z-index: 10; /* Garante que o elemento esteja acima de outros */
        background-color: white; /* Evita sobreposição transparente */
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Opcional: adiciona um efeito de sombra */
    }

    .logo div:first-child {
        border-radius: 50%;
        height: 35px;
        width: 35px;
    }

    .logo div:first-child {
        background-color: var(--cor-principal);
    }

    .container-pesquisar {
        width: 70%;
    }

    .campo-input {
        display: flex;
        align-items: center;
        border-radius: 20px;
        border: 1px solid var(--preto);

        input {
            width: -webkit-fill-available;
            font-weight: 600;
            border: none;

            &:focus {
                outline: none;
            }
        }
    }

    #menu-mobile {
        top: 48px;
        z-index: 2;
        position: sticky;
        background-color: #fff;
    }

    #menu-mobile li {
        text-align: center;
        margin-bottom: 17px;
    }

    #icone-menu {
        max-width: 25px;
    }

    @media screen and (min-width: 769px) {
        #icone-menu{
            display: none !important;
        }
    }

    @media screen and (max-width: 768px) {
        #menu-desktop{
            display: none !important;
        }
    }

    @media screen and (min-width: 371px) {
        #pesquisa{
            max-width: auto;
        }
    }

    @media screen and (max-width: 370px) {
        .container-pesquisar {
            width: auto;
        }

        #pesquisa{
            max-width: 130px;
        }
    }

</style>