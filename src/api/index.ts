import request from "axios";

const axios = request.create({
    baseURL:'https://www.southernapi.top',
    // baseURL:`http://${window.location.hostname}:3102`,
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
    result.then((data)=>{
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

