<script setup>
</script>

<template>
    <nav class="container is-flex is-justify-content-space-between is-align-items-center px-3 py-2">
        <div class="logo">
            <div></div>
        </div>
        <div class="px-5 container-pesquisar">
            <div class="campo-input px-4 py-2">
                <input id="pesquisa" placeholder="Qual planta deseja?">
                <i class="bi bi-search is-clickable"></i>
            </div>
        </div>
        <div class="is-flex is-align-items-center">
            <router-link class="is-size-7 mr-4" to="/entrar">
                Login
            </router-link>
            <!-- <div class="is-clickable is-size-5 mr-4">
                <i class="bi bi-chat-text"></i>
            </div> -->
            <div class="is-clickable is-size-5 mr-4">
                <i class="bi bi-heart"></i>
            </div>
            <router-link class="is-size-4" to="/">
                <i class="bi bi-person-fill"></i>
            </router-link>
        </div>
    </nav>
    <div>
        <div class="banner">
            <h2 class="has-text-white is-size-4 px-3">
                DOE MUDAS, SEMEIE O FUTURO.
            </h2>
        </div>
        <ul class="nav-especies is-flex is-justify-content-center is-align-items-center py-4 px-2">
            <div class="container is-flex is-justify-content-space-between is-align-items-center px-3">
                <i class="bi bi-chevron-left is-size-5 is-clickable px-2"></i>
                <li>PALMEIRAS</li>
                <li>FRUTÍFERAS</li>
                <li>HERBÁCEAS</li>
                <li>ARBUSTOS</li>
                <li>BAMBUS</li>
                <!-- <li>ORNAMENTAIS</li>
                <li>TREPADEIRAS</li>
                <li>FLORES</li>
                <li>TEMPEROS</li>
                <li>SUCULENTAS</li> -->
                <i class="bi bi-chevron-right is-size-5 is-clickable px-2"></i>
            </div>
        </ul>
    </div>
</template>

<style scoped>
    .logo div:first-child {
        border-radius: 50%;
        height: 35px;
        width: 35px;
    }

    .logo div:first-child {
        background-color: var(--cor-principal);
    }

    .container-pesquisar {
        width: 70%;
    }

    .campo-input {
        display: flex;
        align-items: center;
        border-radius: 20px;
        border: 1px solid var(--preto);

        input {
            width: -webkit-fill-available;
            font-weight: 600;
            border: none;

            &:focus {
                outline: none;
            }
        }
    }

    .banner {
        background-image: url('@/assets/images/banner_inicio2.jpg');
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 180px;

        h2 {
            font-family: "Aboreto", system-ui;
            line-height: normal;
        }
    }

    .nav-especies {
        background-color: #f3f3f3;
        /* font-family: "Noto Serif"; */
/* 
        div {
            wid
        } */

        li {
            border-bottom: 3px solid #81b5b0;
            padding-bottom: 3px;
            font-weight: 500;
            cursor: pointer;
        }
    }

</style>