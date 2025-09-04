<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import ModalMensagem from '../components/ModalMensagem.vue'
import Menu from '../components/MenuSuperior.vue'
import RodaPe from '../components/RodaPe.vue'
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

interface Categoria {
    nome: string;
}

interface Planta {
    id: number;
    nome: string;
    nome_cientifico: string;
}

interface Usuario {
    id: number;
    nome: string;
    bairro: string;
    numero: string;
}

interface Foto {
    imagem_base64: string;
}

interface Publicacao {
    id: number;
    usuario: Usuario;
    planta: {
        nome_popular: string;
        nome_cientifico: string;
    };
    quantidade: number;
    foto: Foto;
}

interface PublicacaoClicada {
    id?: number;
    idDono?: number;
    nomeDono?: string;
    nomeComum?: string;
    nomeCientifico?: string;
    quantidade?: number;
    contato?: string;
    local?: string;
    foto?: string;
}

export default defineComponent({
    components: {
        ModalMensagem,
        Menu,
        RodaPe
    },
    setup() {
        const authStore = useAuthStore();

        // Reactive state
        const state = reactive({
            urlBuscarPlanta: 'http://127.0.0.1:5000/buscar_planta',
            urlCadastrarPublicacao: 'http://127.0.0.1:5000/registrar_publicacao',
            urlCarregarPublicacoes: 'http://127.0.0.1:5000/publicacoes',
            urlFiltrarPubCategoria: 'http://127.0.0.1:5000/publicacoes_categoria',
            urlFiltrarPubPlanta: 'http://127.0.0.1:5000/publicacoes_planta',
            urlAddFavorito: 'http://127.0.0.1:5000/favoritos/adicionar',
            urlRemoveFavorito: 'http://127.0.0.1:5000/favoritos/remover',
            urlAbrirConversa: 'http://127.0.0.1:5000/publicacao/contactar',
            urlCategorias: 'http://127.0.0.1:5000/categorias',
            carregando: false,
            showModal: false,
            tituloModal: "",
            conteudoModal: "",
            visibleCategories: [] as string[],
            categorias: [] as string[],
            itemsPerPage: 0,
            currentIndex: 0,
            showModalCadastrarPublicacao: false,
            showModalVerPublicacao: false,
            showModalProcurar: false,
            fotoCarregada: false,
            fotoPreview: null as string | null,
            publicacaoClicada: {} as PublicacaoClicada,
            plantasEncontradas: [] as Planta[],
            idPlantaBuscada: null as number[] | null,
            plantaBuscada: {} as { id?: number; nome_popular?: string; nome_cientifico?: string },
            mensagemErro: "",
            nomePlantaProcurar: "",
            mostrarSelectPlanta: false,
            publicacoes: [] as Publicacao[],
            filtroAtivo: null as string | null,
            tipoFiltroAtivo: null as string | null,
            showButtonCarregarMais: true,
            limite: 16,
            offset: 0,
        });

        // Computed
        const gruposDePlantas = computed(() => {
            return state.publicacoes.reduce((acc: Publicacao[][], publicacao, index) => {
                const grupoIndex = Math.floor(index / 4);
                if (!acc[grupoIndex]) acc[grupoIndex] = [];
                acc[grupoIndex].push(publicacao);
                return acc;
            }, []);
        });

        // Methods
        function closeModal() {
            state.showModalVerPublicacao = false;
            state.showModal = false;
        }
        function closeModalCadastrarPublicacao() {
            state.showModalCadastrarPublicacao = false;
            state.fotoCarregada = false;
            state.plantaBuscada = {};
        }
        function openModalCadastrarPublicacao() {
            state.showModalCadastrarPublicacao = true;
        }
        function abrirModalProcurar() {
            state.showModalProcurar = true;
        }
        function closeModalProcurar() {
            state.showModalProcurar = false;
        }
        function abrirInputFoto() {
            const inputElement = document.getElementById("input-foto") as HTMLInputElement | null;
            if (inputElement) {
                inputElement.click();
            }
        }
        async function carregarPublicacoes(string: string | null = null, tipo_filtro: string | null = null) {
            if (state.carregando) return;

            state.carregando = true;
            try {
                let url = state.urlCarregarPublicacoes;

                // Se houver um filtro, ajusta a URL da requisição
                if (string && tipo_filtro) {
                    state.filtroAtivo = string;
                    state.tipoFiltroAtivo = tipo_filtro;
                    url = tipo_filtro === 'categoria' ? state.urlFiltrarPubCategoria : state.urlFiltrarPubPlanta;
                    url += `/${string}`;
                }

                // Adiciona os parâmetros de paginação
                url += `?limit=${state.limite}&offset=${state.offset}`;
                const response = await axios.get(url);

                if (response.data) {
                    if (state.offset === 0) {
                        state.publicacoes = response.data;
                    } else {
                        state.publicacoes.push(...response.data);
                    }
                    state.offset += state.limite;
                }

                if (response.data.length == 0)
                    state.showButtonCarregarMais = false;
                else
                    state.showButtonCarregarMais = true;

            } catch (error) {
                console.error("Erro ao carregar publicações.");
            } finally {
                state.carregando = false;
            }
        }
        async function getCategorias() {
            try {
                const response = await fetch(state.urlCategorias);

                if (!response.ok) {
                    throw new Error("Erro ao buscar as espécies");
                }

                const data: Categoria[] = await response.json();
                state.categorias = data.map((item) => item.nome);
                updateItemsPerPage();
            } catch (error) {
                console.error("Erro ao buscar espécies.");
            }
        }
        function updateItemsPerPage() {
            nextTick(() => {
                const container = document.querySelector(".container-categorias") as HTMLElement | null;
                if (!container) return;
                state.itemsPerPage = Math.floor(container.offsetWidth / 100);
                state.visibleCategories = state.categorias.slice(
                    state.currentIndex,
                    state.currentIndex + state.itemsPerPage
                );
            });
        }
        function scrollLeft() {
            if (state.currentIndex > 0) {
                state.currentIndex -= 2;
                updateItemsPerPage();
            }
        }
        function scrollRight() {
            if (state.currentIndex + state.itemsPerPage < state.categorias.length) {
                state.currentIndex += 2;
                updateItemsPerPage();
            }
        }
        function confirmarPlanta() {
            if (!state.idPlantaBuscada || state.idPlantaBuscada.length === 0) {
                state.mensagemErro = 'Por favor, selecione uma planta.';
                return;
            }

            const planta = state.plantasEncontradas.find(
                (p) => p.id === state.idPlantaBuscada![0]
            );

            if (planta) {
                state.plantaBuscada = {
                    id: planta.id,
                    nome_popular: planta.nome,
                    nome_cientifico: planta.nome_cientifico,
                };

                closeModalProcurar();
            } else {
                console.error('Nenhuma planta foi selecionada.');
                state.mensagemErro = 'Por favor, selecione uma planta.';
            }
        }
        async function buscarPlantas() {
            if (state.nomePlantaProcurar.length < 3) {
                state.mensagemErro = "Digite pelo menos 3 letras.";
                return;
            }

            try {
                const response = await axios.get(state.urlBuscarPlanta, {
                    params: { query: state.nomePlantaProcurar }
                });

                if (response.data.length) {
                    state.plantasEncontradas = response.data;
                    state.mensagemErro = "";
                } else {
                    state.plantasEncontradas = [];
                    state.mensagemErro = "Nenhuma planta foi encontrada.";
                }
            } catch (error) {
                console.error("Erro ao buscar plantas.");
                state.mensagemErro = "Erro ao buscar plantas. Tente novamente.";
            }
        }
        function previewFile(event: Event) {
            const target = event.target as HTMLInputElement;
            const file = target.files && target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    state.fotoPreview = e.target?.result as string;
                    state.fotoCarregada = true;
                };
                reader.readAsDataURL(file);
            }
        }
        async function cadastrarPublicacao() {
            const fotoPreviewEl = document.getElementById('foto-preview') as HTMLImageElement | null;
            const quantidadeEl = document.getElementById('quatidade-mudas') as HTMLInputElement | null;

            let dados = {
                usuario_id: authStore.cod_usuario,
                planta_id: state.plantaBuscada.id,
                imagem: fotoPreviewEl?.src || '',
                quantidade: quantidadeEl?.value || ''
            }

            try {
                const response = await axios.post(state.urlCadastrarPublicacao, dados, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200) {
                    closeModalCadastrarPublicacao();
                    state.tituloModal = "Sucesso";
                    state.conteudoModal = "Publicação cadastrada com sucesso!";
                    state.showModal = true;
                } else {
                    state.tituloModal = "Erro";
                    state.conteudoModal = "Erro ao cadastrar publicação. Tente novamente.";
                    state.showModal = true;
                }
            } catch (error) {
                console.error("Erro ao cadastrar planta.");
                state.tituloModal = "Erro";
                state.conteudoModal = "Erro ao cadastrar publicação. Tente novamente.";
                state.showModal = true;
            }
        }
        async function openModalVerPublicacao(
            id: number,
            idDono: number,
            nomeDono: string,
            nomeComum: string,
            nomeCientifico: string,
            local: string,
            quantidade: number,
            foto: string,
            numero: string
        ) {
            state.showModalVerPublicacao = true;
            state.publicacaoClicada = {
                id,
                idDono,
                nomeDono,
                nomeComum,
                nomeCientifico,
                quantidade,
                contato: numero,
                local,
                foto
            }
        }
        async function toggleFavorito(event: MouseEvent, id: number) {
            const icon = event.target as HTMLElement;
            let url = '';

            if (icon.classList.contains('bi-heart')) {
                icon.classList.replace('bi-heart', 'bi-heart-fill');
                url = state.urlAddFavorito;
            } else {
                icon.classList.replace('bi-heart-fill', 'bi-heart');
                url = state.urlRemoveFavorito;
            }

            try {
                await axios.post(url, {
                    usuario_id: authStore.cod_usuario,
                    publicacao_id: id
                });
            } catch (error) {
                console.error('Erro ao favoritar.');
            }
        }
        function abrirConversa(id: number) {
            let usuario_id = authStore.cod_usuario;

            axios.post(state.urlAbrirConversa, {
                usuario_id: usuario_id,
                publicacao_id: id
            }).then((res) => {
                const conversaId = res.data.conversa_id;

                if (conversaId) {
                    window.location.href = `/chat?conversa=${conversaId}`;
                }
            }).catch((error) => {
                console.error("Erro ao abrir conversa.");
            });
        }
        function irParaPublicacoesUsuario(usuario_id: number) {
            window.location.href = `/publicacoes_usuario?usuario_id=${usuario_id}`;
        }

        // Lifecycle
        onMounted(() => {
            getCategorias();
            carregarPublicacoes();
            window.addEventListener("resize", updateItemsPerPage);
        });
        onBeforeUnmount(() => {
            window.removeEventListener("resize", updateItemsPerPage);
        });

        return {
            ...state,
            authStore,
            closeModal,
            closeModalCadastrarPublicacao,
            openModalCadastrarPublicacao,
            abrirModalProcurar,
            closeModalProcurar,
            abrirInputFoto,
            carregarPublicacoes,
            getCategorias,
            updateItemsPerPage,
            scrollLeft,
            scrollRight,
            confirmarPlanta,
            buscarPlantas,
            previewFile,
            cadastrarPublicacao,
            openModalVerPublicacao,
            toggleFavorito,
            abrirConversa,
            irParaPublicacoesUsuario,
            gruposDePlantas
        };
    }
});
</script>

<template>
    <ModalMensagem 
        :showModal="showModal" 
        :titleModal="tituloModal"
        :contentModal="conteudoModal" 
        @close="closeModal"
    />

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
                <p class="ver-dono-publicacao" @click="irParaPublicacoesUsuario(publicacaoClicada.idDono)">
                    <strong>Dono(a):</strong> {{ publicacaoClicada.nomeDono }} <i class="bi bi-person-circle"></i>
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

    <!-- Modal de Procurar Publicacao -->
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

    <Menu @barraPesquisa="carregarPublicacoes" />

    <div>
        <div class="banner">
            <h2 class="has-text-white is-size-4 px-3">
                DOE MUDAS, SEMEIE O FUTURO.
            </h2>
        </div>
        <ul class="nav-especies py-4 px-2">
            <div class="container container-categorias is-flex is-justify-content-space-between is-align-items-center">
                <i class="bi bi-chevron-left is-size-5 is-clickable pr-1" @click="scrollLeft"></i>
                <li v-for="(categoria, index) in this.visibleCategories" :key="index">
                    <span @click="offset=0; carregarPublicacoes(categoria, 'categoria');">
                        {{ categoria }}
                    </span>
                </li>
                <i class="bi bi-chevron-right is-size-5 is-clickable px-1" @click="scrollRight"></i>
            </div>
        </ul>
    </div>

    <div class="container container-publicacoes mt-3 pb-5">
        <div v-for="(grupo, index) in gruposDePlantas" :key="index" class="columns is-4">
            <div 
                v-for="(publicacao, i) in grupo" :key="i" 
                class="card-planta column is-3 is-flex is-flex-direction-column is-align-items-center is-clickable"
                @click="openModalVerPublicacao(
                    publicacao.id,
                    publicacao.usuario.id,
                    publicacao.usuario.nome.split(' ')[0],
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
        <div v-if="showButtonCarregarMais" class="is-flex is-justify-content-center mt-6">
            <button class="button is-primary" @click="carregarPublicacoes(filtroAtivo, tipoFiltroAtivo)" :disabled="carregando" style="width: 200px;">
                {{ carregando ? "Carregando..." : "Carregar Mais" }}
            </button>
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

        span:hover {
            color: #81b5b0;
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

    .ver-dono-publicacao {
        color: var(--cor-principal) !important;
        font-weight: 500;
        cursor: pointer;
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