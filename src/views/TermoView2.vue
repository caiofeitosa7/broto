<script>
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
                        body: JSON.stringify({
                            name: this.name,
                            code: this.code,
                            create: this.action === "create"
                        }),
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
</style>
