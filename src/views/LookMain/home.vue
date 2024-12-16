<template>
    <div class="home">
        <div class="top-section" ref="topSectionRef">
            <div class="head-img" :style="{ height: 'calc(100% - 2em)' }">
                <div class="title">
                    <span>头部图片</span>
                    <span style="font-size: 14px;color: #b1b1b1;">&nbsp;随机展示</span>
                    <span style="float: right; cursor: pointer;" @click.self="addHeadImgHandle()">+</span>
                </div>
                <el-scrollbar class="scroll-img" :height="'calc(100% - 3em)'">
                    <div class="img-box" v-for="(item, index) in headeImg" :key="index">
                        <el-card style="height: 200px;">
                            <div class="image-container">
                                <el-image :src="item.url" fit="cover" :preview-src-list="[item.url]" />
                            </div>
                            <div class="options">
                                <div>
                                    <el-button type="danger" @click="delHeadImgHandle(item.id)">删除</el-button>
                                </div>
                                <div>
                                    <el-button :type="item._show ? 'info' : 'success'"
                                        @click="changeHeadImgHandle({ id: item.id, imgUrl: item.url, _show: item._show ? 0 : 1 })">{{
                                        item._show ? '隐藏' : '显示' }}</el-button>
                                </div>
                                <div>
                                    <el-button type="primary"
                                        @click="changeHeadImgUrl({ id: item.id, imgUrl: item.url, _show: item._show as 0 | 1 })">编辑图片地址</el-button>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </el-scrollbar>
            </div>
            <div class="carousel-img" :style="{ height: 'calc(100% - 2em)' }">
                <div class="title">
                    <span>轮播图</span>
                    <span style="font-size: 14px;color: #b1b1b1;">&nbsp;顺序展示(除删除外都要点保存)</span>
                    <el-button size="small" style="float: right;" @click="uploadCarouselHandle">保存</el-button>
                </div>
                <el-scrollbar class="scroll-img" :height="'calc(100% - 3em)'">
                    <div class="img-box" >
                        <el-carousel v-if="reloadFlag" trigger="click" height="150px" style="width: 400px;" :autoplay="false">
                            <el-carousel-item v-for="(item, index) in carouseImgShow" :key="index" >
                                <el-image :src="item.imgUrl" fit="cover"  />
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                    <DndProvider :backend="HTML5Backend">
                        <div class="show-img" >
                            <div class="title">展示中的图片</div>
                            <div class="img-list-box">
                                <DraggableImage @contextmenu.prevent="delCarouselHandle(item)" @click="changeCarouselImageHandle(item)" @change="changeCarouselHandle" v-for="(item, index) in carouseImgShow" :key="index" :item="item"   />
                                <DropEmptyImage @click="changeCarouselImageHandle(undefined,1)" v-if="carouseImgShow.length < 5"  @change="dragIntoEmptyHandle" :type="1"></DropEmptyImage>
                            </div>
                        </div>
                        <div class="img-list">
                            <div class="title">未展示的图片</div>
                            <div class="img-list-box">
                                <DraggableImage @contextmenu.prevent="delCarouselHandle(item)" @click="changeCarouselImageHandle(item)" @change="changeCarouselHandle" v-for="(item, index) in carouselImgHide" :key="index" :item="item"  />
                                <DropEmptyImage @click="changeCarouselImageHandle(undefined,0)" @change="dragIntoEmptyHandle" :type="0"></DropEmptyImage>
                            </div>
                        </div>
                    </DndProvider>
                </el-scrollbar>
            </div>
        </div>
        <div class="bottom-section">
            <div class="index-msg">
                <el-input v-model="indexMsg" style="width: 90%;" resize="none" type="textarea"
                    placeholder="Please input" :rows="7" />
                <div class="btn">
                    <el-button style="margin-left: 1em;" @click="changeIndexMsgHandle">保存</el-button>
                    <el-button style="margin-left: 1em;" @click="recover">恢复</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { changeCarouselList, changeHeadImg, changeIndexMsg, delCarousel, delHeadImg, getCarousel, getHeadImg, getIndexMsg } from '@/api';
import { computed, nextTick, onMounted, Ref, ref, toRaw, watch } from 'vue'
import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DropEmptyImage from '@/components/Home/DropEmptyImage.vue';
const indexMsg: Ref<string> = ref('')
const headeImg = ref([]) as Ref<HeadImg[]>
const carouselImg = ref() as Ref<CarouselImg[]>
const carouseImgShow = computed(()=>{
    return carouselImg.value?.filter(item=>item._show === 1).sort((a,b)=>a.order - b.order)
})

const carouselImgHide = computed(()=>{
    return carouselImg.value?.filter(item=>item._show === 0).sort((a,b)=>a.order - b.order)
})

try {
    indexMsg.value = ((await getIndexMsg()) as any).result
    headeImg.value = ((await getHeadImg() as any)).result
    carouselImg.value = ((await getCarousel() as any)).result

} catch (error) {
    ElMessage.error(error as any)
}
const topSectionRef = ref()


const changeHeadImgUrl = ({ id, imgUrl, _show }: { id: number, imgUrl: string, _show: 0 | 1 }) => {
    ElMessageBox.prompt('输入url地址', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern:
            /\b(?:https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|bmp|svg|webp)(?:\?[^\s]*)?|data:image\/(?:jpg|jpeg|png|gif|bmp|svg|webp);base64,[A-Za-z0-9+/=]+)\b/,
        inputErrorMessage: '不是有效的图片链接格式',
        lockScroll: false,
        inputValue: imgUrl
    })
        .then(({ value }: { value: string }) => {
            changeHeadImg({ id, url_origin: value, url: value, _show }).
                then((res) => {
                    //@ts-ignore res已经被响应拦截器修改
                    if (res.state != 200) throw new Error('修改失败')
                    ElMessage.success('修改成功')
                    headeImg.value.find(item => item.id == id)!.url = value
                }).
                catch(() => {
                    ElMessage.error('修改失败')
                })
        })
}

const changeHeadImgHandle = ({ id, imgUrl, _show }: { id: number, imgUrl: string, _show: 0 | 1 }) => {
    changeHeadImg({ id, url_origin: imgUrl, url: imgUrl, _show }).
        then((res) => {
            //@ts-ignore res已经被响应拦截器修改
            if (res.state != 200) throw new Error('修改失败')
            ElMessage.success('修改成功')
            headeImg.value.find(item => item.id == id)!._show = _show
        }).
        catch(() => {
            ElMessage.error('修改失败')
        })
}

const delHeadImgHandle = (id: number) => {
    ElMessageBox.confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
    }).then(() => {
        delHeadImg(id).then((res) => {
            //@ts-ignore res已经被响应拦截器修改
            if(res.state != 200)throw new Error('删除失败')
            ElMessage.success('删除成功')
            headeImg.value = headeImg.value.filter(item => item.id != id)
        }).catch(() => {
            ElMessage.error('删除失败')
        })
    })
}

const addHeadImgHandle = ()=>{
    ElMessageBox.prompt('输入url地址', '新增',{
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern:
            /\b(?:https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|bmp|svg|webp)(?:\?[^\s]*)?|data:image\/(?:jpg|jpeg|png|gif|bmp|svg|webp);base64,[A-Za-z0-9+/=]+)\b/,
        inputErrorMessage: '不是有效的图片链接格式',
        lockScroll: false,
    })
        .then(({ value }: { value: string }) => {
            changeHeadImg({ id:undefined, url_origin: value, url: value, _show:1 }).
                then((res) => {
                    //@ts-ignore res已经被响应拦截器修改
                    if (res.state != 200) throw new Error('增加失败')
                    ElMessage.success('增加成功')
                    headeImg.value.unshift({
                        //@ts-ignore res已经被响应拦截器修改
                        id:res.result.id,
                        url:value,
                        url_origin:value,
                        _show:1
                    } as HeadImg)
                }).
                catch(() => {
                    ElMessage.error('修改失败')
                })
        })
}

const changeCarouselHandle = ({drag,place}:{drag:CarouselImg,place:CarouselImg})=>{
    let temp = drag.order
    drag.order = place.order
    place.order = temp
    if(drag._show != place._show){
        const p_show = toRaw(place._show)
        const d_show = toRaw(drag._show)
        drag._show = p_show
        place._show = d_show
    }else{
        reload()
    }
}
const reloadFlag = ref(true)
const reload = ()=>{
    reloadFlag.value = false
    nextTick(()=>{
        reloadFlag.value = true
    })
}

const dragIntoEmptyHandle = ({drag,type}:{drag:CarouselImg,type:number}) =>{
    //type = 1展示 type = 0 不展示
    if(type == 1){
        if(carouseImgShow.value.length - 1 < 0)drag.order = 0
        else drag.order = carouseImgShow.value[carouseImgShow.value.length - 1].order + 1
        drag._show = 1
    }else if(type == 0){
        if(carouselImgHide.value.length - 1 < 0)drag.order = 0
        else drag.order = carouselImgHide.value[carouselImgHide.value.length - 1].order + 1 
        drag._show = 0
    }
}

const changeCarouselImageHandle =(drag?:CarouselImg,type?:0 | 1)=>{
    if(drag){
        ElMessageBox.prompt('更改图片url地址', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            inputPattern:
                /\b(?:https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|bmp|svg|webp)(?:\?[^\s]*)?|data:image\/(?:jpg|jpeg|png|gif|bmp|svg|webp);base64,[A-Za-z0-9+/=]+)\b/,
            inputErrorMessage: '不是有效的图片链接格式',
            lockScroll: false,
            inputValue: drag.imgUrl
        })
        .then(({ value }: { value: string }) => {
            drag.imgUrl = value
        })
    }else{
        ElMessageBox.prompt('更改图片url地址', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            inputPattern:
                /\b(?:https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|bmp|svg|webp)(?:\?[^\s]*)?|data:image\/(?:jpg|jpeg|png|gif|bmp|svg|webp);base64,[A-Za-z0-9+/=]+)\b/,
            inputErrorMessage: '不是有效的图片链接格式',
            lockScroll: false,
        })
        .then(({ value }: { value: string }) => {
            const newImg:CarouselImg = {
                imgUrl: value,
                _show: type!,
                id: undefined,
                order: type! == 1?carouseImgShow.value[carouseImgShow.value.length - 1].order + 1:carouselImgHide.value[carouselImgHide.value.length - 1].order + 1
            }
            carouselImg.value.push(newImg)
        })
    }
}

const uploadCarouselHandle = async()=>{
    console.log(carouselImg.value);
    try{
        //@ts-ignore res已经被响应拦截器修改
        const state = (await changeCarouselList(carouselImg.value)).state
        if(state == 200){
            ElMessage.success('上传成功')
        }else{
            ElMessage.error('上传失败')
        }
    }catch(err){
        ElMessage.error(String(err))
    }
}

const delCarouselHandle = (item:CarouselImg)=>{
    ElMessageBox.confirm(
    '是否删除图片',
    '删除',
    {
      distinguishCancelAndClose: true,
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      lockScroll: false,
    }
  )
    .then(() => {
        delCarousel(item.id!).then((res)=>{
            ElMessage({
                type:'success',
                message:'删除成功'
            })
            //@ts-ignore res已经被响应拦截器修改
            if(res.state != 200)throw new Error('删除失败')
            carouselImg.value.splice(carouselImg.value.indexOf(item),1)
        }).catch(()=>{
            ElMessage({
                type:'error',
                message:'删除失败'
            })
        })
    }).catch(() => {})
}

const recover = async(item:any)=>{
    try{
        indexMsg.value = ((await getIndexMsg()) as any).result
        ElMessage({
            type:'success',
            message:'恢复成功'
        })
    }catch(e){
        ElMessage({
            type:'error',
            message:'恢复失败'
        })
    }

}

const changeIndexMsgHandle = async()=>{
    try{
        await changeIndexMsg(indexMsg.value)
        ElMessage({
            type:'success',
            message:'修改成功'
        })
    }catch(e){
        ElMessage({
            type:'error',
            message:'修改失败'
        })
    }
}

</script>

<style scoped lang="less">
.home {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 2em);
    margin: 1em;

    .top-section {
        display: flex;
        flex: 0 0 70%;
        height: 70%;
    }

    .head-img,
    .carousel-img {
        flex: 1; // 让 headImg 和 carouselImg 平均分配空间
        margin: 1em; // 示例内边距
        border-radius: .2em;
        border: 1px solid #b1b3b8;
    }

    .head-img,
    .carousel-img
    {
        .title {
            user-select: none;
            margin: 1em;
        }

        .img-box {
            margin: 1em;

            &>* {
                margin: 0 auto;
            }

            .image-container {
                position: relative;
                height: calc(100% - 2em);
                aspect-ratio: 2 / 1;
                background-color: red;
            }

            :deep(.el-card__body) {
                height: 100%;
                display: flex;

                .options {
                    display: flex;
                    flex-direction: column;

                    .el-button {
                        margin-left: 1em;
                    }

                    >div {
                        margin-bottom: 1em;
                    }
                }
            }

            .el-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }

    .carousel-img {
        .show-img,.img-list{
            .img-list-box{
                margin: 1em;
                display: flex;
                flex-wrap: wrap;
                >*{
                    flex: 0 0 calc(100% / 5 - 1em); 
                    margin-right: 1em;
                    margin-top: 1em;
                    box-sizing: border-box;
                    cursor: pointer;
                }

                > *:nth-child(5n) {
                    margin-right: 0;
                }
                >*:nth-child(1),>*:nth-child(2),>*:nth-child(3),>*:nth-child(4),>*:nth-child(5){
                    margin-top: 0;
                }
            }
        }
    }

    .bottom-section {
        flex: 0 0 30%; // 设置下部分的高度为 40%
    }

    .index-msg {
        padding: 10px; // 示例内边距
        display: flex;

        >.btn {
            display: flex;
            flex-direction: column;
            justify-content: end;

            >* {
                margin-top: .5em;
            }

            ;
        }
    }
}
</style>