<template>
    <div class="main-header">
        <div class="logo">
            <router-link to="/home" class="logolink">
                <img class="logo-img"
                    src="https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e08da34488b114bd4c665ba2fa520a31.svg"
                    alt="LOGO" />

                <img class="mobile-img"
                    src="https:////lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/6c61ae65d1c41ae8221a670fa32d05aa.svg"
                    alt="LOGO" />
            </router-link>

        </div>

        <div class="main-nav">
            <ul class="nav-list">
                <li class="main-nav-list">
                    <div class="phone-show-menu isResourceVisible" @click="toggleMenu">
                        <span v-if="Props.mainid > 0" class="selectedspan">{{ categories[Props.mainid - 1].name }}</span>
                        <span v-else>首页</span>
                        <i class="iconfont icon-xiajiantou unfold16-icon" :class="{ 'active': isMenuActive }"></i>

                    </div>
                    <ul class="phone-hide isResourceVisible" :class="{ 'show': isMenuActive }">
                        <li v-for="category in categories" :key="category.id" class="nav-item link-item"
                            :class="Props.mainid == category.id ? 'active' : ''">
                            <router-link :to="category.route">
                                {{ category.name }}
                            </router-link>
                        </li>

                    </ul>
                </li>
                <ul class="right-side-nav">
                    <li class="search-add">
                        <ul class="search-add-ul isResourceVisible">
                            <li class="nav-item search">
                                <form role="search" class="search-form isResourceVisible">
                                    <input type="search" maxlength="64" placeholder="探索稀土掘金"
                                        class="search-input isResourceVisible">
                                    <div class="seach-icon-container">
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

                    <li class="nav-item notification">
                        <a class="jj-noti-link notification-a" href="/notification">
                            <i class="iconfont icon-tongzhi notification-icon"></i>

                        </a>

                    </li>


                    <li class="nav-item userimg">
                        <img class="avatar"
                            src="https://png.pngtree.com/png-clipart/20220404/original/pngtree-d-rendering-male-character-profile-or-avatar-happy-young-man-with-png-image_7512919.png"
                            alt="" srcset="">
                    </li>
                </ul>
            </ul>
        </div>
    </div>
</template>




<script setup lang="ts">
import "../assets/fonts/iconfont.css";
import { ref } from 'vue';
// import router from "../router";

const Props = defineProps(['mainid']);

const categories = [
    {
        "id": 1,
        "name": "首页",
        "route": "/home",
        "subCategories": [
            {
                "id": 11,
                "name": "关注",
                "route": "/home/follow"
            },
            {
                "id": 12,
                "name": "综合",
                "route": "/home/general"
            },
            {
                "id": 13,
                "name": "排行榜",
                "route": "/home/ranking"
            },
            {
                "id": 14,
                "name": "站长推荐",
                "route": "/home/recommended"
            }
        ]
    },
    {
        "id": 2,
        "name": "AI",
        "route": "/ai",
        "subCategories": [
            {
                "id": 21,
                "name": "图像",
                "route": "/ai/image"
            },
            {
                "id": 22,
                "name": "视频",
                "route": "/ai/video"
            },
            {
                "id": 23,
                "name": "音频",
                "route": "/ai/audio"
            },
            {
                "id": 24,
                "name": "软件",
                "route": "/ai/software"
            },
            {
                "id": 25,
                "name": "模型",
                "route": "/ai/model"
            }
        ]
    },
    {
        "id": 3,
        "name": "金融",
        "route": "/finance",
        "subCategories": [
            {
                "id": 31,
                "name": "股票",
                "route": "/finance/stocks"
            },
            {
                "id": 32,
                "name": "期货",
                "route": "/finance/futures"
            },
            {
                "id": 33,
                "name": "复盘",
                "route": "/finance/review"
            },
            {
                "id": 34,
                "name": "诊股",
                "route": "/finance/analysis"
            },
            {
                "id": 35,
                "name": "资讯",
                "route": "/finance/news"
            }
        ]
    },
    {
        "id": 4,
        "name": "程序猿",
        "route": "/developer",
        "subCategories": [
            {
                "id": 41,
                "name": "前端",
                "route": "/developer/frontend"
            },
            {
                "id": 42,
                "name": "后端",
                "route": "/developer/backend"
            },
            {
                "id": 43,
                "name": "其他",
                "route": "/developer/other"
            }
        ]
    }
]

const isMenuActive = ref(false);

const toggleMenu = () => {
    isMenuActive.value = !isMenuActive.value;
};


const gotopublish = () => {
    window.open("/publish", "_blank");
}

const gotovip = () => {
    window.open("/vip", "_blank");
}

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
    justify-content: space-between;
    background-color: #fff;
    padding: 10px 0;
    width: 100%;
    box-shadow: 0 2px 8px #f2f3f5;
    position: fixed;
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
    }
}

.logo-img {
    width: 107px;
    height: 22px;
}

.mobile-img {
    display: none;
}

.main-nav {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 10px;
    width: 100%;

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
                box-shadow: 0 0 24px rgba(81, 87, 103, .16);
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
    --_g: 50%/calc(100%/var(--f)) 100% no-repeat content-box;
    --_o: calc((1/var(--f) - 1)*var(--s)/2 - var(--b));
    outline: var(--b) solid var(--c);
    outline-offset: var(--_o);
    background:
        radial-gradient(circle closest-side,
            var(--cb) calc(99% - var(--b)), var(--c) calc(100% - var(--b)) 99%, #0000) var(--_g);
    -webkit-mask:
        linear-gradient(#000 0 0) no-repeat 50% calc(1px - var(--_o)) / calc(100%/var(--f) - 2*var(--b) - 2px) 50%,
        radial-gradient(circle closest-side, #000 99%, #0000) var(--_g);
    transform: scale(var(--f));
    transition: .5s;
}

img.avatar:hover {
    --f: 1.4;
    padding-top: calc(var(--s)/5);
}



@media screen and (max-width: 1100px) {
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
        transition: transform .2s ease-in-out;
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
        box-shadow: 0 8px 24px rgba(81, 87, 103, .16);
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

    .logo-img {
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

@media screen and (max-width:365px) {
    .main-nav .right-side-nav .notification .jj-noti-link{
        padding: 0  0px 0 5px;
        width: 20px;
    }
    .main-nav .right-side-nav .notification .jj-noti-link .notification-icon{
        font-size: 22px;
    }
}
</style>
