<template>
    <Navigation :mainid="0" />
    <div id="main" class="markdow-page">
        <div class="grid-wapper">
            <div class="topmainbox">
                <div class="toptitle">
                    {{ bloginfo.title }}
                </div>
            </div>
            <div class="grid-view">
                <Viewer ref="markDownRef" :locale="zh" :value="value" :plugins="plugins" />
            </div>

            <div class="bottommainbox">
                <div class="bottomtitle">
                    标签：
                    <div class="tagbox">
                        {{ bloginfo.tag }}
                    </div>
                </div>
            </div>


        </div>
        <div class="rightbox">
            <div class="rightitem">
                <div class="card-title">
                    目录
                </div>

                <ul class="catalog-list" ref="catalogList">
                    <li v-for="(item, index) in  cateList " :key="index"
                        :class="[{ active: anchor == index }, { d1: item.tagName === 'h2' }, { d2: item.tagName === 'h3' }, { d3: item.tagName === 'h4' }]"
                        class="item">
                        <div class="a-container"><a @click="changeanchor(index)" :href="'#head-' + index"
                                class="catalog-aTag"
                                :class="[{ 'd1-aTag-title': item.tagName === 'h2' }, { 'd2-aTag-title': item.tagName === 'h3' }, { 'd3-aTag-title': item.tagName === 'h4' }]">
                                {{ item.text }}
                            </a></div>
                    </li>
                </ul>
                <!--显示目录-->
                <!-- <div class="marker-card">
                    <a v-for="(item, index) in cateList" :key="index"
                        :class="[{ active: anchor == index }, item.tagName + '-class']" class="marker-item"
                        @click="scrollToSection('head-' + index, index)">{{ item.text }}{{ index }}</a>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, toRefs, markRaw, onMounted, nextTick, onUnmounted } from 'vue'
import { Viewer } from '@bytemd/vue-next'
import { getProcessor } from 'bytemd'
import gfm from '@bytemd/plugin-gfm'
import gemoji from '@bytemd/plugin-gemoji'
import highlight from '@bytemd/plugin-highlight' // 代码高亮
import frontmatter from '@bytemd/plugin-frontmatter' // 解析前题
import mediumZoom from '@bytemd/plugin-medium-zoom' // 缩放图片
import breaks from '@bytemd/plugin-breaks'
import zhHans from 'bytemd/locales/zh_Hans.json'
import 'bytemd/dist/index.css'
import 'juejin-markdown-themes/dist/juejin.min.css' // 掘金同款样式
import { findIndex } from 'lodash'

import Navigation from '../components/mainheader.vue';
import router from "../router";
import API from "../axios/api.ts";


const pluginsList = [gfm(), gemoji(), highlight(), frontmatter(), mediumZoom(), breaks()]
const blogid = router.currentRoute.value.params.id;
const bloginfo = ref({})

const state = reactive({
    value: '',
    plugins: markRaw(pluginsList),
    zh: zhHans,
    cateList: [], // 目录内容
    offsetTopList: [], //文档流中锚点距离顶部距离集合
    anchor: 0,
})
const { anchor, value, plugins, zh, markDownRef, cateList } = toRefs(state)
const catalogList = ref(null);
onMounted(() => {
    Getbloginfo()
})





const Getbloginfo = async () => {
    const res = await API.Getbloginfo('api/blog/Getbloginfo', { blogid: blogid })
    state.value = res.data[0].content
    bloginfo.value = res.data[0]

    getCataLogData()
    nextTick(() => {
        transformToId()
        // 获取内容的所有锚点距离顶部的距离
        getCalcLateTop()
        // 监听页面滚动获取当前第几个锚点
        window.addEventListener('scroll', scrollHandle)
        window.onresize = () => {
            getCalcLateTop()
        }
    })

}


onUnmounted(() => {
    window.removeEventListener('scroll', scrollHandle)
})


const changeanchor = index => {
    state.anchor = index
}


const getCataLogData = () => {
    getProcessor({
        plugins: [
            {
                rehype: p =>
                    p.use(() => tree => {
                        if (tree && tree.children.length) {
                            createCataLog(tree)
                        }
                    }),
            },
        ],
    }).processSync(state.value)
}


const createCataLog = tree => {
    let index = 0
    const items = []
    tree.children
        .filter(v => v.type == 'element')
        .forEach(node => {
            if (node.tagName === 'h2' || node.tagName === 'h3' || node.tagName === 'h4' && node.children.length > 0) {
                items.push({
                    tagName: node.tagName,
                    text: stringifyHeading(node),
                    index: index++
                })
            }
        })
    state.cateList = items
}

const stringifyHeading = node => {
    let result = ''
    node.children.forEach(item => {
        if (item.type == 'text') {
            result += item.value
        } else {
            item.children.forEach(item => {
                result += item.value
            })
        }
    })
    return result
}

const transformToId = () => {
    const dom = document.querySelector('.markdown-body')
    let children = Array.from(dom.children)
    if (children.length > 0) {
        for (let i = 0; i < children.length; i += 1) {
            const tagName = children[i].tagName
            if (tagName === 'H2' || tagName === 'H3' || tagName === 'H4') {
                const index = findIndex(state.cateList, v => v.text === children[i].textContent)
                if (index >= 0) {
                    children[i].setAttribute('id', `head-${index}`)
                }
            }
        }
    }
}
/**
 * 目录与标题联动问题
 * 1:点击目录滚动到锚点
 * 2:监听滚动-获取滚动位置最近的标签-做目录联动
 *
 */
// const scrollToSection = (sectionId, index) => {
//     state.anchor = index
//     const section = document.getElementById(sectionId)
//     if (section) {
//         section.scrollIntoView({ behavior: 'smooth' })
//     }
// }
const getCalcLateTop = () => {
    const mainEl = document.querySelector('#main')
    state.offsetTopList = state.cateList.map((item, index) => {
        const element = document.querySelector(`#head-${index}`)
        return {
            offsetTop: index === 0 ? mainEl.offsetTop : element.offsetTop,
            anchor: index,
        }
    })
}
const scrollHandle = () => {
    const curScrollTop = document.documentElement.scrollTop
        || window.pageYOffset
        || document.body.scrollTop

    let flag = true

    const len = state.offsetTopList.length
    const min = state.offsetTopList[0].offsetTop


    console.log(curScrollTop, state.offsetTopList[0].offsetTop, state.offsetTopList[len - 1].offsetTop)
    // 滚动的距离 小于 第一个锚点距离顶部的距离
    if (curScrollTop < min) {
        state.anchor = 0
        return
    }

    // 滚动的距离 大于 最后一个锚点距离顶部的距离
    if (curScrollTop > state.offsetTopList[len - 1].offsetTop - 30) {
        state.anchor = len - 1
        return
    }


    // 滚动的距离 与 全部锚点距离顶部距离的集合 比较 获取最近的锚点标识
    for (let i = len - 1; i >= 0; i--) {
        const curReference = state.offsetTopList[i].offsetTop // 当前参考值
        if (flag && curScrollTop >= curReference - 30) {
            flag = false
            state.anchor = state.offsetTopList[i].anchor
        }
    }

    // 检查当前视窗内的目录项并更新目录
    updateVisibleItems();
}

const updateVisibleItems = () => {
    const index = state.anchor;
    // 获取目录列表的 DOM 元素
    const listElement = catalogList.value;

    // 获取目标目录项的 DOM 元素
    const targetItem = listElement.querySelector(`.item:nth-child(${index + 1})`);


    // 将目标目录项滚动到目录列表的顶部
    listElement.scrollTop = targetItem.offsetTop;
};
</script>
<style lang="scss" scoped>
.markdow-page {
    padding: 100px 20px;
    max-width: 1300px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;

    :deep() {
        .bytemd {
            height: calc(100vh - 250px);
        }

        .markdown-body {
            margin: 0 20px;
        }
    }
}

.grid-wapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: calc(100% - 320px);
    flex-wrap: wrap;

    .topmainbox {
        background-color: #fff;
        width: 100%;
        padding: 40px 20px 0;
        text-align: justify;
        font-size: 32px;
        font-weight: 600;
    }

    .bottommainbox {
        background-color: #fff;
        width: 100%;
        padding: 40px 20px;
        text-align: justify;

        .bottomtitle {
            display: flex;
            align-items: center;
        }

        .tagbox {
            background-color: #f7f8fa;
            padding: 10px;
            color: #515767;
            margin-left: 20px;
        }
    }

    .grid-view {
        width: 100%;
        background-color: #fff;
    }
}

.rightbox {
    width: 260px;
    max-height: 400px;
    // height: 100vh;
    position: sticky;
    top: 100px;

    .rightitem {
        background: #fff;
        border-radius: 4px;
        padding: 0;
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;


        .card-title {
            font-weight: 500;
            margin: 0 1.667rem;
            font-size: 16px;
            line-height: 2rem;
            color: #252933;
            border-bottom: 1px solid #e4e6eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 56px;
        }
    }
}


//markdown目录样式

.catalog-list::-webkit-scrollbar {
    width: 4px;
    height: 80px
}

.catalog-list::-webkit-scrollbar-track {
    box-shadow: none;
    border-radius: 2px;
}

.catalog-list::-webkit-scrollbar-thumb {
    background-color: #e4e6eb;
    outline: none;
    border-radius: 50px;
}

.catalog-list {
    position: relative;
    padding: 0 0;
    max-height: 312px;
    overflow: auto;
    margin-top: 12px;
}

.catalog-list .catalog-aTag {
    color: inherit;
    display: inline-block;
    padding: 0 8px 8px;
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;

}

.catalog-list .catalog-aTag.d1-aTag-title {
    padding-top: 4px;
    line-height: 22px
}

.catalog-list .a-container:hover {
    cursor: pointer
}

.catalog-list .a-container:hover .catalog-aTag {
    color: #1e80ff
}

.catalog-list .sub-list {
    margin: 0;
    padding: 0
}

.catalog-list .item {
    margin: 0;
    padding: 0;
    font-size: 14px;
    font-weight: 400;
    color: #252933;
    list-style: none;
}

.catalog-list .item .a-container {
    display: block;
    position: relative;
    padding: 0 0 0 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.catalog-list .item.d1 {
    font-weight: 400;
    color: #252933;
}

.catalog-list .item.d1 .a-container {
    margin: 0;
    padding: 0 0 0 15px
}

.catalog-list .item.d1 .a-container:before {
    left: 5px;
    margin-top: -3px;
    width: 6px;
    height: 6px
}

.catalog-list .item.d1 .a-container .d1-aTag-title {
    font-size: 14px
}

.catalog-list .item.d1:first-child .a-container {
    margin-top: 0
}

.catalog-list .item.d2 {
    color: #515767;
}

.catalog-list .item.d2 .a-container {
    padding-left: 30px
}

.catalog-list .item.d2 .a-container:before {
    left: 24px
}

.catalog-list .item.d3 {
    color: #8a919f;
}

.catalog-list .item.d3 .a-container {
    padding-left: 45px
}

.catalog-list .item.d3 .a-container:before {
    left: 39px
}

.catalog-list .item.active>.a-container {
    color: #1e80ff
}

.catalog-list .item.active>.a-container:before {
    content: "";
    position: absolute;
    top: -4px;
    left: 0;
    margin-top: 7px;
    width: 3px;
    height: 14px;
    background: #1e80ff;
    border-radius: 2px
}

.catalog-list .item.d1.active>.a-container:before {
    top: 2px
}


// 
// .marker-card {
//     width: 230px;
//     padding: 10px;
//     position: relative;

//     .marker-item {
//         text-overflow: ellipsis;
//         overflow: hidden;
//         white-space: nowrap;
//         height: 30px;
//         line-height: 30px;
//         cursor: pointer;
//         display: block;

//         &:hover {
//             color: rebeccapurple;
//         }

//         &.h3-class {
//             padding-left: 15px;
//         }

//         &.active {
//             color: red !important;
//         }
//     }
// }



@media screen and (max-width: 768px) {
    .grid-wapper {
        width: 100%;

        .topmainbox {
            font-size: 26px;
        }

        .bottommainbox {
            .tagbox {
                margin-left: 6px;
                padding: 5px;
                font-size: 14px;
            }
        }
    }

    .rightbox {
        display: none;
    }

}

@media screen and (max-width: 600px) {

    .markdow-page {
        padding-top: 80px;
    }

}
</style>
