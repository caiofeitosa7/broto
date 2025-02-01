<script>
    // import ModalCadastrarPlanta from '../components/ModalCadastrarPlanta.vue'
    import ModalMensagem from '../components/ModalMensagem.vue'
    import Menu from '../components/menuSuperior.vue'
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
                urlCadastrarPublicacao: 'http://127.0.0.1:5000/registrar_publicacao',
                urlCarregarPublicacoes: 'http://127.0.0.1:5000/publicacoes_usuario',
                urlCategorias: 'http://localhost:5000/categorias',
                showModal: false,
                tituloModal: "",
                conteudoModal: "",
                categorias: [],
                visibleCategories: [],
                itemsPerPage: 0,
                currentIndex: 0,
                showModalCadastrarPublicacao: false,
                showModalVerPlanta: false,
                showModalProcurar: false,
                fotoCarregada: false,
                fotoPreview: null,
                plantaClicada: {},
                plantasEncontradas: [],
                idPlantaBuscada: null,
                plantaBuscada: {},
                mensagemErro: "",
                nomePlantaProcurar: "",
                mostrarSelectPlanta: false,
                publicacoes: [],
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
                this.showModalVerPlanta = false;
                this.showModal = false;
            },
            closeModalCadastrarPublicacao() {
                this.showModalCadastrarPublicacao = false;
                this.fotoCarregada = false;
                this.plantaBuscada = {};
            },
            openModalCadastrarPublicacao() {
                this.showModalCadastrarPublicacao = true;
            },
            abrirModalProcurar() {
                this.showModalProcurar = true;
            },
            closeModalProcurar() {
                this.showModalProcurar = false;
                // this.nomePlantaProcurar = "";
            },













            async carregarPublicacoes() {
                // try {
                    let usuario_id = this.authStore.cod_usuario;
                    console.log(this.urlCarregarPublicacoes + '/' + usuario_id);
                    const response = await axios.get(this.urlCarregarPublicacoes + '/' + usuario_id);
                    // this.publicacoes = [
                    //     { id: 1, nome_comum: "Jiboia", nome_cientifico: "Epipremnum pinnatum", local: "Lorival Parente", favorita: false, imagem: '@/assets/images/image_8.png' },
                    //     { id: 2, nome_comum: "Espada-de-São-Jorge", nome_cientifico: "Sansevieria trifasciata", local: "Centro", favorita: true, imagem: '@/assets/images/image_8.png' },
                    //     { id: 3, nome_comum: "Costela-de-Adão", nome_cientifico: "Monstera deliciosa", local: "Boa Vista", favorita: false, imagem: '@/assets/images/image_8.png' },
                    //     { id: 4, nome_comum: "Samambaia", nome_cientifico: "Nephrolepis exaltata", local: "Macaúba", favorita: false, imagem: '@/assets/images/image_8.png' },
                    //     { id: 5, nome_comum: "Ficus", nome_cientifico: "Ficus benjamina", local: "Centro", favorita: false, imagem: '@/assets/images/image_8.png' },
                    //     { id: 6, nome_comum: "Cacto", nome_cientifico: "Cactaceae", local: "Vermelha", favorita: true, imagem: '@/assets/images/image_8.png' },
                    // ];

                    console.log(response.data);

                    this.publicacoes = response.data;
                // } catch (error) {
                //     console.error("Erro ao carregar plantas:", error);
                // } finally {
                //     this.carregando = false;
                // }
            },
            confirmarPlanta() {
                if (!this.idPlantaBuscada) {
                    this.mensagemErro = 'Por favor, selecione uma planta.';
                    return;
                }

                const planta = this.plantasEncontradas.find(
                    (p) => p.id === this.idPlantaBuscada[0]
                );

                if (planta) {
                    this.plantaBuscada = {
                        id: planta.id,
                        nome_popular: planta.nome,
                        nome_cientifico: planta.nome_cientifico,
                    };

                    this.closeModalProcurar();
                } else {
                    console.error('Nenhuma planta foi selecionada.');
                    this.mensagemErro = 'Por favor, selecione uma planta.';
                }
            },
            async buscarPlantas() {
                if (this.nomePlantaProcurar.length < 3) {
                    this.mensagemErro = "Digite pelo menos 3 letras.";
                    return;
                }

                try {
                    const response = await axios.get(this.urlBuscarPlanta, {
                        params: { query: this.nomePlantaProcurar }
                    });

                    if (response.data.length) {
                        this.plantasEncontradas = response.data;
                        this.mensagemErro = "";
                    } else {
                        this.plantasEncontradas = [];
                        this.mensagemErro = "Nenhuma planta foi encontrada.";
                    }
                } catch (error) {
                    console.error("Erro ao buscar plantas:", error);
                    this.mensagemErro = "Erro ao buscar plantas. Tente novamente.";
                }
            },
            previewFile(event) {
                const file = event.target.files[0];

                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.fotoPreview = e.target.result;
                        this.fotoCarregada = true;
                    };
                    reader.readAsDataURL(file);
                }
            },
            abrirInputFoto() {
                document.getElementById("input-foto").click()
            },
            async cadastrarPublicacao() {
                let dados = {
                    usuario_id: this.authStore.cod_usuario,
                    planta_id: this.plantaBuscada.id,
                    imagem: document.getElementById('foto-preview').src,
                    quantidade: document.getElementById('quatidade-mudas').value
                }

                try {
                    const response = await axios.post(this.urlCadastrarPublicacao, dados, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    if (response.status === 200) {
                        this.closeModalCadastrarPublicacao();

                        this.tituloModal = "Sucesso";
                        this.conteudoModal = "Publicação cadastrada com sucesso!";
                        this.showModal = true;
                    } else {
                        this.tituloModal = "Erro";
                        this.conteudoModal = "Erro ao cadastrar publicação. Tente novamente.";
                        this.showModal = true;
                    }
                } catch (error) {
                    console.error("Erro ao cadastrar planta:", error);
                    this.tituloModal = "Erro";
                    this.conteudoModal = "Erro ao cadastrar publicação. Tente novamente.";
                    this.showModal = true;
                }
            },
            async openModalVerPublicacao(plantaId) {
                this.showModalVerPlanta = true;

                try {
                    // const response = await fetch(`https://api.example.com/plants/${plantaId}`);
                    // if (!response.ok) throw new Error("Erro ao buscar dados da planta");
                    // this.plantaClicada = await response.json();

                    this.plantaClicada = {
                        'nomeComum': 'Jiboia',
                        'nomeCientifico': 'Abc',
                        'local': 'Prefeitura',
                        'quantidade': 3
                    }

                } catch (error) {
                    console.error("Erro ao carregar dados:", error);
                    this.plantaClicada = { nomeComum: "Erro ao carregar dados" };
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
    <ModalMensagem :showModal="showModal" :titleModal="tituloModal" :contentModal="conteudoModal" @close="closeModal"/>

    <!-- Modal de Visualizar Planta -->
    <div v-if="showModalVerPlanta" class="modal is-active">
        <div class="modal-background" @click="closeModal"></div>
        <div class="modal-content is-flex is-justify-content-center px-5">
            <div class="box">
                <div class="is-flex is-flex-direction-column is-justify-align-items-center">
                    <img class="imagem-planta" src="@/assets/images/image_8.png" alt="foto da planta">
                    <p class="has-text-centered has-text-weight-medium is-size-4 pt-3">
                        {{ plantaClicada.nomeComum || 'Carregando...' }}
                    </p>
                    <p class="has-text-centered is-size-7 pt-1 pb-3">
                        {{ plantaClicada.nomeCientifico }}
                    </p>
                </div>
                <p>
                    <strong>Dono(a):</strong> {{ plantaClicada.nomeCientifico }}
                </p>
                <p class="py-2">
                    <strong>Localidade:</strong> {{ plantaClicada.local }}
                </p>
                <p>
                    <strong>Quantidade:</strong> {{ plantaClicada.quantidade }}
                </p>
                <div class="btn-conversar is-flex is-justify-content-center mt-5 py-3">
                    Conversar
                </div>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
    </div>

    <!-- Modal de Cadastrar Planta -->
    <div v-if="showModalCadastrarPublicacao" class="modal is-active">
        <div class="modal-background" @click="closeModalCadastrarPublicacao"></div>
        <div class="modal-content is-flex is-justify-content-center px-5">
            <div class="box">
                <div class="is-flex is-flex-direction-column is-justify-align-items-center">
                    <div class="container-foto is-clickable" @click="abrirInputFoto()">

                        <!-- Slot-foto: Aparece apenas se não houver uma imagem carregada -->
                        <div
                            id="slot-foto" 
                            v-if="!fotoCarregada"
                            class="is-flex is-justify-content-center is-align-items-center"
                        >
                            <i class="bi bi-image-fill"></i>
                        </div>

                        <!-- Foto-preview: Aparece apenas se uma imagem for carregada -->
                        <img
                            v-if="fotoCarregada"
                            id="foto-preview"
                            :src="fotoPreview"
                            class="imagem-planta is-clickable"
                            alt="Pré-visualização da foto"
                        />

                        <!-- Input de arquivo -->
                        <input
                            id="input-foto"
                            type="file"
                            accept="image/*"
                            @change="previewFile"
                            hidden
                        />

                        <span class="label-imagem is-size-7">
                            click para adicionar uma foto
                        </span>
                    </div>
                </div>
                <div v-if="this.plantaBuscada" class="is-flex is-flex-direction-column">
                    <span class="has-text-centered has-text-weight-bold is-size-6">
                        {{ plantaBuscada.nome_popular }}
                    </span>
                    <span class="has-text-centered is-size-7 pt-1 pb-3">
                        {{ plantaBuscada.nome_cientifico }}
                    </span>
                </div>
                <div class="is-flex is-justify-content-space-between is-align-items-center pb-1">
                    <label for="nome-planta" class="text-nowrap">
                        Nome da planta:
                    </label>
                    <button class="btn btn-nome-planta is-size-7" @click="abrirModalProcurar">
                        <span>Procurar</span>
                        <i class="bi bi-search ml-3"></i>
                    </button>
                </div>
                <div class="is-flex is-justify-content-space-between is-align-items-center py-2">
                    <label for="quatidade-mudas" class="text-nowrap mr-2">
                        Quantas mudas?
                    </label>
                    <input id="quatidade-mudas" type="number" min="0">
                </div>
                <div class="btn-cadastrar is-flex is-justify-content-center mt-4 py-3" @click="cadastrarPublicacao">
                    Cadastrar
                </div>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="closeModalCadastrarPublicacao"></button>
    </div>

    <!-- Modal de Procurar Planta -->
    <div v-if="showModalProcurar" id="modalProcurarPlanta" class="modal is-active">
        <div class="modal-background" @click="closeModalProcurar"></div>
        <div class="modal-content is-flex is-justify-content-center px-5">
            <div class="box">
                <div class="field">
                    <label for="procurar-planta" class="label mb-3">
                        Nome da planta:
                    </label>
                    <div class="campo-pesquisa px-4 py-2">
                        <input
                            id="procurar-planta"
                            v-model="nomePlantaProcurar"
                            placeholder="Digite o nome da planta"
                        />
                        <i class="bi bi-search is-clickable" @click="buscarPlantas"></i>
                    </div>
                    <div class="is-flex is-justify-content-end">
                        <span class="is-size-7 mt-1 mb-4">
                            Digite pelo menos 3 letras
                        </span>
                    </div>
                    <div v-if="plantasEncontradas.length" class="select is-multiple">
                        <select id="select-planta" v-model="idPlantaBuscada" multiple size="7">
                            <option
                                v-for="planta in plantasEncontradas"
                                :key="planta.id"
                                :value="planta.id"
                            >
                                {{ planta.nome }}
                            </option>
                        </select>
                    </div>
                    <span v-else-if="mensagemErro" class="has-text-danger is-size-7">
                        {{ mensagemErro }}
                    </span>
                </div>
                <div class="is-flex is-justify-content-space-between mt-4">
                    <button class="button mr-2" @click="closeModalProcurar">
                        Cancelar
                    </button>
                    <button class="button is-primary ml-2" @click="confirmarPlanta">
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="closeModalProcurar"></button>
    </div>

    <Menu :exibirPesquisa="false" />






















    <div>
        <div class="banner">
            <h2 class="has-text-white is-size-4 px-3">
                MINHAS PUBLICAÇÕES
            </h2>
        </div>
    </div>
    <div class="container mt-3 pb-6">
        <div v-for="(grupo, index) in gruposDePlantas" :key="index" class="columns is-4">
            <div 
                v-for="(publicacao, i) in grupo" :key="i" 
                class="card-planta column is-3 is-flex is-flex-direction-column is-align-items-center is-clickable"
                @click="openModalVerPublicacao(publicacao.id)"
            >
                <!-- <img :src="planta.imagem || '@/assets/images/image_8.png'" alt="foto da planta"> -->
                <img src="@/assets/images/image_8.png" alt="foto da planta">
                <div class="is-flex is-justify-content-space-between pt-3 px-2">
                    <div class="is-flex is-flex-direction-column">
                        <span class="nome-comum is-size-5">
                            {{ publicacao.planta.nome_popular }}
                        </span>
                        <span class="nome-cientifico pt-2">
                            {{ publicacao.planta.nome_cientifico }}
                        </span>
                    </div>
                    <i 
                        :class="['bi', publicacao.favorita ? 'bi-heart-fill' : 'bi-heart', 'is-size-5', 'is-clickable']" 
                        @click.stop="toggleFavorito(publicacao)"
                    ></i>
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
        max-width: 310px;
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
        color: var(--verde-secundario);
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

    @media screen and (max-width: 768px) {
        .nav-especies li {
            font-size: small;
        }
    }

    @media screen and (max-width: 500px) {
        .banner h2 {
            font-size: medium !important;
        }
    }
</style>