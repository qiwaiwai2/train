import axios from 'axios'
import QS from 'qs';
const service = axios.create({
    //设置超过时间
    timeout:1000000,
    baseURL:process.env.BASE_URL
})
//POST请求的时候要加请求头，可以在这里进行默认设置
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
/**
 * 请求前拦截
 * 用于处理需要在请求前的操作
 */
service.interceptors.request.use(config => {
    return config
},error => {
    return Promise.reject(error)
})
/**
 * 请求响应拦截
 * 用于处理需要在请求返回后的操作
 */
service.interceptors.response.use(response => {
    const responseCode = response.status
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if(responseCode==200){
        if(response.data.status==1){
            return Promise.resolve(response.data)
        }else{
            alert(response.data.msg)
            return Promise.resolve(response.data)
        }
        
    }else{
        alert('网络请求错误，请稍后重试！')
        return Promise.reject(response)
    }
},error => {
    // 服务器返回不是 2 开头的情况，会进入这个回调
    // 可以根据后端返回的状态码进行不同的操作
    alert('网络请求错误，请稍后重试！')
    return Promise.reject(error)
    // const responseCode = error.response.status
    // switch(responseCode) {
    //     case 401:
    //         //跳转登录页
    //         break;
    //     // case 
    // }
})

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
 function get(url, params){    
    return new Promise((resolve, reject) =>{        
        axios.get(url, {            
            params: params        
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)        
    })    
});}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
 function post(url, params) {    
    return new Promise((resolve, reject) => {       
        console.log(QS.stringify(params))  
        axios.post(url, QS.stringify(params))        
        .then(res => {            
            resolve(res.data);        
        })        
        .catch(err => {            
            reject(err.data)        
        })    
    });
}


export default service
