<template>
  <div>
    <div
      class="bg-image"
      :style="{
        backgroundImage: 'url(' + require('@/assets/background.svg') + ')',
      }"
    >
      <form @submit="newUser($event)">
        <input
          type="text"
          v-model="userId"
          @keyup="onChangeUser()"
          placeholder="User Id [ ex. larry_page]"
        />
        <input
          type="text"
          v-model="name"
          placeholder="Display Name [ ex. Larry Page ]"
        />
        <button :disabled="isActiveSpinner" type="submit">
          {{ button }}
          <span v-if="isActiveSpinner" class="loader">Loading...</span>
        </button>
      </form>
    </div>
    <div>
      <p>
        Build with
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events"
          target="_blank"
          >SSE</a
        >&nbsp;&nbsp;
        <a href="https://vuejs.org/" target="_blank">Vue.js</a>&nbsp;&nbsp;
        <a href="https://nestjs.com/" target="_blank">NesJS</a>&nbsp;&nbsp;
        <a href="https://www.mongodb.com/" target="_blank">MongoDB</a
        >&nbsp;&nbsp;
      </p>
      <p>
        Hosting provider
        <a href="https://www.netlify.com/" target="_blank">netlify</a
        >&nbsp;&nbsp;
        <a href="https://www.heroku.com/" target="_blank">HEROKU</a>&nbsp;&nbsp;
        <a href="https://www.mongodb.com/cloud/atlas" target="_blank"
          >MongoDB Atlas</a
        >&nbsp;
      </p>
    </div>
  </div>
</template>

<script>
import { Room } from "../constants/ApiUrl";
import { getData, postData, putData } from "../shared/httpHandler";

export default {
  name: "join-room",
  data() {
    return {
      userId: "",
      name: "",
      isActiveSpinner: false,
    };
  },
  methods: {
    newUser($event) {
      $event.preventDefault();
      if (!this.name || !this.userId) return;
      if (!this.$route.params.roomId) {
        this.createRoom();
      } else {
        this.joinNewUser();
      }
    },
    createRoom() {
      const newRoom = {
        users: [
          {
            userId: this.userId,
            name: this.name,
            point: null,
            isAdmin: true,
          },
        ],
        cards: [
          {
            title: "Total",
            point: 0,
            userCardPoints: [],
          },
        ],
        isVisibleToAll: false,
      };
      this.isActiveSpinner = true;
      postData(Room.BASE, newRoom)
        .then((res) => {
          this.isActiveSpinner = false;
          const dbUser = res.users.find((x) => x.userId == this.userId);
          sessionStorage.setItem("uoid", dbUser._id);
          if (dbUser) {
            this.$router.push({ path: `/${res._id}/board` });
          }
        })
        .catch((err) => {
          this.isActiveSpinner = false;
        });
    },
    joinNewUser() {
      this.isActiveSpinner = true;
      getData(`${Room.BASE}/${this.$route.params.roomId}`)
        .then((res) => {
          const index = res.users.findIndex(
            (x) => x.userId.toLowerCase() == this.userId.toLowerCase().trim()
          );
          if (index >= 0) {
            res.users[index].name = this.name;
          } else {
            res.users.push({
              userId: this.userId,
              name: this.name,
              point: null,
              isAdmin: false,
            });
          }
          putData(Room.BASE, res).then((res) => {
            this.isActiveSpinner = false;
            const dbUser = res.users.find((x) => x.userId == this.userId);
            sessionStorage.setItem("uoid", dbUser._id);
            if (dbUser) {
              this.$router.push({
                path: `/${this.$route.params.roomId}/board`,
              });
            }
          });
        })
        .catch((err) => {
          this.isActiveSpinner = false;
          this.$router.push({ path: "/room-not-found" });
        });
    },
    onChangeUser() {
      this.userId = this.userId.trim().toLowerCase();
    },
  },
  computed: {
    button: function() {
      return !this.$route.params.roomId ? "Create" : "Join";
    },
  },
};
</script>

<style scoped>
input,
button {
  height: 2.5rem;
  width: 100%;
  font-size: 1rem;
  margin: 0.5rem 0;
}

form {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 25vh;
  left: 70vw;
  right: 10vw;
  width: 20vw;
}

.bg-image {
  height: 70vh;
  width: 50vw;
  margin-top: 15vh;
  background-repeat: round;
}

@media only screen and (max-width: 1440px) {
  .bg-image {
    width: 65vw;
    background-repeat: round;
    margin-left: 1rem;
  }
}
@media only screen and (max-width: 600px) {
  form {
    top: 10vh;
    left: 20vw;
    right: 20vw;
    width: 60vw;
  }
  .bg-image {
    margin-left: 3.5rem;
  }
}
</style>
