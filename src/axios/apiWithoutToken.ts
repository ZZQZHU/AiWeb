// apiWithoutToken.ts

import axios from 'axios';


const instance = axios.create({
  baseURL: 'https://backsys.aiblog.top/',
});

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 不携带 token
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

  

export default instance;
