<script>
    import ModalMensagem from '../components/ModalMensagem.vue'
    import Menu from '../components/MenuSuperior.vue'
    import RodaPe from '../components/RodaPe.vue'
    import { useAuthStore } from "@/stores/auth";
    import axios from "axios";

    export default {
        components: {
            ModalMensagem,
            Menu,
            RodaPe
        },
        setup() {
            const authStore = useAuthStore();
            return { authStore };
        },
        data() {
            return {
                urlBuscarPlanta: 'http://127.0.0.1:5000/buscar_planta',
                urlAbrirConversa: 'http://127.0.0.1:5000/publicacao/contactar',
                urlCarregarPublicacoes: 'http://127.0.0.1:5000/publicacoes_usuario',
                urlAddFavorito: 'http://127.0.0.1:5000/favoritos/adicionar',
                urlRemoveFavorito: 'http://127.0.0.1:5000/favoritos/remover',
                urlApagarPublicacao: 'http://localhost:5000/publicacao/apagar',
                urlCategorias: 'http://localhost:5000/categorias',
                urlGetUsuario: 'http://localhost:5000/get_usuario',
                atualizacaoPublicacao: false,
                showModal: false,
                tituloModal: "",
                conteudoModal: "",
                itemsPerPage: 0,
                currentIndex: 0,
                showModalVerPublicacao: false,
                publicacaoClicada: {},
                plantaBuscada: {},
                mensagemErro: "",
                nomePlantaProcurar: "",
                mostrarSelectPlanta: false,
                publicacoes: [],
                usuario: {},
            };
        },
        computed: {
            gruposDePlantas() {
                return this.publicacoes.reduce((acc, publicacao, index) => {
                    const grupoIndex = Math.floor(index / 4);
                    if (!acc[grupoIndex]) acc[grupoIndex] = [];
                    acc[grupoIndex].push(publicacao);
                    return acc;
                }, []);
            }
        },
        methods: {
            closeModal() {
                this.showModalVerPublicacao = false;
                this.showModal = false;
            },
            abrirConversa(id) {
                let usuario_id = this.authStore.cod_usuario;

                axios.post(this.urlAbrirConversa, {
                    usuario_id: usuario_id,
                    publicacao_id: id
                }).then((res) => {
                    const conversaId = res.data.conversa_id;

                    if (conversaId) {
                        this.$router.push({ path: '/chat', query: { conversa: conversaId } });
                    }
                }).catch((error) => {
                    console.error("Erro ao abrir conversa.");
                });
            },
            async carregarPublicacoes() {
                try {
                    let usuario_id = this.$route.query.usuario_id;
                    const response_publicacoes = await axios.get(this.urlCarregarPublicacoes + '/' + usuario_id);
                    this.publicacoes = response_publicacoes.data;
                    
                    const elemento_h2 = document.querySelector('.banner h2');
                    if (this.publicacoes.length > 0)
                        elemento_h2.innerHTML = `Publicações de ${this.publicacoes[0].usuario.nome.split(' ')[0]}`;
                    else
                        elemento_h2.innerHTML = `Nenhuma publicação encontrada`;
                    
                } catch (error) {
                    console.error("Erro ao carregar plantas!");
                } finally {
                    this.carregando = false;
                }
            },
            async openModalVerPublicacao(id, nomeDono, planta_id, nomeComum, nomeCientifico, local, quantidade, foto, numero) {
                this.showModalVerPublicacao = true;
                this.publicacaoClicada = {
                    'id': id,
                    'nomeDono': nomeDono,
                    'planta_id': planta_id,
                    'nomeComum': nomeComum,
                    'nomeCientifico': nomeCientifico,
                    'quantidade': quantidade,
                    'contato': numero,
                    'local': local,
                    'foto': foto,
                }
            },
            async toggleFavorito(event, id) {
                const icon = event.target;
                let url = '';

                if (icon.classList.contains('bi-heart')) {
                    icon.classList.replace('bi-heart', 'bi-heart-fill');
                    url = this.urlAddFavorito;
                } else {
                    icon.classList.replace('bi-heart-fill', 'bi-heart');
                    url = this.urlRemoveFavorito;
                }

                try {
                    const response = await axios.post(url, {
                        usuario_id: this.authStore.cod_usuario,
                        publicacao_id: id
                    });
                } catch (error) {
                    console.error('Erro ao favoritar');
                }
            },
        },
        mounted() {
            this.carregarPublicacoes();
            window.addEventListener("resize", this.updateItemsPerPage);
        },
        beforeUnmount() {
            window.removeEventListener("resize", this.updateItemsPerPage);
        },
    };
</script>

<template>
    <!-- Modal de Visualizar Publicacao -->
    <div v-if="showModalVerPublicacao" class="modal is-active">
        <div class="modal-background" @click="closeModal"></div>
        <div class="modal-content is-flex is-justify-content-center px-5">
            <div class="box">
                <div class="is-flex is-flex-direction-column is-justify-align-items-center">
                    <img class="imagem-planta" :src=publicacaoClicada.foto alt="foto da planta">
                    <p class="has-text-centered has-text-weight-medium is-size-6 pt-3">
                        {{ publicacaoClicada.nomeComum || 'Carregando...' }}
                    </p>
                    <p class="has-text-centered is-size-7 pt-1 pb-3">
                        {{ publicacaoClicada.nomeCientifico }}
                    </p>
                </div>
                <p>
                    <strong>Dono(a):</strong> {{ publicacaoClicada.nomeDono }}
                </p>
                <p class="py-2">
                    <strong>Localidade:</strong> {{ publicacaoClicada.local }}
                </p>
                <p>
                    <strong>Quantidade:</strong> {{ publicacaoClicada.quantidade }}
                </p>
                <a @click="abrirConversa(this.publicacaoClicada.id)">
                    <div class="btn-conversar is-flex is-justify-content-center mt-5 py-3">
                        Conversar
                    </div>
                </a>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
    </div>

    <ModalMensagem :showModal="showModal" :titleModal="tituloModal" :contentModal="conteudoModal" @close="closeModal"/>

    <Menu :exibirPesquisa="false" />

    <div class="banner">
        <h2 class="has-text-white is-size-4 px-3"></h2>
    </div>
    <div class="container container-publicacoes mt-3 pb-6">
        <div v-for="(grupo, index) in gruposDePlantas" :key="index" class="columns is-4">
            <div 
                v-for="(publicacao, i) in grupo" :key="i" 
                class="card-planta column is-3 is-flex is-flex-direction-column is-align-items-center is-clickable"
                @click="openModalVerPublicacao(
                    publicacao.id,
                    publicacao.usuario.nome.split(' ')[0],
                    publicacao.planta.id,
                    publicacao.planta.nome_popular,
                    publicacao.planta.nome_cientifico,
                    publicacao.usuario.bairro,
                    publicacao.quantidade,
                    publicacao.foto.imagem_base64,
                    publicacao.usuario.numero
                )"
            >
                <img :src=publicacao.foto.imagem_base64 class="foto-publicacao" alt="foto da planta">
                <div class="is-flex is-justify-content-space-between pt-3 px-2">
                    <div class="is-flex is-flex-direction-column">
                        <span class="nome-comum is-size-6 has-text-weight-bold">
                            {{ publicacao.planta.nome_popular }}
                        </span>
                        <span class="nome-cientifico">
                            {{ publicacao.planta.nome_cientifico }}
                        </span>
                    </div>
                    <i 
                        :class="['bi', 'bi-heart', 'is-size-5', 'is-clickable']" 
                        @click.stop="toggleFavorito($event, publicacao.id)"
                    ></i>
                    
                    <!-- <i 
                        :class="['bi', publicacao.favorita ? 'bi-heart-fill' : 'bi-heart', 'is-size-5', 'is-clickable']" 
                        @click.stop="toggleFavorito(publicacao.id)"
                    ></i> -->
                    <!-- <i 
                        :class="['bi', this.authStore.favoritos.includes(publicacao.id) ? 'bi-heart-fill' : 'bi-heart', 'is-size-5', 'is-clickable']" 
                        @click.stop="toggleFavorito(publicacao)"
                    ></i> -->
                </div>
                <span class="local mt-4 px-4 py-2">
                    {{ publicacao.usuario.bairro }}
                </span>
            </div>
        </div>
    </div>
    
    <RodaPe />

</template>

<style scoped>
    .container-publicacoes {
        min-height: 75vh;
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

    .container-categorias {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        width: 100%;
        gap: 10px;
    }

    .nav-especies {
        background-color: #f3f3f3;
        display: flex;
        justify-content: center;
        align-items: center;
        
        li {
            border-bottom: 3px solid #81b5b0;
            list-style: none;
            text-align: center;
            padding-bottom: 3px;
            font-weight: 500;
            cursor: pointer;
        }
    }

    .card-planta {
        line-height: normal;
        
        div {
            width: 100%;
        }

        div i {
            color: var(--verde-secundario);
        }

        .nome-cientifico {
            font-size: smaller;
        }
    }

    .btn-conversar, .btn-cadastrar, .card-planta .local {
        background-color: var(--verde-secundario);
        text-align: center;
        border-radius: 7px;
        font-size: smaller;
        min-width: 65%;
        color: #fff;
        cursor: pointer;
    }
    
    .box {
        background-color: #fff;
        max-width: 310px;
    }

    .box strong, .box p {
        color: var(--preto);
    }

    .modal-content {
        width: fit-content;
    }

    .container-foto div {
        background-color: var(--verde-claro);
        color: var(--cor-principal);
        height: 270px;
        width: 270px;
    }

    .label-imagem {
        color: var(--cor-principal);
        position: relative;
        top: -21px;
        left: 6px;
    }

    .btn-nome-planta {
        border: 1px solid var(--verde-secundario);
        color: var(--verde-secundario);
        padding: 5px 10px;
        margin-left: 10px;
        cursor: pointer;
    }

    #quatidade-mudas {
        border: 1px solid var(--verde-secundario);
        border-radius: 5px;
        padding: 5px 10px;
        font-size: 13px;
        width: 100px;

        &:focus {
            border: 1px solid var(--verde-secundario);
            outline: none;
        }
    }

    #modalProcurarPlanta .box {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 470px;
        width: 400px;
    }

    .imagem-planta {
        min-width: 270px;
        max-width: 270px;
        min-height: 270px;
        max-height: 270px;
    }

    .campo-pesquisa {
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

    .select {
        width: -webkit-fill-available;

        select {
            width: 100%;

            &:focus {
                outline: none;
                border: none;
            }
        }

        select::-webkit-scrollbar {
            width: 7px;
        }

        select::-webkit-scrollbar-thumb {
            background-color: hsla(171deg, 100%, 41%,1); /* cor do botão de rolagem */
            border-radius: 13px;
        }
    }

    .floating-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* Botão de deletar no canto superior direito */
    .delete-button {
        position: absolute;
        top: 20px;
        right: 20px;
        background-color: red;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: 0.3s;
    }

    .delete-button:hover {
        background-color: rgb(160, 6, 6);
    }

    .relative {
        position: relative;
    }

    /* Estilização do modal de confirmação */
    #modal-confirmacao .modal-content {
        text-align: center;
        line-height: 1.3;
        padding: 20px;
    }

    @media screen and (max-width: 768px) {
        .nav-especies li {
            font-size: small;
        }

        .card-planta {
            max-width: 330px;
        }

        .columns {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }

    @media screen and (max-width: 500px) {
        .banner h2 {
            font-size: medium !important;
        }
    }
</style>