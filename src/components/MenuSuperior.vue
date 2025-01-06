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
                showDropdown: false,
                menuVisivel: false,
            }
        },
        methods: {
            async logout() {
                try {
                    const response = await axios.get(this.urlLogout);
                    this.authStore.logout();
                    this.showDropdown = false;
                    this.router.push({ name: "login" });
                } catch (error) {
                    console.error("Erro ao verificar o usuário:", error);
                }
            },
            toggleMenu() {
                this.menuVisivel = !this.menuVisivel;
            },
            toggleDropdown() {
                this.showDropdown = !this.showDropdown;
            },
            closeDropdown(event) {
                if (!this.$el.contains(event.target)) {
                    this.showDropdown = false;
                }
            },
        },
        mounted() {
            document.addEventListener('click', this.closeDropdown);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.closeDropdown);
        },
    };
</script>

<template>
    <nav>
        <div class="container is-flex is-justify-content-space-between is-align-items-center px-3 py-2">
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
                <!-- <router-link class="is-size-4" to="/">
                    <i class="bi bi-person-fill"></i>
                </router-link> -->

                <div class="is-size-4 is-relative">
                    <i class="bi bi-person-fill is-clickable" @click="toggleDropdown"></i>
                    
                    <!-- Menu flutuante -->
                    <div v-show="showDropdown" class="menu-dropdown">
                        <ul class="is-size-6">
                            <li><router-link to="/perfil">Perfil</router-link></li>
                            <li><router-link to="/configuracoes">Publicações</router-link></li>
                            <!-- <li v-if="authStore.autenticado" @click="logout">Sair</li> -->
                        </ul>
                    </div>
                </div>

            </div>
            <img @click="toggleMenu" id="icone-menu" class="is-clickable" src="@/assets/images/icon-menu.png" alt="Menu">
        </div>
        <div v-if="menuVisivel" id="menu-mobile" class="is-flex is-align-items-center is-justify-content-center pt-4">
            <ul>
                <li class="is-clickable" :class="{ 'menu-selecionado': secaoAtiva === 'banner-frase' }">
                    <a @click="scrollToSection('banner-frase')">HOME</a>
                </li>
                <li class="is-clickable" :class="{ 'menu-selecionado': secaoAtiva === 'container-sobre-nos' }">
                    <a @click="scrollToSection('container-sobre-nos')">FAVORITOS</a>
                </li>
                <li class="is-clickable" :class="{ 'menu-selecionado': secaoAtiva === 'container-projetos' }">
                    <a @click="scrollToSection('container-projetos')">PUBLICAÇÕES</a>
                </li>
                <li class="is-clickable" :class="{ 'menu-selecionado': secaoAtiva === 'container-noticias' }">
                    <a @click="scrollToSection('container-noticias')">PERFIL</a>
                </li>
                <li class="is-clickable" :class="{ 'menu-selecionado': secaoAtiva === 'container-contato' }">
                    <a @click="scrollToSection('container-contato')">CHAT</a>
                </li>
                <li class="is-clickable" :class="{ 'menu-selecionado': secaoAtiva === 'container-contato' }">
                    <a @click="scrollToSection('container-contato')">SAIR</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<style scoped>
    nav {
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

    .menu-dropdown {
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        background-color: white;
        position: absolute;
        border-radius: 4px;
        min-width: 150px;
        padding: 10px;
        z-index: 20;
        top: 100%; /* Alinha abaixo do ícone */
        right: 0;
    }

    .menu-dropdown ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .menu-dropdown ul li {
        padding: 8px 12px;
        cursor: pointer;
    }

    .menu-dropdown ul li:hover {
        background-color: #f5f5f5;
    }


    /* ---------------------------------------------------------- */


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