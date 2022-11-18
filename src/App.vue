<template>
  <div>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import {my} from './api/index'

  console.log(import.meta.env);
  //自动保存

window.addEventListener('beforeunload', async() => {
  await my()
});
</script>

<style scoped>

</style>
