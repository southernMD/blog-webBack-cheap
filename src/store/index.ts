import { defineStore } from 'pinia'

import {
    Login,postArticle,getDraft,getTrash,delForever,recover, tags,gather,
    getLooking,switchPublicState,delShort
} from '../api/index';


export const useLogin= defineStore('Main', {
    state: ():UseLogin => {
        return {
            theme:'auto',
            windowWidth:1000
        }
    },
    // getters{

    // },
    actions:{
        async reqLogin(qs:PostQs) {
            let result = await Login(qs);
            return new Promise((res) => {
                res(result)
            })
        },
    }
})

export const useMy = defineStore('My', {
    state: ():UseMy => {
        return{
            draftArr:[],
            trashArr:[],
            lookingArr:[],
            writing:{
                title: '', 
                time: '',
                text: '',
                gather: '',
                tags: '',
                state: '',
                imgUrl: '',
                ifpublic: '',
                id:null
            },
            saveIndex:-1,
            EndFlie:[],
            newPageFlag:false,
            lookactiveNames:[]
        }
    },
    // getters{

    // },
    actions:{
        async reqPostArticle(data:any):Promise<any>{
            let result = await postArticle(data);
            return new Promise((res) => {
                res(result)
            })
        },
        //获取草稿箱
        async reqDraft():Promise<DraftArrHttp>{
            let result = await getDraft() as unknown as DraftArrHttp;
            this.draftArr = result.data
            return new Promise((res) => {
                res(result)
            })
        },
        //获取垃圾箱
        async reqTrash():Promise<DraftArrHttp>{
            let result = await getTrash() as unknown as TrashArrHttp;
            result.data.forEach((val,index)=>{
                result.data[index].state = val.state.split(',')[0] as stateName
            })
            this.trashArr = result.data
            return new Promise((res) => {
                res(result)
            })
        },
        //永久删除
        async reqDelForever(ids:string):Promise<BaseRes>{
            let result = await delForever(ids.toString()) as unknown as TrashArrHttp;
            return new Promise((res) => {
                res(result)
            })
        },
        //恢复
        async reqRecover(ids:string):Promise<BaseRes>{
            let result = await recover(ids.toString()) as unknown as TrashArrHttp;
            return new Promise((res) => {
                res(result)
            })
        },
        //获取tags
        async reqTags():Promise<TagsMessage>{
            let result = await tags() as unknown as TagsMessage
            console.log(result.result);
            return new Promise((res) => {
                res(result)
            })
        },
        async reqGather():Promise<TagsMessage>{
            let result = await gather() as unknown as TagsMessage
            console.log(result.result);
            return new Promise((res) => {
                res(result)
            })
        },
        //获取looking
        async reqLooking():Promise<lookingArrHttp>{
            let result = await getLooking() as unknown as lookingArrHttp
            this.lookingArr = result.data
            return new Promise((res) => {
                res(result)
            })
        },
        //隐私/公开
        async reqPublic(state:string,id:number):Promise<BaseRes>{
            let result = await switchPublicState(state,id) as unknown as BaseRes
            return new Promise((res) => {
                res(result)
            })
        },
        //删除 
        async reqDel(ids:string):Promise<BaseRes>{
            let result = await delShort(ids) as unknown as BaseRes
            return new Promise((res) => {
                res(result)
            })
        },
        clearWriting(){
            this.writing = {
                title: '', 
                time: '',
                text: '',
                gather: '',
                tags: '',
                state: '',
                imgUrl: '',
                ifpublic: '',
                id:null
            }
        }
    },
    persist: {
        enabled: true,
        strategies: [
            { storage: localStorage, paths: ['writing','lookCheckList'] }, // writing localstorage存储
        ],
    }
})
