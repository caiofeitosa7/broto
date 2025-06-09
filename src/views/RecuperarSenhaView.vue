<script>
    import Modal from '../components/ModalMensagem.vue'
    import axios from "axios";

    export default {
        components: {
            Modal,
        },
        data() {
            return {
                urlVerificarUsuario: 'http://localhost:5000/usuario/buscar',
                urlNovaSenha: 'http://localhost:5000/usuario/nova_senha',
                showModal: false,
                titleModal: "",
                contentModal: "",
                bloco_senha: false,
                confirmar_senha: '',
                nova_senha: '',
                usuario_id: 0,
                nome: '',
                erro: '',
                cpf: ''
            }
        },
        methods: {
            async validarUsuario() {
                let dados = {
                    nome: this.nome,
                    cpf: this.cpf,
                }

                if (!dados.nome || !dados.cpf)
                    this.erro = 'Preencha todos os campos';
                else if (dados.cpf.length != 11)
                    this.erro = 'CPF inválido';
                else {
                    try {
                        const response = await axios.post(this.urlVerificarUsuario, dados);
                        this.usuario_id = response.data.usuario_id;
                        this.bloco_senha = true;
                    } catch (error) {
                        this.erro = error.response?.data?.message || "Erro ao validar usuário";
                    }
                }
            },
            validarSenha() {
                if (!this.nova_senha || !this.confirmar_senha)
                    this.erro = 'Preencha todos os campos';
                else if (this.nova_senha.length < 8)
                    this.erro = 'A senha deve ter no mínimo 8 caracteres';
                else if (this.nova_senha != this.confirmar_senha)
                    this.erro = 'As senhas não conferem';
                else if (!/[A-Za-z]/.test(this.nova_senha) || !/[0-9]/.test(this.nova_senha) || !/[!@#$%^&*(),.?":{}|<>]/.test(this.nova_senha))
                    this.erro = 'A senha deve conter letras, números e caracteres especiais';
                else
                    this.recuperarSenha();
            },
            recuperarSenha() {                
                this.modal_confirmacao = true;

                try {
                    const response = axios.post(this.urlNovaSenha, {
                        usuario_id: this.usuario_id,
                        senha: this.nova_senha
                    });
                    this.showModal = true;
                    this.titleModal = "Senha alterada";
                    this.contentModal = "Sua senha foi alterada com sucesso!";

                    console.log(response, 'deu certo');

                } catch (error) {
                    this.showModal = true;
                    this.titleModal = "Erro";
                    this.contentModal = "Ocorreu um erro ao alterar a senha. Tente novamente.";

                    console.log('deu errado');
                    
                }

            },
            fecharBlocoSenha() {
                this.bloco_senha = false;
                this.confirmar_senha = '';
                this.nova_senha = '';
                this.erro = '';
                this.nome = '';
                this.cpf = '';
            },
            fecharModal() {
                this.showModal = false;
            },
        }
    }
</script>

<template>
    <div class="container-recuperacao">

        <Modal
            :showModal="showModal"
            :titleModal="titleModal"
            :contentModal="contentModal"
            @close="fecharModal"
        />

        <form v-if="!bloco_senha" @submit.prevent="validarUsuario">
            <div class="is-flex is-justify-content-center">
                <a class="logo" href="/">
                    <img class="image" src="@/assets/images/broto-1.3.png" alt="Logo do Broto" width="50px" height="50px"/>
                </a>
            </div>
            <p class="has-text-weight-medium has-text-centered is-size-7 mt-2 mb-5">
                Para validar o link de acesso e recuperar sua senha, confirme os dados.
            </p>
            <div class="field">
                <label class="mr-2">Nome Completo</label>
                <div class="control mt-2">
                    <input v-model="nome" class="input" placeholder="Informe o nome completo">
                </div>
            </div>
            <div class="field pt-2">
                <div class="is-flex">
                    <label class="mr-2">CPF</label>
                    <span class="is-size-7">(somente números)</span>
                </div>
                <div class="control mt-2">
                    <input v-model="cpf" class="input" placeholder="Informe o CPF">
                </div>
            </div>
            <div class="field control pt-3">
                <button class="button is-primary is-fullwidth" type="submit">
                    Próximo
                </button>
                <div class="is-flex is-justify-content-center mt-1">
                    <span v-if="this.erro" class="help is-danger">
                        {{ this.erro }}
                    </span>
                </div>
            </div>
        </form>

        <form v-if="bloco_senha" @submit.prevent="validarSenha">
            <div class="is-flex is-justify-content-center">
                <a class="logo" href="/">
                    <img class="image" src="@/assets/images/broto-1.3.png" alt="Logo do Broto" width="50px" height="50px"/>
                </a>
            </div>
            <p class="has-text-weight-medium has-text-centered is-size-7 mt-2 mb-5">
                Crie uma nova senha. Utilize letras, números e caracteres especiais.
            </p>
            <div class="field">
                <div class="is-flex">
                    <label class="mr-2">Senha</label>
                    <span class="is-size-7">(pelo menos 8 caracteres)</span>
                </div>
                <div class="control mt-2">
                    <input v-model="nova_senha" class="input" placeholder="Informe a senha">
                </div>
            </div>
            <div class="field pt-2">
                <label class="mr-2">Confirmar senha</label>
                <div class="control mt-2">
                    <input v-model="confirmar_senha" class="input" placeholder="Confirme a senha">
                </div>
            </div>
            <div class="field control pt-3">
                <button class="button is-primary is-fullwidth" type="submit">
                    Enviar
                </button>
                <div class="is-flex is-justify-content-center mt-1">
                    <span v-if="this.erro" class="help is-danger">
                        {{ this.erro }}
                    </span>
                </div>

                <div class="is-display-flex is-justify-content-center">
                    <a href="/">Ir para o login</a>
                </div>
            </div>
        </form>

    </div>
</template>

<style scoped>
    .container-recuperacao {
        background-image: url('@/assets/images/banner_inicio.jpg');
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        height: 100vh;
        width: 100vw;
    }

    form {
        background-color: rgba(0, 0, 0, .65);
        border-radius: 10px;
        max-width: 600px;
        padding: 20px;
        width: 50%;
    }

    form a {
        color: rgb(202, 202, 198);
        text-align: center;
        font-size: smaller;
        margin-top: 10px;
        cursor: pointer;
        padding: 5px;
    }

    @media screen and (max-width: 750px) {
        form {
            width: 75%;
        }
    }


    @media screen and (max-width: 400px) {
        form {
            width: 90%;
        }
    }
</style>