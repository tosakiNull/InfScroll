<template>
  <div class="loading-container">
    <div class="loader">
      <span class="loader-dot"></span>
      <span class="loader-dot"></span>
      <span class="loader-dot"></span>
      <span class="loader-text"></span>
    </div>
  </div>
</template>
<style scoped>
$width: 250px;
$height: 20px;

.loading-container {
  width: 100%;
  height: 100vh;
  border: solid;
  background-color: #000000;
}
.loader-dot {
  height: $height;
  width: $width;
  position: absolute;
  top: 0;
  left: 0;
  margin: auto;
}
.loader {

}
</style>
