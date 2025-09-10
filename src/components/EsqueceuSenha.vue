<script>
    import { useAuthStore } from "@/stores/auth";
    import { useRouter } from "vue-router";
    import axios from "axios";
    import { ref } from 'vue';

    export default {
        setup() {
            const router = useRouter();
            const authStore = useAuthStore();
            const isPasswordVisible = ref(false);
            const togglePasswordVisibility = () => {
                isPasswordVisible.value = !isPasswordVisible.value;
            };

            const urlLogin = "http://127.0.0.1:5000/login";
            const form = ref({ usuario: "", senha: "" });
            const erro = ref("");

            const realizarLogin = async () => {
                try {
                    const response = await axios.post(urlLogin, form.value);
                    authStore.login(
                        response.data.user.id, 
                        response.data.user.nome,
                        response.data.favoritos
                    );
                    router.push({ name: "home" });
                } catch (error) {
                    erro.value = error.response?.data?.message || "Erro ao realizar login";
                }
            };

            return {
                realizarLogin,
                isPasswordVisible,
                togglePasswordVisibility,
                form,
                erro,
            };
        },
    };
</script>

<template>
    <div class="container">
        <div id="container-form" class="is-flex is-flex-direction-column is-align-items-center">
            <a class="logo pb-3" href="/">
                <img class="image" src="@/assets/images/broto-1.3.png" alt="Logo do Broto" width="50px" height="50px"/>
            </a>
            <form @submit.prevent="realizarLogin">
                <p class="has-text-justified">
                    Para redefinir sua senha, informe seu CPF para que possamons enviar um e-mail com as instruções.
                </p>
                <div class="campo-input px-3 py-2 mb-2 mt-5">
                    <input id="usuario" v-model="form.usuario" placeholder="">
                </div>
                <p class="has-text-weight-medium has-text-right is-size-7">
                    *Somente números
                </p>
                <button class="btn-cor-principal mt-4 p-3" type="submit">
                    Recuperar
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped>
    #container-form {
        position: relative;
        top: -40px;

        .campo-input {
            background-color: var(--verde-claro);
            border-radius: 7px;
            display: flex;
            align-items: center;

            i {
                color: var(--cor-principal);
                margin-right: 7px;
            }

            input {
                background-color: var(--verde-claro);
                color: var(--cor-principal);
                border: none;

                &:focus {
                    outline: none;
                }
            }
        }

        p:first-child {
            color: var(--cor-principal);
            line-height: 1.2;
            margin-top: 5px;
        }
        
        #senha {
            width: 208px;
        }

        form {
            width: 270px;
        }
    }

    @media screen and (min-width: 1215px) {
        #container-form {
            top: -50px;
        }
    }

    @media screen and (max-width: 770px) {
        #container-form {
            top: -5px;
        }

        form {
            width: 250px;
        }
    }

    @media screen and (max-width: 600px) {
        h2 {
            font-size: 1.7rem !important;
        }
    }

    @media screen and (max-width: 400px) {
        h2 {
            font-size: 1.2rem !important;
        }
    }
</style>