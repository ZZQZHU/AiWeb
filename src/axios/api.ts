
import apiWithoutToken from './apiWithoutToken.ts';
import apiWithToken from './apiWithToken.ts';
import { AxiosError } from 'axios';
import { ElMessage } from 'element-plus';

// const WebAPI = "http://127.0.0.1:5000/";
const WebAPI = "https://backsys.aiblog.top/";


const request = (method: string, url: string, WithToken: boolean, params?: any) => {
  const instance = WithToken ? apiWithToken : apiWithoutToken;
  const requrl = WebAPI + url
  const options = {
    method,
    url: requrl,
    params: method === 'GET' ? params : undefined,
    data: method === 'POST' ? params : undefined,
  };
  return instance(options)
    .then((response) => response)
    .catch((error) => {
      handleError(error);
      return Promise.reject(error);
    });
};


// 共用的错误处理函数
function handleError(error: AxiosError) {
  let errorMessage = '未知错误';
  if (error.response) {
    const { status } = error.response;
    switch (status) {
      case 400:
        errorMessage = '错误请求';
        break;
      case 401:
        errorMessage = '未授权，请重新登录';
        break;
      case 403:
        errorMessage = '拒绝访问';
        break;
      case 404:
        errorMessage = '请求错误,未找到该资源';
        break;
      case 405:
        errorMessage = '请求方法未允许';
        break;
      case 408:
        errorMessage = '请求超时';
        break;
      case 500:
        errorMessage = '服务器端出错';
        break;
      case 501:
        errorMessage = '网络未实现';
        break;
      case 502:
        errorMessage = '网络错误';
        break;
      case 503:
        errorMessage = '服务不可用';
        break;
      case 504:
        errorMessage = '网络超时';
        break;
      case 505:
        errorMessage = 'http版本不支持该请求';
        break;
      default:
        errorMessage = `连接错误${status}`;
    }
  } else if (error.message) {
    errorMessage = error.message;
  }
  ElMessage.error(errorMessage);
}


// 封装不同的请求方法
const http = {
  get: (url: string, params: any) => request('GET', url, false, params),
  getwithToken: (url: string, params: any) => request('GET', url, true, params),
  post: (url: string, params: any) => request('POST', url, false, params),
  postwithToken: (url: string, params: any) => request('POST', url, false, params),
};




const API = {
  UserLogin(url: string, param: any) { //用户登录
    return http.get(url, param);
  },
  UploadImage(url: string, param: any) { //上传图片
    return http.post(url, param);
  },
  changepreserve(url: string, param: any) { //上传图片
    return http.post(url, param);
  }
};

export default API;