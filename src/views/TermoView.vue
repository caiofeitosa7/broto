<!-- <script>
import Room from "../components/Chat.vue"; // Importa o componente de chat

export default {
  components: { Room },
  data() {
    return {
      name: "",
      code: "",
      rooms: [],
      error: null,
      action: "",
      currentRoom: null,
    };
  },
  methods: {
    async fetchRooms() {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/rooms");
        this.rooms = await response.json();
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    },
    async handleSubmit() {
      this.error = null;
      try {
        const response = await fetch("http://127.0.0.1:5000/api/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: this.name, code: this.code, create: this.action === "create" }),
        });

        const data = await response.json();

        if (!response.ok) {
          this.error = data.error;
        } else {
          this.currentRoom = data.room; // Atualiza a sala atual para exibir o componente Room
        }
      } catch (error) {
        this.error = "Failed to connect to the server.";
      }
    },
    leaveRoom() {
      this.currentRoom = null; // Volta para a tela inicial
    }
  },
  mounted() {
    this.fetchRooms();
  },
};
</script>

<template>
  <div v-if="!currentRoom" class="container">
    <form @submit.prevent="handleSubmit" class="buttons">
      <h3>Enter The Chat Room</h3>
      <div>
        <label>Name:</label>
        <input v-model="name" placeholder="Pick a name!" required />
      </div>
      <div class="join">
        <input v-model="code" placeholder="Room Code" />
        <button type="submit" @click="action = 'join'">Join a Room</button>
      </div>
      <button type="submit" @click="action = 'create'" class="create-btn">Create a Room</button>

      <ul v-if="error">
        <li>{{ error }}</li>
      </ul>
    </form>

    <h3>Available Rooms</h3>
    <ul v-if="rooms.length">
      <li v-for="room in rooms" :key="room">{{ room }}</li>
    </ul>
    <p v-else>No rooms available.</p>
  </div>

  <Room v-else :roomCode="currentRoom" :userName="name" @leave="leaveRoom" />
</template>

<style scoped>
.container {
  max-width: 400px;
  margin: auto;
  text-align: center;
}
.buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.create-btn {
  background-color: green;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}
.join input,
.create-btn {
  margin-top: 10px;
}
</style> -->


<script>
    import RodaPe from '../components/RodaPe.vue'

    export default {
        components: {
            RodaPe
        },
        data() {
            return {
                accepted: false
            };
        },
        methods: {
            proceed() {
                alert("Você aceitou os termos e pode continuar.");
            }
        }
    };
</script>

<template>
    <div class="banner">
        <h2 class="has-text-white has-text-centered is-size-4 px-3">
            TERMO DE COMPROMISSO E RESPONSABILIDADE
        </h2>
    </div>
    <div class="container">
        <p class="has-text-weight-bold">1. OBJETIVO</p>
        <p>
            O presente Termo de Compromisso e Responsabilidade estabelece as condições de uso da aplicação BROTO, 
            desenvolvida pela Prefeitura de Teresina, para facilitar a doação de mudas de plantas entre usuários 
            da plataforma.
        </p>
        <p class="has-text-weight-bold">2. ISENÇÃO DE RESPONSABILIDADE DA PREFEITURA DE TERESINA</p>
        <p>
            2.1. A Prefeitura de Teresina não se responsabiliza por qualquer interação, comunicação ou transação 
            realizada entre os usuários da aplicação BROTO.
        </p>
        <p>
            2.2. A Prefeitura de Teresina não garante a veracidade das informações fornecidas pelos usuários sobre 
            as mudas disponíveis, incluindo sua condição, qualidade ou disponibilidade.
        </p>
        <p>
            2.3. A Prefeitura de Teresina não se responsabiliza por quaisquer danos, prejuízos ou incidentes decorrentes 
            do uso da plataforma, incluindo, mas não se limitando a, golpes, fraudes, conflitos entre usuários ou qualquer 
            outro tipo de problema que possa surgir em decorrência das interações realizadas na aplicação.
        </p>
        <p class="has-text-weight-bold">3. RESPONSABILIDADE DO USUÁRIO</p>
        <p>
            3.1. O usuário é responsável por todas as informações que fornece na plataforma, devendo garantir que são verídicas e completas.
        </p>
        <p>
            3.2. O usuário deve tomar as devidas precauções ao interagir com terceiros, incluindo, mas não se limitando a,
            verificar a idoneidade de outros usuários e evitar a divulgação de informações pessoais sensíveis.
        </p>
        <p>
            3.3. O usuário compreende que o uso da aplicação BROTO é voluntário e que assume integral responsabilidade 
            por suas ações e decisões tomadas dentro da plataforma.
        </p>
        <p class="has-text-weight-bold">4. ORIENTAÇÕES DE SEGURANÇA</p>
        <p>
            4.1. Recomenda-se que as trocas sejam realizadas em locais públicos e seguros.
        </p>
        <p>
            4.2. O usuário não deve compartilhar dados pessoais sensíveis, como informações bancárias, endereço residencial 
            ou qualquer outra informação que possa comprometer sua segurança.
        </p>
        <p>
            4.3. Em caso de comportamento suspeito, golpe ou qualquer outro problema, recomenda-se que o usuário denuncie 
            o ocorrido às autoridades competentes.
        </p>
        <p class="has-text-weight-bold">5. ACEITE DOS TERMOS</p>
        <p>
            Ao utilizar a aplicação BROTO, o usuário declara ter lido, compreendido e aceitado todos os termos aqui descritos, 
            isentando a Prefeitura de Teresina de qualquer responsabilidade sobre as interações realizadas na plataforma.
        </p>
    
        <!-- <div class="flex items-center mt-4">
            <input type="checkbox" id="accept" v-model="accepted" class="mr-2">
            <label for="accept">Declaro que li e aceito os termos acima.</label>
        </div>
        
        <button 
            :disabled="!accepted" 
            @click="proceed" 
            class="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">
            Continuar
        </button> -->
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

    .container {
        max-width: 800px;
        margin: auto;
        padding: 20px;
    }

    p {
        margin-bottom: 10px;
        line-height: 1.2;
    }

    @media screen and (max-width: 600px) {
        h2 {
            font-size: 1.7rem !important;
        }
    }

    @media screen and (max-width: 400px) {
        h2 {
            font-size: 1rem !important;
        }
    }
</style>
