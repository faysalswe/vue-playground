<template>
  <div>
    <h1>Nested Route</h1>
    <test-link> </test-link>
    <router-view></router-view>
  </div>
</template>

<script>
import Links from "../views/Links";

export default {
  components: {
    "test-link": Links
  }
};
</script>

<style></style>
