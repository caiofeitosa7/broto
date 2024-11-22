<script>
    export default {
        props: [
            'showModal'
        ],
        methods: {
            fecharModal() {
                this.$emit('close');
            },
            previewFile(event, index) {
                let file = document.getElementById("input-foto-" + index).files[0];
                let preview = document.getElementById("foto-preview-" + index);
                let reader = new FileReader();

                reader.addEventListener(
                    "load",
                    () => {
                        preview.src = reader.result;  
                    },
                    false
                );

                if (file) {
                    reader.readAsDataURL(file);
                }
            }
        },
    };
</script>

<template>
    <div class="modal" :class="{ 'show-modal': showModal }">
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
                    
                    <div class="btn-conversar is-flex is-justify-content-center mt-5 py-3">
                        Conversar
                    </div>
                </div>
            </div>
        <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
    </div>
</template>

<style scoped>
    .box {
        max-width: 310px;
    }

    .modal-content {
        width: fit-content;
    }

    .show-modal {
        display: flex;
    }
</style>
