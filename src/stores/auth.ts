import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        cod_usuario: null,
        nome_usuario: null,
        autenticado: false,
        favoritos: [],
    }),
    getters: {
        isAuthenticated: (state) => state.autenticado,
        getUserCode: (state) => state.cod_usuario,
        getUserName: (state) => state.nome_usuario,
    },
    actions: {
        login(codigo, nome, favoritos) {
            this.cod_usuario = codigo;
            this.nome_usuario = nome;
            this.favoritos = favoritos;
            this.autenticado = true;
        },
        logout() {
            this.cod_usuario = null;
            this.nome_usuario = null;
            this.autenticado = false;
            this.favoritos = [];
        },
    },
    persist: {
        enabled: true,
    },
});
