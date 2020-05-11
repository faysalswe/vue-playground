<template>
  <div class="container">
    <div class="item">
      <h2>Create Room</h2>
      <form @submit="createRoom($event)">
        <input type="text" v-model="userId" placeholder="Admin userId" />
        <input type="text" v-model="name" placeholder="Admin name" />
        <button type="submit">Create</button>
      </form>
    </div>
  </div>
</template>

<script>
import { roomRef } from "../firebase/firebase";
export default {
  name: "create-room",
  data() {
    return {
      userId: "",
      name: ""
    };
  },
  methods: {
    createRoom($event) {
      $event.preventDefault();
      if (!this.name && !this.userId) return;
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
      this.$router.push({ path: `/scrum-poker/${ref.key}/${this.userId}` });
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
