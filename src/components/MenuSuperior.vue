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
        <div class="is-flex is-align-items-center">
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
    </nav>
</template>

<style scoped>
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

</style>