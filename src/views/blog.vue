<template>
	<div id="main" class="markdow-page">
		<div class="grid-wapper">
			<div class="grid-view">
				<Viewer ref="markDownRef" :locale="zh" :value="value" :plugins="plugins" />
			</div>
			<!--显示目录-->
			<div class="marker-card">
				<a v-for="(item, index) in cateList" :key="index" :class="[{ active: anchor == index }, item.tagName + '-class']" class="marker-item" @click="scrollToSection('head-' + index, index)">{{ item.text }}{{ index }}</a>
			</div>
		</div>
	</div>
</template>
<script setup>
import { reactive, toRefs, markRaw, onMounted, nextTick, onUnmounted } from 'vue'
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

const pluginsList = [gfm(), gemoji(), highlight(), frontmatter(), mediumZoom(), breaks()]
/*
 *@Description: 状态初始化
 *@MethodAuthor: peak1024
 *@Date: 2023-10-25 15:46:36
 */
const state = reactive({
    value: '',
    plugins: markRaw(pluginsList),
    zh: zhHans,
    cateList: [], // 目录内容
    offsetTopList: [], //文档流中锚点距离顶部距离集合
    anchor: 0,
})
const { anchor, value, plugins, zh, markDownRef, cateList } = toRefs(state)

onMounted(() => {
	state.value =
		'# Hi，欢迎使用闪念笔记的新老朋友\n\n\n## 我是谁\n`熟悉掘金的朋友`可能知道，掘金的浏览器插件中有一个笔记的功能，该功能自2021年10月上线以来，深受众多掘友喜爱，期间也收到了不少掘友的反馈，比如此前页面抽屉式的交互不方便、没有web版、App里也找不到入口等等。这些反馈产品经理一直有认真记录整理，终于到今天，**我以全新的姿态来和你见面啦**！\n\n我是一款专门为掘友打造的学习记录工具，旨在帮助掘友在社区或其他学习场景下便捷记录学习内容，同时**支持内容的多端同步**，助力大家随时随地实现记录笔记的需求。\n\n## 如何使用\n\n### 浏览器插件端\n\n**1. 安装掘金浏览器插件后，点击浏览器右上角的icon，面板中即包含笔记入口**\n\n\n\n**2. 打开掘金浏览器插件，切换到「工具模式」，点击「快捷工具」版块即可看到「笔记入口」**\n\n**3. 阅读内容时，选中需要记录/引用的内容，即可出现笔记的气泡提示（该入口支持在插件设置中关闭）**\n\n\n\n\n**4. 在网页中点击鼠标右键弹出的面板中也支持快捷记录**\n\n\n\n**5. 在任意网页双击「jj」快捷键，唤出快捷搜索框，输入「note」即可快速唤出笔记**\n\n\n\n## Web端\n点击掘金主站头像，在下拉菜单中即可看到「闪念笔记」入口；\n\n### App端\n打开掘金App，点击「我」页面，在「更多功能」版块即可看到「闪念笔记」入口；\n\n ## 更多\n\n笔记在支持纯文本的基础上，支持切换到Markdown模式，例如常见的标题、加粗、斜体等文本格式，例如：\n\n# 一级标题\n## 二级标题\n### 三级标题\n#### 四级标题\n##### 五级标题\n###### 六级标题\n\n**这是一段字体加粗演示**\n\n*这是一段文本斜体演示* \n\n~~这是一段文本删除线演示~~\n\n> 这是一段引用内容演示\n\n ## 测试回显\n```\n* 无序列表项1\n* 无序列表项2\n* 无序列表项3\n\n1. 有序列表项1\n2. 有序列表项2\n3. 有序列表项3\n\n- [ ] todo1\n- [ ] todo2\n\n\n| 标题展示 |  |\n| --- | --- |\n|  表格内容展示  |\n\n\n---\n\n此外每条笔记支持用户自主添加标签，用于对内容进行归类筛选，插件、web、app三端内容云同步，满足大家在多场景的笔记需求；\n\n\n## 传送门\n更多功能欢迎大家体验❤\n* 浏览器插件，点击链接下载：https://juejin.cn/extension?utm_source=flash_note_web\n* App（扫码下载安装）：\n\n'
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
})

onUnmounted(() => {
	window.removeEventListener('scroll', scrollHandle)
})

/*
 *@Description: 获取目录
 *@MethodAuthor: peak1024
 *@Date: 2023-10-25 15:46:49
 */
const getCataLogData = () => {
    getProcessor({
        plugins: [
         {
            rehype: p =>
                p.use(() => tree => {
                    if (tree && tree.children.length) {
                        console.log(tree)
                        createCataLog(tree)
                    }
                }),
          },
        ],
    }).processSync(state.value)
}

const createCataLog = tree => {
    const items = []
    tree.children
        .filter(v => v.type == 'element')
        .forEach(node => {
            if (node.tagName === 'h2' && node.children.length > 0) {
                items.push({
                    tagName: node.tagName,
                    text: stringifyHeading(node),
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
        }
    })
    return result
}
/*
 *@Description: 设置锚点ID
 *@MethodAuthor: peak1024
 *@Date: 2023-10-25 17:03:21
 */
const transformToId = () => {
    const dom = document.querySelector('.markdown-body')
    let children = Array.from(dom.children)
    if (children.length > 0) {
        for (let i = 0; i < children.length; i += 1) {
            const tagName = children[i].tagName
            if (tagName === 'H1' || tagName === 'H2' || tagName === 'H3') {
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
const scrollToSection = (sectionId, index) => {
	state.anchor = index
	const section = document.getElementById(sectionId)
	if (section) {
            section.scrollIntoView({ behavior: 'smooth' })
	}
}
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
	// 滚动的距离 小于 第一个锚点距离顶部的距离
	if (curScrollTop < min) {
            state.anchor = 0
            return
	}
	// 滚动的距离 与 全部锚点距离顶部距离的集合 比较 获取最近的锚点标识
	for (let i = len - 1; i >= 0; i--) {
            const curReference = state.offsetTopList[i].offsetTop // 当前参考值
            if (flag && curScrollTop >= curReference - 100) {
                flag = false
                state.anchor = state.offsetTopList[i].anchor
            }
	}
}
</script>
<style lang="scss" scoped>

.markdow-page {
	width: 100%;
	height: 100vh;
	:deep() {
            .bytemd {
                height: calc(100vh - 200px);
            }
	}
}
.grid-wapper {
	display: flex;
	justify-content: center;
	align-items: flex-start;
	.grid-view {
		width: 1200px;
	}
	.marker-card {
		width: 200px;
		background-color: antiquewhite;
		padding: 10px;
		position: fixed;
		right: 20px;
		.marker-item {
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			height: 30px;
			line-height: 30px;
			cursor: pointer;
			display: block;
			&:hover {
				color: rebeccapurple;
			}
			&.h3-class {
				padding-left: 15px;
			}
			&.active {
				color: red !important;
			}
		}
	}
}
</style>

