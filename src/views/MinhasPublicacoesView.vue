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
                urlCadastrarPublicacao: 'http://127.0.0.1:5000/registrar_publicacao',
                urlCarregarPublicacoes: 'http://127.0.0.1:5000/publicacoes_usuario',
                urlAddFavorito: 'http://127.0.0.1:5000/favoritos/adicionar',
                urlRemoveFavorito: 'http://127.0.0.1:5000/favoritos/remover',
                urlCategorias: 'http://localhost:5000/categorias',
                urlApagarPublicacao: 'http://localhost:5000/publicacao/apagar',
                showModalConfirmacao: false,
                atualizacaoPublicacao: false,
                showModal: false,
                tituloModal: "",
                conteudoModal: "",
                categorias: [],
                visibleCategories: [],
                itemsPerPage: 0,
                currentIndex: 0,
                showModalCadastrarPublicacao: false,
                showModalVerPublicacao: false,
                showModalAtualizacao: false,
                showModalProcurar: false,
                fotoCarregada: false,
                fotoPreview: null,
                publicacaoClicada: {},
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
                this.showModalVerPublicacao = false;
                this.showModal = false;
            },
            closeModalCadastrarPublicacao() {
                this.showModalCadastrarPublicacao = false;
                this.fotoCarregada = false;
                this.plantaBuscada = {};
            },
            openModalCadastrarPublicacao() {
                this.showModalCadastrarPublicacao = true;
                this.atualizacaoPublicacao = false;
            },
            abrirModalProcurar() {
                this.showModalProcurar = true;
            },
            closeModalProcurar() {
                this.showModalProcurar = false;
                // this.nomePlantaProcurar = "";
            },
            async carregarPublicacoes() {
                try {
                    let usuario_id = this.authStore.cod_usuario;
                    const response = await axios.get(this.urlCarregarPublicacoes + '/' + usuario_id);

                    this.publicacoes = response.data;
                } catch (error) {
                    console.error("Erro ao carregar plantas");
                } finally {
                    this.carregando = false;
                }
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
                    console.error("Erro ao buscar plantas");
                    this.mensagemErro = "Erro ao buscar plantas. Tente novamente.";
                }
            },
            previewFile(event) {
                const file = event.target.files[0];
                let mostrar_foto = this.validarImagem(file);

                if (mostrar_foto && file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.fotoPreview = e.target.result;
                        this.fotoCarregada = true;
                    };
                    reader.readAsDataURL(file);
                } else {
                    event.target.value = ""; // Limpa o input
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
                    quantidade: document.getElementById('quatidade-mudas').value,
                    atualizacao: this.atualizacaoPublicacao
                }

                if (this.atualizacaoPublicacao)
                    dados['publicacao_id'] = this.publicacaoClicada.id

                try {
                    const response = await axios.post(this.urlCadastrarPublicacao, dados, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    if (response.status === 200) {
                        this.closeModalCadastrarPublicacao();
                        this.fecharModalAtualizacao();
                        this.closeModalProcurar();
                        this.closeModal();
                        this.carregarPublicacoes();

                        if (this.atualizacaoPublicacao)
                            this.conteudoModal = "Publicação atualizada com sucesso!";
                        else
                            this.conteudoModal = "Publicação cadastrada com sucesso!";
                        
                        this.tituloModal = "Sucesso";
                        this.showModal = true;
                    } else {
                        this.closeModalCadastrarPublicacao();
                        this.fecharModalAtualizacao();

                        if (this.atualizacaoPublicacao)
                            this.conteudoModal = "Erro ao atualizar publicação. Tente novamente!";
                        else
                            this.conteudoModal = "Erro ao cadastrar publicação. Tente novamente!";

                        this.tituloModal = "Erro";
                        this.showModal = true;
                    }
                } catch (error) {
                    this.tituloModal = "Erro";
                    this.conteudoModal = "Erro ao cadastrar publicação. Tente novamente.";
                    this.showModal = true;
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
            async deletarPublicacao() {
                try {
                    const response = await axios.post(this.urlApagarPublicacao, {
                        publicacao_id: this.publicacaoClicada.id
                    });

                    if (response.status === 200) {
                        this.closeModal();
                        this.carregarPublicacoes();
                    } else {
                        alert("Erro ao deletar publicação.");
                    }
                } catch (error) {
                    console.error("Erro ao deletar publicação");
                }
                this.fecharModalConfirmacao();
            },
            abrirModalAtualizacao() {
                this.fotoPreview = this.publicacaoClicada.foto;
                this.atualizacaoPublicacao = true;
                this.showModalAtualizacao = true;
                this.fotoCarregada = true;

                this.plantaBuscada = {
                    id: this.publicacaoClicada.planta_id,
                    nome_popular: this.publicacaoClicada.nomeComum,
                    nome_cientifico: this.publicacaoClicada.nomeCientifico,
                };
            },
            validarImagem(arquivo) {
                if (arquivo && arquivo.size > 1 * 1024 * 1024) {
                    alert("O arquivo é muito grande! O limite é 3MB.");
                    return false;
                }
                return true;
            },
            abrirModalConfirmacao() {
                this.showModalConfirmacao = true;
            },
            fecharModalConfirmacao() {
                this.showModalConfirmacao = false;
            },
            fecharModalAtualizacao() {
                this.showModalAtualizacao = false;
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
            <div class="box relative">
                <!-- Botão de deletar -->
                <button class="delete-button" @click="abrirModalConfirmacao">
                    <i class="bi bi-trash"></i>
                </button>

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
                <div class="btn-conversar is-flex is-justify-content-center mt-5 py-3" @click="abrirModalAtualizacao">
                    Editar
                </div>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
    </div>

    <!-- MODAL DE CONFIRMAÇÃO -->
    <div v-if="showModalConfirmacao" id="modal-confirmacao" class="modal is-active">
        <div class="modal-background" @click="fecharModalConfirmacao"></div>
        <div class="modal-content box">
            <p class="has-text-centered is-size-5 has-text-weight-semibold">
                Tem certeza que deseja apagar esta publicação?
            </p>
            <div class="buttons is-centered mt-4">
                <button class="button" @click="fecharModalConfirmacao">Cancelar</button>
                <button class="button is-danger" @click="deletarPublicacao">Apagar</button>
            </div>
        </div>
    </div>

    <!-- Modal de Cadastrar Publicacao -->
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
                            clique para adicionar uma foto
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

    <!-- Modal de Editar Publicacao -->
    <div v-if="showModalAtualizacao" class="modal is-active">
        <div class="modal-background" @click="fecharModalAtualizacao"></div>
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
                            clique para adicionar uma foto
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
                    <input id="quatidade-mudas" type="number" min="0" v-model="publicacaoClicada.quantidade">
                </div>
                <div class="btn-cadastrar is-flex is-justify-content-center mt-4 py-3" @click="cadastrarPublicacao">
                    Atualizar
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

    <ModalMensagem :showModal="showModal" :titleModal="tituloModal" :contentModal="conteudoModal" @close="closeModal"/>

    <Menu :exibirPesquisa="false" />

    <div class="banner">
        <h2 class="has-text-white is-size-4 px-3">
            MINHAS PUBLICAÇÕES
        </h2>
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
    
    <button class="button is-primary floating-button" @click="openModalCadastrarPublicacao()">
        <img src="@/assets/images/add-plant.png"/>
    </button>
    
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

    #modalProcurarPlanta label, #modalProcurarPlanta .box {
        color: var(--preto);
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

        option {
            background-color: #fff;
            color: #575757;
        }

        option:hover {
            background-color: var(--bulma-primary-on-scheme);
            color: #fff;
        }

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