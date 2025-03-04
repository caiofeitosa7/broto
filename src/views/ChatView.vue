<script>
    import { useAuthStore } from "@/stores/auth";
    import { io } from "socket.io-client";
    import axios from "axios";

    export default {
        setup() {
            const authStore = useAuthStore();
            return { authStore };
        },
        data() {
            return {
                urlConversas: 'http://127.0.0.1:5000/chat/conversas/',
                urlMensagens: 'http://127.0.0.1:5000/chat/mensagens/',
                urlSocket: 'http://localhost:5000',
                selectedChat: false,
                newMessage: "",
                socket: null,
                chats: [],
            };
        },
        methods: {
            async loadMessages(chatId) {
                try {
                    const response = await axios.get(this.urlMensagens + `/${chatId}/${this.authStore.cod_usuario}`);
                    const messages = response.data;

                    const chat = this.chats.find((c) => c.id === chatId);
                    if (chat) {
                        chat.messages = messages.map((msg) => ({
                                id: msg.id,
                                texto: msg.texto,
                                data_hora: new Date(msg.data_hora).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }),
                                not_me: msg.not_me,
                            }));
                        this.scrollToBottom();
                    }
                } catch (error) {
                    console.error("Erro ao buscar mensagens:", error);
                }
            },
            async fetchChats() {
                try {
                    const response = await fetch(this.urlConversas + this.authStore.cod_usuario);
                    const data = await response.json();
                    this.chats = data.map(chat => ({
                        id: chat.codigo_conversa,
                        name: chat.outro_usuario,
                        inicial: chat.inicial_outro_usuario,
                        lastMessage: chat.ultima_mensagem,
                        unread: chat.mensagens_nao_lidas,
                        time: chat.ultima_mensagem_time ? chat.ultima_mensagem_time.split(" ")[1] : "",
                        online: false,
                        messages: []
                    }));


                    console.log(this.chats);
                } catch (error) {
                    console.error("Erro ao carregar conversas:", error);
                }
            },
            async selectChat(chatId) {
                this.selectedChat = this.chats.find((chat) => chat.id === chatId);

                if (this.selectedChat) {
                    this.connectSocket(chatId);
                    await this.loadMessages(chatId);
                }
            },
            async sendMessage() {
                if (this.newMessage.trim() && this.selectedChat) {
                    try {
                        this.socket.emit("message", {
                            texto: this.newMessage,
                            cod_conversa: this.selectedChat.id,
                            cod_usuario: this.authStore.cod_usuario,
                        });
                        this.newMessage = "";
                    } catch (error) {
                        console.error("Erro ao enviar mensagem:", error);
                    }
                }
            },
            connectSocket(cod_conversa) {
                this.socket = io(this.urlSocket, {
                    query: {
                        cod_usuario: this.authStore.cod_usuario,
                        cod_conversa: cod_conversa,
                    }
                });
                
                this.socket.emit("join", { cod_conversa });

                this.socket.on("nova_mensagem", (mensagem) => {
                    console.log("Mensagem recebida:", mensagem);

                    if (this.selectedChat && this.selectedChat.id === mensagem.cod_conversa) {
                        this.selectedChat.messages.push({
                            id: mensagem.id,
                            texto: mensagem.texto,
                            data_hora: new Date(mensagem.data_hora).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                            not_me: mensagem.usuario !== this.authStore.cod_usuario,
                        });
                        this.scrollToBottom();
                    }
                });

            },
            scrollToBottom() {
                this.$nextTick(() => {
                    const container = this.$refs.messagesContainer;
                    if (container)
                        container.scrollTop = container.scrollHeight;
                });
            },
            leaveRoom() {
                this.socket.disconnect();
            },


























        },
        mounted() {
            this.fetchChats();

            // Sidebar Toggle
            document.querySelector('.chat-sidebar-profile-toggle').addEventListener('click', function(e) {
                e.preventDefault();
                this.parentElement.classList.toggle('active');
            });

            document.addEventListener('click', function(e) {
                if (!e.target.matches('.chat-sidebar-profile, .chat-sidebar-profile *')) {
                    document.querySelector('.chat-sidebar-profile').classList.remove('active');
                }
            });

            // Conversation Toggle
            document.querySelectorAll('[data-conversation]').forEach(function(item) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.querySelectorAll('.conversation').forEach(function(i) {
                    i.classList.remove('active');
                    });
                    document.querySelector(this.dataset.conversation).classList.add('active');
                });
            });

            document.querySelectorAll('.conversation-back').forEach(function(item) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    this.closest('.conversation').classList.remove('active');
                    document.querySelector('.conversation-default').classList.add('active');
                });
            });
        }
    };
</script>

<template>
    <section class="chat-section">
      <div class="chat-container">
        <!-- Sidebar -->
        <aside :class="{'chat-sidebar': true, 'is-hidden-mobile': selectedChat}">
          <!-- <a href="#" class="chat-sidebar-logo ">
            <i class="ri-chat-1-fill"></i>
          </a> -->
          <ul class="chat-sidebar-menu">
            <li class="active" @click="selectedChat=false">
              <a data-title="Chats"><i class="ri-chat-3-line"></i></a>
            </li>
            <!-- <li><a href="#" data-title="Contacts"><i class="ri-contacts-line"></i></a></li>
            <li><a href="#" data-title="Documents"><i class="ri-folder-line"></i></a></li>
            <li><a href="#" data-title="Settings"><i class="ri-settings-line"></i></a></li> -->
            <li></li>
            <li></li>
            <li></li>
            <li class="chat-sidebar-profile">
              <button type="button" class="chat-sidebar-profile-toggle">
                <img src="/broto-1.3.png" alt="User" />
              </button>
              <ul class="chat-sidebar-profile-dropdown">
                <!-- <li><a href="#"><i class="ri-user-line"></i> Perfil</a></li> -->
                <li><a href="/"><i class="ri-logout-box-line"></i> Voltar</a></li>
              </ul>
            </li>
          </ul>
        </aside>
        
        <!-- Chat Content -->
        <div class="chat-content">
          <div class="content-sidebar">
            <div class="content-sidebar-title has-text-weight-bold">Conversas</div>
            <!-- <form class="content-sidebar-form">
              <input type="search" class="content-sidebar-input" placeholder="Search..." />
              <button type="submit" class="content-sidebar-submit"><i class="ri-search-line"></i></button>
            </form> -->
            <div class="content-messages">
              <ul class="content-messages-list">
                <li class="content-message-title"><span>Recentes</span></li>
                <li v-for="chat in chats" :key="chat.id">
                  <a href="#" @click.prevent="selectChat(chat.id)">
                    <!-- <img class="content-message-image" :src="chat.image" alt="" /> -->
                    <div class="content-message-initial">
                      <span class="is-bold">{{ chat.inicial }}</span>
                    </div>
                    <span class="content-message-info">
                      <span class="content-message-name mb-1">{{ chat.name }}</span>
                      <span class="content-message-text">{{ chat.lastMessage }}</span>
                    </span>
                    <span class="content-message-more">
                      <span v-if="chat.unread" class="content-message-unread mb-1">
                        {{ chat.unread }}
                      </span>
                      <span v-if="chat.unread == 0" style="margin-bottom: 22px;">
                      </span>
                      <span class="content-message-time">{{ chat.time }}</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Conversation -->
          <div v-if="selectedChat" :class="{'conversation': true, 'active': selectedChat}">
            <div class="conversation-top">
              <button type="button" class="conversation-back" @click="selectedChat = null">
                <i class="ri-arrow-left-line"></i>
              </button>
              <div class="conversation-user">
                <!-- <img class="conversation-user-image" :src="selectedChat.image"/> -->
                <div class="conversation-user-initial">
                  <span>{{ selectedChat.inicial }}</span>
                </div>
                <div>
                  <div class="conversation-user-name">{{ selectedChat.name }}</div>
                  <!-- <div class="conversation-user-status mt-1" :class="{'online': selectedChat.online}">
                    {{ selectedChat.online ? 'online' : 'offline' }}
                  </div> -->
                </div>
              </div>
              <div class="conversation-buttons">
                <button type="button"><i class="ri-error-warning-line"></i></button>
              </div>
            </div>
            <div class="conversation-main" ref="messagesContainer">
              <ul class="conversation-wrapper">
                <div class="coversation-divider">
                  <span>Hoje</span>
                </div>
                <li v-for="message in selectedChat.messages" :key="message.id" :class="{'me': message.not_me}" class="conversation-item">
                  <div class="conversation-item-content">
                    <div class="conversation-item-wrapper">
                      <div class="conversation-item-box">
                        <div class="conversation-item-text">
                          <p>{{ message.texto }}</p>
                          <div class="conversation-item-time">{{ message.data_hora }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="conversation-form">
                <div class="conversation-form-group ml-0">
                    <input 
                        v-model="newMessage" 
                        class="conversation-form-input" 
                        placeholder="Digite uma mensagem"
                        @keyup.enter="sendMessage"
                        rows="1"
                    ></input>
                </div>
                <button class="conversation-form-button conversation-form-submit" @click="sendMessage">
                    <i class="ri-send-plane-2-line"></i>
                </button>
            </div>
          </div>
          <div v-if="!selectedChat" :class="{'conversation conversation-default': true, 'active': !selectedChat}">
            <div class="conversation-default-content">
              <i class="ri-chat-3-line"></i>
              <p>Selecione uma conversa para ver as mensagens!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <style scoped>
    @import url('https://cdn.jsdelivr.net/npm/remixicon@3.2.0/fonts/remixicon.css');

    .chat-section { display: flex; }
    .chat-sidebar { width: 80px; background: #f8f9fa; }
    .chat-content { flex-grow: 1; display: flex; justify-content: center; align-items: center; }
  </style>
  