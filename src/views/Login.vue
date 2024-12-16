<template>
    <div class="login">
        <div class="page">
            <div class="title">吾有三罪</div>
            <div class="inp">
                <div>决裂</div>
                <el-input v-model="q1" show-password/>
            </div>
            <div class="inp">
                <div>欲望内的求解之源</div>
                <el-input v-model="q2" show-password/>
            </div>
            <div class="inp">
                <div>无法放下的凝望</div>
                <el-input v-model="q3" show-password/>
            </div>
            <div class="btn" @click="go">
                <div>提交</div>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import {ref} from 'vue'
import {useLogin} from '@/store'
import { useRouter } from 'vue-router';
import {ElMessage} from 'element-plus'

const Login = useLogin()
const $router = useRouter()


const q1 = ref('')
const q2 = ref('')
const q3 = ref('')

const go =async()=>{
   let result:LoginState = await Login.reqLogin({q1:q1.value,q2:q2.value,q3:q3.value}) as LoginState
   console.log(result);
   if(result.status == 200){
    $router.push({
        name:'home'
    })
   }else if(result.status == 203){
    result.message?.forEach((value,index)=>{
        console.log(value);
        ElMessage({
            message: value,
            type: 'error',
        })
    })
   }else{

   }
}
</script>

<style lang='less' scoped>
.login{
    background-image: url('@/assets/dj.png');
    width: 100vw;
    height: 100vh;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    background-repeat: no-repeat;
    .page{
        height: 40vh;
        width: 30vw;
        min-height: 450px;
        min-width: 300px;
        background: hsla(0,0%,100%,.5) border-box;
        overflow: hidden;
        border-radius: .5em;
        box-shadow: 0 0 0 1px hsla(0,0%,100%,.3) inset,
        0 .5em 1em rgba(0, 0, 0, 0.6);
        text-shadow: 0 1px 1px hsla(0,0%,100%,.3);
        display: flex;
        align-items: center;
        flex-direction: column;
        &::before{
            content: '';
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            margin: -30px;
            z-index: -1;
            -webkit-filter: blur(20px);
            filter: blur(20px);
        }
        .title{
            margin-top: 15px;
            font-size: 25px;
            color: black;
            user-select: none;
        }
        .inp{
            width: 100%;
            margin:0 auto;
            margin-top: 20px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            >div{
                width: 80%;
                margin:0 auto;
                color: black;
                font-size: 20px;
                margin-top: 5px;
                margin-bottom: 5px;
                user-select: none;
            }
            :deep(.el-input){
                width: 80%;
                margin:0 auto;
                input{
                    color: red;
                }
            }
        }
        .btn{
            width: 100px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid black;
            border-radius: .5em;
            color: black;
            cursor: pointer;
            margin-top: 25px;
            >div{
                user-select: none;
            }
        }
    }
}
</style>