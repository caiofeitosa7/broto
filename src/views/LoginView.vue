<script setup>
</script>

<template>
    <div class="container is-flex is-flex-direction-column is-justify-content-space-between has-text-white p-6 pr-4">
        <div class="is-flex is-justify-content-flex-end has-text-right">
            <h2 class="is-size-2">
                DOE MUDAS, <br>SEMEIE O FUTURO.
            </h2>
        </div>
        <div id="opcoes" class="is-flex is-flex-direction-column is-align-items-center">
            <div id="opcoes" class="is-flex is-flex-direction-column is-align-items-center">
                <router-link to="/entrar" class="mb-2 py-3 px-6">Entrar</router-link>
                <router-link to="/criar-conta" class="py-3 px-5">Criar Conta</router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .container {
        background-image: url('@/assets/images/banner_inicio.jpg');
        min-height: 100vh;
        min-width: 100vw;

        h2 {
            line-height: normal;
            font-family: "Aboreto", system-ui;
        }

        a:first-child {
            background-color: rgba(255, 255, 255, .2);
            border-radius: 7px;

            &:hover {
                background-color: rgba(255, 255, 255, .35);
            }
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