<template>
    <div>
        <md-editor v-model="text" :theme="theme" class="editor" 
        :toolbars-exclude="excludeArr"
             />
        <div class="others">
            <el-input v-model="title" :rows="2" type="textarea" placeholder="输入文章标题" maxlength="15" resize="none" />
            <el-input v-model="title2" :rows="2" type="textarea" placeholder="输入文章副标题" maxlength="225" resize="none" />
            <div class="btns">
                <el-button type="success" @click="next">下一步</el-button>
            </div>

        </div>
    </div>

</template>

<script lang='ts' setup>
import { defineComponent, ref, Ref,toRef, watch, getCurrentInstance, ComponentInternalInstance, onMounted, onUnmounted, onActivated } from 'vue';
import MdEditor, { Themes } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useLogin ,useMy} from '@/store';
import { ElMessage } from 'element-plus';
import { throttle } from 'lodash'
import {ToolbarNames} from 'md-editor-v3'

import { useRouter, useRoute } from 'vue-router';

const $el = getCurrentInstance() as ComponentInternalInstance
const $router = useRouter()
const $route = useRoute()
const Login = useLogin()
const My = useMy()

//工具
const excludeDefult:ToolbarNames[] = ['github','save']
const excludeLess: ToolbarNames[] = [
    '-',
    'title',
    'strikeThrough',
    'sub',
    'sup',
    'quote',
    'unorderedList',
    'orderedList',
    'save',
    '-',
    'codeRow',
    'code',
    'table',
    'mermaid',
    'katex',
    'github'
]
let excludeArr = ref(['']) as Ref<ToolbarNames[]>

const removeTog = () => {
    if (domWidth.value >= 1000) {
        excludeArr.value = excludeDefult
    } else {
        excludeArr.value = excludeLess
    }
}


let domWidth = toRef(Login, 'windowWidth')

watch(domWidth, () => {
    removeTog()
}, { immediate: true })

onActivated(() => {
    removeTog()
})

const theme = ref<Themes>('light')
let th = toRef(Login, 'theme')
watch(th, () => {
    if (th.value == 'dark') {
        theme.value = 'dark'
    } else {
        theme.value = 'light'
    }
}, { immediate: true })

let text = toRef(My.writing,'text')
let title = toRef(My.writing,'title')
let title2 = toRef(My.writing,'title2')

const next = () => {
    console.log(text.value);
    console.log(title.value);
    $router.push({
        name: 'editor2',
        query:$route.query
    })
}


onActivated(()=>{
    console.log($route.query);
    
})
</script>

<style lang='less' scoped>
.editor {
    height: 80vh;
    width: 95%;
    margin: 0 auto;

    :deep(.md-toolbar-wrapper) {
        height: auto;

        .md-toolbar {
            flex-wrap: wrap;
        }

        >.md-toolbar-item {
            flex: 1 1 10%;
        }
    }
}

.others {
    width: 95%;
    margin: 0 auto;
    margin-top: 20px;
    position: relative;
    height: 150px;

    :deep(.el-textarea) {
        width: 25%;
        min-width: 200px;
        margin-right: 15px;
    }

    .btns {
        position: absolute;
        right: 0;
        top: 20%;
        bottom: 0;

    }

    // :deep(.el-button){
    //     position: ;
    // }
}

@media screen and (max-width: 1000px) {
    :deep(.md-content) {
        flex-direction: column;
    }
    :deep(.md-toolbar){
        justify-content: flex-start;
    }
}
</style>