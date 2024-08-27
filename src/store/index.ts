// src/store/index.ts
import { createPinia, defineStore } from 'pinia';

const pinia = createPinia();

const domain = 'localhost';//本地开发环境
// const domain = 'aiblog.top';

export const useDataStore = defineStore('dataStore', {
  state: () => ({
    count: 999,
    isVisible: false,
  }),
  actions: {
    setCookie(name: string, value: string, hours: number) { // 设置cookie
      const hoursnum = Number(hours);
      const exp = new Date();
      exp.setTime(exp.getTime() + hoursnum * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${exp.toUTCString()};domain=${domain};path=/`;
    },
    delCookie(name: string) { // 删除cookie
      const exp = new Date();
      exp.setTime(exp.getTime() - 1);
      const cval = this.getCookie(name);
      if (cval != null) {
        document.cookie = `${name}='';expires=${exp.toUTCString()};domain=${domain};path=/`;
      }
    },
    getCookie(name: string) { // 获取cookie
      const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
      const arr = document.cookie.match(reg);
      return arr ? arr[2] : null;
    },
    showModal() {
      console.log(2111)
      this.isVisible = true
    },
    closeModal() {
      console.log(111)
      this.isVisible = false
    }

  },
  getters: {},
});


export default pinia;
