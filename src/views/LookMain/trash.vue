<template>
    <div class="trash">
        <div class="title">垃圾桶会保留你的文章十五天</div>
        <el-card class="box-card">
            <el-table :data="tableData" border style="width: 100%;height: 95%;"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40" />
                <el-table-column prop="title" label="标题" width="200" height="60" />
                <el-table-column prop="text" label="正文" />
                <el-table-column prop="state" label="状态" width="60" />
                <el-table-column prop="restOfTime" label="剩余时间" width="90" class-name="sss" />
                <el-table-column fixed="right" prop="address" :width="40" label="操作" type="expand"
                    v-if="PHWidth <= 500">
                    <template #default="scope">
                        <div class="btns">
                            <el-button type="primary" @click="Recover(scope.$index, scope.row)">恢复</el-button>
                            <el-button type="danger" @click="Delete(scope.$index, scope.row)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" prop="address" :width="200" label="操作" v-else>
                    <template #default="scope">
                        <div class="btns">
                            <el-button type="primary" @click="Recover(scope.$index, scope.row)">恢复</el-button>
                            <el-button type="danger" @click="Delete(scope.$index, scope.row)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <div class="option">
            <el-button type="danger" @click="DeleteSelect">删除选中</el-button>
            <el-button type="primary" @click="RecoverSelect">恢复选中</el-button>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { onMounted, ref, toRef, watch } from 'vue'
import { useLogin, useMy } from '@/store';
import { ElMessageBox,ElMessage } from 'element-plus'
const Login = useLogin()
const My = useMy()
My.reqTrash()
let tableData = toRef(My, 'trashArr')
// const tableData = [
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
//     {title:1,text:'dasdad',restOfTime:0},
// ]

let phoneWidth = ref(200)
let phoneType = ref('')

let PHWidth = toRef(Login, 'windowWidth')


const multipleSelection = ref<any[]>([])

const handleSelectionChange = (val: any[]) => {
    multipleSelection.value = val
    console.log(multipleSelection.value);
}

const Recover = (index: number, row: any) => {
    console.log(index, row)
    ElMessageBox.confirm(
        '恢复？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async() => {
        let result = await My.reqRecover(row.id.toString())
        tableData.value.splice(index, 1)
        My.reqDraft()
        if(result.status == 200){
            ElMessage({
                message: '恢复成功',
                type: 'success',
            })
        }
    })
}
const Delete = (index: number, row: any) => {
    ElMessageBox.confirm(
        '永久删除？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async() => {
        let result = await My.reqDelForever(row.id.toString())
        tableData.value.splice(index, 1)
        if(result.status == 200){
            ElMessage({
                message: '删除成功',
                type: 'success',
            })
        }
    })
    console.log(index, row)
}

const DeleteSelect = () => {
    ElMessageBox.confirm(
        '永久删除？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async() => {
        let idArr: any = []
        multipleSelection.value.forEach((val) => {
            idArr.push(val.id)
            for (let i = 0; i < tableData.value.length; i++) {
                if (val.id == tableData.value[i].id) {
                    tableData.value.splice(i, 1)
                    break
                }
            }
        })
        let result = await My.reqDelForever(idArr.toString())
        if(result.status == 200){
            ElMessage({
                message: '删除成功',
                type: 'success',
            })
        }

    })
}

const RecoverSelect = () => {
    ElMessageBox.confirm(
        '恢复？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async() => {
        let idArr: any = []
        multipleSelection.value.forEach((val) => {
            idArr.push(val.id)
            for (let i = 0; i < tableData.value.length; i++) {
                if (val.id == tableData.value[i].id) {
                    tableData.value.splice(i, 1)
                    break
                }
            }
        })
        let result = await My.reqRecover(idArr.toString())
        if(result.status == 200){
            My.reqDraft()
            ElMessage({
                message: '恢复成功',
                type: 'success',
            })
        }
    })
}
</script>

<style lang='less' scoped>
.trash {

    margin: 20px 40px;
    height: calc(100% - 40px);

    .title {
        height: 40px;
        user-select: none;
    }

    :deep(.el-card) {
        height: 100%;

        .el-card__body {
            height: 100%;
        }

        .el-table__row {
            height: 60px;
        }
    }

    .btns {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    :deep(.el-table td.el-table__cell div) {
        white-space: nowrap;
    }

    .option {
        margin-top: 20px;
        margin-left: 10px;
        height: 150px;
    }
}
</style>