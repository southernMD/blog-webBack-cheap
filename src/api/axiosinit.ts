import request from "axios";

const axios = request.create({
    baseURL:`http://${window.location.hostname}:3102`,
    withCredentials:true
}) 

//请求拦截器，在发起请求前做一些事情
axios.interceptors.request.use((config)=>{
    //包含请求头headers
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


export default axios