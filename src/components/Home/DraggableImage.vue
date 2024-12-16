<template>
    <div ref="draggableRef" class="draggable-image" :class="{hidden:collectDrag.isDragging}">
        <el-image :src="item.imgUrl" fit="cover" />
    </div>
</template>

<script setup lang="ts">
import { useDrag, useDrop } from 'vue3-dnd';
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
    item: CarouselImg;
}>();

const draggableRef = ref(null);

const [collectDrag, drag, preview] = useDrag(() => ({
    type: 'image',
    item: () => props.item,
    collect: (monitor) => ({
        isDragging: monitor.isDragging(),
    }),
}));

const $emit = defineEmits(['change'])
const [collectDrop, drop] = useDrop(() => ({
    accept: 'image',
    drop: (item: CarouselImg) => {
        $emit('change',{drag:item,place:props.item})
    },
    collect: (monitor) => ({
        isOver: monitor.isOver(),
    }),
}));

onMounted(() => {
    if (draggableRef.value) {
        drag(draggableRef.value);
        drop(draggableRef.value);
    }
});
</script>

<style scoped lang="less">
.hidden{
    opacity: 0;
}
</style>