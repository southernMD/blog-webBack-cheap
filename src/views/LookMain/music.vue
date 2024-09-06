<script lang="ts" setup>
import { ref, watch,reactive, toRefs, toRef ,toRaw} from 'vue'
import Card from '@/components/Card.vue'
import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import { delMusic, getMusic, orderMusic, postMusic,postChangeHide } from '@/api'
interface Item {
  id: number
  name: string
  ar:string
  al:string
  hide:string
  songUrl:string
  coverUrl:string
  ifScroll:boolean
  lrc:string
  ifTranslate:boolean
  translate:string
  order:number
}
const cards = ref<Item[]>([])
try {
  //@ts-ignore
  let res:Item[] = (await getMusic()).result
  res.sort((item1,item2)=>{
    return item1.order > item2.order ?1:-1
  })
  console.log(res);
  cards.value = res
} catch (error) {
  cards.value = []
}

const reSort = async()=>{
  cards.value.forEach((it,index)=>{
    it.order = index
  })
  let ids:number[] = []
  cards.value.forEach((item)=>{
    ids.push(item.id)
  })
  await orderMusic(ids)
}

const flag = ref(true)
const showForm = ref(false)
const stopClick = ref(false)
const moveCard = async(dragIndex: number, hoverIndex: number) => {
  const item = cards.value[dragIndex]
  cards.value.splice(dragIndex, 1)
  cards.value.splice(hoverIndex, 0, item)
  await reSort()
}
const openSong = (order:number)=>{
  if(stopClick.value)return
  flag.value = false
  showForm.value = true
  for (let key in cards.value[order]) {
    form[key] = cards.value[order][key];
  }
  console.log(form);
}

watch(cards, () => {
  console.log(cards.value);
}, { deep: true })

let form = reactive({
  id: cards.value[0].id ?? 1,
  name: '',
  ar:'',
  al:'',
  songUrl:'',
  coverUrl:'',
  ifScroll:true,
  lrc:'',
  ifTranslate:true,
  translate:'',
  order:0,
})

const 保存 = ()=>{
  if (!ruleFormRef.value) return
  ruleFormRef.value!.validate(async(valid) => {
    if (valid) {
      if(!stopClick.value){
        console.log('submit!')
        //@ts-ignore
        let t = (await postMusic(form)).state
        console.log(t);
        if(t==200){
          let orderIndex = form.order
          for (let key in form) {
            cards.value[orderIndex][key] = form[key]
          }
        }

      }else{
        console.log('submit!')
        form.order = cards.value.length
        //@ts-ignore
        let id = (await postMusic(form)).result.id
        form.id = id
        let obj = JSON.parse(JSON.stringify(toRaw(form)))
        cards.value.push(obj)

      }
      flag.value = true
      showForm.value = false
      if(stopClick.value)stopClick.value = false
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const 添加 = ()=>{
  console.log('发送请求');
  const newSong = {
    id: -1,
    name: '',
    ar:'',
    al:'',
    songUrl:'',
    coverUrl:'',
    ifScroll:true,
    lrc:'',
    ifTranslate:true,
    translate:'',
    order:0,
  }
  for (let key in newSong) {
    form[key] = newSong[key];
  }
  flag.value = false
  showForm.value = true
  stopClick.value = true
}

const 返回 = ()=>{
  showForm.value = false
  stopClick.value = false
  flag.value = true
}
const ruleFormRef = ref<FormInstance>()
const validatePass = (rule: any, value: string, callback: any) => {
  console.log(value.startsWith('http'));
  if(!value.startsWith('http')){
    callback(new Error('格式错误'))
  }else{
    callback()
  }
}

const rules = reactive({
  songUrl: [{ validator: validatePass, trigger: 'blur' }],
  coverUrl: [{ validator: validatePass, trigger: 'blur' }],
  name:[
    { required: true, message: '不为空', trigger: 'blur' },
  ],
  ar:[
    { required: true, message: '不为空', trigger: 'blur' },
  ],
  al:[
    { required: true, message: '不为空', trigger: 'blur' },
  ],
})

const deleteSong = (id:number,index:number)=>{
  // 
  ElMessageBox.confirm(
    '确认删除吗？',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      //@ts-ignore
      let t = (await delMusic(id)).state
      if(t == 200){
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
      cards.value.splice(index,1)
      await reSort()
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消',
      })
    })
}
const hideSong = async(id:number,index:number)=>{
  console.log( cards.value[index].hide);
  const willHide = cards.value[index].hide == '0'?'1':'0'
  try {
    await postChangeHide({id,hide:+willHide})
    cards.value[index].hide = willHide
    ElMessage({
      message: '更改成功',
      type: 'success',
    })
  } catch (error) {
    ElMessage({
      message: '更改失败',
      type: 'error',
    })
  }
}
</script>

<template>
  <div class="music">
    <div class="main">
      <div class="drag-able">
        <el-scrollbar>
          <DndProvider :backend="HTML5Backend">
            <Card v-for="(card, index) in cards" 
            :id="card.id" :key="card.id" :name="card.name"
            :index="index"
            :order="index"
            :ar="card.ar"
            :hide="+card.hide"
            :open-song="openSong"
            :delete-song="deleteSong"
            :hideSong="hideSong"
            :move-card="moveCard" />
          </DndProvider>
        </el-scrollbar>
      </div>
      <div class="form" v-if="showForm">
        <el-scrollbar>
          <el-form :model="form" label-width="auto"  :rules="rules" ref="ruleFormRef">
              <div class="list">
                <div class="img">
                  <el-image style="width: 240px; height: 240px" :src="form.coverUrl" />
                </div>
                <el-form-item label="封面地址" prop="coverUrl">
                  <el-input v-model="form.coverUrl" />
                </el-form-item>
                <el-form-item label="歌名"  prop="name">
                  <el-input v-model="form.name"/>
                </el-form-item>
                <el-form-item label="歌手" prop="ar">
                  <el-input v-model="form.ar" />
                </el-form-item>
                <el-form-item label="专辑" prop="al">
                  <el-input v-model="form.al" />
                </el-form-item>
                <el-form-item label="音乐地址" prop="songUrl">
                  <el-input v-model="form.songUrl" />
                </el-form-item>
                <el-form-item label="滚动歌词">
                  <el-checkbox v-model="form.ifScroll" size="large" />
                </el-form-item>
                <el-form-item label="歌词" prop="lrc">
                  <el-input
                    v-model="form.lrc"
                    type="textarea"
                  />
                </el-form-item>
                <el-form-item label="存在翻译">
                  <el-checkbox v-model="form.ifTranslate" size="large" />
                </el-form-item>
                <el-form-item label="滚动翻译" v-if="form.ifTranslate" prop="translate">
                  <el-input
                    v-model="form.translate"
                    type="textarea"
                  />
                </el-form-item>
              </div>
          </el-form>
        </el-scrollbar>

      </div>
    </div>
    <div class="option">
      <el-button type="success" v-if="flag" @click="添加">添加</el-button>
      <el-button type="primary" v-else @click="保存">保存</el-button>
      <el-button type="primary" v-if="stopClick" @click="返回">返回</el-button>
    </div>
  </div>
</template>

<style lang="less">
.music {


  .main {
    padding: 2%;
    display: flex;
    .drag-able {
      width: 50%;
      height: 550px;
    }

    .form {
      border: 1px solid @font-color;
      width: 45%;
      height: 550px;
      margin-left: 5%;
      .list{
        display: flex;
        flex-direction: column;
        .img{
          display: flex;
          align-items: center;
          flex-direction: column;
          order: 0;
          .el-image{
            border-radius: .2em;
            padding: 2%;
            .el-image__wrapper{
              position: relative;
              user-select: none;
            }
          }
        }
        >div{
          order: 2;
        }
      }
    }
  }
  .option{
    padding: 0 2%;
  }

}
</style>
