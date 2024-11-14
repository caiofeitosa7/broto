<script setup>
</script>

<template>
    <div class="container is-flex is-flex-direction-column is-justify-content-space-between">
        <nav class="is-flex is-justify-content-space-between">
            <div class="container-logo background-gradiente-verde is-flex is-align-items-center px-6 is-size-4">
                <h1 class="has-text-white">BROTO</h1>
            </div>
            <div class="is-flex is-align-items-center pr-4">
                <router-link to="/criar-conta" class="btn-criar-conta py-2 px-3 mr-4">
                    Criar Conta
                </router-link>
                <router-link to="/entrar" class="background-gradiente-verde btn-entrar has-text-white p-3">
                    Entrar
                </router-link>
            </div>
        </nav>
        <div class="columns">
            <div id="conteudo" class="column is-3">
                <div class="columns">
                    <div class="column">
                        <img src="@/assets/images/vaso.jpg">
                    </div>
                    <div class="column">
                        <h2>Encontre plantas<br>para sua casa</h2>
                        <p>
                            Troque mudas de plantas com pessoas próximas, promovendo a sustentabilidade e a conexão com a natureza.
                        </p>
                    </div>
                </div>
            </div>
            <div class="column is-9 fundo-verde background-gradiente-verde pb-5">
                <button class="py-1">Ver plantas</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .container {
        max-height: 100vh;
        max-width: 100vw;

        nav {
            height: 60px;
        }

        .btn-entrar {
            border-radius: 7px;
        }

        .btn-entrar:hover {
            background-color: #2e615e !important;
        }

        .btn-criar-conta {
            border: 2px solid #1F3F3E;
            font-weight: 500;
        }

        .background-gradiente-verde {
            background: linear-gradient(to right, #1F3F3E, #14272A);
        }

        .container-logo {
            font-family: "Pridi", serif;
        }

        h2 {
            font-size: large;
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

        .fundo-verde {
            height: 91.9vh;
        }

        button {
            border: 2px solid #fff;
            border-radius: 7px;
            color: #fff;
            width: 140px;

            &:hover {
                background-color: rgba(255, 255, 255, .1);
            }
        }

        #conteudo {
            padding-left: 6vw;
            color: #fff;
            z-index: 2;
        }

        img {
            min-width: 450px;
        }
    }

    @media screen and (min-width: 1024px) {
        .container {
            max-width: 100%;
        }

        h2, p {
            min-width: 500px;
        }
    }

    @media screen and (min-width: 1216px) {
        .container {
            max-width: 100% !important;
        }

        #conteudo {
            padding-left: 7.5vw !important;
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