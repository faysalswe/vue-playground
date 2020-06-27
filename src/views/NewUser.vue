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
        @keydown="onChangeUser()"
        placeholder="UserId [twinkle_cse]"
      />
      <input
        type="text"
        v-model="name"
        placeholder="Full Name [Twinkle Little Start]"
      />
      <button type="submit">{{ button }}</button>
    </form>
  </div>
</template>

<script>
import { database, roomRef } from "../firebase/firebase";
export default {
  name: "join-room",
  data() {
    return {
      userId: "",
      name: ""
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
      const ref = roomRef.push({
        userPoints: [
          {
            userId: this.userId,
            name: this.name,
            isAdmin: true,
            isEdit: false,
            point: ""
          }
        ],
        scoredCards: [{ name: "Total Point", point: 0 }],
        isShowPoint: false
      });
      this.$router.push({ path: `/${ref.key}/${this.userId}` });
    },
    joinNewUser() {
      const ref = database.ref(`rooms/${this.$route.params.roomId}`);
      ref.once("value", res => {
        this.room = res.val();
        if (this.room) {
          const index = this.room.userPoints.findIndex(
            x => x.userId.toLowerCase() == this.userId.toLowerCase().trim()
          );
          if (index >= 0) {
            this.room.userPoints[index].name = this.name;
          } else {
            this.room.userPoints.push({
              userId: this.userId,
              name: this.name,
              isAdmin: false,
              isEdit: false,
              point: ""
            });
          }
          ref.update({ ...this.room });
          this.$router.push({
            path: `/${this.$route.params.roomId}/${this.userId}`
          });
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
      return !this.$route.params.roomId ? "Create Room" : "Join Room";
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
