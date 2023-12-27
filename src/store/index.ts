// src/store/index.ts
import { createPinia,defineStore } from 'pinia';

const pinia = createPinia();

const domain = 'localhost';

export const useDataStore = defineStore('dataStore', {
  state: () => ({
    count: 999,
  }),
  actions: {
    setCookie(name: string, value: string) { // 设置cookie
      const Days = 1;
      const exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
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
  },
  getters: {},
});


export default pinia;
