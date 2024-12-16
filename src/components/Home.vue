<template>
  <div class="">
    home
  </div>
</template>

<script setup lang="ts">
import { getCarousel, getHeadImg, getIndexMsg } from '@/api';
import {ref} from 'vue'
const inexdMsg = ref('')
const headeImg = ref()
const carouselImg = ref();
const t = (await getIndexMsg()).data.result
const t1 = (await getHeadImg()).data.result
const t2= (await getCarousel()).data.result
console.log(t,t1,t2,"JJJJJJJJJJJJJJJJJJJJJJJJJJJ");

// try {
//     inexdMsg.value = (await getIndexMsg()).data.result
    // headeImg.value = (await getHeadImg()).data.result
    // carouselImg.value = (await getCarousel()).data.result
// } catch (error) {
//     console.log(error);
    
// }

</script>

<style scoped lang="less"></style>