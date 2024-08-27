<template>
    <div class="topbox">
        <Navigation :mainid="2" />
    </div>
    <div class="container">
        <div class="mainbox">
            <div class="totalaibot">
                <div class="aibot-item" v-for="(item, index) in botlist" :key="index" @click="gotochat(item)">
                    <div class="botitem-top">
                        <div class="itemtop-left">
                            <img src="https://static.aiblog.top/aiweb/robot.svg" alt="">
                        </div>
                        <div class="itemtop-right">
                            <div class="right-title">{{ item.title }}</div>
                            <div class="right-text">{{ item.text }}</div>
                        </div>
                    </div>
                    <div class="botitembottom">
                        <div class="bottom-text">
                            {{ item.tiptext }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script lang="ts" setup>
import Navigation from '../components/mainheader.vue';
import { ref, onMounted } from "vue";
import { debounce } from "lodash";
import { useDataStore } from '../store/index.ts';
const dataStore = useDataStore()
import router from "../router";
// import { ElMessage } from "element-plus";
const isMobile = ref(false);

const botlist = ref([
    {
        title: 'AI智能对话',
        text: '聊天助手',
        img: 'https://static.aiblog.top/aiweb/robot.svg',
        tiptext: '通用的AI大模型，实现智能对话，帮您解决各种问题，如：日常对话，文件解读，翻译，计算，学习，解疑等！',
        type: 'Kimi',
        params: ''
    },
    {
        title: 'AI高级前端面试官',
        text: '聊天助手',
        img: 'https://static.aiblog.top/aiweb/robot.svg',
        tiptext: '我是一个AI高级前端面试官，充当您未来的面试官，我将重点针对vue,react,web性能优化，前端工程化，web安全，服务端渲染，Node等技术对你进行提问！',
        type: 'Dify',
        params: 'DifyowINfQa2atc06i'
    },
    {
        title: 'AI求职助手',
        text: '聊天助手',
        img: 'https://static.aiblog.top/aiweb/robot.svg',
        tiptext: '从各大招聘网站上找到心仪的工作，直接复制链接或者输入意向的公司信息和工作招聘等信息，在提供下自己的简历（pdf版），AI会帮助您分析下简历适配度，简历优化等信息，助您早日找到心仪的工作！',
        type: 'Dify',
        params: 'DifyizNoreZYGdSRbx'
    },
    {
        title: 'AI职位宣传',
        text: '聊天助手',
        img: 'https://static.aiblog.top/aiweb/robot.svg',
        tiptext: '我是一个在人力资源领域从事多年的营销专家，针对招聘职位，设计下宣传文案，撰写职位的宣传文案！',
        type: 'Dify',
        params: 'DifyGr5SH44Gh9LHoW'
    },

])


onMounted(() => {
    checkWidthAndSetPlaceholder();
});




const gotochat = (item: any) => {
    // 判断用户是否登录
    if (!dataStore.getCookie("Token")) {
        dataStore.showModal()
        return
    }
    console.log(item)
    // 判断type是否为Kimi
    if (item.type === 'Kimi') {
        router.push('/chat')
    } else {
        // 跳转到Dify  通过params传递参数
        router.push({ name: 'dify', params: { id: item.params } })
    }
}


const checkWidthAndSetPlaceholder = () => {
    if (document.body.clientWidth < 350) {
        isMobile.value = true;
    } else if (document.body.clientWidth < 768) {
        isMobile.value = true;
    } else {
        isMobile.value = false;
    }
};
//监听页面宽度 如果是移动端则显示提示
window.onresize = debounce(() => {
    if (document.body.clientWidth < 350) {
        isMobile.value = true;
    } else if (document.body.clientWidth < 768) {
        isMobile.value = true;
    } else {
        isMobile.value = false;
    }
}, 1000);

</script>


<style scoped>
.topbox {
    position: fixed;
    z-index: 99;
}

.container {
    position: relative;
    width: 100%;
    overflow-x: hidden;
    height: 100%;
    min-height: 100vh;
    background-color: rgba(242, 244, 247, 1);
}


.mainbox {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 1200px;
    padding: 0 20px;
}

.totalaibot {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.aibot-item {
    width: 30%;
    height: 150px;
    margin-bottom: 20px;
    background-color: #fff;
    border: 0 solid #eaecf0;
    padding: 20px 14px;
    border-radius: 14px;
    box-shadow: 0 0 #0000, 0 0 #0000, 0px 1px 2px 0px rgba(16, 24, 40, .06), 0px 1px 3px 0px rgba(16, 24, 40, .1);
    cursor: pointer;
}

.botitem-top {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.itemtop-left {
    background: rgb(255, 234, 213);
    padding: 10px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
}

.itemtop-left img {
    width: 24px;
    height: 24px;
}

.right-title {
    font-size: 16px;
    font-weight: 600;
}

.right-text {
    color: #667085;
    font-size: 12px;
}

.bottom-text {
    color: #667085;
    font-size: 13px;
    line-height: 1.5;
    margin-top: 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
    text-overflow: ellipsis;
}

@media screen and (max-width: 1200px) {
    .aibot-item {
        width: 45%;
    }

}


@media screen and (max-width: 768px) {
    .mainbox {
        position: static;
        /* margin: 20px auto 20px; */
        margin: 100px auto 20px;
        transform: none;
    }

    .aibot-item {
        width: 100%;
        height: 130px;
    }


}
</style>