<template>
  <div
    class="bg-image"
    :style="{
      backgroundImage: 'url(' + require('@/assets/background.jpg') + ')'
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
  height: 3rem;
  font-size: 1.1rem;
  font-weight: normal;
  margin-left: 0.5rem;
}

.bg-image {
  height: 100vh;
  width: 100vw;
  background-repeat: no-repeat;
}
</style>
