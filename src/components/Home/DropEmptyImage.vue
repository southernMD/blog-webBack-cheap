<template>
  <div class="draggable-image empty-image" ref="draggableRef">+</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDrop } from 'vue3-dnd';

const props = defineProps<{
    type:number
}>()

const $emit = defineEmits(['change'])
const [collectDrop, drop] = useDrop(() => ({
    accept: 'image',
    drop: (item: CarouselImg) => {
        console.log(item);
        $emit('change',{drag:item,type:props.type})
    },
    collect: (monitor) => ({
        isOver: monitor.isOver(),
    }),
}));
const draggableRef = ref();
onMounted(() => {
    if (draggableRef.value) {
        drop(draggableRef.value);
    }
});
</script>

<style scoped lang="less">
.empty-image{
    border: 1px solid #b1b3b8;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: .2em;
    font-size: 20px;
    user-select: none;
    aspect-ratio: 1/0.75;
}
</style>