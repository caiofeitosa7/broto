<script>
    import ModalMensagem from '../components/ModalMensagem.vue'
    import Menu from '../components/menuSuperior.vue'
    import RodaPe from '../components/RodaPe.vue'

    export default {
        components: {
            ModalMensagem,
            // ModalVisualizarPlanta,
            Menu,
            RodaPe
        },
        data() {
            return {
                showModalMensagem: false,
                tituloModalMensagem: "",
                conteudoModalMenasagem: "",
                showModalVerPlanta: false,
                plantaClicada: {}
            };
        },
        methods: {
            closeModal() {
                this.showModalVerPlanta = false;
                this.showModalMensagem = false;
            },
            async openModal(plantaId) {
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
        }
    };
</script>

<template>
    <div>
        <ModalMensagem :showModal="showModal" :titleModal="tituloModal" :contentModal="conteudoModal" @close="closeModal"/>
        <div v-if="showModalVerPlanta" class="modal is-active">
            <div class="modal-background" @click="closeModal"></div>
                <div class="modal-content is-flex is-justify-content-center px-5">
                    <div class="box">
                        <div class="is-flex is-flex-direction-column is-justify-align-items-center">
                            <img src="@/assets/images/image_8.png" alt="foto da planta">
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
        <Menu />
        <div class="container mt-3 pb-6">
            <div class="columns is-4">
                <div class="card-planta column is-flex is-flex-direction-column is-align-items-center is-clickable"
                    @click="openModal('123')">
                    <img src="@/assets/images/image_8.png" alt="foto da planta">
                    <div class="is-flex is-justify-content-space-between pt-3 px-2">
                        <div class="is-flex is-flex-direction-column">
                            <span class="nome-comum is-size-5">
                                Jiboia
                            </span>
                            <span class="nome-cientifico pt-2">
                                Epipremnum pinnatum
                            </span>
                        </div>
                        <i class="bi bi-heart is-size-5 is-clickable"></i>
                    </div>
                    <span class="local mt-4 px-4 py-2">
                        Lorival Parente
                    </span>
                </div>
                <div class="card-planta column is-flex is-flex-direction-column is-align-items-center is-clickable">
                    <img src="@/assets/images/image_8.png" alt="foto da planta">
                    <div class="is-flex is-justify-content-space-between pt-3 px-2">
                        <div class="is-flex is-flex-direction-column">
                            <span class="nome-comum is-size-5">
                                Jiboia
                            </span>
                            <span class="nome-cientifico pt-2">
                                Epipremnum pinnatum
                            </span>
                        </div>
                        <i class="bi bi-heart-fill is-size-5 is-clickable"></i>
                    </div>
                    <span class="local mt-4 px-4 py-2">
                        Lorival Parente
                    </span>
                </div>
                <div class="card-planta column is-flex is-flex-direction-column is-align-items-center is-clickable">
                    <img src="@/assets/images/image_8.png" alt="foto da planta">
                    <div class="is-flex is-justify-content-space-between pt-3 px-2">
                        <div class="is-flex is-flex-direction-column">
                            <span class="nome-comum is-size-5">
                                Jiboia
                            </span>
                            <span class="nome-cientifico pt-2">
                                Epipremnum pinnatum
                            </span>
                        </div>
                        <i class="bi bi-heart is-size-5 is-clickable"></i>
                    </div>
                    <span class="local mt-4 px-4 py-2">
                        Lorival Parente
                    </span>
                </div>
                <div class="card-planta column is-flex is-flex-direction-column is-align-items-center is-clickable">
                    <img src="@/assets/images/image_8.png" alt="foto da planta">
                    <div class="is-flex is-justify-content-space-between pt-3 px-2">
                        <div class="is-flex is-flex-direction-column">
                            <span class="nome-comum is-size-5">
                                Jiboia
                            </span>
                            <span class="nome-cientifico pt-2">
                                Epipremnum pinnatum
                            </span>
                        </div>
                        <i class="bi bi-heart is-size-5 is-clickable"></i>
                    </div>
                    <span class="local mt-4 px-4 py-2">
                        Lorival Parente
                    </span>
                </div>
            </div>
            <div class="columns is-4">
                <div class="card-planta column is-flex is-flex-direction-column is-align-items-center is-clickable">
                    <img src="@/assets/images/image_8.png" alt="foto da planta">
                    <div class="is-flex is-justify-content-space-between pt-3 px-2">
                        <div class="is-flex is-flex-direction-column">
                            <span class="nome-comum is-size-5">
                                Jiboia
                            </span>
                            <span class="nome-cientifico pt-2">
                                Epipremnum pinnatum
                            </span>
                        </div>
                        <i class="bi bi-heart is-size-5 is-clickable"></i>
                    </div>
                    <span class="local mt-4 px-4 py-2">
                        Lorival Parente
                    </span>
                </div>
                <div class="card-planta column is-flex is-flex-direction-column is-align-items-center is-clickable">
                    <img src="@/assets/images/image_8.png" alt="foto da planta">
                    <div class="is-flex is-justify-content-space-between pt-3 px-2">
                        <div class="is-flex is-flex-direction-column">
                            <span class="nome-comum is-size-5">
                                Jiboia
                            </span>
                            <span class="nome-cientifico pt-2">
                                Epipremnum pinnatum
                            </span>
                        </div>
                        <i class="bi bi-heart is-size-5 is-clickable"></i>
                    </div>
                    <span class="local mt-4 px-4 py-2">
                        Lorival Parente
                    </span>
                </div>
                <div class="card-planta column is-flex is-flex-direction-column is-align-items-center is-clickable">
                    <img src="@/assets/images/image_8.png" alt="foto da planta">
                    <div class="is-flex is-justify-content-space-between pt-3 px-2">
                        <div class="is-flex is-flex-direction-column">
                            <span class="nome-comum is-size-5">
                                Jiboia
                            </span>
                            <span class="nome-cientifico pt-2">
                                Epipremnum pinnatum
                            </span>
                        </div>
                        <i class="bi bi-heart is-size-5 is-clickable"></i>
                    </div>
                    <span class="local mt-4 px-4 py-2">
                        Lorival Parente
                    </span>
                </div>
                <div class="card-planta column is-flex is-flex-direction-column is-align-items-center is-clickable">
                    <img src="@/assets/images/image_8.png" alt="foto da planta">
                    <div class="is-flex is-justify-content-space-between pt-3 px-2">
                        <div class="is-flex is-flex-direction-column">
                            <span class="nome-comum is-size-5">
                                Jiboia
                            </span>
                            <span class="nome-cientifico pt-2">
                                Epipremnum pinnatum
                            </span>
                        </div>
                        <i class="bi bi-heart is-size-5 is-clickable"></i>
                    </div>
                    <span class="local mt-4 px-4 py-2">
                        Lorival Parente
                    </span>
                </div>
            </div>
        </div>
    </div>
    <RodaPe />
</template>

<style scoped>
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

    .btn-conversar, .card-planta .local {
        background-color: var(--verde-secundario);
        text-align: center;
        border-radius: 7px;
        font-size: smaller;
        min-width: 65%;
        color: #fff;
    }
    
    .box {
        max-width: 310px;
    }

    .modal-content {
        width: fit-content;
    }
</style>