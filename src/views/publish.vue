<template>
  <div class="totalpage" @click="handleOutsideClick">
    <div class="toptitle">
      <el-input class="title-input" v-model="blogtitle" placeholder="输入文章标题..." />
      <div class="topright">
        <el-button class="btn" type="primary" @click.stop="publish()">发布</el-button>
        <img class="avatar"
          src="https://png.pngtree.com/png-clipart/20220404/original/pngtree-d-rendering-male-character-profile-or-avatar-happy-young-man-with-png-image_7512919.png"
          alt="" srcset="">
      </div>


      <div v-if="panelshow" class="panel">
        <div class="title">发布文章</div>
        <div class="form-item">
          <div class="label required">分类: </div>
          <div class="form-item-content category-list">
            <div class="item" :class="typeid == 1 ? 'active' : ''" @click="getType(1)">
              AI
            </div>
            <div class="item" :class="typeid == 2 ? 'active' : ''" @click="getType(2)">
              金融
            </div>
            <div class="item" :class="typeid == 3 ? 'active' : ''" @click="getType(3)">
              程序猿
            </div>
          </div>
        </div>


        <div class="form-item">
          <div class="label required">添加标签: </div>
          <div class="form-item-content selectbox">
            <el-select v-model="tagstr" multiple multiple-limit="1" placeholder="请先添加文章标签" style="width: 240px">
              <el-option v-for="item in tagoptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </div>

        <div class="form-item">
          <div class="label">文章封面: </div>
          <div v-if="!imgstr" class="form-item-content uploadbox">
            <el-upload class="avatar-uploader" action="https://backsys.aiblog.top/api/upload/uploadimg"
              :show-file-list="false" :on-success="handleAvatarSuccess">

              <div class="upimgbox">
                <div class="upimgtotal">
                  <div class="addicon">
                    <i class="iconfont icon-tianjia"></i>
                  </div>
                  <div class="el-upload__text">上传图片</div>
                </div>
              </div>

            </el-upload>
          </div>
          <div v-else class="form-item-content preview-img">
            <img :src="imgstr" alt="">
            <div class="deleteicon" @click.stop="deleteimg()">
              <i class="iconfont icon-shanchu"></i>
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="label required">编辑摘要: </div>
          <div class="form-item-content summary" :class="nolimit ? 'nolimit' : ''">
            <el-input type="textarea" class="summarytext" minlength="50" maxlength="100" show-word-limit
              v-model="summary" placeholder="请输入文章摘要" />

          </div>
        </div>

        <div class="footer">
          <div class="btn-container">
            <el-button @click="cancelpanel()">取消</el-button>
            <el-button type="primary" @click="surePubilsh()">确认并发布</el-button>
          </div>

        </div>

      </div>
    </div>
    <div class="markdow-page">
      <Editor :locale="zh" :upload-images="handleUploadFile" :value="value" :plugins="plugins" @change="handleChange" />
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, toRefs, markRaw, watch } from "vue";
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
import "../assets/fonts/iconfont.css";
import { ElNotification } from 'element-plus';


import API from "../axios/api.ts";
import { ta } from "element-plus/es/locales.mjs";

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

const panelshow = ref(false);
const typeid = ref(0);
const tagstr = ref("");
const tagoptions = ref([
  {
    label: 'AI模型',
    value: 'AI模型'
  },
  {
    label: 'AI工具',
    value: 'AI工具'
  },
  {
    label: 'AI应用',
    value: 'AI应用'
  },
  {
    label: '股票',
    value: '股票'
  },
  {
    label: '基金',
    value: '基金'
  },
  {
    label: '期货',
    value: '期货'
  },
  {
    label: '前端',
    value: '前端'
  },
  {
    label: '后端',
    value: '后端'
  },
  {
    label: '数据库',
    value: '数据库'
  },
  {
    label: '算法',
    value: '算法'
  },
  {
    label: '运维',
    value: '运维'
  }
])

const imgstr = ref('');

const summary = ref('');
const nolimit = ref(true);
// 监听 summary 的变化
watch(summary, (newSummary) => {
  if (newSummary.length < 50) {
    nolimit.value = true;
  }
  if (newSummary.length >= 50) {
    nolimit.value = false;
  }
}
);
//上传的图片数组
const blogimgarr = ref([])



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
  console.log(files);

  // 创建一个异步函数用于将图片转换为WebP格式
  const convertToWebP = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        const img = new Image();
        img.src = readerEvent.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0, img.width, img.height);

          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/webp');
        };
      };

      reader.readAsDataURL(file);
    });
  };

  try {
    const webpBlob = await convertToWebP(files[0]);

    let formData = new FormData();
    formData.append("file", webpBlob, "converted.webp");

    // 上传转换为WebP格式的图片
    const imgUrl = await API.UploadImage('api/upload/uploadimg', formData).then(res => {
      return res.data.imageUrl;
    }).catch(err => {
      console.error(err);
      throw err;
    });

    blogimgarr.value.push(imgUrl);

    return [
      {
        url: imgUrl,
      },
    ];
  } catch (error) {
    console.error("Error converting to WebP:", error);
    // 处理错误，可以返回一个错误提示或者采取其他措施
    throw error;
  }
};
const publish = () => {
  const blogTitle = blogtitle.value;

  if (!blogTitle) {
    ElNotification({
      type: "warning",
      message: "请输入文章标题",
      duration: 1500
    })
    return;
  }

  const richTextContent = state.value;

  if (!richTextContent) {
    ElNotification({
      type: "warning",
      message: "请输入文章内容",
      duration: 1500
    })
    return;
  }
  panelshow.value = true;
  const uploadedImageUrls = blogimgarr.value;

  // 提取富文本内容中的图片链接
  const regex = /\!\[.*?\]\((.*?)\)/g;
  let match;
  const richTextImageUrls = [];

  while ((match = regex.exec(richTextContent)) !== null) {
    richTextImageUrls.push(match[1]);
  }

  // 找到在uploadedImageUrls中存在，但在richTextImageUrls中不存在的图片
  const newImages = uploadedImageUrls.filter((imageUrl) => {
    console.log(imageUrl);
    return !richTextImageUrls.includes(imageUrl)
  });

  // 打印值以进行测试
  console.log("博客标题:", blogTitle);
  console.log("富文本内容:", richTextContent);
  console.log("已上传的图片链接:", uploadedImageUrls);
  console.log("可以删除的图片:", newImages);
  if (newImages.length > 0) {
    changepreserve(newImages);
  }
};

// 修改图片状态
const changepreserve = async (e) => {
  // 上传转换图片状态
  await API.UploadImage('api/upload/preserve', { imagearr: e }).then(res => {
    console.log(res);
  }).catch(err => {
    console.error(err);
    throw err;
  });
};


const deleteimg = async () => {
  console.log(imgstr.value);
  let deleteimgarr = [imgstr.value];
  imgstr.value = '';
  await API.UploadImage('api/upload/preserve', { imagearr: deleteimgarr }).then(res => {
    console.log(res);
  }).catch(err => {
    console.error(err);
    throw err;
  });

}




const getType = (e) => {
  typeid.value = e;

  console.log(typeid.value);
  tagstr.value = '';

  if (e == 1) {
    tagoptions.value = [
      {
        label: 'AI模型',
        value: 'AI模型'
      },
      {
        label: 'AI工具',
        value: 'AI工具'
      },
      {
        label: 'AI应用',
        value: 'AI应用'
      }
    ];
  } else if (e == 2) {
    tagoptions.value = [
      {
        label: '股票',
        value: '股票'
      },
      {
        label: '基金',
        value: '基金'
      },
      {
        label: '期货',
        value: '期货'
      }
    ];
  } else if (e == 3) {
    tagoptions.value = [
      {
        label: '前端',
        value: '前端'
      },
      {
        label: '后端',
        value: '后端'
      },
      {
        label: '数据库',
        value: '数据库'
      },
      {
        label: '算法',
        value: '算法'
      },
      {
        label: '运维',
        value: '运维'
      }
    ];
  }
}


const cancelpanel = () => {
  panelshow.value = false;
}



const surePubilsh = () => {
  const blogTitle = blogtitle.value;
  const richTextContent = state.value;
  if (typeid.value == 0) {
    ElNotification({
      type: "warning",
      message: "请选择文章分类",
      duration: 1500
    })
    return;
  }
  if (!tagstr.value) {
    ElNotification({
      type: "warning",
      message: "请选择文章标签",
      duration: 1500
    })
    return;
  }
  if (!summary.value) {
    ElNotification({
      type: "warning",
      message: "请输入文章摘要",
      duration: 1500
    })
    return;
  }

  if (summary.value.length < 50) {
    ElNotification({
      type: "warning",
      message: "文章摘要不能少于50个字符",
      duration: 1500
    })
    return;
  }
  const blogData = {
    title: blogTitle,
    content: richTextContent,
    summary: summary.value,
    type: typeid.value,
    tag: tagstr.value[0],
    img: imgstr.value
  };
  console.log(blogData);
  return;
  API.PublishBlog('api/blog/publish', blogData).then(res => {
    console.log(res);
  }).catch(err => {
    console.error(err);
    throw err;
  });

}

const handleAvatarSuccess = (
  response,
  uploadFile
) => {
  console.log(response, uploadFile);
  imgstr.value = response.imageUrl;
  // imgstr.value = URL.createObjectURL(uploadFile.raw);
}



// 处理点击页面外部的事件
const handleOutsideClick = (event) => {
  if (!panelshow.value) return;
  console.log(event.target);

  // 检查点击事件是否发生在 panel 区域内部
  const panel = document.querySelector('.panel');
  if (panel && !panel.contains(event.target)) {
    panelshow.value = false;
  }
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
  position: relative;
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

:deep(.title-input .el-input__wrapper) {
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



<style scoped>
.panel {
  position: absolute;
  margin: 10px 20px 0 0;
  top: 100%;
  right: 0;
  width: 560px;
  font-size: 1.2rem;
  white-space: nowrap;
  color: #909090;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 2px #f1f1f1;
  box-shadow: 0 1px 2px #f1f1f1;
  cursor: default;
  z-index: 100
}

.panel:before {
  content: "";
  position: absolute;
  margin-left: -.5rem;
  top: -.6rem;
  right: 5rem;
  width: 1rem;
  height: 1rem;
  background-color: #fff;
  border: 1px solid #ddd;
  border-right: none;
  border-bottom: none;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg)
}

.panel .title {
  padding: 24px 20px 16px 20px;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  color: #1d2129;
  border-bottom: 1px solid #e5e6eb
}

.panel .form-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin: 20px;
}

.panel .form-item .label {
  font-weight: 400;
  font-size: 14px;
  line-height: 32px;
  text-align: right;
  color: #1d2129;
  width: 85px;
  -webkit-box-flex: 0;
  -ms-flex: none;
  flex: none
}

.panel .form-item .label.required:before {
  content: "*";
  color: #f53f3f;
  vertical-align: -2px
}

.panel .form-item .form-item-content {
  margin-left: 10px;
}

.panel .form-item .item {
  display: inline-block;
  margin-right: 5px;
  padding: 0 0.7rem;
  font-size: 14px;
  line-height: 28px;
  width: 88px;
  height: 28px;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  border-radius: 2px;
  cursor: pointer;
  color: #86909c;
  background-color: #f4f5f5;
}

.panel .form-item .item.active {
  color: #1d7dfa;
  background-color: #e8f3ff;
}

.panel .form-item .uploadbox {
  width: 192px;
  height: 128px;
  background-color: #fafafa;
  border: 1px dashed #e5e6eb;
  margin-bottom: 16px;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.upimgbox {
  font-size: 16px;
  color: #8c939d;
  width: 192px;
  height: 128px;
  text-align: center;
  display: flex;
  align-content: center;
  justify-content: center;
}

.upimgbox .upimgtotal {
  display: flex;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  justify-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.upimgbox .upimgtotal .addicon {
  font-size: 40px;
  color: #8c939d;
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  justify-items: center;
  cursor: pointer;
}

.upimgbox .upimgtotal .el-upload__text {
  width: 100%;
  color: #8c939d;
}


.preview-img {
  position: relative;
  width: 160px;
  overflow: hidden;
}

.preview-img img {
  width: 100%;
}

.preview-img .deleteicon {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background-color: #fff;
  display: flex;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  justify-items: center;
  cursor: pointer;
}

.form-item .summary {
  position: relative;
  width: 100%;
}



.footer {
  display: flex;
  border-top: 1px solid #e5e6eb;
  height: 72px;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
}




:deep(.el-tag .el-tag__close) {
  color: #1d7dfa;
  /* 关闭按钮颜色 */
}

:deep(.el-tag .el-tag__close:hover) {
  background-color: #c7c8c8;
}

:deep(.el-tag.el-tag--info) {
  background-color: #e8f3ff;
  /* 标签背景色 */
  color: #1d7dfa;
  /* 标签字体颜色 */
  border-color: #e8f3ff;
  /* 标签边框颜色 */
}

:deep(.form-item .summary .summarytext .el-textarea__inner) {
  max-height: 100px;
  min-height: 80px !important;
}

:deep(.nolimit .el-textarea .el-input__count) {
  color: rgb(238, 77, 56);
}
</style>