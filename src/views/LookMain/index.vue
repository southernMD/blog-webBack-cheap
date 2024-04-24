<template>
  <div class="common-layout" color-scheme="dark">
    <el-container>
      <transition name="leftShow">
        <el-aside v-show="domWidth > 500 || showLeftFlag && domWidth <= 500" :class="{phoneClass:domWidth <= 500}">
          <div class="mb-2" @click="goIndex">
            <div class="img" ref="headerImg"></div>
          </div>
          <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
            <el-sub-menu index="1">
              <template #title>
                <span>模块</span>
              </template>
              <el-menu-item index="1-1" @click="go('1-1')">发文</el-menu-item>
              <el-menu-item index="1-2" @click="go('1-2')">浏览</el-menu-item>
              <el-menu-item index="1-3" @click="go('1-3')">垃圾桶</el-menu-item>
              <el-menu-item index="1-4" @click="go('1-4')">关于</el-menu-item>
              <el-menu-item index="1-4" @click="go('1-5')">音乐</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <span>实验室</span>
              </template>
              <el-menu-item index="2-1" @click="go('2-1')">提交至github</el-menu-item>
              <!-- <el-menu-item index="2-1" @click="go('2-1')">拾色器</el-menu-item>
              <el-menu-item index="2-2" @click="go('2-2')">图片懒加载</el-menu-item>
              <el-menu-item index="2-3" @click="go('2-3')">文件上传</el-menu-item>
              <el-menu-item index="2-4" @click="go('2-4')">音乐播放器</el-menu-item>
              <el-menu-item index="2-5" @click="go('2-5')">视频播放器</el-menu-item>
              <el-menu-item index="2-6" @click="go('2-6')">聊天室</el-menu-item> -->
            </el-sub-menu>
            <el-menu-item index="3">
              <template #title>
                <div class="messageTitle">
                  <div>消息</div>
                  <div class="number">
                    <div>5</div>
                  </div>
                </div>
              </template>
            </el-menu-item >
          </el-menu>
        </el-aside>
      </transition>

      <div class="modle" @click.self="close" :class="{ 'modle-more': draftOpenFlag && domWidth <= 500 }"
        v-show="(showLeftFlag || draftOpenFlag) && domWidth <= 500"></div>
      <el-main>
        <el-scrollbar>
          <el-header>
            <i class="iconfont icon-caidan" @click="showLeft" v-show="domWidth <= 500"></i>
            <i class="iconfont icon-jiahao_o" :class="{
              'add-pc': domWidth > 500,
              'add-phone': domWidth <= 500
            }" v-show="String($route.name).includes('editor')" @click="newPage"></i>
            <div :class="{
              'draft-pc': domWidth > 500,
              'draft-phone': domWidth <= 500
            }">
              <span @click="openDraft">草稿箱</span>
            </div>
            <el-switch v-model="switchFlag" class="mb-2" @click="toggleDark()" style="--el-switch-on-color: #73767a;" />
            <div class="menu" v-show="draftOpenFlag && domWidth <= 500">
              <el-scrollbar>
                <el-menu index="1">
                  <el-menu-item :index="`1-${index + 1}`" v-for="(val, index) in draftArr" style='
                    display: flex;
                    justify-content: space-between;
                  ' @click="reLoadDraft(index)" :data-id="val" :key="val">
                    <div>{{ val.title }}</div>
                    <div>{{ val.time }}</div>
                  </el-menu-item>
                </el-menu>
              </el-scrollbar>
            </div>
            <el-drawer v-if="domWidth > 500" v-model="draftOpenFlag" title="I am the title" :with-header="false"
              :append-to-body="true">
              <el-menu index="1" style="border:none">
                <el-menu-item :index="`1-${index + 1}`" v-for="(val, index) in draftArr" style="
                    display: flex;
                    justify-content: space-between;
                  " @click="reLoadDraft(index)" :data-id="val" :key="val">
                  <div>{{ val.title }}</div>
                  <div>{{ val.time }}</div>
                </el-menu-item>
              </el-menu>
            </el-drawer>
          </el-header>
          <main>
            <div v-show="$route.name == 'my'">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id, ea sunt molestiae quia quae itaque natus
              voluptas placeat ratione exercitationem officia. Aperiam earum, nostrum inventore quaerat cupiditate omnis
              unde animi.
            </div>
            <Suspense>
              <template #default>
                <router-view v-slot="{ Component }">
                  <transition name="fade">
                    <KeepAlive v-if="$route.fullPath.includes('editor')">
                      <component :is="Component" />
                    </KeepAlive>
                    <component :is="Component" v-else />
                  </transition>
                </router-view>
              </template>
              <template #fallback>
                <div style="color:red">加载中</div>               
              </template>
            </Suspense>

          </main>
        </el-scrollbar>

      </el-main>
    </el-container>
  </div>
</template>

<script lang='ts' setup>
import { useDark, useToggle } from '@vueuse/core'
import { getCurrentInstance, ref, watch, ComponentInternalInstance, onMounted, onUnmounted, toRef, Ref, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { useLogin, useMy } from '@/store';
import { ElAside, ElMessageBox, ElMessage, Action } from 'element-plus'

const $el = getCurrentInstance() as ComponentInternalInstance
const $router = useRouter()
const $route = useRoute()
const Login = useLogin()
const My = useMy()



const isDark = useDark({
  storageKey: 'useDarkKEY',
  // 暗黑class名字
  valueDark: 'dark',
  // 高亮class名字
  valueLight: 'light'
})

const toggleDark = useToggle(isDark)
const switchFlag = ref(false)

watch(switchFlag, () => {
  let headerImg = $el.refs.headerImg as HTMLElement
  if (headerImg) {
    if (switchFlag.value == true) {
      Login.theme = 'dark'
      headerImg.style.backgroundImage = 'url(' + '../../../icon.png' + ')'
      document.documentElement.style.setProperty('--titleColor', `#333`);
      document.documentElement.style.setProperty('--fontColor', `#eee`);
      document.documentElement.style.setProperty('--bkColor', `#000`);
      document.documentElement.style.setProperty('--messageBdColor', `#fff`);
      document.documentElement.style.setProperty('--bkColorReverse', `#fff`);
    } else {
      Login.theme = 'auto'
      headerImg.style.backgroundImage = 'url(' + '../../../iconRed.png' + ')'
      document.documentElement.style.setProperty('--titleColor', `#66ccaa`);
      document.documentElement.style.setProperty('--fontColor', `#66ccff`);
      document.documentElement.style.setProperty('--bkColor', `#fff`);
      document.documentElement.style.setProperty('--messageBdColor', `#000`);
      document.documentElement.style.setProperty('--bkColorReverse', `#000`);
    }
  }
}, { immediate: true })

onMounted(() => {
  let model = localStorage.getItem('useDarkKEY')
  let headerImg = $el.refs.headerImg as HTMLElement
  if (model == 'dark') {
    switchFlag.value = true;
    Login.theme = 'dark'
    headerImg.style.backgroundImage = 'url(' + '../../../icon.png' + ')'
    document.documentElement.style.setProperty('--titleColor', `#333`);
    document.documentElement.style.setProperty('--fontColor', `#eee`);
    document.documentElement.style.setProperty('--bkColor', `#000`);
    document.documentElement.style.setProperty('--messageBdColor', `#fff`);
    document.documentElement.style.setProperty('--bkColorReverse', `#fff`);
  } else {
    switchFlag.value = false;
    Login.theme = 'auto'
    headerImg.style.backgroundImage = 'url(' + '../../../iconRed.png' + ')'
    document.documentElement.style.setProperty('--titleColor', `#66ccaa`);
    document.documentElement.style.setProperty('--fontColor', `#66ccff`);
    document.documentElement.style.setProperty('--bkColor', `#fff`);
    document.documentElement.style.setProperty('--messageBdColor', `#000`);
      document.documentElement.style.setProperty('--bkColorReverse', `#000`);
  }
})

const go = (way: string) => {
  if (way === '1-1') {
    console.log('1-1');
    $router.push({
      name: 'editor'
    })
  }else if(way === '1-3'){
    $router.push({
      name: 'trash'
    })
  }else if(way === '1-2'){
    $router.push({
      name: 'look'
    })
  }else if(way === '1-4'){
    $router.push({
      name: 'about'
    })
  }else if(way === '1-5'){
    $router.push({
      name: 'music'
    })
  }
}

const goIndex = () => {
  $router.push({
    path: '/my'
  })
}

let domWidth = toRef(Login,'windowWidth')

const windResize = () => {
  domWidth.value = document.body.clientWidth
  Login.windowWidth = domWidth.value
}

onMounted(() => {
  window.addEventListener('resize', windResize)
  nextTick(()=>{
    domWidth.value = document.body.clientWidth
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', windResize)
})

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

//打开草稿箱
let draftOpenFlag = ref(false)
const openDraft = () => {
  draftOpenFlag.value = !draftOpenFlag.value
}

//获取草稿箱
const writing = toRef(My, 'writing')
const draftArr = toRef(My, 'draftArr')
const getDraft = async () => {
  await My.reqDraft()
}

onMounted(() => {
  getDraft()
})

//打开草稿文章
const saveText = async () => {
  writing.value.imgUrl = '1.jpg'
  writing.value.state = '保存'

  let obj: ArticleObj = {
    title: writing.value.title || '[save]',
    title2: writing.value.title2 || '[save]',
    time: writing.value.time,
    text: writing.value.text || '[save]',
    gather: writing.value.gather || '[save]',
    tags: writing.value.tags || '[save]',
    state: writing.value.state,
    imgUrl: writing.value.imgUrl,
    ifpublic: writing.value.ifpublic,
    id: writing.value.id
  }
  console.log(obj);
  postA(obj, '保存')
}
const postA = async (obj: ArticleObj, ms: string) => {
  //axios提交
  const result: PostArticle | ErrorVar = await My.reqPostArticle(obj)
  console.log(result);
  if ((result as PostArticle).status == 200) {
    ElMessage({
      message: `${ms}成功`,
      type: 'success',
      onClose: () => {
        draftArr.value[My.saveIndex] = obj as DraftArr
        My.reqDraft()
        if (ms != '保存') {
          $router.push({
            name: 'my',
          })
        }
      }
    })
  } else if ((result as ErrorVar).statusCode != 200) {
    ElMessage({
      message: `${ms}失败,error:${(result as ErrorVar).error}`,
      type: 'error',
    })
  }
}

const readAndClear = (index: number | undefined) => {
  if (index != undefined) {
    Object.keys(draftArr.value[index]).forEach((key) => {
      if (draftArr.value[index][key] == '[save]') {
        writing.value[key] = ''
      } else {
        writing.value[key] = draftArr.value[index][key]
      }
    })
    My.saveIndex = index
  } else {
    Object.keys(writing.value).forEach((key) => {
      if (key == 'id') {
        writing.value[key] = null
      } else if (key == 'ifpublic') {
        writing.value[key] = 'true'
      } else {
        writing.value[key] = ''
      }
    })
    My.newPageFlag = true
  }
}

const reLoadDraft = async (index?: number) => {
  let saveFlag = ref(false)
  console.log(index);
  if (My.saveIndex != -1) {
    console.log(draftArr.value[My.saveIndex], writing.value);
    Object.keys(writing.value).forEach((key) => {
      if (key != 'id' && key != 'time') {
        if (writing.value[key] != draftArr.value[My.saveIndex][key]) {
          if (!(writing.value[key] == '' && draftArr.value[My.saveIndex][key] == '[save]')) {
            console.log(writing.value[key], draftArr.value[My.saveIndex][key]);

            saveFlag.value = true;
          }
        }
      }

    })
  } else {
    Object.keys(writing.value).forEach((key) => {
      if (writing.value[key] != '' && writing.value[key] != null) {
        if(key != 'ifpublic' && key != 'time'){
          console.log(key,'wwwwwwwwwwwwww&&&&&&&&&&&&&&');
          
          saveFlag.value = true;
        }
      }
    })
  }
  if (saveFlag.value == true && $route.fullPath.includes('editor')) {
    await ElMessageBox.confirm(
      '当前文章未保存，你是要保存还是放弃',
      '警告',
      {
        distinguishCancelAndClose: true,
        confirmButtonText: '保存',
        cancelButtonText: '放弃',
        type: 'warning',
      }
    )
      .then(() => {
        saveText()
        readAndClear(index)
      })
      .catch((action: Action) => {
        if (action == 'cancel') {
          readAndClear(index)
          $router.push({
            name: 'editor',
          })
        }
        // My.clearWriting()
      })
  } else {
    readAndClear(index)
    $router.push({
      name: 'editor',
    })
  }


  draftOpenFlag.value = false
}

//手机控制显示
let showLeftFlag = ref(false)

const close = () => {
  draftOpenFlag.value = false
  showLeftFlag.value = false
}

const showLeft = () => {
  showLeftFlag.value = true
  draftOpenFlag.value = false
}

//换新一页
const newPage = () => {
  reLoadDraft()
  My.saveIndex = -1
  ElMessage({
    message: 'new',
    type: 'success',
  })
}
</script>

<style lang='less' scoped>
//开始过度
.leftShow-enter-from {
  transform: translateX(-100px);
}

//开始过度了
.leftShow-enter-active {
  transition: all 0.2s linear;
}

//过度完成
.leftShow-enter-to {
  transform: translateX(0);
}

//开始过度
.leftShow-leave-from {
  transform: translateX(0);
}

//开始过度了
.leftShow-leave-active {
  transition: all 0.2s linear;
}

//过度完成
.leftShow-leave-to {
  transform: translateX(-100px);
}

//开始过度
.fade-enter-from {
  transform: translateX(-100px);
  opacity: 0;
}

//开始过度了
.fade-enter-active {
  transition: all 0.5s ease-in-out;
}

//过度完成
.fade-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.common-layout {
  :deep(.el-aside) {
    // background-color: red;
    height: 100vh;
    border-right: #b1b3b8 1px solid;
    overflow-x: hidden;
    z-index: 5;
    position: relative;

    .mb-2 {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100px;
      border-bottom: #b1b3b8 1px solid;
      cursor: pointer;

      .img {
        height: 70px;
        width: 70px;
        background-image: url('../../../icon.png');
        background-repeat: no-repeat;
      }
    }

    .el-menu {
      .is-active {
        color: @font-color;
      }
      .messageTitle{
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        .number{
          height: 20px;
          width: 30px;
          border: 1px solid @message-bd-color;
          color: @bk-color-reverse;
          font-size: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          user-select: none;
          border-radius: 2em;
        }
      }
    }
  }

  :deep(.phoneClass) {
    background-color: @bk-color;
    position: fixed;
    left: 0;
    z-index: 5;
  }

  .modle {
    width: 100vw;
    height: 100vh;
    background-color: var(--el-overlay-color-lighter);
    position: fixed;
    left: 0;
    z-index: 4;
  }

  .modle-more {
    z-index: 2;
  }

  :deep(.el-main) {
    // background-color: saddlebrown;
    padding: 0;
    overflow: hidden;

    main {
      height: calc(100vh - 60px);
      // width: calc(100vw - 300px);
    }
  }

  :deep(.el-header) {
    // background-color: cadetblue;
    background-color: @title-color;
    position: relative;
    border-bottom: #b1b3b8 1px solid;
    z-index: 3;

    .el-switch {
      position: absolute;
      top: 0px;
      bottom: 0px;
      margin: auto 0;
      right: 40px;
    }

    .draft-pc {
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 18px;
      user-select: none;

      >span {
        cursor: pointer;
      }
    }

    .draft-phone {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 18px;
      user-select: none;

      >span {
        cursor: pointer;
      }
    }

    i {
      position: absolute;
      top: 0px;
      bottom: 0px;
      margin: auto 0;
      left: 30px;
      font-size: 40px;
      width: 40px;
      height: 40px;
      cursor: pointer;
    }

    .add-pc {
      left: 100px;
      font-size: 30px;
      width: 30px;
      height: 30px;
    }

    .add-phone {
      left: 100px;
      font-size: 30px;
      width: 30px;
      height: 30px;
    }

    .menu {
      background: @bk-color;
      position: absolute;
      width: 100%;
      left: 0;
      z-index: 5;
      height: 200px;
    }
  }
}

@media screen and (max-width: 800px) {
  :deep(.el-aside) {
    width: 150px !important;
  }
}
</style>