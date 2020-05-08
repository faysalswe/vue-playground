<template>
  <div>
    <h1>Posts</h1>
    <div v-for="(post, index) in posts" :key="index" class="card">
      <h4>
        {{ post.title }}
      </h4>
      {{ post.body }}
      <router-link :to="`post/${post.id}`">view full</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "posts",
  data() {
    return {
      posts: []
    };
  },
  created() {
    fetch("https://jsonplaceholder.typicode.com/posts", { method: "GET" })
      .then(res => res.json())
      .then(data => (this.posts = data));
  }
};
</script>

<style>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px; /* 5px rounded corners */
  margin: 1rem;
  padding: 2rem;
}
</style>
