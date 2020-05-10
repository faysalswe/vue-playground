<template>
  <div>
    <h4>{{ this.post.title }}</h4>
    <p>{{ this.post.body }}</p>
    <div>
      <div class="comment" v-for="(comment, index) in comments" :key="index">
        <div class="body">{{ comment.body }}</div>
        <div class="user">{{ `👉 ${comment.name}(${comment.email})` }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "post",
  data() {
    return {
      post: {},
      comments: []
    };
  },
  watch: {
    $route(to, from) {
      if (from.params.id !== to.params.id) {
        this.getPost();
      }
    }
  },
  created() {
    this.getPost();
  },
  methods: {
    getPost() {
      fetch(
        `https://jsonplaceholder.typicode.com/posts/${this.$route.params.id}`
      )
        .then(res => res.json())
        .then(data => (this.post = data));
      fetch(
        `https://jsonplaceholder.typicode.com/posts/${this.$route.params.id}/comments`
      )
        .then(res => res.json())
        .then(data => (this.comments = data));
    }
  }
};
</script>

<style>
p {
  font-size: 18px;
  text-align: left;
  padding: 0rem 2rem;
}
.user {
  font-style: italic;
  color: lightgray;
  text-align: right;
}
.comment {
  text-align: left;
  padding: 1rem 7rem;
}
.body {
  text-align: left;
}
</style>
