<template>
  <div class="main">
    <el-input
    v-model="textarea"
    :autosize="{ minRows: 2, maxRows: 50 }"
    type="textarea"
    placeholder="Please input"
    resize="none"/>
    <div class="btns">
        <el-button type="primary" @click="back">撤销</el-button>
        <el-button type="warning" @click="save">暂存</el-button>
        <el-button type="success" @click="post">保存</el-button>
    </div>
    <div class="btns">
        <el-button type="warning" @click="loadSave">查看暂存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {getabout,postabout} from '@/api'
import { ElMessage } from 'element-plus'
const textarea = ref('')
const message = await getabout()
//@ts-ignore
const oldmessage = message.result
textarea.value = oldmessage

const back = ()=>{
    textarea.value = oldmessage
    ElMessage({
        message: '撤销成功',
        type: 'success',
    })
}

const save = ()=>{
    localStorage.setItem('about',textarea.value)
    ElMessage({
        message: '暂存成功',
        type: 'success',
    })
}

const loadSave = ()=>{
    textarea.value = localStorage.getItem('about') as string
    ElMessage({
        message: '读取暂存成功',
        type: 'success',
    })
}

const post = async()=>{
    const status = (await postabout(textarea.value)).status
    console.log(status);
    if(status == 200){
        ElMessage({
            message: '保存成功',
            type: 'success',
        })
    }else{
        ElMessage({
            message: '保存失败',
            type: 'error',
        })
    }

}
</script>

<style scoped lang="less">
.main{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .btns{
        margin-top: 20px;
    }
}
</style>