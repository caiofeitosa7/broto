<script>
    import Menu from '../components/menuSuperior.vue'
    import RodaPe from '../components/RodaPe.vue'
    import { useAuthStore } from "@/stores/auth";
    import { useRouter } from "vue-router";
    import Modal from './ModalMensagem.vue';
    import axios from "axios";

    export default {
        components: {
            Modal,
            Menu,
            RodaPe
        },
        setup() {
            const authStore = useAuthStore();
            const router = useRouter();

            return {
                authStore,
                router
            };
        },
        data() {
            return {
                urlAtualizarUsuario: "http://127.0.0.1:5000//atualizar_usuario",
                urlGetUsuario: 'http://127.0.0.1:5000/get_usuario/',
                senhaVisivel: false,
                showModal: false,
                titleModal: "",
                contentModal: "",
                dadosUsuario: {
                    nome: "",
                    email: "",
                    cep: "",
                    cidade: "",
                    logradouro: "",
                    bairro: "",
                    numero: "",
                    cpf: "",
                    sexo: "I",
                    telefone: "",
                    usuario: "",
                    senha: "",
                },
            };
        },
        methods: {
            getUsuario() {
                const idUsuario = this.authStore.cod_usuario;
                axios.get(this.urlGetUsuario + idUsuario)
                    .then(response => {
                        this.dadosUsuario = response.data;
                    })
                    .catch(error => {
                        console.error("Erro ao obter os dados do usuário");
                    });
            },
            verificarCamposObrigatorios(camposObrigatorios, dadosUsuario) {
                return camposObrigatorios.every(campo => {
                    const valor = dadosUsuario[campo]?.trim();
                    return valor !== "" && valor !== undefined && valor !== null;
                });
            },
            fecharModal() {
                this.showModal = false;
            },
            async atualizarUsuario(event) {
                event.preventDefault();

                // this.dadosUsuario.senha = this.senha;

                // if (!this.senhasIguais) {
                //     this.titleModal = "Erro!";
                //     this.contentModal = "As senhas não coincidem.";
                //     this.showModal = true;
                //     return;
                // }

                let camposObrigatorios = ['nome', 'email', 'cpf', 'usuario', 'senha'];
                if (!this.verificarCamposObrigatorios(camposObrigatorios, this.dadosUsuario)) {
                    this.titleModal = "Erro!";
                    this.contentModal = "Por favor, preencha todos os campos obrigatórios.";
                    this.showModal = true;
                    return;
                }

                // const response = await axios.get(this.urlVerificarUsuario, {
                //     params: { usuario: this.dadosUsuario.usuario }
                // });

                // if (response.data.existe) {
                //     this.titleModal = "Erro!";
                //     this.contentModal = "Este usuário já está em uso.";
                //     this.showModal = true;
                //     return;
                // }

                try {
                    const response = await axios.post(this.urlAtualizarUsuario, this.dadosUsuario);

                    this.titleModal = "Sucesso!";
                    this.contentModal = "Atualização realizada com sucesso.";
                    this.showModal = true;

                } catch (error) {
                    this.titleModal = "Erro!";
                    this.contentModal =
                    error.response?.data?.message || "Ocorreu um erro ao enviar os dados.";
                    this.showModal = true;
                }
            },
            toggleSenhaVisivel() {
                this.senhaVisivel = !this.senhaVisivel;
            },
        },
        mounted() {
            this.getUsuario();
        },
        // watch: {
        //     senha: "verificarSenhas",
        //     confirmacaoSenha: "verificarSenhas",
        // },
    };
</script>
<template>
    <Menu :exibirPesquisa="false" />

    <div class="container">
        <Modal
            :showModal="showModal"
            :titleModal="titleModal"
            :contentModal="contentModal"
            @close="fecharModal"
        />
        <div class="container-wave is-flex is-flex-direction-column pt-5">
            <img src="@/assets/images/wave.svg" alt="">
        </div>
        <div id="container-form" class="is-flex is-flex-direction-column is-align-items-center">
            <p class="has-text-centered pb-1">
                Meus Dados
            </p>
            <p class="has-text-centered is-size-7">
                * Campos obrigatórios
            </p>
            <form class="pt-5">
                <div class="columns">
                    <div class="column is-5">
                        <label for="nome">
                            Nome*
                        </label>
                        <input id="nome" name="nome" class="mt-1" v-model="dadosUsuario.nome">
                    </div>
                    <div class="column is-4">
                        <label for="email">
                            Email*
                        </label>
                        <input id="email" name="email" class="mt-1" v-model="dadosUsuario.email">
                    </div>
                    <div class="column is-3">
                        <label for="cpf">
                            CPF*
                        </label>
                        <input id="cpf" name="cpf" class="mt-1" v-model="dadosUsuario.cpf">
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-display-flex is-flex-direction-column is-3">
                        <label for="sexo">
                            Sexo
                        </label>
                        <div class="select mt-1">
                            <select v-model="dadosUsuario.sexo" id="sexo">
                                <option value="I">Ignorado</option>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </select>
                        </div>
                    </div>
                    <div class="column is-3">
                        <label for="telefone">
                            Telefone (DDD)
                        </label>
                        <input id="telefone" name="telefone" class="mt-1" v-model="dadosUsuario.telefone">
                    </div>
                    <div class="column is-2">
                        <label for="cep">
                            CEP
                        </label>
                        <input id="cep" name="cep" class="mt-1" v-model="dadosUsuario.cep">
                    </div>
                    <div class="column is-4">
                        <label for="cidade">
                            Cidade
                        </label>
                        <input id="cidade" name="cidade" class="mt-1" v-model="dadosUsuario.cidade">
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-5">
                        <label for="logradouro">
                            Logradouro
                        </label>
                        <input id="logradouro" name="logradouro" class="mt-1" v-model="dadosUsuario.logradouro">
                    </div>
                    <div class="column is-5">
                        <label for="bairro">
                            Bairro
                        </label>
                        <input id="bairro" name="bairro" class="mt-1" v-model="dadosUsuario.bairro">
                    </div>
                    <div class="column is-2">
                        <label for="numero">
                            Número
                        </label>
                        <input id="numero" name="numero" class="mt-1" type="number" v-model="dadosUsuario.numero">
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-3">
                        <label for="usuario">
                            Usuário*
                        </label>
                        <input id="usuario" name="usuario" class="mt-1" v-model="dadosUsuario.usuario" disabled>
                    </div>
                    <div class="column is-3">
                        <label for="senha">
                            Senha*
                        </label>
                        <div class="campo-input mt-1">
                            <input id="senha" v-model="dadosUsuario.senha" :type="senhaVisivel ? 'text' : 'password'">
                            <div @click="toggleSenhaVisivel" class="is-clickable pr-3">
                                <i :class="senhaVisivel ? 'bi bi-eye-fill m-0' : 'bi bi-eye-slash-fill m-0'"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center my-6">
                    <button class="btn-cor-principal py-3" @click="atualizarUsuario">
                        Atualizar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
    .columns {
        margin-bottom: 0;
    }

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

        input {
            background-color: var(--verde-claro);
            width: -webkit-fill-available;
            color: var(--cor-principal);
            border-radius: 5px;
            font-weight: 600;
            font-size: 1rem;
            padding: .5rem;
            border: none;

            &:focus {
                outline: none;
            }
        }

        input[disabled] {
            cursor: not-allowed;
            opacity: 0.7;
        }

        p:first-child {
            color: var(--cor-principal);
            font-size: larger;
            font-weight: 600;
        }

        .select {
            height: 37px;
        }

        .select:not(.is-multiple):not(.is-loading):after {
            border-color: var(--cor-principal) !important;
        }

        select {
            width: -webkit-fill-available;
            background-color: var(--verde-claro);
            color: var(--cor-principal);
            font-weight: 600;
            padding: 0 .7rem;
            font-size: 1rem;
            height: inherit;
            border: none;

            &:focus {
                outline: none;
                border: none;
            }
        }

        label {
            color: var(--cor-principal);
            font-weight: 500;
        }

        form {
            width: 80%;
        }

        button {
            width: 25%;
        }

        .campo-input {
            background-color: var(--verde-claro);
            border-radius: 7px;
            display: flex;
            align-items: center;

            i {
                color: var(--cor-principal);
            }

            input {
                background-color: var(--verde-claro);
                color: var(--cor-principal);
                font-weight: 600;
                border: none;
                width: 94%;

                &:focus {
                    outline: none;
                }
            }
        }
    }

    @media screen and (max-width: 770px) {
        #container-form {
            top: -5px;
        }

        button {
            width: 50% !important;
        }
    }
</style>