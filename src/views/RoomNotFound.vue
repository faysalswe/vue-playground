<template>
  <div class="container">
    <div>
      <span>⚠</span>
      <h1>Room not found !</h1>
      <p>requested url is not correct or room destroyed</p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  height: 80vh;
}
span {
  font-size: 50px;
  margin: unset;
}
h1 {
  color: lightsalmon;
  margin: unset;
}
p {
  margin: unset;
  font-style: italic;
}
</style>
