<template>
  <div class="loginbox" :class="bgcolor ? '' : 'bloginbox'">
    <div class="maxbox">
      <div class="topleft -enter-x">
        <img src="../assets/logo.svg" alt="" />
        <span class="toptitle">造梦星球AI智能平台</span>
      </div>
      <div class="topright enter-x">
        <el-switch v-model="bgcolor" class="mt-2" size="large"
          style="--el-switch-on-color: #151515; --el-switch-off-color: #151515" inline-prompt>
          <template #active-action>
            <span class="custom-active-action"><i class="iconfont icon-a-ziyuan11"></i></span>
          </template>
          <template #inactive-action>
            <span class="custom-inactive-action"><i class="iconfont icon-a-ziyuan19"></i></span>
          </template>
        </el-switch>
      </div>

      <div class="totalcontain">
        <div class="containleft -enter-x">
          <div class="containleftimgbox -enter-x">
            <img src="../assets/loginlogo.svg" alt="" />
          </div>
          <span class="containtitle -enter-x">助力梦想，打开思维的AI智能平台</span>
          <span class="containtip -enter-x">快速开始一段造梦之旅</span>
        </div>
        <div class="containright enter-x">
          <div class="formbox enter-x">
            <div class="formtop enter-x">
              <span class="enter-x">登录</span>
            </div>
            <el-form :model="form" class="enter-x">
              <el-form-item class="enter-x">
                <el-input v-model="form.name" placeholder="账号" />
              </el-form-item>
              <el-form-item class="enter-x">
                <el-input v-model="form.password" type="password" placeholder="密码" show-password />
              </el-form-item>

              <div class="formline enter-x">
                <el-form-item class="enter-x">
                  <el-checkbox v-model="form.remember" label="记住我" name="type" />
                </el-form-item>
                <span class="enter-x">忘记密码？</span>
              </div>
              <el-form-item class="enter-x">
                <el-button type="primary" @click="onSubmit">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import "../assets/fonts/iconfont.css";
import API from "../axios/api.ts";
import router from "../router";
import { ElMessage } from 'element-plus';
const bgcolor = ref(true);
import { useDataStore } from '../store/index.ts';
const dataStore = useDataStore()


const form = reactive({
  name: "",
  password: "",
  remember: false,
});
const onSubmit = () => {
  console.log("submit!", form.name, form.password);
  API.UserLogin('api/login/gologin', { username: form.name, password: form.password }).then(res => {
    console.log(res);
    if (res.data) {
      dataStore.setCookie("Token", res.data.token, 1);
      dataStore.setCookie("refreshToken", res.data.refreshToken, 24);
      router.push('/')

    } else {
      ElMessage.error('账号密码错误嗷');
    }

  }).catch(err => {
    console.log(err);
  })
};
</script>

<style scoped>
.loginbox {
  position: relative;
  height: 100vh;
}

.loginbox:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin-left: -48%;
  background-image: url("../assets/bg.svg");
  background-repeat: no-repeat;
  background-position: 100%;
  background-size: auto 100%;
}

.bloginbox {
  background-color: #293146;
}

.bloginbox::before {
  background-image: url("../assets/bg-back.svg");
}

.topleft {
  display: flex;
  align-items: center;
  position: absolute;
  top: 20px;
  left: 60px;
}

.topleft img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.topleft .toptitle {
  font-size: 20px;
  color: #fff;
}

.topright {
  display: flex;
  align-items: center;
  position: absolute;
  top: 20px;
  right: 60px;
}

.totalcontain {
  display: flex;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.containleft {
  display: flex;
  flex-wrap: wrap;
  width: 50%;
  color: #fff;
  padding-left: 60px;
}

.containleft .containleftimgbox {
  display: flex;
  width: 100%;
  margin-bottom: 60px;
}

.containleft img {
  width: 320px;
}

.containleft .containtitle {
  font-size: 1.875rem;
  line-height: 2.25rem;
  width: 100%;
  margin-bottom: 20px;
}

.containright {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
}

.formbox {
  width: 70%;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 2px 2px 6px 2px #b3b3b3;
}

.formbox .formtop {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  font-size: 20px;
  color: #333;
  font-weight: bold;
}

:deep(.formbox .el-form) {
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
}

:deep(.el-form-item) {
  width: 100%;
  height: 36px;
  margin-bottom: 20px;
}

:deep(.el-form-item .el-button) {
  width: 100%;
  height: 36px;
  background-color: #0960bd;
}

:deep(.el-form-item .el-input__inner) {
  width: 100%;
  height: 36px;
}

.formline {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.formline span {
  font-size: 14px;
  color: #0960bd;
  flex-shrink: 0;
}

.maxbox {
  max-width: 1280px;
  height: 100%;
  margin: 0 auto;
  position: relative;
}

:deep(.el-switch__core .el-switch__inner .is-icon) {
  font-size: 22px;
}

:deep(.el-switch--large .el-switch__core) {
  box-shadow: 1px 1px 2px 2px #cfcfcf;
}

/* 动画 */

.enter-x {
  transform: translate(50px);
}

.-enter-x {
  transform: translate(-50px);
}

.enter-x:nth-child(1) {
  opacity: 0;
  animation: enter-x-animation 0.4s ease-in-out 0.3s;
  animation-fill-mode: forwards;
  animation-delay: 0.1s;
}

.-enter-x:nth-child(1) {
  opacity: 0;
  animation: enter-x-animation 0.4s ease-in-out 0.3s;
  animation-fill-mode: forwards;
  animation-delay: 0.1s;
}

.enter-x:nth-child(2) {
  opacity: 0;
  animation: enter-x-animation 0.4s ease-in-out 0.3s;
  animation-fill-mode: forwards;
  animation-delay: 0.2s;
}

.-enter-x:nth-child(2) {
  opacity: 0;
  animation: enter-x-animation 0.4s ease-in-out 0.3s;
  animation-fill-mode: forwards;
  animation-delay: 0.2s;
}

.enter-x:nth-child(3) {
  opacity: 0;
  animation: enter-x-animation 0.4s ease-in-out 0.3s;
  animation-fill-mode: forwards;
  animation-delay: 0.3s;
}

.-enter-x:nth-child(3) {
  opacity: 0;
  animation: enter-x-animation 0.4s ease-in-out 0.3s;
  animation-fill-mode: forwards;
  animation-delay: 0.3s;
}

.enter-x:nth-child(4) {
  opacity: 0;
  animation: enter-x-animation 0.4s ease-in-out 0.3s;
  animation-fill-mode: forwards;
  animation-delay: 0.4s;
}

@keyframes enter-x-animation {
  to {
    opacity: 1;
    transform: translate(0);
  }
}

@keyframes enter-y-animation {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

@media screen and (max-width: 768px) {
  .loginbox {
    width: 100%;
    height: 100vh;
    background-color: #0960bd;
  }

  .bloginbox {
    background-color: #293146;
  }

  .loginbox:before,
  .bloginbox:before {
    background-image: none;
  }

  .maxbox {
    max-width: 100%;
  }

  .topleft {
    left: 5%;
  }

  .topright {
    right: 5%;
  }

  .totalcontain {
    width: 100%;
  }

  .-enter-x.containleft {
    display: none;
  }

  .containright {
    width: 100%;
  }

  .formbox {
    width: 90%;
  }
}
</style>
