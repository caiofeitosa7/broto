<script>
export default {
  data() {
    return {
      userImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      chats: [
        {
          id: 1,
          name: "Someone",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
          lastMessage: "Lorem ipsum dolor sit amet.",
          unread: 5,
          time: "12:30",
          online: true,
          messages: [
            { id: 1, text: "Olá, como você está?", time: "12:30", me: true },
            { id: 2, text: "Estou bem, e você?", time: "12:31", me: false }
          ]
        }
      ],
      selectedChat: null,
      newMessage: ""
    };
  },
  methods: {
    selectChat(chatId) {
      this.selectedChat = this.chats.find(chat => chat.id === chatId);
    },
    sendMessage() {
      if (this.newMessage.trim() && this.selectedChat) {
        this.selectedChat.messages.push({
          id: Date.now(),
          text: this.newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          me: true
        });
        this.newMessage = "";
      }
    }
  },
  mounted() {
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
        <aside class="chat-sidebar">
          <a href="#" class="chat-sidebar-logo">
            <i class="ri-chat-1-fill"></i>
          </a>
          <ul class="chat-sidebar-menu">
            <li class="active"><a href="#" data-title="Chats"><i class="ri-chat-3-line"></i></a></li>
            <li><a href="#" data-title="Contacts"><i class="ri-contacts-line"></i></a></li>
            <li><a href="#" data-title="Documents"><i class="ri-folder-line"></i></a></li>
            <li><a href="#" data-title="Settings"><i class="ri-settings-line"></i></a></li>
            <li class="chat-sidebar-profile">
              <button type="button" class="chat-sidebar-profile-toggle">
                <img :src="userImage" alt="User" />
              </button>
              <ul class="chat-sidebar-profile-dropdown">
                <li><a href="#"><i class="ri-user-line"></i> Profile</a></li>
                <li><a href="#"><i class="ri-logout-box-line"></i> Logout</a></li>
              </ul>
            </li>
          </ul>
        </aside>
        
        <!-- Chat Content -->
        <div class="chat-content">
          <div class="content-sidebar">
            <div class="content-sidebar-title">Chats</div>
            <!-- <form class="content-sidebar-form">
              <input type="search" class="content-sidebar-input" placeholder="Search..." />
              <button type="submit" class="content-sidebar-submit"><i class="ri-search-line"></i></button>
            </form> -->
            <div class="content-messages">
              <ul class="content-messages-list">
                <li class="content-message-title"><span>Recently</span></li>
                <li v-for="chat in chats" :key="chat.id">
                  <a href="#" @click.prevent="selectChat(chat.id)">
                    <img class="content-message-image" :src="chat.image" alt="" />
                    <span class="content-message-info">
                      <span class="content-message-name">{{ chat.name }}</span>
                      <span class="content-message-text">{{ chat.lastMessage }}</span>
                    </span>
                    <span class="content-message-more">
                      <span class="content-message-unread">{{ chat.unread }}</span>
                      <span class="content-message-time">{{ chat.time }}</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Conversation -->
          <div v-if="selectedChat" class="conversation">
            <div class="conversation-top">
              <button type="button" class="conversation-back" @click="selectedChat = null"><i class="ri-arrow-left-line"></i></button>
              <div class="conversation-user">
                <img class="conversation-user-image" :src="selectedChat.image" alt="" />
                <div>
                  <div class="conversation-user-name">{{ selectedChat.name }}</div>
                  <div class="conversation-user-status" :class="{'online': selectedChat.online}">
                    {{ selectedChat.online ? 'online' : 'offline' }}
                  </div>
                </div>
              </div>
            </div>
            <div class="conversation-main">
              <ul class="conversation-wrapper">
                <li v-for="message in selectedChat.messages" :key="message.id" :class="{'me': message.me}" class="conversation-item">
                  <div class="conversation-item-content">
                    <div class="conversation-item-wrapper">
                      <div class="conversation-item-box">
                        <div class="conversation-item-text">
                          <p>{{ message.text }}</p>
                          <div class="conversation-item-time">{{ message.time }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="conversation-form">
              <input type="text" v-model="newMessage" placeholder="Type here..." />
              <button @click="sendMessage"><i class="ri-send-plane-2-line"></i></button>
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
  