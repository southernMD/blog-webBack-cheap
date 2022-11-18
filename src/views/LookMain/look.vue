<template>
    <div class="look">
        <el-card class="box-card" :class="{'box-card-ph':windowWidth <= 500}">
            <div class="title">
                <el-row>
                    <el-col :lg="1" :md="1" :sm="1" :xs="1">
                        <template #default>
                            <div class="name"> </div>
                        </template>
                    </el-col>
                    <el-col :lg="4" :md="7" :sm="8" :xs="8">
                        <template #default>
                            <div class="name">标题</div>
                        </template>
                    </el-col>
                    <el-col :lg="10" :md="8" :sm="8" :xs="8">
                        <template #default>
                            <div class="name">正文</div>
                        </template>
                    </el-col>
                    <el-col :lg="2" :md="2" :sm="4" :xs="4">
                        <template #default>
                            <div class="name">状态</div>
                        </template>
                    </el-col>
                    <el-col :lg="6" :md="6" :sm="3" :xs="3">
                        <template #default>
                            <div class="name">操作</div>
                        </template>
                    </el-col>
                </el-row>
            </div>
            <el-scrollbar>
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-checkbox-group v-model="checkList">
                        <el-collapse-item :title="val[0]" :name="val[0]" v-for="val in gatherList" :key="val[0]">
                            <el-scrollbar>
                                <div class="list">
                                    <div class="list-item" :class="{'list-item-heigher':windowWidth<996  && !iconMap.get(obj.id)}" v-for="(obj,index) in val[1]" :key="obj.id">
                                        <el-row :class="{'el-row-heigher':windowWidth<996}">
                                            <el-col :lg="1" :md="1" :sm="1" :xs="1">
                                                <template #default>
                                                    <div class="name" :class="{'el-checkbox-heigher':windowWidth<996}">
                                                        <el-checkbox :label="obj.id" size="large" />
                                                    </div>
                                                </template>
                                            </el-col>
                                            <el-col :lg="4" :md="7" :sm="8" :xs="8">
                                                <template #default>
                                                    <div class="name">{{obj.title}}</div>
                                                </template>
                                            </el-col>
                                            <el-col :lg="10" :md="8" :sm="8" :xs="8">
                                                <template #default>
                                                    <div class="name">{{obj.text}}</div>
                                                </template>
                                            </el-col>
                                            <el-col :lg="2" :md="2" :sm="4" :xs="4">
                                                <template #default>
                                                    <div class="name">{{obj.ifpublic == 'true'?'公开':'隐私'}}</div>
                                                </template>
                                            </el-col>
                                            <el-col :lg="6" :md="6" :sm="3" :xs="3">
                                                <template #default>
                                                    <div class="name" v-if="windowWidth>=996 ">
                                                        <el-button type="primary" @click="Editor(val[0],obj.id)">编辑</el-button>
                                                        <el-button type="success" @click="throttleChangePublic(obj.ifpublic,obj.id,val[0],index)">{{obj.ifpublic !== 'true'?'公开':'隐私'}}</el-button>
                                                        <el-button type="danger" @click="Delete(obj.id)">删除</el-button>
                                                    </div>
                                                    <div class="ELicon" v-else>
                                                        <el-icon @click="changeIcon(obj.id,false)" v-if="iconMap.get(obj.id)"><ArrowRight /></el-icon>
                                                        <el-icon @click="changeIcon(obj.id,true)" v-else><ArrowDown /></el-icon>
                                                    </div>
                                                </template>
                                            </el-col>
                                            <el-col :span="24" v-if="windowWidth<996 && !iconMap.get(obj.id)">
                                                <template #default>
                                                    <div :id="`slot_${obj.id}`" class="slotbtns">
                                                        <el-button type="primary" @click="Editor(val[0],obj.id)">编辑</el-button>
                                                        <el-button type="success" @click="throttleChangePublic(obj.ifpublic,obj.id,val[0],index)">{{obj.ifpublic !== 'true'?'公开':'隐私'}}</el-button>
                                                        <el-button type="danger" @click="Delete(obj.id)">删除</el-button>
                                                    </div>
                                                </template>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-scrollbar>
                        </el-collapse-item>
                    </el-checkbox-group>
                </el-collapse>
            </el-scrollbar>
        </el-card>
        <div class="option-all">
            <el-button type="danger" @click="Delete(checkList)">删除选中</el-button>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, toRef, watch ,Ref} from 'vue'
import { useLogin, useMy } from '@/store';
import {ArrowRight,ArrowDown} from '@element-plus/icons-vue'
import {ElMessage,ElMessageBox} from 'element-plus'
import { useRouter } from 'vue-router';
import { throttle} from 'lodash'
const $router = useRouter()
const Login = useLogin()
const My = useMy()
const multipleSelection = ref<any[]>([])
await My.reqLooking()
let lookingArr = toRef(My,'lookingArr') 
let gatherList:Ref<Map<string,DraftArr[]>> = ref(new Map())
let iconMap:Ref<Map<number,boolean>> = ref(new Map())
let activeNames = toRef(My,'lookactiveNames')
let windowWidth = toRef(Login,'windowWidth')
let checkList = ref([])
const changeGatherList = ()=>{
    gatherList.value = new Map()
    lookingArr.value.forEach((val)=>{
        if(!gatherList.value.has(val.gather)){
            gatherList.value.set(val.gather,[val])
        }else{
            let t = gatherList.value.get(val.gather) as DraftArr[]
            t.push(val)
            gatherList.value.set(val.gather,t)
        }
        iconMap.value.set(val.id,true)
    })
}

watch(lookingArr,()=>{
    console.log(gatherList);
    
    changeGatherList()
},{immediate:true})

const changeIcon = (id:number,flag:boolean)=>{
    iconMap.value.set(id,flag)
}

let PHWidth = toRef(Login, 'windowWidth')
// let tableData = toRef(My, 'trashArr')
const tableData = [
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
    { title: 1, text: 'dasdad', restOfTime: 0 },
]
const handleChange = (val: string[]) => {
    console.log(val)
}

const handleSelectionChange = (val: any[]) => {
    multipleSelection.value = val
    console.log(multipleSelection.value);
}

let writing = toRef(My,'writing')
const Editor = (key:string,id:number) => {
    let arr = gatherList.value.get(key) as DraftArr[]
    for (let i = 0;i<arr?.length ;i++){
        if(arr[i].id == id){
            Object.keys(writing.value).forEach((key)=>{
                writing.value[key] = arr[i][key]
            })
        }
    }
    $router.push({
        name:'editor'
    })
}

const ChangePublic = async (ifPublic:string,id:number,key:string,index:number) => {
    let result:BaseRes
    if(ifPublic === 'true'){    //去隐私
        result = await My.reqPublic('false',id)
        let arr = gatherList.value.get(key) as DraftArr[]
        arr[index].ifpublic = 'false'
        gatherList.value.set(key,arr)
    }else{
        result = await My.reqPublic('true',id)
        let arr = gatherList.value.get(key) as DraftArr[]
        arr[index].ifpublic = 'true'
        gatherList.value.set(key,arr)
    }
    if(result.status == 200){
        ElMessage({
            type: 'success',
            message: '成功'
        })
    }
}
const throttleChangePublic = throttle(ChangePublic, 2000, { trailing: true })

//删除
const reqDel = async (id:number | number[])=>{
    let result = await My.reqDel(id.toString())
    if(result.status == 200){
        ElMessage({
            type: 'success',
            message: '成功',
        })
        let idArr = id.toString().split(',')
        let lookingArrCopy = Array.from(lookingArr.value) 
        idArr.forEach((id)=>{
            let index = lookingArrCopy.findIndex((obj)=>{
                return +id == obj.id
            })
            console.log(index);
            lookingArrCopy.splice(index,1)
        })
        console.log(lookingArrCopy);
        
        lookingArr.value = lookingArrCopy
    }
}

const Delete = (id:number | number[]) => {
    if(id instanceof Array && id.length == 0){
        ElMessage({
            type:'error',
            message:'请选择至少一个'
        })
        return
    }
    ElMessageBox.confirm(
        '确定删除么，你可以在垃圾箱内找到它',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        reqDel(id);
    })
}
</script>
  
<style scoped lang="less">
.look {
    height: calc(100% - 40px);
    user-select: none;
    .list {
        height: 200px;

        .list-item {
            height: 60px;
            :deep(.slotbtns){
                height: 60px;
                width: 100%;
            }
        }
        .list-item-heigher{
            height: 120px;
        }
    }
    .option-all{
        margin: 20px 20px;
    }

}

:deep(.el-table td.el-table__cell div) {
    white-space: nowrap;
}

:deep(.el-card) {
    height: 92%;

    .el-card__body {
        height: 92%;
    }

    .el-table__row {
        height: 60px;
    }
    :not(.title){
        .name{
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }

}

.el-checkbox-heigher{
    >label{
        display: block;
    }
}
.ELicon{
    display: flex;
    justify-content: center;
    align-items: center;
    >.el-icon{
        cursor: pointer;
    }
}

:deep(.el-row) {
    align-items: center;
    height: 100%;
    .el-checkbox{
        .el-checkbox__label{
            display: none;
        }
    }
}

:deep(.el-row-heigher){
    align-items: start;
    height: 50%;
}
:deep(.el-scrollbar__bar){
    right: -2px !important;
}
:deep(.el-collapse-item){
    .el-scrollbar__bar{
        right: 6px !important;
    }
}
:deep(.el-collapse-item__header){
    user-select: none;
}
.box-card {
    margin: 20px 20px;

    .title {
        height: 40px;
        border: 1px solid #606266;
    }

    .btns-phone {
        display: flex;
        justify-content: center;
    }
}
.box-card-ph{
    margin: 0 !important;
    .el-card__body{
        padding: 0;
    }
}
</style>
  