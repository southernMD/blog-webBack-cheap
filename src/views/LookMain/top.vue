<script lang="ts" setup>
import { getArticleShort,changeIfTop } from "@/api";
import { ElMessage } from "element-plus"
import { ref,Ref } from "vue";

const checkList:Ref<boolean[]> = ref([])
const list:Ref<any[]> = ref([])
try {
  let result = (await getArticleShort())
  if(result.status == 200){
    //@ts-ignore
    list.value = result.result
    checkList.value = list.value.map((item:any)=>{
        return item.if_top ? true:false
    })
    console.log(checkList.value);
  }else{
    throw('')
  }
} catch (error) {
  console.log(error);
}

const changeWay = async(index:number)=>{
  console.log(index,checkList.value[index]);
  let type:0 | 1 = checkList.value[index]?1:0
  try {
    //@ts-ignore
    const state = (await changeIfTop({id:list.value[index].id,type})).state
    console.log(state);
    if(state == 410){
      ElMessage({
        message: '最多只能添加两个，请先取消',
        type: 'error',
      })
      checkList.value[index] = !checkList.value[index]
    }else if(state!= 200){
      throw('')
    }
  } catch (error) {
    console.log(error);
    ElMessage(String(error))
    checkList.value[index] = !checkList.value[index]
  }
}
</script>

<template>
  <div class="top">
    <div class="item" v-for="i,index in list">
      <div class="title">{{ i.title }}</div>
      <div class="gather">{{ i.gather }}</div>
      <div class="iftop">
        <el-checkbox v-model="checkList[index]" @change="changeWay(index)">{{ checkList[index]?'是':'否' }}</el-checkbox>
      </div>
    </div>
  </div>
</template>

<style lang="less">
  .top{
    display: flex;
    width: calc(100% - 20px);
    margin: 20px;
    padding-bottom: 70px;
    flex-wrap: wrap;
    .item{
      margin: 5px; /* 可选的间距 */
      height: 100px;
      flex: 0 0 calc((100% - 50px)/4); /* 不要拉伸项目 */
      border-radius:.5em;
      border:1px solid @font-color;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;       
      text-overflow: ellipsis;
      white-space: nowrap; 
      >div{
        margin: 5px;
      }
      .title{
        max-width:  calc((100% - 50px)/4);
      }
      .gather{
        font-size: 12px;
        height: 20px;
        max-width: 300px;
        width: 50px;
        border: 1px solid @font-color;
        border-radius: 5em;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
      }
      .iftop{
        width: 100px;
      }
    }
  }
</style>
