<script>
    export default {
        data() {
            return {
                anoAtual: new Date().getFullYear()
            };
        }
    };
</script>

<template>
    <div class="rodape is-flex is-justify-content-center is-size-7 py-4">
        BROTO &copy; {{ anoAtual }} | Todos os direitos reservados.
    </div>
</template>

<style scoped>
    .rodape {
        background-color: var(--verde-claro);
    }
</style>
