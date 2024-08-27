<template>
    <div class="temtotal">
        <div class="temHeader">
            <div class="temHeaderitem">
                <Navigation :mainid="3" @custom-event="searchData"> </Navigation>
            </div>
        </div>

        <div class="temmainbody">
            <div class="temtopnav">
                <div class="temtopitem">
                    <div class="toptitle">
                        联系站长：1502680795@qq.com
                    </div>
                </div>
            </div>
            <div class="temleftnav">
                <div class="temleftitem">
                    <div class="leftbox">
                        <div class="toptitle">
                            联系站长：
                        </div>
                        <div class="contenttext">
                            1502680795@qq.com
                        </div>

                    </div>

                </div>
            </div>

            <div class="temcontainbody">
                <div class="mainCom temcontainitem">
                    <div class="blogbox">
                        <div class="toptabbox">
                            <div :class="toptab == 0 ? 'tabselected' : ''" class="toptabitem" @click="changetab(0)">
                                推荐
                            </div>
                            <div :class="toptab == 1 ? 'tabselected' : ''" class="toptabitem" @click="changetab(1)">
                                最新
                            </div>
                        </div>
                        <div class="mainblogbox" :class="loading ? 'paddingbox' : ''">
                            <el-skeleton :rows="5" animated :loading="loading">
                                <div class="listbox" v-if="Bloglist.length > 0">
                                    <div class="listitem" v-for="item in Bloglist" :key="item.post_id"
                                        @click="gotoblog(item.post_id)">
                                        <div class="itemleft">
                                            <div class="itemtitle">
                                                {{ item.title }}
                                            </div>
                                            <div class="itemsummary">
                                                {{ item.summary }}
                                            </div>
                                            <div class="itemtag">
                                                {{ item.tag }}
                                            </div>
                                        </div>


                                        <div class="itemright" v-if="item.cover_image_url">
                                            <img :src="item.cover_image_url" alt="">
                                        </div>

                                    </div>
                                </div>
                                <div v-else class="nodata">
                                    <img src="https://static.aiblog.top/aiweb/nodata.avif" alt="">
                                    <div class="nodatatext">
                                        暂无内容
                                    </div>
                                </div>
                            </el-skeleton>
                        </div>


                    </div>
                </div>

            </div>


            <div class="temrightbox">
                <div class="temrightitem toprightbox">
                    <div class="toptitle">
                        很高兴认识你！
                    </div>
                    <div class="contenttext">
                        欢迎来到铁甲蛹博客园！
                    </div>
                </div>
                <div class="temrightitem tworightbox">
                    <div class="rightbox">
                        广告位出租中...
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Navigation from "../components/mainheader.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import router from "../router";
import API from "../axios/api.ts";
const loading = ref(true);
const toptype = ref(1)
const toptab = ref(0);
const changetab = (index: number) => {
    toptab.value = index;
    loading.value = true;
    isnomore.value = false
    Bloglist.value = [];
    page.value = 1
    GetBlogList()
}

interface Blog {
    post_id: number;
    title: string;
    summary: string;
    user_id: number;
    tag: string;
    cover_image_url: string;
}


const Bloglist = ref<Blog[]>([])


const page = ref(1);
const limit = ref(10);
const search = ref('')
const isnomore = ref(false)

onMounted(async () => {
    window.addEventListener('scroll', handleScroll);
    GetBlogList()
})

const GetBlogList = async () => {
    if (isnomore.value) {
        return
    }
    const params = {
        type: toptype.value,
        toptab: toptab.value,
        page: page.value,
        limit: limit.value,
        search: search.value
    }

    const res = await API.GetBlogList('api/blog/GetBlogList', params)
    Bloglist.value = Bloglist.value.concat(res.data)
    if (res.data.length < 10) {
        isnomore.value = true
    }
    loading.value = false;
}

const searchData = async (e: string) => {
    console.log(e)
    page.value = 1
    isnomore.value = false
    search.value = e
    const params = {
        type: toptype.value,
        toptab: toptab.value,
        page: page.value,
        limit: limit.value,
        search: e
    }
    const res = await API.GetBlogList('api/blog/GetBlogList', params)
    Bloglist.value = res.data
    loading.value = false;
}






const gotoblog = (id: number) => {
    router.push({
        name: "blog",
        params: {
            id: id
        }
    })
}

// 滚动事件处理函数
const handleScroll = () => {
    const bottomOfWindow = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;

    if (bottomOfWindow) {
        page.value += 1;  // 增加页码
        GetBlogList();
    }
};


onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});

</script>



<style scoped lang="scss">
/* 引入外部css */
@import "../style.css";


.blogbox {
    margin-bottom: 100px;

    .toptabbox {
        color: #909090;
        padding: 16px 0;
        border-bottom: solid 1px #e4e6eb;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .toptabitem {
            padding: 0 20px;
            cursor: pointer;
        }

        .tabselected {
            color: #252933;
            position: relative;

        }

        .tabselected::before {
            display: block;
            content: "";
            position: absolute;
            bottom: -1rem;
            left: 40%;
            width: 22%;
            height: 3px;
            background-color: #1e80ff;
            border-radius: 2px;
        }
    }


    .paddingbox {
        padding: 20px;
    }

    .mainblogbox {
        .listbox {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            width: 100%;

            .listitem {
                width: 100%;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: #fff;
                border-bottom: 1px solid #eaecf0;
                padding-bottom: 12px;
                cursor: pointer;
            }

            .listitem:last-child {
                border-bottom: none;
                padding-bottom: 20px;
            }


            .listitem:hover {
                background-color: #f7f8fa;
            }


            .itemleft {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;

                .itemtitle {
                    width: 100%;
                    font-weight: 600;
                    font-size: 16px;
                    line-height: 24px;
                    color: #252933;
                    width: 100%;
                    display: -webkit-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    margin-bottom: 4px;
                }

                .itemsummary {
                    width: 100%;
                    color: #8a919f;
                    font-size: 13px;
                    line-height: 22px;
                    display: -webkit-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    margin-bottom: 4px;
                }

                .itemtag {
                    background-color: #f2f3f5;
                    padding: 0 6px;
                    border-radius: 2px;
                    max-width: 76px;
                    box-sizing: border-box;
                    margin-right: 6px;
                    color: #8a919f;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    min-height: 18px;
                    line-height: 18px;
                    font-size: 12px;
                    margin-bottom: 4px;
                }

            }

            .itemright {
                img {
                    flex: 0 0 auto;
                    width: 108px;
                    height: 72px;
                    margin-left: 24px;
                    background-color: #fff;
                    border-radius: 4px;
                    border: 1px solid #e4e6eb80;
                }
            }

        }
    }
}

.temrightitem {
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
}

.toprightbox {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;

    .toptitle {
        font-size: 18px;
        color: #252933;
        margin-bottom: 4px;
        font-weight: 600;
        line-height: 24px;
        width: 100%;
    }

    .contenttext {
        color: #8a919f;
        font-size: 12px;
        font-weight: 400;
        line-height: 24px;
        margin-top: 2px;
    }

}

.tworightbox {
    height: 400px;
    background-image: linear-gradient(to right, #434343 0%, black 100%);

    .rightbox {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        color: #fff;
        font-size: 18px;
        font-weight: 500;
        letter-spacing: 1.5px;
        line-height: 24px;
        height: 100%;

    }
}


.temleftitem {
    background-color: #fff;

    .leftbox {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        padding: 20px;

        .toptitle {
            font-size: 18px;
            color: #252933;
            margin-bottom: 4px;
            font-weight: 600;
            line-height: 24px;
            width: 100%;
        }

        .contenttext {
            color: #8a919f;
            font-size: 12px;
            font-weight: 400;
            line-height: 24px;
            margin-top: 2px;
        }
    }
}

.temtopitem {
    .toptitle {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}


.nodata {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 40px;

    img {
        width: 180px;
        height: 180px;
    }

    .nodatatext {
        width: 100%;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: #8a919f;
        line-height: 24px;
        margin-top: 10px;
    }


}

@media screen and (max-width: 1000px) {
    .blogbox {
        margin-bottom: 60px;
    }
}
</style>