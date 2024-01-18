<template>
  <div class="toptitle">
    <el-input class="title-input" v-model="blogtitle" placeholder="输入文章标题..." />
    <div class="topright">
      <el-button class="btn" type="primary" @click="publish()">发布</el-button>
      <img class="avatar"
        src="https://png.pngtree.com/png-clipart/20220404/original/pngtree-d-rendering-male-character-profile-or-avatar-happy-young-man-with-png-image_7512919.png"
        alt="" srcset="">
    </div>
  </div>
  <div class="markdow-page">
    <Editor :locale="zh" :upload-images="handleUploadFile" :value="value" :plugins="plugins" @change="handleChange" />
  </div>
</template>
<script setup>
import { reactive, ref, toRefs, markRaw } from "vue";
import { Editor } from "@bytemd/vue-next";
import gfm from "@bytemd/plugin-gfm";
import gemoji from "@bytemd/plugin-gemoji";
import highlight from "@bytemd/plugin-highlight"; // 代码高亮
import frontmatter from "@bytemd/plugin-frontmatter"; // 解析前题
import mediumZoom from "@bytemd/plugin-medium-zoom"; // 缩放图片
import breaks from "@bytemd/plugin-breaks";
import zhHans from "bytemd/locales/zh_Hans.json";
import "bytemd/dist/index.css";
import "juejin-markdown-themes/dist/juejin.min.css"; // 掘金同款样式


import API from "../axios/api.ts";

// 内容控件所支持的特殊功能插件列表，如：支持代码高亮、图片优化等。
const pluginsList = [
  gfm(),
  gemoji(),
  highlight(),
  frontmatter(),
  mediumZoom(),
  breaks(),
  //
];


const blogtitle = ref("")
const state = reactive({
  value: "",
  plugins: markRaw(pluginsList),
  zh: zhHans,
});
const { value, plugins, zh } = toRefs(state);

const handleChange = (val) => {
  state.value = val;
  console.log(val);
};
const handleUploadFile = async (files) => {
  console.log(files)
  let fromData = new FormData();
  fromData.append("file", files[0]);
  // 上传图片
  const imgUrl = await API.UploadImage('api/upload/uploadimg', fromData).then(res => {
    console.log(res.data.imageUrl);
    return res.data.imageUrl
  }).catch(err => {
    console.log(err);
  })

  console.log(imgUrl);

  return [
    {
      title: "图片",
      url: imgUrl,
    },
  ];
};
const publish = () => {
  console.log(blogtitle.value);
  console.log(state.value);
};
</script>
<style scoped>
.toptitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 70px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.title-input {
  margin: 0;
  padding: 0;
  font-size: 24px;
  font-weight: 500;
  color: #1d2129;
  border: none;
  outline: none;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  height: 100%;
}

:deep(.el-input__wrapper) {
  border: none;
  box-shadow: none;
}



.toptitle .topright {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 180px;
}

.topright .btn {
  margin-left: 10px;
  margin-right: 10px;
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





.markdow-page {
  width: 100%;
}

:deep(.bytemd) {
  height: calc(100vh - 70px);
}
</style>
