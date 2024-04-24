<script lang="ts" setup>
import { computed, ref, unref } from 'vue'
import { useDrag, useDrop } from 'vue3-dnd'
import type { Identifier } from 'dnd-core'
import { toRefs } from '@vueuse/core'

const props = defineProps<{
  id: any
  name: string
  index: number
  ar:string
  order:number
  moveCard: (dragIndex: number, hoverIndex: number) => void
  deleteSong: (id:number,order:number) => void
  openSong:(message:any)=>void
}>()

interface DragItem {
  index: number
  id: string
  type: string
}

const card = ref<HTMLDivElement>()
const [dropCollect, drop] = useDrop<
  DragItem,
  void,
  { handlerId: Identifier | null, isShallowOver: boolean }
>({
  accept: 'card',
  collect(monitor) {
    return {
      handlerId: monitor.getHandlerId(),
      isShallowOver: monitor.isOver({ shallow: true })
    }
  },
  drop(item: DragItem, monitor) {
    const dragIndex = item.index
    const hoverIndex = props.index
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    item.index = hoverIndex
  }
})

const [collect, drag] = useDrag({
  type: 'card',
  item: () => {
    return { id: props.id, index: props.index }
  },
  collect: (monitor: any) => ({
    isDragging: monitor.isDragging(),
  }),
})

const { handlerId, isShallowOver } = toRefs(dropCollect)
const { isDragging } = toRefs(collect)
const opacity = computed(() => (unref(isDragging) ? 0 : 1))

const setRef:any = (el: HTMLDivElement) => {
  card.value = drag(drop(el)) as HTMLDivElement
}

const openThisSong = ()=>{
  props.openSong(props.order)
}

</script>

<template>
  <div class="wrapper">
    <div
      :ref="setRef"
      class="card"
      :style="{ opacity }"
      :data-handler-id="handlerId"
    >
      <span class="in">{{ index }} </span>
      <span class="txt" @click="openThisSong"> {{ name }} </span>
      <span class="ar" @click.stop>{{ ar }}</span>
      <span class="del" @click="deleteSong(id,index)">删除</span>
    </div>
    <div v-if="isShallowOver && !isDragging" :class="['indicator', { first: props.index === 0 }]"></div>
  </div>

</template>

<style lang="less" scoped>
.wrapper {
  position: relative;
  padding: .2rem 0;
}
.indicator {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: @font-color;
  &.first {
    top: 0;
    bottom: unset;
  }
}
.card {
  padding: 0.5rem 1rem;
  border: 1px solid gray;
  cursor: move;
  color:@font-color;
  display: flex;
  .in{
    display: inline-block;
    padding-right: 1rem;
    font-size: 14px;
    width: 15px;
  }
  .txt{
    display: inline-block;
    cursor: pointer;
    font-size: 13px;
    width: 80%;
    // background-color: red;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ar{
    // background-color: red;
    width: 20%;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .del{
    cursor: pointer;
    width: 5%;
    font-size: 12px;
  }
}
</style>
