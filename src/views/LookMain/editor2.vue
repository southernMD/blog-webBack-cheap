<template>
    <div class="editor2">
        <div class="title-url">
            <el-input v-model="Url" placeholder="文章头图地址" />
        </div>
        <div class="img">
            <el-image :src="Url" class="avatar" ref="img" fit="cover">
                <template #error>
                    <div class="image-slot">
                    </div>
                </template>
            </el-image>
        </div>
        <ElConfigProvider :locale="zhCn">
            <div class="choice-time" style="
                width:95%;
                margin: 0 auto;
                margin-top: 20px
            ">
                <el-date-picker v-model="dateValue" type="datetime" placeholder="选择上传时间"
                    :default-time="new Date(WrTime)" />
            </div>

        </ElConfigProvider>
        <div class="small-tag">
            <div class="tags">
                <div class="title">选择标签</div>
                <el-tag v-for="tag in dynamicTags" :key="tag" class="mx-1" :disable-transitions="false"
                    @click="chooseTag(tag)">
                    {{ tag }}
                </el-tag>
                <el-input v-if="inputVisible" ref="InputRef" :maxlength="8" v-model="inputValue" class="ml-1 w-20"
                    size="small" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
                <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
                    + New Tag
                </el-button>
            </div>
            <el-divider v-show="chosenTags.length != 0"></el-divider>
            <div class="addTags">
                <el-tag v-for="tag in chosenTags" :key="tag" class="mx-1" :disable-transitions="false"
                    @click="removeTags(tag)">
                    {{ tag }}
                </el-tag>
            </div>
        </div>
        <div class="gather">
            <div class="title">选择集合</div>
            <el-select v-model="gatherValue" class="m-2" placeholder="Select">
                <el-option v-for="item in gatherArr" :key="item" :label="item" :value="item" />
            </el-select>
            <el-input v-model="addGather" placeholder="添加一个新的集合"></el-input>
            <el-button type="primary" @click="saveGather">添加</el-button>
        </div>
        <div class="ifpublic">
            <el-checkbox v-model="ifpublic" label="是否公开" size="large" />
        </div>
        <div class="option">
            <div class="left">
                <el-button type="success" @click="prev">上一步</el-button>
            </div>
            <div class="right">
                <el-button type="danger" @click="DelText" v-if="saveIndex != -1">删除</el-button>
                <el-button type="primary" @click="throttleSaveText">保存</el-button>
                <el-button type="success" @click="throttlePost">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { ref, nextTick, Ref, toRef, watch, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { UploadFile, UploadFiles, ElMessage, ElMessageBox } from 'element-plus'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { throttle } from 'lodash'
import { ElInput } from 'element-plus'
import { useRouter, useRoute, LocationQueryValue } from 'vue-router'
import { useLogin, useMy } from '@/store'
import { my } from '@/api'

//
const Login = useLogin()
const My = useMy()
const inputValue = ref('')
let baseTags: string[] = []
let dynamicTags = ref(baseTags)
const chosenTags = ref([]) as Ref<any[]>
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()
const $router = useRouter()
const $route = useRoute()

onMounted(async () => {
    baseTags = (await My.reqTags()).result
    console.log(chosenTags.value);
    chosenTags.value.forEach((val) => {
        baseTags.splice(baseTags.indexOf(val), 1)
    })
    dynamicTags.value = baseTags
})

const writing = toRef(My, 'writing')

const tags = toRef(My.writing, 'tags')

// watch(chosenTags, () => {
//     tags.value = chosenTags.value.toString()
// }, { deep: true })

watch(tags, (newValue, oldValue) => {
    console.log(newValue, 'new', oldValue, 'old');
    if (oldValue != undefined) {
        let oldArr = oldValue.split(',')
        let newArr = newValue.split(',')
        let flag1 = oldArr.every(val => newArr.includes(val))
        let flag2 = newArr.every(val => oldArr.includes(val))
        if (!flag1 && !flag2) {
            console.log(tags.value.split(','), '231321412(((&)))');
            dynamicTags.value = baseTags
            if (tags.value.split(',')[0] != '') {
                chosenTags.value = tags.value.split(',')
            }
            let str = dynamicTags.value.filter((val) => {
                return !chosenTags.value.includes(val)
            })
            dynamicTags.value = str;
            return
        }
    }

    if (oldValue == undefined || oldValue.length < newValue.length) {
        if (tags.value.split(',')[0] != '') {
            chosenTags.value = tags.value.split(',')
        }
        let str = dynamicTags.value.filter((val) => {
            return !chosenTags.value.includes(val)
        })
        dynamicTags.value = str;
    } else {
        //oldValue.length > newValue.length
        let oldArr = oldValue.split(',')
        let newArr = newValue.split(',')
        console.log(newArr, oldArr);

        let str = oldArr.filter((val) => {
            return !newArr.includes(val)
        })
        console.log(str);

        dynamicTags.value.push(str[0])
    }


}, { immediate: true })


let newPageFlag = toRef(My, 'newPageFlag')

watch(newPageFlag, () => {
    if (newPageFlag.value == true) {
        dynamicTags.value = baseTags
        chosenTags.value = []
        newPageFlag.value = false
    }
}, { immediate: true })


const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value!.input!.focus()
    })
}

const handleInputConfirm = () => {
    if (inputValue.value) {
        dynamicTags.value.push(inputValue.value)
    }
    inputVisible.value = false
    inputValue.value = ''
}



//

const chooseTag = (tag: string) => {
    console.log(chosenTags.value.length);

    if (chosenTags.value.length >= 3) {
        ElMessage({
            type: 'error',
            message: '最多选择三个'
        })
    } else {
        if (tags.value.length != 0) {
            tags.value = tags.value + ',' + tag
        } else {
            tags.value = tag
        }
    }
}
const removeTags = (tag: string) => {
    let t = tags.value
    let arr = t.split(',')
    arr.splice(arr.indexOf(tag), 1)
    tags.value = arr.toString()
    chosenTags.value = arr
}


let Url = ref('https://raw.githubusercontent.com/southernMD/images/main/img/SoxZwcrw.jpeg')
const saveIndex = toRef(My, 'saveIndex')
watch(saveIndex, () => {
    if (saveIndex.value != -1) {
        Url.value = writing.value.imgUrl
    }
}, { immediate: true })
let EndFlie = toRef(My, 'EndFlie')

let dateValue: Ref<Date | undefined> = ref()   //时间
let WrTime = toRef(My.writing, 'time')
watch(WrTime, () => {
    if (WrTime.value == "") dateValue.value = new Date()
    else dateValue.value = new Date(WrTime.value)

}, { immediate: true })

watch(dateValue, () => {
    WrTime.value = dateValue.value?.toLocaleString() ? dateValue.value?.toLocaleString() : new Date().toLocaleString()
}, { immediate: true })



let gatherValue = toRef(My.writing, 'gather') //集合值

let baseGathers: string[] = []
let gatherArr = ref(baseGathers)
onMounted(async () => {
    baseGathers = (await My.reqGather()).result
    gatherArr.value = baseGathers
})
let addGather = ref('') //添加集合

const saveGather = () => {
    if (addGather.value.length == 0) {
        ElMessage({
            type: 'error',
            message: '你不能添加一个空的集合'
        })
    } else if (addGather.value == '[save]') {
        ElMessage({
            type: 'error',
            message: '你不能添加一个名为[save]的集合'
        })
    } else {
        let index = gatherArr.value.indexOf(addGather.value);
        if (index == -1) {
            gatherArr.value.push(addGather.value);
            gatherValue.value = addGather.value
            addGather.value = ''
        } else {
            gatherValue.value = addGather.value
            addGather.value = ''
        }
    }

}

const postA = async (obj: ArticleObj, ms: string) => {
    //axios提交
    const result: PostArticle | ErrorVar = await My.reqPostArticle(obj)
    console.log(result);
    if ((result as PostArticle).status == 200) {
        writing.value.id = (result as PostArticle).id
        if (ms == '保存') {
            saveIndex.value = My.draftArr.length
        }
        ElMessage({
            message: `${ms}成功`,
            type: 'success',
        })
        My.reqDraft()
        if (ms == '删除') {
            My.clearWriting()
            My.saveIndex = -1
        }
        if (ms != '保存') {
            $router.push({
                name: 'my',
            })
        }

    } else if ((result as ErrorVar).statusCode != 200) {
        ElMessage({
            message: `${ms}失败,error:${(result as ErrorVar).error}`,
            type: 'error',
        })
    }
}

const saveText = async () => {
    writing.value.state = '保存'
    writing.value.imgUrl = Url.value
    let obj: ArticleObj = {
        title: writing.value.title || '[save]',
        time: writing.value.time,
        text: writing.value.text || '[save]',
        gather: writing.value.gather || '[save]',
        tags: writing.value.tags || '[save]',
        state: writing.value.state,
        imgUrl: writing.value.imgUrl || 'https://raw.githubusercontent.com/southernMD/images/main/img/SoxZwcrw.jpeg',
        ifpublic: writing.value.ifpublic,
        id: writing.value.id
    }
    console.log(obj);

    postA(obj, '保存')
}

const throttleSaveText = throttle(saveText, 2000, { trailing: true })

const prev = () => {
    $router.push({
        name: 'editor',
    })
}

let ifpublic = ref(true)
watch(ifpublic, () => {
    writing.value.ifpublic = ifpublic.value.toString()
}, { immediate: true })

const post = async () => {
    writing.value.state = '发布'
    let obj: ArticleObj = {
        title: writing.value.title,
        time: writing.value.time,
        text: writing.value.text,
        gather: writing.value.gather,
        tags: writing.value.tags,
        state: writing.value.state,
        imgUrl: writing.value.imgUrl,
        ifpublic: writing.value.ifpublic,
        id: writing.value.id
    }
    console.log(obj);

    let flag = true
    if (obj.title == '' || obj.title == undefined) {
        $router.push({
            name: 'editor',
        })
        ElMessage({
            message: '标题不能为空',
            type: 'error',
        })
        flag = false
    }
    if (obj.text == '' || obj.text == undefined) {
        $router.push({
            name: 'editor',
        })
        ElMessage({
            message: '文章内容不能为空',
            type: 'error',
        })
        flag = false
    }
    if (obj.gather == '' || obj.gather == undefined) {
        ElMessage({
            message: '集合不能为空',
            type: 'error',
        })
        flag = false
    }
    if (flag) {
        postA(obj, '发布');
    }

}

const throttlePost = throttle(post, 5000, { leading: true })

//删除
const DelText = () => {
    ElMessageBox.confirm(
        '确定删除么，你可以在垃圾箱内找到它',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        let obj: ArticleObj = {
            title: writing.value.title || '[save]',
            time: writing.value.time,
            text: writing.value.text || '[save]',
            gather: writing.value.gather || '[save]',
            tags: writing.value.tags || '[save]',
            state: writing.value.state + ',删除' as stateName,
            imgUrl: writing.value.imgUrl || 'https://raw.githubusercontent.com/southernMD/images/main/img/SoxZwcrw.jpeg',
            ifpublic: writing.value.ifpublic,
            id: writing.value.id,
            delTime: new Date().toLocaleString(),
            restOfTime: 15
        }
        postA(obj, '删除');
    })
}
</script>

<style lang='less' scoped>
.editor2 {
    position: relative;
    min-height: calc(100vh - 60px);

    .title-url {
        width: 95%;
        margin: 0 auto;
        margin-top: 20px;
    }

    .img {
        width: 95%;
        margin: 0 auto;
        border-radius: 2em;

        >.el-image {
            width: 100%;
            margin-top: 10px;
            height: 200px;
            border-radius: .2em;
        }
    }

    :deep(.el-upload) {
        width: 95%;
        margin: 0 auto;
        max-height: 310px;
        min-height: 310px;
        overflow: hidden;

        .el-upload-dragger {
            min-height: 310px;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .el-image {
            height: 300px;
            width: 100%;
        }
    }

    .small-tag {
        border: 1px solid #b1b3b8;
        width: 95%;
        margin: 0 auto;
        margin-top: 20px;
        padding: 5px 5px;
        box-sizing: border-box;

        .tags {

            .title {
                user-select: none;
                margin-bottom: 10px;
            }

            :deep(.el-tag) {
                user-select: none;
                cursor: pointer;
                margin-right: 5px;
            }

            :deep(.el-input) {
                max-width: 80px;
                margin-top: 5px;
            }

            :deep(.el-button) {
                margin-top: 5px;
            }
        }

        :deep(.el-divider) {
            margin: 10px 0;
        }

        .addTags {
            :deep(.el-tag) {
                user-select: none;
                cursor: pointer;
                margin-right: 5px;
                margin-top: 5px;
            }
        }
    }

    .gather {
        border: 1px solid #b1b3b8;
        width: 95%;
        margin: 0 auto;
        margin-top: 20px;
        padding: 5px 5px;
        box-sizing: border-box;
        height: auto;

        .title {
            user-select: none;
            margin-bottom: 10px;
        }

        >.el-input {
            width: 40%;
            max-width: 200px;
            margin-left: 10px;
            margin-right: 5px;
        }

        :deep(.el-button) {
            margin-left: 5px;
            margin-top: 5px;
        }

        :deep(.select-trigger) {
            width: 180px;
        }
    }

    .ifpublic {
        width: 95%;
        margin: 0 auto;
        margin-top: 10px
    }

    .option {
        width: 95%;
        height: 150px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        margin: 0 auto;
        margin-bottom: 50px;
        margin-top: 20px;
    }
    
}
</style>