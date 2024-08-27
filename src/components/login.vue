<!-- LoginModal.vue -->
<template>
  <teleport to="body">
    <div v-if="dataStore.isVisible" class="modal">
      <div class="modal-content">
        <div class="closebox">
          <i class="iconfont icon-guanbi" @click="closeModal()"></i>
        </div>
        <div class="wxLogin enter-x" v-loading="loading">
          <div class="loginbox">
            <div class="toptitle">微信扫码，安全登录</div>

            <div class="loginimgbox">
              <img class="loginimg" v-if="WxLoginimg" :src="WxLoginimg" alt="" srcset="">

              <div class="tiptext" v-if="overtime" @click="getWxImg()">
                刷新
              </div>
            </div>


            <div class="tiptitle">请使用微信扫描二维码登录“铁甲蛹”</div>

          </div>

        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { onMounted, ref } from "vue";
import "../assets/fonts/iconfont.css";
import { useLoginModal } from '../components/hooks/useLoginModal.ts';
import { useDataStore } from '../store/index.ts';
const dataStore = useDataStore()
const { WxLoginimg, loading, overtime, getWxImg } = useLoginModal();

onMounted(() => {
  getWxImg();
})
const closeModal = () => {
  dataStore.isVisible = false;
}

</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  position: relative;
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




.wxLogin {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 240px;
}

.loginimg {
  width: 240px;
  height: 240px;
}

.wxLogin .tiptext {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: #0960bd;
  width: 240px;
  height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.75)
}

.modal-content .closebox {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 9;
}

.closebox .iconfont {
  font-size: 30px;
  color: rgba(255, 255, 255, 0.35);
}

.loginbox {
  padding: 20px 40px;
}

.loginimgbox {
  position: relative;
  display: flex;
  justify-content: center;
  height: 240px;
}

.loginbox .toptitle {
  color: #222;
  font-size: 22px;
  font-weight: 500;
  line-height: 30px;
  margin-bottom: 15px;
  text-align: center;
}

.loginbox .tiptitle {
  color: #999;
  font-size: 12px;
  line-height: 17px;
  margin-top: 10px;
  text-align: center;
}




@media screen and (max-width: 1100px) {
  .loginbox::before {
    margin-left: -42%;
  }

  .containleft {
    padding-left: 20px;
  }
}

@media screen and (max-width: 768px) {
  .loginbox {
    width: 100%;
    /* height: 100vh;
    background-color: #0960bd; */
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