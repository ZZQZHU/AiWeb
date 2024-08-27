<template>
  <div class="main-header">
    <div class="logo">
      <router-link to="/home" class="logolink">
        <img class="logo-img" src="../assets/logo.svg" alt="LOGO" />
        <div class="logotitle">AI博客园</div>

        <img class="mobile-img" src="../assets/logo.svg" alt="LOGO" />
      </router-link>
      <div class="main-nav">
        <ul class="nav-list">
          <li class="main-nav-list">
            <div class="phone-show-menu isResourceVisible" @click="toggleMenu">
              <span v-if="Props.mainid > 0" class="selectedspan">{{
              categories[Props.mainid - 1].name
            }}</span>
              <span v-else>首页</span>
              <i class="iconfont icon-xiajiantou unfold16-icon" :class="{ active: isMenuActive }"></i>
            </div>
            <ul class="phone-hide isResourceVisible" :class="{ show: isMenuActive }">
              <li v-for="category in categories" :key="category.id" class="nav-item link-item"
                :class="Props.mainid == category.id ? 'active' : ''" @click="hideisMenuActive">
                <router-link :to="category.route">
                  {{ category.name }}
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>

    <div class="main-nav">
      <ul class="nav-list">
        <ul class="right-side-nav">
          <li class="search-add">
            <ul class="search-add-ul isResourceVisible">
              <li class="nav-item search">
                <form role="search" class="search-form isResourceVisible" @submit.prevent="emitSearch">
                  <input type="search" maxlength="64" placeholder="探索铁甲蛹" v-model="searchtext"
                    class="search-input isResourceVisible" />
                  <div class="seach-icon-container" @click="emitSearch">
                    <i class="iconfont icon-search search-icon"></i>
                  </div>
                </form>
              </li>
              <li class="nav-item add creator-item">
                <div class="add-group">
                  <button class="add-btn" @click="gotopublish">
                    创作者中心
                  </button>
                </div>
              </li>
            </ul>
          </li>

          <li class="nav-item vip-entry" @click="gotovip">
            <div class="vip-title">
              <div class="vip-entry-img">
                <i class="iconfont icon-huiyuan vip-img"></i>
              </div>

              <div class="vip-words">会员</div>
            </div>
          </li>

          <li class="nav-item notification" @click="gotonotification">
            <div class="jj-noti-link notification-a">
              <i class="iconfont icon-tongzhi notification-icon"></i>
            </div>
          </li>

          <li class="nav-item userimg">
            <img class="useravatar" src="https://static.aiblog.top/WX/imgs/boy.svg" alt="" srcset="" />
          </li>
        </ul>
      </ul>
    </div>
  </div>

</template>

<script setup lang="ts">
import "../assets/fonts/iconfont.css";
import { ref, defineEmits, watch } from "vue";
import router from "../router";
import { ElMessage } from "element-plus";
const Props = defineProps(["mainid"]);
import { useDataStore } from '../store/index.ts';
const dataStore = useDataStore()
import { debounce } from "lodash";


const searchtext = ref('')
const emit = defineEmits(['custom-event']);

const emitSearch = () => {
  emit('custom-event', searchtext.value);
};

const debouncedSearch = debounce(() => {
  emitSearch();
}, 1000);

// 监听searchtext的值并加上防抖2秒内
watch(searchtext, (newval) => {
  console.log(newval, 111)
  debouncedSearch()
})






const categories = [
  {
    id: 1,
    name: "首页",
    route: "/home",
    subCategories: [
      {
        id: 11,
        name: "关注",
        route: "/home/follow",
      },
      {
        id: 12,
        name: "综合",
        route: "/home/general",
      },
      {
        id: 13,
        name: "排行榜",
        route: "/home/ranking",
      },
      {
        id: 14,
        name: "站长推荐",
        route: "/home/recommended",
      },
    ],
  },
  {
    id: 2,
    name: "BOT",
    route: "/aibot",
    subCategories: [
    ],
  },

  {
    id: 3,
    name: "AI",
    route: "/ai",
    subCategories: [
      {
        id: 31,
        name: "图像",
        route: "/ai/image",
      },
      {
        id: 32,
        name: "视频",
        route: "/ai/video",
      },
      {
        id: 33,
        name: "音频",
        route: "/ai/audio",
      },
      {
        id: 34,
        name: "软件",
        route: "/ai/software",
      },
      {
        id: 35,
        name: "模型",
        route: "/ai/model",
      },
    ],
  },
  {
    id: 4,
    name: "金融",
    route: "/finance",
    subCategories: [
      {
        id: 41,
        name: "股票",
        route: "/finance/stocks",
      },
      {
        id: 42,
        name: "期货",
        route: "/finance/futures",
      },
      {
        id: 43,
        name: "复盘",
        route: "/finance/review",
      },
      {
        id: 44,
        name: "诊股",
        route: "/finance/analysis",
      },
      {
        id: 45,
        name: "资讯",
        route: "/finance/news",
      },
    ],
  },
  {
    id: 5,
    name: "程序猿",
    route: "/developer",
    subCategories: [
      {
        id: 51,
        name: "前端",
        route: "/developer/frontend",
      },
      {
        id: 52,
        name: "后端",
        route: "/developer/backend",
      },
      {
        id: 53,
        name: "其他",
        route: "/developer/other",
      },
    ],
  },
];

const isMenuActive = ref(false);

const toggleMenu = () => {
  isMenuActive.value = !isMenuActive.value;
};
const hideisMenuActive = () => {
  isMenuActive.value = false
}


const gotopublish = () => {
  console.log("点击了创作中心");
  // 判断cookie是否带有token
  if (!dataStore.getCookie("Token")) {
    dataStore.showModal()
  } else {
    // 生成一个随机数 randomStr 限制在24位  前面固定blog  带时间戳 用于跳转
    const random = Math.random().toString(36).substr(2);
    const time = new Date().getTime();
    let randomStr = 'b' + time + random;
    // 新标签跳转  params  blog路由页面
    router.push({ name: 'publish', params: { id: randomStr } })
  }
};

const gotovip = () => {
  //弹框提示
  ElMessage({
    type: 'info',
    message: '紧急开发中'
  })
  return
  window.open("/vip", "_blank");
};
const gotonotification = () => {
  //弹框提示
  ElMessage({
    type: 'info',
    message: '紧急开发中'
  })
  return
  window.open("/notification", "_blank");
};

</script>

<style scoped lang="scss">
ul {
  padding-inline-start: 0px;
}

li {
  list-style: none;
}

.main-header {
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  padding: 10px 0px;
  width: 100%;
  box-shadow: 0 2px 8px #f2f3f5;
  position: fixed;
  z-index: 999;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  flex-shrink: 0;

  .logolink {
    display: flex;
    align-items: center;
    text-decoration: none;
  }
}

.logo-img {
  width: 35px;
  height: 35px;
  margin-right: 10px;
}

.mobile-img {
  display: none;
}

.logotitle {
  font-size: 20px;
  font-weight: 500;
  color: #515767;
  text-decoration: none;
}

.main-nav {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 10px;

  a {
    color: #515767;
    text-decoration: none;
    display: inline-block;
    padding: 10px 20px;
  }

  .nav-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-inline-start: 0px;
    margin: 0px;

    .main-nav-list {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 0 10px;
      cursor: pointer;

      .phone-show-menu {
        display: none;

        span {
          font-size: 16px;
          font-weight: 500;
          color: #515767;
        }

        .unfold16-icon {
          margin-left: 5px;
          color: #515767;
        }
      }

      .phone-hide {
        display: flex;
        width: 100%;

        li {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
        }

        li:hover a::before {
          content: "";
          position: absolute;
          top: auto;
          right: 0;
          bottom: 0;
          left: 1rem;
          height: 2px;
          background-color: #1e80ff;
          width: calc(100% - 2rem);
        }

        .active a {
          color: #1e80ff;
        }
      }
    }
  }

  .right-side-nav {
    display: flex;
    align-items: center;
    justify-content: center;

    .search-add {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10px;

      .search-add-ul {
        display: flex;
        align-items: center;
        justify-content: center;

        .nav-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;
        }

        .search {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;
          cursor: auto;

          .search-form {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            border: solid 1px #c2c8d1;
            border-radius: 4px;
            background: #fff;
            overflow: hidden;

            .search-input {
              display: flex;
              align-items: center;
              justify-content: center;
              max-width: 240px;
              padding: 10px;
              border: none;
              box-shadow: none;
              outline: none;
              font-size: 14px;
              color: #252933;
            }

            .seach-icon-container {
              position: relative;
              left: -2px;
              width: 44px;
              height: 30px;
              background: #f2f3f5;
              border-radius: 2px;
              display: flex;
              align-items: center;
              justify-content: center;

              .search-icon {
                color: #515767;
                font-size: 22px;
              }
            }
          }

          .typehead {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 10px;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: #fff;
            border-radius: 4px;
            box-shadow: 0 2px 8px 0 rgb(0 0 0 / 10%);
            z-index: 100;

            .title {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0 10px;
              height: 40px;
              border-bottom: 1px solid #ebebeb;

              .clear {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 10px;
                margin-left: auto;
                font-size: 14px;
                color: #515767;
                cursor: pointer;
              }
            }

            .list {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0 10px;

              .item {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 10px;
                height: 40px;
                border-bottom: 1px solid #ebebeb;

                .item-link {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 0 10px;
                  width: 100%;
                  height: 100%;
                  text-decoration: none;

                  .item-name {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 10px;
                    width: 100%;
                    height: 100%;
                    font-size: 14px;
                    color: #515767;
                  }
                }
              }
            }
          }
        }

        .add {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0px;

          .add-group {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 10px;

            .add-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0 10px;
              width: 100px;
              height: 32px;
              border: 1px solid #007fff;
              border-radius: 4px;
              background-color: #007fff;
              font-size: 14px;
              color: #fff;
              height: 36px;
              cursor: pointer;

              &:hover {
                background-color: #0066ff;
              }
            }

            .more {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0 10px;
              margin-left: 10px;
              cursor: pointer;

              .unfold12-icon {
                fill: #007fff;
              }
            }
          }
        }
      }
    }

    .vip-entry {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      .vip-title {
        display: flex;
        align-items: center;
        justify-content: center;

        .vip-entry-img {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 25px;
          height: 26px;

          .vip-img {
            font-size: 26px;
          }
        }

        .vip-words {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 5px;
          font-size: 14px;
          color: #515767;
          flex-shrink: 0;
        }
      }
    }

    .notification {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .jj-noti-link {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        cursor: pointer;

        .notification-icon {
          font-size: 26px;
        }
      }

      .notification-dropdown-menu {
        display: none;
        position: absolute;
        left: -90px;
        top: 34px;
        background: #fff;
        padding: 8px;
        box-sizing: border-box;
        box-shadow: 0 0 24px rgba(81, 87, 103, 0.16);
        border-radius: 6px;
        z-index: 10;

        .menu-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;

          &:hover {
            background-color: #f6f6f6;
          }

          .item-link {
            width: 100px;
            height: 40px;
            color: #515767;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 12px;
            position: relative;

            .item-name {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0 10px;
              width: 100%;
              height: 100%;
              font-size: 14px;
              color: #515767;
            }
          }
        }
      }
    }

    .userimg {
      padding: 0 10px;
    }
  }
}

.nav-item.notification:hover .notification-dropdown-menu {
  display: block;
}

img.useravatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: solid 2px #3f8ddc;
}

img.avatar {
  --s: 50px;
  /* image 大小*/
  --b: 2px;
  /* border 像素*/
  --c: #3f8ddc;
  /* border 颜色 */
  --cb: #e9ecef;
  /* 背景色 */
  --f: 1;
  /* 初始缩放 */

  width: var(--s);
  aspect-ratio: 1;
  cursor: pointer;
  border-radius: 0 0 999px 999px;
  --_g: 50% / calc(100% / var(--f)) 100% no-repeat content-box;
  --_o: calc((1 / var(--f) - 1) * var(--s) / 2 - var(--b));
  outline: var(--b) solid var(--c);
  outline-offset: var(--_o);
  background: radial-gradient(circle closest-side,
      var(--cb) calc(99% - var(--b)),
      var(--c) calc(100% - var(--b)) 99%,
      #0000) var(--_g);
  -webkit-mask: linear-gradient(#000 0 0) no-repeat 50% calc(1px - var(--_o)) / calc(100% / var(--f) - 2 * var(--b) - 2px) 50%,
    radial-gradient(circle closest-side, #000 99%, #0000) var(--_g);
  transform: scale(var(--f));
  transition: 0.5s;
}

img.avatar:hover {
  --f: 1.4;
  padding-top: calc(var(--s) / 5);
}


@media screen and (max-width: 1400px) {
  .main-header {
    justify-content: space-between;
  }
}

@media screen and (max-width: 1100px) {
  .main-header {
    padding: 10px 0px;
  }

  .main-nav .nav-list .main-nav-list .phone-show-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .selectedspan {
      color: #1e80ff;
    }
  }

  .main-nav .nav-list .main-nav-list .phone-hide li:hover {
    background: #f7f8fa;
  }

  .main-nav .nav-list .main-nav-list .phone-hide li:hover a::before {
    background-color: #fff;
  }

  .unfold16-icon {
    display: block;
    transition: transform 0.2s ease-in-out;
  }

  .unfold16-icon.active {
    color: #1e80ff;
    transform: rotate(-180deg);
  }

  .main-nav .nav-list .main-nav-list .phone-hide.show {
    display: block;
    position: absolute;
    background-color: #fff;
    width: 120px;
    top: 48px;
    padding: 10px 5px;
    box-shadow: 0 8px 24px rgba(81, 87, 103, 0.16);
    border: 1px solid #e4e6eb;
    border-radius: 4px;
  }

  .main-nav .nav-list .main-nav-list .phone-hide {
    display: none;
  }
}

@media screen and (max-width: 800px) {
  .main-nav .right-side-nav .search-add .search-add-ul .add {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .logo {
    padding-right: 0;
  }

  .logo-img,
  .logotitle {
    display: none;
  }

  .mobile-img {
    display: block;
    width: 26px;
    height: 26px;
  }
}

@media screen and (max-width: 600px) {
  .main-nav .right-side-nav .userimg {
    display: none;
  }

  .main-nav .right-side-nav .search-add .search-add-ul .search .search-form .search-input {
    max-width: 180px;
  }
}

@media screen and (max-width: 450px) {
  .main-nav .right-side-nav .notification {
    display: none;
  }

  .main-nav {
    padding-left: 0;
  }

  .main-nav .nav-list .main-nav-list .phone-hide.show {
    top: 38px;
  }

  .main-nav .right-side-nav .search-add .search-add-ul .search .search-form .search-input {
    max-width: 120px;
  }

  .mobile-img {
    width: 22px;
    height: 22px;
  }

  .main-nav .nav-list .main-nav-list .phone-show-menu span,
  .main-nav .nav-list .main-nav-list .phone-show-menu .unfold16-icon {
    font-size: 14px;
  }

  .main-nav .right-side-nav .search-add .search-add-ul .search {
    padding: 0;
  }

  .main-nav .right-side-nav .vip-entry {
    padding: 0 5px;
  }

  .main-nav .right-side-nav .vip-entry .vip-title .vip-entry-img .vip-img {
    font-size: 20px;
  }

  .main-nav .right-side-nav .vip-entry {
    padding: 0 0 0 5px;
  }
}

@media screen and (max-width: 365px) {
  .main-nav .right-side-nav .notification .jj-noti-link {
    padding: 0 0px 0 5px;
    width: 20px;
  }

  .main-nav .right-side-nav .notification .jj-noti-link .notification-icon {
    font-size: 22px;
  }
}
</style>
