<script>
    import { useAuthStore } from "@/stores/auth";
    import { useRouter } from "vue-router";
    import axios from "axios";
    import { ref } from 'vue';

    export default {
        setup() {
            const router = useRouter();
            const authStore = useAuthStore();
            const solicitouRecuperacao = ref(false);
            const urlRecuperarSenha = "http://127.0.0.1:5000/usuario/solicitar_recuperacao";
            const urlLogin = "http://127.0.0.1:5000/login";
            const form = ref({ usuario: "", senha: "" });
            const form_recuperacao = ref({ cpf: "" });
            const erro = ref("");

            const isPasswordVisible = ref(false);
            const togglePasswordVisibility = () => {
                isPasswordVisible.value = !isPasswordVisible.value;
            };

            const esqueceuSenha = ref(false);
            const toggleEsqueceuSenha = () => {
                esqueceuSenha.value = !esqueceuSenha.value;
                solicitouRecuperacao.value = false;
                form_recuperacao.value = { cpf: "" };
                erro.value = "";
            };
 
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

            const recuperarSenha = async () => {
                try {
                    if (!form_recuperacao.value.cpf) {
                        erro.value = "Informe o CPF";
                        return;
                    }

                    const response = await axios.post(urlRecuperarSenha, form_recuperacao.value);
                    if (response.status === 200) {
                        solicitouRecuperacao.value = true;
                    } else {
                        erro.value = "CPF não encontrado";
                    }
                
                } catch (error) {
                    erro.value = error.response?.data?.message || "Erro ao realizar login";
                }
            };

            return {
                realizarLogin,
                isPasswordVisible,
                toggleEsqueceuSenha,
                togglePasswordVisibility,
                recuperarSenha,
                form_recuperacao,
                solicitouRecuperacao,
                esqueceuSenha,
                form,
                erro,
            };
        },
    };
</script>

<template>
    <div class="container">

        <div class="container-wave is-flex is-flex-direction-column">
            <div class="is-flex is-justify-content-flex-end has-text-right p-6">
                <h2 class="has-text-white is-size-2">
                    DOE MUDAS, <br>SEMEIE O FUTURO.
                </h2>
            </div>
            <img src="@/assets/images/wave.svg" alt="">
        </div>

        <div v-if="!esqueceuSenha" id="container-form" class="is-flex is-flex-direction-column is-align-items-center">
            <a class="logo pb-3" href="/">
                <img class="image" src="@/assets/images/broto-1.3.png" alt="Logo do Broto" width="50px" height="50px"/>
            </a>
            <form @submit.prevent="realizarLogin">
                <p class="has-text-centered pb-1">
                    Bem Vindo!
                </p>
                <p class="has-text-centered is-size-7">
                    Insira suas informações de login
                </p>
                <div class="campo-input px-3 py-2 mb-4 mt-5">
                    <label for="usuario"><i class="bi bi-person-fill"></i></label>
                    <input id="usuario" v-model="form.usuario">
                </div>
                <div class="campo-input px-3 py-2">
                    <label for="senha"><i class="bi bi-lock-fill"></i></label>
                    <input id="senha" v-model="form.senha" :type="isPasswordVisible ? 'text' : 'password'">
                    <div @click="togglePasswordVisibility" class="is-clickable">
                        <i :class="isPasswordVisible ? 'bi bi-eye-fill m-0' : 'bi bi-eye-slash-fill m-0'"></i>
                    </div>
                </div>
                <div class="is-flex is-justify-content-end is-align-items-center mt-1">
                    <p class="has-text-weight-medium has-text-right is-clickable is-size-7 py-1" @click="toggleEsqueceuSenha">
                        Esqueci a senha*
                    </p>
                </div>
                <button class="btn-cor-principal mt-5 p-3" type="submit">
                    Entrar
                </button>
                <div class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
                    <span v-if="erro" class="help is-danger">
                        {{ erro }}
                    </span>
                    <router-link to="/criar_conta" class="is-size-7 p-2 mt-2">
                        Não tenho uma conta
                    </router-link>
                </div>
            </form>
        </div>

        <div v-if="esqueceuSenha && !solicitouRecuperacao" id="container-form" class="is-flex is-flex-direction-column is-align-items-center">
            <a class="logo pb-3" href="/">
                <img class="image" src="@/assets/images/broto-1.3.png" alt="Logo do Broto" width="50px" height="50px"/>
            </a>
            <form class="form-esqueceu-senha" @submit.prevent="recuperarSenha">
                <p class="has-text-justified is-size-6">
                    Para redefinir sua senha, informe seu CPF para que possamons enviar um e-mail com as instruções.
                </p>
                <div class="campo-input px-3 py-2 mb-2 mt-4">
                    <input id="cpf" v-model="form_recuperacao.cpf" placeholder="CPF">
                </div>
                <p class="has-text-weight-medium has-text-right is-size-7">
                    *Somente números
                </p>
                <button class="btn-cor-principal mt-5 p-3" type="submit">
                    Recuperar
                </button>
                <div class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
                    <span v-if="erro" class="help is-danger">
                        {{ erro }}
                    </span>
                    <span class="is-clickable is-size-7 p-2 mt-2" @click="toggleEsqueceuSenha">
                        Cancelar
                    </span>
                </div>
            </form>
        </div>

        <div v-if="solicitouRecuperacao" class="px-6 is-flex is-flex-direction-column is-align-items-center">
            <a class="logo pb-3" href="/">
                <img class="image" src="@/assets/images/broto-1.3.png" alt="Logo do Broto" width="50px" height="50px"/>
            </a>
            <p class="has-text-justified mb-2">
                Enviamos a você um e-mail com o link para concluir a recuperação da sua senha.
            </p>
            <p class="has-text-justified">
                Não localizou o e-mail? <span class="has-text-weight-bold">Verifique a caixa de spam</span> ou tente novamente.
            </p>
            <div class="is-flex is-justify-content-center mt-5">
                <button class="btn-cor-principal py-3 px-5" @click="toggleEsqueceuSenha">
                    Retornar ao login
                </button>
            </div>
        </div>

    </div>
</template>

<style scoped>
    .container-wave {
        background-image: url('@/assets/images/banner_inicio.jpg');
        height: max-content;
        max-width: 1280px;
        overflow: hidden;

        h2 {
            font-family: "Aboreto", system-ui;
            line-height: normal;
        }
    }

    #container-form {
        background-color: #fff;
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
            font-size: larger;
            font-weight: 600;
        }
        
        #senha {
            width: 208px;
        }

        form {
            width: 270px;
        }
    }

    .form-esqueceu-senha p:first-child {
        line-height: 1.15;
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