<template>
    <div class="loginbox">
        <div class="topleft">
            <img src="../assets/logo.png" alt="">
            <span class="toptitle">造梦星球AI智能平台</span>
        </div>
        <div class="topright">
            <el-switch v-model="bgcolor" class="mt-2" style="margin-left: 24px" inline-prompt :active-icon="Sunny"
                :inactive-icon="MoonNight" />
        </div>

        <div class="totalcontain">
            <div class="containleft">
                <div class="containleftimgbox">
                    <img src="../assets/loginlogo.svg" alt="">
                </div>
                <span class="containtitle">助力创业，打开思维的AI智能平台</span>
                <span class="containtip">快速开始一段造梦之旅</span>
            </div>
            <div class="containright">
                <div class="formbox">
                    <div class="formtop">
                        <span>登录</span>
                    </div>
                    <el-form :model="form">
                        <el-form-item>
                            <el-input v-model="form.name" placeholder="账号" />
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="form.password" type="password" placeholder="密码" show-password />
                        </el-form-item>

                        <div class="formline">
                            <el-form-item>
                                <el-checkbox-group v-model="form.remember">
                                    <el-checkbox label="记住我" name="type" />
                                </el-checkbox-group>
                            </el-form-item>
                            <span>忘记密码？</span>
                        </div>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">登录</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">

import { reactive, ref } from 'vue'
import { Sunny, MoonNight } from '@element-plus/icons-vue'
const bgcolor = ref(true)

const form = reactive({
    name: '',
    password: '',
    remember: false
})
const onSubmit = () => {
    console.log('submit!')
}
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
:deep(.el-switch__core) {
    width: 50px;
    height: 26px;
    background-color: #151515;
    padding: 0 6px;
    border-radius: 10px;
}

:deep(.el-switch.is-checked .el-switch__core){
    background-color: #151515;

}
.totalcontain {
    display: flex;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
}

.totalcontain .containleft {
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
    width: 50%;
}

.formbox {
    width: 70%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 2px #888;
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
;
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
</style>