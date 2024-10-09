<script setup>
    import { ref, watch } from 'vue';
    import Modal from './ModalMensagem.vue';
    import PageEntrar from './PageEntrar.vue';

    const senha = ref('');
    const confirmacaoSenha = ref('');
    const senhasIguais = ref(true);

    const showModal = ref(false);
    const titleModal = ref('Erro de Confirmação de Senha');
    const contentModal = ref('As senhas inseridas não são iguais.');

    watch(confirmacaoSenha, (newVal) => {
        console.log("entrou aqui")


        if (newVal.length === senha.value.length) {
            senhasIguais.value = senha.value === newVal;

            if (!senhasIguais.value) {
                showModal.value = true;
                console.log("senha diferente")
            }
        }
    });

    // const abrirModal = () => {
    //     titleModal.value = 'Erro';
    //     contentModal.value = 'Você digitou duas senhas diferentes';
    //     showModal.value = true;
    // };

    const fecharModal = () => {
        showModal.value = false;
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
            <form action="" method="post" class="pt-5">
                <div class="columns">
                    <div class="column">
                        <label for="nome">
                            Nome
                        </label>
                        <input id="nome" name="nome" class="mt-1">
                    </div>
                    <div class="column">
                        <label for="email">
                            Email
                        </label>
                        <input id="email" name="email" class="mt-1">
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-5">
                        <label for="logradouro">
                            Logradouro
                        </label>
                        <input id="logradouro" name="logradouro" class="mt-1">
                    </div>
                    <div class="column is-5">
                        <label for="bairro">
                            Bairro
                        </label>
                        <input id="bairro" name="bairro" class="mt-1">
                    </div>
                    <div class="column is-2">
                        <label for="numero">
                            Número
                        </label>
                        <input id="numero" name="numero" class="mt-1" type="number" min="0">
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-5">
                        <label for="cpf">
                            CPF
                        </label>
                        <input id="cpf" name="cpf" class="mt-1">
                    </div>
                    <div class="column is-display-flex is-flex-direction-column is-4">
                        <label for="sexo">
                            Sexo
                        </label>
                        <div class="select mt-1">
                            <select>
                                <option>Ignorado</option>
                                <option>Masculino</option>
                                <option>Feminino</option>
                            </select>
                        </div>
                    </div>
                    <div class="column is-3">
                        <label for="telefone">
                            Telefone
                        </label>
                        <input id="telefone" name="telefone" class="mt-1">
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-3">
                        <label for="usuario">
                            Usuário
                        </label>
                        <input id="usuario" name="usuario" class="mt-1">
                    </div>
                    <div class="column is-3">
                        <label for="senha">
                            Senha
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
                    <button class="btn-cor-principal py-2" type="submit" :disabled="!senhasIguais">
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