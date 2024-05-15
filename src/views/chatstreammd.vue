<template>
  <div class="container">
    <div class="topbox">
      <div class="topleft">
        <svg class="icon icon-lishihuihua" aria-hidden="true">
          <use xlink:href="#icon-lishihuihua"></use>
        </svg>
        历史会话
      </div>
    </div>

    <div class="mainbox">
      <div class="chatBox" v-for="(chat, index) in ChatlistData" :key="index">
        <div class="userChat" v-if="chat.role == 'user'">
          <div class="chatcontent userchatcontent" v-html="formatContent(chat.content)"></div>
          <div class="chatImg"><img :src="userImage" alt="" srcset="" /></div>
        </div>

        <div class="systemChat" v-else>
          <div class="chatImg">
            <img src="../assets/robot.svg" alt="" srcset="" />
          </div>
          <div class="chatcontent">
            <Viewer :value="chat.content" />
          </div>
        </div>
      </div>
      <div class="chatBox" v-if="isAnswer">
        <div class="systemChat">
          <div class="chatImg">
            <img src="../assets/robot.svg" alt="" srcset="" />
          </div>
          <div class="chatcontent">
            <div class="answering">
              正在思考中<span class="blinkspan"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottombox">
      <div class="contentbox">
        <div class="inputbox">
          <el-input :placeholder="placeholder" v-model="searchData" :autosize="{ minRows: 1, maxRows: 4 }" resize="none"
            type="textarea" :rows="4" @keydown.enter.prevent="sendMessage"></el-input>

          <div class="userbtn" v-if="!isMobile">
            <el-popover placement="top-start" :width="300" popper-style="font-size: 12px;" trigger="hover" effect="dark"
              content="支持上传文件（最多 50 个，每个 100 MB）接受 pdf、doc、xlsx、ppt、txt、图片等">
              <template #reference>
                <el-upload class="uploadbox" multiple :auto-upload="false" :show-file-list="false" ref="uploadRef"
                  :http-request="UploadFiles" :limit="50" :on-exceed="handleExceed" :on-change="beforeFileUpload">
                  <div class="btnitem">
                    <svg class="icon icon-shangchuanwenjian-xian" aria-hidden="true">
                      <use xlink:href="#icon-shangchuanwenjian-xian"></use>
                    </svg>
                  </div>
                </el-upload>
              </template>
            </el-popover>

            <el-popover placement="top-start" :width="60" popper-style="font-size: 12px;" trigger="hover" effect="dark"
              content="请输入您的问题">
              <template #reference>
                <div class="btnitem" @click="ChatCompletion()">
                  <svg class="icon icon-fasongxiaox" :class="{ allowchat: searchData }" aria-hidden="true">
                    <use xlink:href="#icon-fasongxiaoxi"></use>
                  </svg>
                </div>
              </template>
            </el-popover>
          </div>
          <div class="userbtn" v-else>
            <el-upload class="uploadbox" multiple :auto-upload="false" :show-file-list="false" ref="uploadRef"
              :http-request="UploadFiles" :limit="50" :on-exceed="handleExceed" :on-change="beforeFileUpload">
              <div class="btnitem">
                <svg class="icon icon-shangchuanwenjian-xian" aria-hidden="true">
                  <use xlink:href="#icon-shangchuanwenjian-xian"></use>
                </svg>
              </div>
            </el-upload>

            <div class="btnitem" @click="ChatCompletion()">
              <svg class="icon icon-fasongxiaox" :class="{ allowchat: searchData }" aria-hidden="true">
                <use xlink:href="#icon-fasongxiaoxi"></use>
              </svg>
            </div>
          </div>
        </div>
        <div class="filetotallist" v-if="uploadImgLists.length > 0 || uploadFileLists.length > 0">
          <div class="filelist">
            <div class="fileimg" v-if="uploadImgLists.length > 0">
              <div class="listitem" v-for="(file, index) in uploadImgLists" :key="index">
                <img class="itemimg" :src="getFileUrl(file)" alt="" />
                <svg class="icon icon-guanbi" aria-hidden="true" @click="removeImgList(index)">
                  <use xlink:href="#icon-guanbi"></use>
                </svg>
              </div>
            </div>
            <div class="filenotimg" v-if="uploadFileLists.length > 0">
              <div class="listitem" v-for="(file, index) in uploadFileLists" :key="index">
                <div class="listitemleft">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-wenjian"></use>
                  </svg>
                </div>
                <div class="listitemright">
                  <div class="filename">{{ file.name }}</div>
                  <div class="fileinfo">
                    <div class="filetype">{{ getFileType(file.type) }}</div>
                    <div>{{ formatFileSize(file.size) }}</div>
                  </div>
                </div>
                <svg class="icon icon-guanbi" aria-hidden="true" @click="removeFileList(index)">
                  <use xlink:href="#icon-guanbi"></use>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import "../assets/font/iconfont.css";
import "../assets/font/iconfont.js";
import { debounce } from "lodash";
// @ts-ignore
import { Viewer } from "@bytemd/vue-next";
import "bytemd/dist/index.css";
import "juejin-markdown-themes/dist/juejin.min.css";
// @ts-ignore
import API from "../axios/api.js";
import { ElMessage } from "element-plus";
import type { UploadProps, UploadUserFile, UploadRawFile } from "element-plus";
const uploadRef = ref<UploadUserFile[]>([]);
const uploadImgLists = ref<UploadRawFile[]>([]);
const uploadFileLists = ref<UploadRawFile[]>([]);
const isMobile = ref(false);
const placeholder = ref("Enter 发送; Shift + Enter 换行");
const stringA = ref("欢迎来到HRflag AI工具");
const stringB = ref("");
const searchData = ref("");
const isAnswer = ref(false);
const userImage = ref(
  "https://hrflagfile.oss-cn-hangzhou.aliyuncs.com/UserImage/UserTop/_43753560e96eec6f5bca0d95f9a6524f.jpg"
);
const ChatlistData = ref([
  {
    role: "system",
    content:
      "Hi，我是 铁甲蛹～ \n\n 很高兴遇见你！你可以随时把网址🔗或者文件📃发给我，我来帮你看看",
  },
]);

onMounted(() => {
  print();
  checkWidthAndSetPlaceholder();
  watch(ChatlistData.value, (newVal) => {
    console.log(newVal, "565656");
    // 监听聊天记录的变化，如果有新消息，滚动到底部 滚动顺滑
    setTimeout(() => {
      const chatBox = document.querySelector(".mainbox");
      chatBox?.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth",
      });
    }, 200);
  });
});


const formatContent = (content: string) => {
  return content.replace(/\n/g, "<br>");
};

const sendMessage = debounce((event: KeyboardEvent) => {
  if (event.shiftKey) {
    searchData.value += "\n";
  } else {
    ChatCompletion();
  }
}, 300);

const removeImgList = (index: number) => {
  uploadImgLists.value.splice(index, 1);
};

const removeFileList = (index: number) => {
  uploadFileLists.value.splice(index, 1);
};

const ChatCompletion = debounce(async () => {
  if (!searchData.value) {
    return;
  }
  isAnswer.value = true;
  let userchatdata = {
    role: "user",
    content: searchData.value,
  };
  ChatlistData.value.push(userchatdata);
  searchData.value = "";
  console.log(ChatlistData.value);
  let KimiData;
  // 判断ChatlistData的长度，如果大于等于5,就取最新的5条作为参数
  if (ChatlistData.value.length >= 5) {
    KimiData = ChatlistData.value.slice(-5);
  } else {
    KimiData = ChatlistData.value;
  }

  let params = JSON.stringify({
    model: "moonshot-v1-128k",
    messages: KimiData,
    temperature: 0.3,
    stream: true,
  });

  const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer sk-GMyIk8B9deLWWpSeqH2ZXCsWBdQhueYGsIn635AkSYDP9ZVV`,
    },
    body: params,
  });
  isAnswer.value = false;
  // 添加系统消息到聊天列表
  const systemChatData = {
    role: "system",
    content: "",
  };
  ChatlistData.value.push(systemChatData);
  // 处理流式数据
  // @ts-ignore
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");
    const parsedLines = lines
      .map((line) => line.replace(/^data: /, "").trim())
      .filter((line) => line !== "" && line !== "[DONE]")
      .map((line) => JSON.parse(line));

    for (const parsedLine of parsedLines) {
      const { choices } = parsedLine;
      const { delta } = choices[0];
      const { content } = delta;
      if (content) {
        // 只修改ChatlistData的最后一条数据的content
        ChatlistData.value[ChatlistData.value.length - 1].content += content;
      }
    }
  }
}, 300);

const UploadFiles = (file: UploadProps) => {
  console.log(file);
};

const handleExceed = (fileList: UploadUserFile[]) => {
  console.log(fileList);
  ElMessage.error(
    `当前限制选择 2 个文件，本次选择了 ${fileList.length} 个文件`
  );
};

const beforeFileUpload = (file: UploadUserFile) => {
  if (!file || !file.raw || typeof file.size !== "number") {
    ElMessage.error("");
    return false; // 返回 false 表示文件上传不通过
  }

  console.log(file.size / 1024 / 1024);
  const isLt2M = file.size / 1024 / 1024 < 100;
  if (!isLt2M) {
    ElMessage.error("上传文件大小不能超过 100MB!");
    return false; // 返回 false 表示文件上传不通过
  }
  // 判断是否是图片
  if (
    file.raw.type === "image/png" ||
    file.raw.type === "image/jpg" ||
    file.raw.type === "image/jpeg" ||
    file.raw.type === "image/gif" ||
    file.raw.type === "image/bmp" ||
    file.raw.type === "image/webp"
  ) {
    uploadImgLists.value.push(file.raw as UploadRawFile);
  } else {
    uploadFileLists.value.push(file.raw as UploadRawFile);
  }
};

// 获取文件的预览 URL
const getFileUrl = (file: File | Blob) => {
  return URL.createObjectURL(file);
};

const getFileType = (type: string) => {
  // 获取文件类型
  const types: Record<string, string> = {
    "image/png": "PNG",
    "image/jpeg": "JPEG",
    "image/jpg": "JPG",
    "image/gif": "GIF",
    "application/pdf": "PDF",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
    "application/vnd.ms-excel": "XLS",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
    "application/vnd.ms-powerpoint": "PPT",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "PPTX",
    "text/plain": "TXT",
  };
  return types[type] || "";
};

const formatFileSize = (size: number) => {
  // 格式化文件大小显示
  if (size === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 定义print函数，自动执行
const print = () => {
  if (stringB.value.length >= stringA.value.length) {
    // 退出递归
    return;
  } else {
    // stringA仍然比stringB短，进入下一次等待和递归
    setTimeout(() => {
      stringB.value += stringA.value.charAt(stringB.value.length);
      print();
    }, 150);
  }
};

const checkWidthAndSetPlaceholder = () => {
  if (document.body.clientWidth < 768) {
    placeholder.value = "有什么问题尽管问";
    isMobile.value = true;
  } else {
    placeholder.value = "Enter 发送; Shift + Enter 换行";
    isMobile.value = false;
  }
};
//监听页面宽度 如果是移动端则显示提示
window.onresize = debounce(() => {
  console.log(document.body.clientWidth);
  if (document.body.clientWidth < 768) {
    placeholder.value = "有什么问题尽管问";
    isMobile.value = true;
  } else {
    placeholder.value = "Enter 发送; Shift + Enter 换行";
    isMobile.value = false;
  }
}, 1000);
</script>

<style scoped>
.container {
  position: relative;
  height: 100vh;
}

.container .topbox {
  position: absolute;
  top: 10px;
  left: 20px;
  display: flex;
  justify-content: space-between;
}

.topbox .topleft {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #fff;
  background-color: #2e67fa;
  border-color: #2e67fa;
  border-radius: 10px;
  padding: 10px;
}

.topleft i {
  margin-right: 5px;
}

.container .mainbox {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: calc(100vh - 200px);
  overflow-y: scroll;
  text-align: center;
}

.mainbox .chatBox {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.contentbox .inputbox {
  width: 100%;
  margin: 0 auto;
  position: relative;
  background-color: #fff;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 8px 16px;
}

.inputbox .userbtn {
  display: flex;
  align-items: center;
  color: #666;
}

.userbtn .btnitem {
  width: 30px;
  height: 30px;
  padding: 5px;
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.userbtn i {
  font-size: 26px;
  cursor: pointer;
  color: #666;
}

.userbtn .btnitem:hover {
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 5px;
}

.scolltitle .blinkspan {
  margin-bottom: -3px;
  width: 16px;
  height: 2px;
  background: rgb(79, 159, 255);
  display: inline-block;
  animation: blink___XOnRp 1s linear infinite;
  opacity: 1;
}

@keyframes blink___XOnRp {
  20% {
    opacity: 0.9;
  }

  30% {
    opacity: 0.7;
  }

  40% {
    opacity: 0.6;
  }

  50% {
    opacity: 0.5;
  }

  60% {
    opacity: 0.4;
  }

  70% {
    opacity: 0.3;
  }

  80% {
    opacity: 0.2;
  }

  90% {
    opacity: 0.1;
  }

  to {
    opacity: 0;
  }
}

:deep(.el-input__wrapper) {
  border: none;
  box-shadow: none;
  border-radius: 12px;
  background-color: #fff;
  padding: 5px 10px;
}

:deep(.el-popper.is-light) {
  background-color: #333;
  color: #fff;
}

.uploadbox {
  display: flex;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.icon-lishihuihua {
  width: 1.3em;
  height: 1.3em;
  margin-right: 3px;
}

.icon-shangchuanwenjian-xian {
  width: 1.5em;
  height: 1.5em;
  fill: #666;
}

.icon-fasongxiaox {
  width: 1.5em;
  height: 1.5em;
  fill: #b6b6b8;
}

.allowchat {
  fill: #666;
}

.contentbox {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  box-shadow: 0px 8px 25px 0px #0000000d;
  overflow: hidden;
}

.filetotallist {
  width: 100%;
  background-color: #f3f5fc;
  padding: 14px 16px;
}

.fileimg {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}

.fileimg .listitem {
  width: 19%;
  aspect-ratio: 1.13;
  position: relative;
  margin-right: 1%;
}

.listitem .itemimg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.listitem .icon-guanbi {
  color: brown;
  font-size: 16px;
  position: absolute;
  top: -8px;
  right: -8px;
}

.filenotimg {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 10px;
}

.filenotimg .listitem {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 32%;
  padding: 10px 0;
  background-color: #fff;
  margin-bottom: 10px;
  border-radius: 10px;
  margin-right: 1%;
  position: relative;
}

.listitemleft {
  width: 40px;
  height: 40px;
  margin: 0px 10px;
  flex-shrink: 1;
}

.listitemleft .icon {
  width: 100%;
  height: 100%;
}

.listitemright {
  flex: 1;
  margin-right: 10px;
}

.listitemright .filename {
  font-size: 12px;
  color: #333;
  font-weight: bold;
  display: -webkit-box;
  /* 使用 flexbox 布局 */
  -webkit-box-orient: vertical;
  /* 设置 flexbox 布局为垂直方向 */
  -webkit-line-clamp: 1;
  /* 指定显示的文本行数 */
  overflow: hidden;
  /* 超出部分隐藏 */
  text-overflow: ellipsis;
  /* 显示省略号 */
  text-align: justify;
}

.listitemright .fileinfo {
  font-size: 12px;
  color: #666;
  display: flex;
  justify-content: flex-start;
}

.fileinfo .filetype {
  margin-right: 3px;
}

.bottombox {
  position: fixed;
  width: 90%;
  max-width: 800px;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.mainbox {
  height: calc(100vh - 100px);
}

.systemChat {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 25px;
}

.userChat {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  margin-bottom: 25px;
}

.chatBox .chatImg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.systemChat .chatImg {
  margin-right: 10px;
}

.userChat .chatImg {
  margin-left: 10px;
}

.chatImg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chatBox .chatcontent {
  max-width: 100%;
  background-color: #fff;
  border-radius: 10px;
  padding: 0 15px;
  display: flex;
  justify-content: flex-start;
  text-align: justify;
  overflow-x: auto;
}

.chatBox .userchatcontent {
  padding: 15px;
}

.userChat .chatcontent {
  background-color: #2e67fa;
  color: #fff;
  overflow-x: scroll;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  min-height: 4px;
  background-clip: content-box;
  background-color: #333;
  border-radius: 10px;
}

/* 滚动条样式 */
:deep(::-webkit-scrollbar) {
  width: 4px;
  height: 4px;
}

:deep(::-webkit-scrollbar-track) {
  border-radius: 10px;
}

:deep(::-webkit-scrollbar-thumb) {
  min-height: 4px;
  background-clip: content-box;
  background-color: #bebebe;
  border-radius: 10px;
}

:deep(.el-textarea) {
  align-self: center;
}

:deep(.el-textarea__inner) {
  box-shadow: none;
}

.answering {
  padding: 15px;
}

.blinkspan::after {
  content: "__";
  animation: blink 1s infinite;
}

@keyframes blink {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media screen and (max-width: 768px) {
  .fileimg .listitem {
    width: 32%;
    margin-right: 0%;
  }

  .fileimg .listitem:nth-child(3n + 2) {
    margin-left: 2%;
    margin-right: 2%;
  }

  .listitemleft {
    margin-right: 0px;
  }

  .filenotimg .listitem {
    width: 49%;
    margin-right: 0%;
  }

  .filenotimg .listitem:nth-child(2n + 1) {
    margin-right: 2%;
  }

  .container .mainbox {
    height: calc(100vh - 170px);
  }

  .chatBox .userchatcontent {
    font-size: 13px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
  }

  .chatBox .chatImg {
    width: 30px;
    height: 30px;
  }

  :deep(.markdown-body) {
    width: 100%;
    overflow-x: scroll;
    font-size: 13px;
  }
}
</style>
