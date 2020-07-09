<template>
  <div
    class="bg-image"
    :style="{
      backgroundImage: 'url(' + require('@/assets/background.svg') + ')'
    }"
  >
    <form @submit="newUser($event)">
      <input
        type="text"
        v-model="userId"
        @keyup="onChangeUser()"
        placeholder="UserId [twinkle_cse]"
      />
      <input
        type="text"
        v-model="name"
        placeholder="Full Name [Twinkle Little Start]"
      />
      <button :disabled="isActiveSpinner" type="submit">{{ button }} <span v-if="isActiveSpinner" class="loader">Loading...</span></button>
    </form>
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
      isActiveSpinner: false
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
            isAdmin: true
          }
        ],
        cards: [
          {
            title: "Total",
            point: 0,
            userCardPoints: []
          }
        ],
        isVisibleToAll: false
      };

      postData(Room.BASE, newRoom)
        .then(res => {
          this.$router.push({ path: `/${res._id}/${this.userId}` });
        })
        .catch(err => {
          console.log(err);
        });
    },
    joinNewUser() {
      this.isActiveSpinner = true;
      getData(`${Room.BASE}/${this.$route.params.roomId}`).then(res => {
        if (res) {
          const index = res.users.findIndex(
            x => x.userId.toLowerCase() == this.userId.toLowerCase().trim()
          );
          if (index >= 0) {
            res.users[index].name = this.name;
          } else {
            res.users.push({
              userId: this.userId,
              name: this.name,
              point: null,
              isAdmin: false
            });
          }
          putData(Room.BASE, res)
            .then(res => {
              this.isActiveSpinner = false;
              this.$router.push({
                path: `/${this.$route.params.roomId}/${this.userId}`
              });
            })
            .catch(err => {});
        } else {
          this.$router.push({ path: "/room-not-found" });
        }
      });
    },
    onChangeUser() {
      this.userId = this.userId.trim().toLowerCase();
    }
  },
  computed: {
    button: function() {
      return !this.$route.params.roomId ? "Create" : "Join";
    }
  }
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
</style>
