<template>
  <div class="container">
    <div>
      <h2>Join Room</h2>
      <form @submit="joinRoom($event)">
        <input type="text" v-model="userId" placeholder="UserId" />
        <input type="text" v-model="name" placeholder="Name" />
        <button type="submit">Join</button>
      </form>
    </div>
  </div>
</template>

<script>
import { database } from "../firebase/firebase";
export default {
  name: "join-room",
  data() {
    return {
      userId: "",
      name: ""
    };
  },
  methods: {
    joinRoom($event) {
      $event.preventDefault();
      const ref = database.ref(`rooms/${this.$route.params.roomId}`);
      if (!this.name && !this.userId) return;
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
        path: `/scrum-poker/${this.$route.params.roomId}/${this.userId}`
      });
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 70vh;
}
</style>
