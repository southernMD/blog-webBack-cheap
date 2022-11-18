import axios from "./axiosInit"

export const Login = (qs:PostQs)=>{
    //返回的是promise对象
    return axios({
        url:`/login`,
        method:'POST',
        data:{
            ...qs
        }
    })
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

