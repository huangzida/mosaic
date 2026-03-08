<script setup lang="ts">
import { Mosaic } from '../src/index'
</script>

<template>
  <div class="playground">
    <Mosaic debug />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
.playground {
  width: 100vw;
  height: 100vh;
  background: #000;
}
</style>
