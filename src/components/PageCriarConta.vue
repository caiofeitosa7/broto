<script>
    import axios from "axios";
    import Modal from './ModalMensagem.vue';

    export default {
        components: {
            Modal,
        },
        data() {
            return {
                showModal: false,
                titleModal: "",
                contentModal: "",
                senha: "",
                confirmacaoSenha: "",
                senhasIguais: false,
                usuarioExistente: false,
                formData: {
                    nome: "",
                    email: "",
                    logradouro: "",
                    bairro: "",
                    numero: "",
                    cpf: "",
                    sexo: "I",
                    telefone: "",
                    usuario: "",
                    senha: "",
                },
                apiUrl: "http://127.0.0.1:5000/add_usuario",
            };
        },
        methods: {
            verificarCamposObrigatorios(camposObrigatorios, formData) {
                console.log("Dados do formulário:", formData);
                return camposObrigatorios.every(campo => {
                    const valor = formData[campo]?.trim();
                    console.log(`Campo ${campo}:`, valor);
                    return valor !== "" && valor !== undefined && valor !== null;
                });
            },
            verificarSenhas() {
                this.senhasIguais = this.senha === this.confirmacaoSenha;
            },
            fecharModal() {
                this.showModal = false;
            },
            async verificarUsuarioExistente() {
                try {
                    const response = await axios.get('http://127.0.0.1:5000/verificar_usuario', {
                        params: { usuario: this.formData.usuario }
                    });
                    this.usuarioExistente = response.data.existe;
                } catch (error) {
                    console.error("Erro ao verificar o usuário:", error);
                }
            },
            async cadastrarUsuario(event) {
                event.preventDefault(); // Evita o recarregamento da página
                this.verificarSenhas();

                this.formData.senha = this.senha;

                if (!this.senhasIguais) {
                    this.titleModal = "Erro!";
                    this.contentModal = "As senhas não coincidem.";
                    this.showModal = true;
                    return;
                }

                let camposObrigatorios = ['nome', 'email', 'cpf', 'usuario', 'senha'];
                if (!this.verificarCamposObrigatorios(camposObrigatorios, this.formData)) {
                    this.titleModal = "Erro!";
                    this.contentModal = "Por favor, preencha todos os campos obrigatórios.";
                    this.showModal = true;
                    return;
                }

                const response = await axios.get('http://127.0.0.1:5000/verificar_usuario', {
                    params: { usuario: this.formData.usuario }
                });

                if (response.data.existe) {
                    this.titleModal = "Erro!";
                    this.contentModal = "Este usuário já está em uso.";
                    this.showModal = true;
                    return;
                }

                try {
                    this.formData.senha = this.senha;
                    const response = await axios.post(this.apiUrl, this.formData);

                    console.log(response.data);

                    this.titleModal = "Sucesso!";
                    this.contentModal = "Cadastro realizado com sucesso.";
                    this.showModal = true;
                } catch (error) {
                    this.titleModal = "Erro!";
                    this.contentModal =
                    error.response?.data?.message || "Ocorreu um erro ao enviar os dados.";
                    this.showModal = true;
                }
            },
        },
        watch: {
            senha: "verificarSenhas",
            confirmacaoSenha: "verificarSenhas",
        },
    };
</script>
<template>
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
                Cadastro
            </p>
            <p class="has-text-centered is-size-7">
                Preencha as informações solicitadas
            </p>
            <p class="has-text-centered is-size-7">
                * Campos obrigatórios
            </p>
            <form class="pt-5">
                <div class="columns">
                    <div class="column">
                        <label for="nome">
                            Nome*
                        </label>
                        <input id="nome" name="nome" class="mt-1" v-model="formData.nome">
                    </div>
                    <div class="column">
                        <label for="email">
                            Email*
                        </label>
                        <input id="email" name="email" class="mt-1" v-model="formData.email">
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-5">
                        <label for="logradouro">
                            Logradouro
                        </label>
                        <input id="logradouro" name="logradouro" class="mt-1" v-model="formData.logradouro">
                    </div>
                    <div class="column is-5">
                        <label for="bairro">
                            Bairro
                        </label>
                        <input id="bairro" name="bairro" class="mt-1" v-model="formData.bairro">
                    </div>
                    <div class="column is-2">
                        <label for="numero">
                            Número
                        </label>
                        <input id="numero" name="numero" class="mt-1" type="number" v-model="formData.numero">
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-5">
                        <label for="cpf">
                            CPF*
                        </label>
                        <input id="cpf" name="cpf" class="mt-1" v-model="formData.cpf">
                    </div>
                    <div class="column is-display-flex is-flex-direction-column is-4">
                        <label for="sexo">
                            Sexo
                        </label>
                        <div class="select mt-1">
                            <select v-model="formData.sexo" id="sexo">
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
                        <input id="telefone" name="telefone" class="mt-1" v-model="formData.telefone">
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-3">
                        <label for="usuario">
                            Usuário*
                        </label>
                        <input id="usuario" name="usuario" class="mt-1"
                            v-model="formData.usuario" @blur="verificarUsuarioExistente"
                        >
                        <p v-if="usuarioExistente" class="help is-danger">Este usuário já existe.</p>
                    </div>
                    <div class="column is-3">
                        <label for="senha">
                            Senha*
                        </label>
                        <input id="senha" name="senha" type="password" class="mt-1" v-model="senha">
                    </div>
                    <div class="column is-3">
                        <label for="comfirmacao-senha">
                            Confirmar Senha
                        </label>
                        <input 
                            id="confirmacao-senha" 
                            name="confirmacao-senha" 
                            type="password" 
                            class="mt-1"
                            v-model="confirmacaoSenha"
                        >
                    </div>
                </div>
                <div class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center my-6">
                    <button class="btn-cor-principal py-2" @click="cadastrarUsuario">
                        Cadastrar
                    </button>
                    <router-link to="/entrar" class="is-size-7 mb-2 p-2 mt-3">
                        Já tenho uma conta
                    </router-link>
                </div>
            </form>
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

        /* #nome:-internal-autofill-selected {
            background-color: #fff !important;
            color: var(--cor-principal) !important;
            -webkit-text-fill-color: var(--cor-principal) !important;
        } */
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