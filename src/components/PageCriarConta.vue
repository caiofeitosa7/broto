<script>
    import axios from "axios";
    import { useRouter } from "vue-router";
    import Modal from './ModalMensagem.vue';

    export default {
        setup() {
            const router = useRouter();
            return { router };
        },
        components: {
            Modal,
        },
        data() {
            return {
                urlAddUsuario: "http://127.0.0.1:5000/add_usuario",
                urlVerificarUsuario: 'http://127.0.0.1:5000/verificar_usuario',
                urlGetCidadesPermitidas: "http://127.0.0.1:5000/cidades_permitidas",
                faixa_ceps_aceitos: [],
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
                    aceitaTermos: false,
                },
            };
        },
        methods: {
            verificarCamposObrigatorios(camposObrigatorios, formData) {
                return camposObrigatorios.every(campo => {
                    const valor = formData[campo]?.trim();
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
                    const response = await axios.get(this.urlVerificarUsuario, {
                        params: { usuario: this.formData.usuario }
                    });
                    this.usuarioExistente = response.data.existe;
                } catch (error) {
                    console.error("Erro ao verificar o usuário");
                }
            },
            async cadastrarUsuario(event) {
                event.preventDefault();
                this.verificarSenhas();
                this.formData.senha = this.senha;

                const cepVerificacao = this.verificarCidadePermitida(this.formData.cep);
                if (!cepVerificacao.permitido) {
                    let cidades = this.faixa_ceps_aceitos.map(cep => cep[2]).join(", ");

                    this.titleModal = "Atenção!";
                    this.contentModal = "Desculpe, no momento só atendemos as cidades de " + cidades + ".";
                    this.showModal = true;
                    return;
                }

                if (this.formData.cidade && this.formData.cidade !== cepVerificacao.cidade) {
                    this.titleModal = "Atenção!";
                    this.contentModal = "A cidade informada não corresponde ao CEP fornecido.";
                    this.showModal = true;
                    return;
                }

                const response = await axios.get(this.urlVerificarUsuario, {
                    params: { usuario: this.formData.usuario }
                });

                if (response.data.existe) {
                    this.titleModal = "Atenção!";
                    this.contentModal = "Este usuário já está em uso.";
                    this.showModal = true;
                    return;
                }

                if (!this.senhasIguais) {
                    this.titleModal = "Atenção!";
                    this.contentModal = "As senhas não coincidem.";
                    this.showModal = true;
                    return;
                }

                let camposObrigatorios = ['nome', 'email', 'cpf', 'usuario', 'senha'];
                if (!this.verificarCamposObrigatorios(camposObrigatorios, this.formData)) {
                    this.titleModal = "Atenção!";
                    this.contentModal = "Por favor, preencha todos os campos obrigatórios.";
                    this.showModal = true;
                    return;
                }

                if (!this.formData.aceitaTermos) {
                    this.titleModal = "Atenção!";
                    this.contentModal = "É necesário aceitar os termos para continuar.";
                    this.showModal = true;
                    return;
                }

                try {
                    this.formData.senha = this.senha;
                    const response = await axios.post(this.urlAddUsuario, this.formData);

                    this.titleModal = "Sucesso!";
                    this.contentModal = "Cadastro realizado! Verifique seu email.";
                    this.showModal = true;

                    setTimeout(() => {
                        this.router.push({ name: "login" });
                    }, 3000);
                    
                } catch (error) {
                    this.titleModal = "Erro!";
                    this.contentModal = error.response?.data?.message || "Ocorreu um erro ao enviar os dados.";
                    this.showModal = true;
                }
            },
            async buscarCep() {
                const cepLimpo = this.formData.cep.replace(/\D/g, '');
                
                if (cepLimpo.length === 8 || (this.formData.cep.length === 9 && /^[0-9a-zA-Z]+$/.test(this.formData.cep))) {
                    try {
                        const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cepLimpo}`);
                        const data = response.data;
                        
                        this.formData.logradouro = data.street || '';
                        this.formData.bairro = data.neighborhood || '';
                        this.formData.cidade = data.city || '';
                        
                    } catch (error) {
                        console.error("Erro ao buscar CEP");
                        this.titleModal = "Erro!";
                        this.contentModal = "CEP não encontrado ou inválido.";
                        this.showModal = true;
                    }
                }
            },
            verificarCidadePermitida(cep) {
                const cepNum = parseInt(cep.replace(/\D/g, '').substring(0, 5));

                for (const [inicio, fim, cidade] of this.faixa_ceps_aceitos) {
                    if (cepNum >= inicio && cepNum <= fim) {
                        // console.log("cep permitido", cepNum >= inicio && cepNum <= fim);
                        return { permitido: true, cidade: cidade };
                    }
                }
                return { permitido: false, cidade: "Cidade não autorizada" };
            },
            async buscarCidadesPermitidas() {
                try {
                    const response = await axios.get(this.urlGetCidadesPermitidas);
                    this.faixa_ceps_aceitos = response.data;
                } catch (error) {
                    console.error("Erro ao buscar cidades permitidas");
                    this.faixa_ceps_aceitos = [];
                }
            },
        },
        mounted() {
            this.buscarCidadesPermitidas();
        },
        watch: {
            senha: "verificarSenhas",
            confirmacaoSenha: "verificarSenhas",

            'formData.cep': function(newVal) {
                if (newVal) {
                    this.buscarCep();
                }
            }
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
                    <div class="column is-5">
                        <label for="nome">
                            Nome*
                        </label>
                        <input id="nome" name="nome" class="mt-1" v-model="formData.nome">
                    </div>
                    <div class="column is-4">
                        <label for="email">
                            Email*
                        </label>
                        <input id="email" name="email" class="mt-1" v-model="formData.email">
                    </div>
                    <div class="column is-3">
                        <label for="cpf">
                            CPF*
                        </label>
                        <input id="cpf" name="cpf" class="mt-1" v-model="formData.cpf">
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-display-flex is-flex-direction-column is-3">
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
                    <div class="column is-2">
                        <label for="cep">
                            CEP
                        </label>
                        <input id="cep" name="cep" class="mt-1" v-model="formData.cep">
                    </div>
                    <div class="column is-4">
                        <label for="cidade">
                            Cidade
                        </label>
                        <input id="cidade" name="cidade" class="mt-1" v-model="formData.cidade">
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
                            Confirmar Senha*
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
                <div class="columns">
                    <div class="column">
                        <label class="checkbox">
                            <input type="checkbox" v-model="formData.aceitaTermos">
                            Li e aceito os <a href="/termo_compromisso" target="_blank" rel="noopener noreferer">termos de uso</a>.
                        </label>
                        <p v-if="!formData.aceitaTermos && formEnviado" class="help is-danger">
                            Você deve aceitar os termos para continuar.
                        </p>
                    </div>
                </div>
                <div class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center mt-6 mb-3">
                    <button class="btn-cor-principal py-3" @click="cadastrarUsuario">
                        Cadastrar
                    </button>
                    <router-link to="/login" class="is-size-7 mb-2 p-2 mt-3">
                        Já tenho uma conta
                    </router-link>
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
        position: relative;
        top: -40px;

        input {
            background-color: var(--verde-claro);
            width: -webkit-fill-available;
            color: var(--cor-principal);
            font-size: smaller !important;
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
            height: 32px;
        }

        .select:not(.is-multiple):not(.is-loading):after {
            border-color: var(--cor-principal) !important;
        }

        select {
            width: -webkit-fill-available;
            background-color: var(--verde-claro);
            color: var(--cor-principal);
            font-size: small !important;
            font-weight: 600;
            padding: 0 .7rem;
            border: none;

            &:focus {
                outline: none;
                border: none;
            }
        }

        label {
            color: var(--cor-principal);
            font-weight: 500;

            input {
                width: auto !important;
                margin-right: 5px;
            }

            a {
                color: #f8b12d;
                font-weight: 700;
            }
        }

        form {
            width: 80%;
        }

        button {
            width: 25%;
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