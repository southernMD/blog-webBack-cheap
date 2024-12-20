import request from "axios";

const axios = request.create({
    baseURL:import.meta.env.VITE_APP_BASE_API,
    // baseURL:`http://${window.location.hostname}:3102`,
    // baseURL:`https://www.southernapi.top`,
    withCredentials:true
}) 

//请求拦截器，在发起请求前做一些事情
axios.interceptors.request.use((config)=>{
    //包含请求头headers
    config.headers = {Authorization:'Bearer '+ window.localStorage.getItem('token')}
    return config;
})

//相应拦截器
axios.interceptors.response.use((response) =>{
    console.log(response);
    console.log(response.data);
    let data = response.data;
    return response.data;
  },  (error)=>{
    if(error.response.status == 403){
        window.location.reload()
    }
    return Promise.reject(error);
});


export const Login = (qs:PostQs)=>{
    //返回的是promise对象
    const result = axios({
        url:`/login`,
        method:'POST',
        data:{
            ...qs
        }
    })
    result.then((data :any)=>{
        console.log(data,'zaizheli');
        if(data.status == 200){
            console.log('设置');
            window.localStorage.setItem('token',data.token)
            // axios.defaults.headers['Authorization'] = 'Bearer '+ data.token
        }
    })
    return result
}

export const LoginState = ()=>{
    //返回的是promise对象
    return axios({
        url:`/login/status`,
        method:'GET',
    })
}


export const postArticle = (data:any)=>{
    //返回的是promise对象
    return axios({
        url:`/my/postArticle`,
        method:'POST',
        data
    })
}

export const getDraft = ()=>{
    //返回的是promise对象
    return axios({
        url:`/my/draft`,
        method:'GET',
    })
}

export const getTrash = ()=>{
    //返回的是promise对象
    return axios({
        url:`/my/trash`,
        method:'GET',
    })
}

export const delForever = (ids:string)=>{
    //返回的是promise对象
    return axios({
        url:`/my`,
        method:'DELETE',
        data:{
            ids
        }
    })
}
export const recover = (ids:string)=>{
    //返回的是promise对象
    return axios({
        url:`/my/recover`,
        method:'POST',
        data:{
            ids
        }
    })
}

export const tags = ()=>{
    return axios({
        url:`/my/tags`,
        method:'GET',
    })
}

export const gather = ()=>{
    return axios({
        url:`/my/gather`,
        method:'GET',
    })
}

export const getLooking = ()=>{
    return axios({
        url:`/my/looking`,
        method:'GET',
    })
}

export const switchPublicState = (flag:string,id:number)=>{
    return axios({
        url:`/my/switch`,
        method:'POST',
        data:{
            flag,id
        }
    })
}

export const delShort = (ids:string)=>{
    return axios({
        url:`/my/del`,
        method:'DELETE',
        data:{
            ids
        }
    })
}

export const my = ()=>{
    //返回的是promise对象
    return axios({
        url:`/my`,
        method:'GET',
    })
}

export const getabout = ()=>{
    return axios({
        url:`/show/about`,
        method:'GET'
    })
}

export const postabout = (ms:string)=>{
    return axios({
        url:`/show/about`,
        method:'POST',
        data:{
            message:ms
        }
    })
}

export const getMusic = ()=>{
    return axios({
        url:`/my/music`,
        method:'GET',
    })
}

export const postMusic = (item:any)=>{
    item.ifTranslate = item.ifTranslate.toString()
    item.ifScroll = item.ifScroll.toString()
    return axios({
        url:`/my/music`,
        method:'POST',
        data:item
    })
}

export const delMusic = (id:number)=>{
    return axios({
        url:`/my/music`,
        method:'DELETE',
        data:{
            id
        }
    })
}


export const orderMusic = (ids:number[])=>{
    return axios({
        url:`/my/music-order`,
        method:'POST',
        data:{
            ids
        }
    })
}

export const getArticleShort = ()=>{
    return axios({
        url:`/show/article_short`,
        method:'GET',
    })
}

export const changeIfTop = (body:{type:1 | 0,id:number})=>{
    return axios({
        url:`/my/change_top`,
        method:'POST',
        data:body
    })
}

export const getTopArticle = ()=>{
    return axios({
        url:`/show/top_article`,
        method:'GET',
    })
}


export const postChangeHide = (body:{id:number,hide:number})=>{
    return axios({
        url:`/my/change_hide`,
        method:'POST',
        data:body
    })
}

export const getHeadImg = ()=>{
    return axios({
        url:`/my/head_img`,
        method:'GET',
    })
}

export const changeHeadImg = (body:{id?:number,url:string,url_origin:string,_show:0 | 1})=>{
    return axios({
        url:`/my/head_img`,
        method:'POST',
        data:body
    })
}

export const delHeadImg = (id:number)=>{
    return axios({
        url:`/my/head_img`,
        method:'DELETE',
        data:{
            id
        }
    })
}

export const getIndexMsg = ()=>{
    return axios({
        url:`/my/index_msg`,
        method:'GET',
    })
}
export const changeIndexMsg = (data:string)=>{
    return axios({
        url:`/my/index_msg`,
        method:'POST',
        data:{
            message:data
        }
    })
}

export const getCarousel = ()=>{
    return axios({
        url:`/my/carousel`,
        method:'GET',
    })
}

export const changeCarouselList = (body:{id?:number,imgUrl:string,_show:0 | 1}[])=>{
    return axios({
        url:`/my/carousel`,
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        data:body
    })
}

export const delCarousel = (id:number)=>{
    return axios({
        url:`/my/carousel`,
        method:'DELETE',
        data:{
            id
        }
    })
}