//引入路由对象
import { createRouter, createWebHistory, createWebHashHistory, createMemoryHistory, RouteRecordRaw } from 'vue-router'
import {LoginState} from '@/api'
import NProgress from "nprogress"
import 'nprogress/nprogress.css' //这个样式必须引入
//vue2 mode history vue3 createWebHistory
//vue2 mode  hash  vue3  createWebHashHistory
//vue2 mode abstact vue3  createMemoryHistory
 
//路由数组的类型 RouteRecordRaw
// 定义一些路由
// 每个路由都需要映射到一个组件。
const routes: Array<RouteRecordRaw> = [
    {
        path:'/login',
        name:'login',
        component:()=>import('@/views/Login.vue')
    },
    {
        path:'/my',
        name:'my',
        component:()=>import('@/views/LookMain/index.vue'),
        children:[
            {
                path:'editor',
                name:'editor',
                component:()=>import('@/views/LookMain/editor.vue'),
            },
            {
                path:'editor2',
                name:'editor2',
                component:()=>import('@/views/LookMain/editor2.vue'),
            },
            {
                path:'trash',
                name:'trash',
                component:()=>import('@/views/LookMain/trash.vue'),
            },
            {
                path:'look',
                name:'look',
                component:()=>import('@/views/LookMain/look.vue'),
            },
            {
                path:'about',
                name:'about',
                component:()=>import('@/views/LookMain/about.vue'),
            },
            {
                path:'music',
                name:'music',
                component:()=>import('@/views/LookMain/music.vue'),
            },
        ]
        
    },
    {
        path: '/:pathMatch(.*)',
        redirect:'/login'
    }
]

 
const router = createRouter({
    scrollBehavior(){
        return {top:0,left:0};
    },

    history: createWebHistory(),
    routes,
})

router.beforeEach(async(to,from,next)=>{
    NProgress.start()
    console.log(to.fullPath,from.fullPath);
    if(to.fullPath.includes('my')){
        try {
            let result:LoginState = (await LoginState()) 
            next()
        } catch (error) {
            next('/login')
        }
    }else if(to.fullPath.includes('login')){
        try {
            let result:LoginState = (await LoginState()) 
            next('/my')
        } catch (error) {
            next()
        }
    }
})


router.afterEach((to, from) => {
    NProgress.done()
})

//导出router
export default router