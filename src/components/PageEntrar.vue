<script setup>
    import { ref } from 'vue';

    const isPasswordVisible = ref(false);
    const togglePasswordVisibility = () => {
        isPasswordVisible.value = !isPasswordVisible.value;
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
        <div id="container-form" class="is-flex is-flex-direction-column is-align-items-center">
            <form action="" method="post">
                <p class="has-text-centered pb-1">
                    Bem Vindo!
                </p>
                <p class="has-text-centered is-size-7">
                    Insira suas informações de login
                </p>
                <div class="campo-input px-3 py-2 mb-4 mt-6">
                    <label for="usuario"><i class="bi bi-person-fill"></i></label>
                    <input id="usuario" name="usuario">
                </div>
                <div class="campo-input px-3 py-2">
                    <label for="senha"><i class="bi bi-lock-fill"></i></label>
                    <input id="senha" name="senha" :type="isPasswordVisible ? 'text' : 'password'">
                    <div @click="togglePasswordVisibility" class="is-clickable ml-2">
                        <i :class="isPasswordVisible ? 'bi bi-eye-fill m-0' : 'bi bi-eye-slash-fill m-0'"></i>
                    </div>
                </div>
                <p class="has-text-weight-medium has-text-right is-clickable is-size-7 pt-1">
                    Esqueci a senha*
                </p>
                <button class="btn-cor-principal mt-6 py-2" type="submit">
                    Entrar
                </button>
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
                width: -webkit-fill-available;
                color: var(--cor-principal);
                font-weight: 600;
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