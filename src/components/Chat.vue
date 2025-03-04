<template>
    <div class="message-box">
      <h2>Chat Room: {{ roomCode }}</h2>
      <button class="leave-btn" @click="leaveRoom">Leave Room</button>
  
      <div class="messages" ref="messagesContainer">
        <div v-for="msg in messages" :key="msg.timestamp" class="text">
          <span><strong>{{ msg.name }}</strong>: {{ msg.message }}</span>
          <span class="muted">{{ msg.timestamp }}</span>
        </div>
      </div>
  
      <div class="inputs">
        <input v-model="newMessage" placeholder="Message" @keyup.enter="sendMessage" />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </template>
  
  <script>
    import axios from "axios";
    import { io } from "socket.io-client";
    
    export default {
        props: ["roomCode", "userName"],
        data() {
            return {
                messages: [],
                newMessage: "",
                socket: null,
            };
        },
        methods: {
        connectSocket() {
            this.socket = io("http://localhost:5000", {
                query: {
                    room: this.roomCode,
                    name: this.name,
                }
            });
            
            this.loadMessages();
    
            this.socket.on("message", (data) => {
                this.messages.push({
                    name: data.name,
                    message: data.message,
                    timestamp: new Date().toLocaleString(),
                });
                this.scrollToBottom();
            });
    
            this.socket.emit("join", { room: this.roomCode });
        },
        async loadMessages() {
            // try {
            const response = await axios.get(`http://localhost:5000/api/messages/${this.roomCode}`);
            this.messages = response.data; // Assume que a resposta é uma lista de mensagens
            // } catch (error) {
            // console.error("Erro ao carregar mensagens:", error);
            // }
        },
        sendMessage() {
            if (!this.newMessage.trim()) return;

            console.log(this.newMessage);
            
            this.socket.emit("message", {
                texto: this.newMessage,
                room: this.roomCode,
                name: this.userName,
                timestamp: new Date().toLocaleString(),
            });
            this.newMessage = "";
        },
        leaveRoom() {
            this.socket.disconnect();
            this.$emit("leave"); // Notifica o componente pai para voltar à tela inicial
        },
        scrollToBottom() {
            this.$nextTick(() => {
            const container = this.$refs.messagesContainer;
            container.scrollTop = container.scrollHeight;
            });
        },
        },
        mounted() {
            this.connectSocket();
        
            // this.socket = io("http://localhost:5000/api/join", {
            // this.socket = io("http://localhost:5000", {
            //     transports: ["websocket"], // Evita fallback para polling
            // });

            // this.socket.on("connect", () => {
            //     console.log("Conectado ao servidor WebSocket!");
            // });

            // this.socket.on("disconnect", () => {
            //     console.log("Desconectado do servidor WebSocket!");
            // });

            // this.socket.on("message", () => {
            //     console.log(this.newMessage);

            //     this.sendMessage();
            // });

        },
        beforeUnmount() {
            this.socket.disconnect();
        },
    };
  </script>
  
  <style scoped>
  .message-box {
    max-width: 500px;
    margin: auto;
    text-align: center;
  }
  .messages {
    height: 300px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  .text {
    background: #f1f1f1;
    padding: 5px;
    border-radius: 5px;
    margin-bottom: 5px;
  }
  .inputs {
    display: flex;
  }
  .inputs input {
    flex: 1;
    padding: 10px;
  }
  .inputs button {
    background: green;
    color: white;
    padding: 10px;
    cursor: pointer;
  }
  .leave-btn {
    background: red;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
  }
  </style>
  