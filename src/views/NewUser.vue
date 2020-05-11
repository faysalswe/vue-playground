<template>
  <div class="container">
    <div>
      <h2>{{ heading }}</h2>
      <form @submit="newUser($event)">
        <input
          type="text"
          v-model="userId"
          @keydown="onChangeUser()"
          placeholder="UserId"
        />
        <input type="text" v-model="name" placeholder="Name" />
        <button type="submit">{{ button }}</button>
      </form>
    </div>
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
      });
      this.$router.push({
        path: `/${this.$route.params.roomId}/${this.userId}`
      });
    },
    onChangeUser() {
      this.userId = this.userId.trim().toLowerCase();
    }
  },
  computed: {
    heading: function() {
      return !this.$route.params.roomId ? "Create room" : "Join room";
    },
    button: function() {
      return !this.$route.params.roomId ? "Create" : "Join";
    }
  }
};
</script>

<style scoped>
input {
  font-size: 16px;
  font-weight: normal;
  margin-left: 2px;
}
.container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 70vh;
}
</style>
