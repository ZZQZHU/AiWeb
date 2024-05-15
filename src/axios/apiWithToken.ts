// apiWithToken.ts

import axios from 'axios';
import { useDataStore } from '../store/index.ts';
const dataStore = useDataStore()

const instance = axios.create({
  baseURL: 'https://backsys.aiblog.top/',
});

// 请求拦截器
instance.interceptors.request.use(
  config => {
    const token = dataStore.getCookie('Token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);



export default instance;
