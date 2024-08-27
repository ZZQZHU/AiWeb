<template>

  <div class="container">
    <div class="mainbox">
      <div class="chatBox" v-for="(chat, index) in ChatlistData" :key="index">
        <div class="userChat" v-if="chat.query">
          <div class="chatleft">
            <div class="chatcontent userchatcontent" v-html="formatContent(chat.query)"></div>
            <div class="filetotallist" v-if="chat.uploadListsimg.length > 0 ||
        chat.uploadListsfile.length > 0
        ">
              <div class="filelist">
                <div class="fileimg">
                  <div class="listitem" v-for="item in chat.uploadListsimg">
                    <img class="itemimg" @click="goDetail(item)" :src="item.filePath" alt="" />
                  </div>
                </div>
                <div class="filenotimg">
                  <div class="listitem" v-for="item in chat.uploadListsfile" @click="goDetail(item)">
                    <div class="listitemleft">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-wenjian"></use>
                      </svg>
                    </div>
                    <div class="listitemright">
                      <div class="filename">{{ item.filecontent.name }}</div>
                      <div class="fileinfo" v-if="!item.error">
                        <div class="filetype">
                          {{ item.fileType }}
                        </div>
                        <div>{{ formatFileSize(item.filecontent.size) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="chatImg"><img :src="userImage" alt="" srcset="" /></div>
        </div>

        <div class="systemChat" v-else-if="chat.type == '0' && chat.answer">
          <div class="chatImg">
            <img src="../assets/robot.svg" alt="" srcset="" />
          </div>
          <div class="chatcontent">
            <Viewer :value="chat.answer" />
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
              content="支持上传文件（最多 1个，大小不超过 10 MB）接受 pdf、doc、xlsx、txt等">
              <template #reference>
                <el-upload class="uploadbox" v-model:file-list="fileList" :show-file-list="false" ref="uploadRef"
                  :http-request="UploadFiles" :limit="1" :on-exceed="handleExceed" :before-upload="beforeFilelimt"
                  :on-change="beforeFileUpload">
                  <div class="btnitem">
                    <svg class="icon icon-shangchuanwenjian-xian" aria-hidden="true">
                      <use xlink:href="#icon-shangchuanwenjian-xian"></use>
                    </svg>
                  </div>
                </el-upload>
              </template>
            </el-popover>

            <el-popover placement="top-start" :width="60" popper-style="font-size: 12px;" trigger="hover" effect="dark"
              :content="sendTip">
              <template #reference>
                <div class="btnitem" @click="ChatCompletion()">
                  <svg class="icon icon-fasongxiaox" :class="{
        allowchat:
          (searchData && isnormalImg != 2 && isnormalFile != 2) ||
          (isnormalImg == 1 && isnormalFile != 2) ||
          (isnormalFile == 1 && isnormalImg != 2),
      }" aria-hidden="true">
                    <use xlink:href="#icon-fasongxiaoxi"></use>
                  </svg>
                </div>
              </template>
            </el-popover>
          </div>
          <div class="userbtn" v-else>
            <el-upload class="uploadbox" v-model:file-list="fileList" :show-file-list="false" ref="uploadRef"
              :http-request="UploadFiles" :limit="1" :on-exceed="handleExceed" :before-upload="beforeFilelimt"
              :on-change="beforeFileUpload">
              <div class="btnitem">
                <svg class="icon icon-shangchuanwenjian-xian" aria-hidden="true">
                  <use xlink:href="#icon-shangchuanwenjian-xian"></use>
                </svg>
              </div>
            </el-upload>

            <div class="btnitem" @click="ChatCompletion()">
              <svg class="icon icon-fasongxiaox" :class="{
        allowchat:
          (searchData && isnormalImg != 2 && isnormalFile != 2) ||
          (isnormalImg == 1 && isnormalFile != 2) ||
          (isnormalFile == 1 && isnormalImg != 2),
      }" aria-hidden="true">
                <use xlink:href="#icon-fasongxiaoxi"></use>
              </svg>
            </div>
          </div>
        </div>
        <div class="filetotallist" v-if="uploadImgLists.length > 0 || uploadFileLists.length > 0">
          <div class="filelist">
            <div class="fileimg" v-if="uploadImgLists.length > 0">
              <div class="listitem" v-for="(file, index) in uploadImgLists" :key="index">
                <img class="itemimg" :src="getFileUrl(file.file)" alt="" />
                <div class="errortip" v-if="file.error">
                  <div>{{ file.error }}</div>
                </div>
                <div class="fileloading" v-if="file.loading">
                  <el-progress :percentage="100" :indeterminate="true" :duration="3" striped color="#2e67fa"
                    :show-text="false"></el-progress>
                </div>
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
                  <div class="filename">{{ file.file.name }}</div>
                  <div class="fileinfo" v-if="!file.error">
                    <div class="filetype">
                      {{ getFileType(file.file.type) }}
                    </div>
                    <div>{{ formatFileSize(file.file.size) }}</div>
                  </div>
                  <div class="fileinfo" v-else>
                    <div>{{ file.error }}</div>
                  </div>
                </div>
                <div class="fileloading" v-if="file.loading">
                  <el-progress :percentage="100" :indeterminate="true" :duration="3" striped color="#2e67fa"
                    :show-text="false"></el-progress>
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

    <div class="filetotalbox" v-if="filedetail.filename">
      <div class="filebox">
        <div class="filetopbox">
          <div class="fileName">{{ filedetail.filename }}</div>
          <div class="fileClose" @click="Canceldetail">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-guanbi"></use>
            </svg>
          </div>
        </div>
        <div class="filecontent">
          <div class="contentimg" v-if="filedetail.fileimgurl">
            <img :src="getFileUrl(filedetail.fileimgurl)" alt="" />
          </div>
          <div class="contenttext" v-else>
            <Viewer :value="filedetail.filecontent" />
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
import { useDataStore } from '../store/index.ts';
const dataStore = useDataStore()
import router from "../router";
import { ElMessage } from "element-plus";
import type { UploadUserFile, UploadProps } from "element-plus";
const uploadRef = ref<UploadUserFile[]>([]);
const uploadImgLists = ref<any[]>([]);
const isnormalImg = ref(0);
const uploadFileLists = ref<any[]>([]);
const fileList = ref<UploadUserFile[]>([]); //当前轮次上传的文件列表
const isnormalFile = ref(0);
const isMobile = ref(false);
const placeholder = ref("Enter 发送; Shift + Enter 换行");
const sendTip = ref("请输入问题");
const stringA = ref("欢迎来到铁甲蛹AI助手");
const stringB = ref("");
const searchData = ref("");
const isAnswer = ref(false);
// 当前上传文件的id 和content 数组
const uploadFileIdcontent = ref<any[]>([]);
// 当前上传文件的内容  字符串
const uploadFileContent = ref("");

// 单个文件查看详情  json格式
const filedetail = ref<any>({});
const userImage = ref(
  "https://static.aiblog.top/WX/imgs/boy.svg"
);


// 当日token
// const dayToken = ref(0);


// 拿到路由参数params传递
const { id } = router.currentRoute.value.params as { id: string };
// 不同参数对应不同的提示语
const jsonlist = ref([
  {
    id: 'DifyizNoreZYGdSRbx',
    prompt: 'Hi，我是铁甲蛹AI求职助手～ \n\n 我可以帮助你分析简历适配度，简历优化等信息，助您早日找到心仪的工作！请先输入意向的公司信息和工作招聘信息，或者您也可以直接输入招聘链接！'
  },
  {
    id: 'DifyGr5SH44Gh9LHoW',
    prompt: 'Hi，我是铁甲蛹AI职位宣传～ \n\n 我可以帮助您设计下宣传文案，撰写职位的宣传文案！请先输入需要宣传的职位信息，或者您也可以直接输入招聘链接！'
  },
  {
    id: 'DifyowINfQa2atc06i',
    prompt: 'Hi，我是铁甲蛹AI高级前端面试官～ \n\n 我将重点针对vue、react、web性能优化、前端工程化、web安全、服务端渲染、Node等技术对你进行提问！请问您准备好了吗?'
  }
])

// 根据id获取对应的提示语
const getPrompt = (id: string) => {
  let prompt = ''
  jsonlist.value.forEach((item) => {
    if (item.id == id) {
      prompt = item.prompt
    }
  })
  return prompt
}



const ChatlistData = ref([
  {
    query: "",
    conversation_id: "",
    answer: getPrompt(id),
    type: "0",
    uploadListsimg: [] as any[],
    uploadListsfile: [] as any[],
  },
]);

const ConversationId = ref("");








interface MyUploadUserFile extends UploadUserFile {
  file: File;
  // 添加其他属性...
}

onMounted(() => {
  print();
  checkWidthAndSetPlaceholder();
  // getFileList();
  getUserInfo();
  getChatRecord();
});







watch(ChatlistData, (newVal) => {
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

// 获取当前用户当日的历史对话token
// const getDayToken = async () => {
//   const response = await fetch("https://backsys.aiblog.top/Kimi/chat/gettoken", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       user_id: dataStore.getCookie("user_id"),
//     }),
//   });
//   const responseData = await response.json();
//   // 如果是非空数组，就设置token
//   if (responseData.length > 0) {
//     dayToken.value = responseData[0].chattoken;
//   }
// }


// 存储用户对话记录
const saveChatRecord = async (data: any) => {
  const response = await fetch("https://backsys.aiblog.top/Dify/chat/recordchat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: dataStore.getCookie("user_id"),
      type: "1",
      messages: data,
      difyid: id,
      conversation_id: ConversationId.value
    }),
  });
  const responseData = await response.json();
  console.log(responseData);
}

// 获取用户对话记录
const getChatRecord = async () => {
  const response = await fetch("https://backsys.aiblog.top/Dify/chat/getchatrecord", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: dataStore.getCookie("user_id"),
      type: "1",
      difyid: id
    })
  });
  const responseData = await response.json();
  if (responseData.length > 0) {
    const recorddata = JSON.parse(responseData[0].chatdata)
    ChatlistData.value = JSON.parse(recorddata);
    ConversationId.value = responseData[0].conversation_id;
  }
}


// 根据cookie的token获取用户信息
const getUserInfo = async () => {
  const token = dataStore.getCookie("Token")
  const response = await fetch("https://backsys.aiblog.top/api/login/userinfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const responseData = await response.json();
  // 如果用户信息存在，就设置用户头像
  if (responseData && responseData.user_id) {
    userImage.value = responseData.profile_picture_url ? responseData.profile_picture_url : "https://static.aiblog.top/WX/imgs/boy.svg";
    // 存到cookie中
    dataStore.setCookie("user_id", responseData.user_id, 24 * 7)
  }
};




//监听uploadImgLists的变化，如果有变化，就判断是否存在error有值的项，如果有就将IsnoramlImg设置为false
watch(uploadImgLists.value, (newVal) => {
  if (newVal.length > 0) {
    let iserror = newVal.some((item) => item.error);
    if (iserror) {
      isnormalImg.value = 2;
      sendTip.value = "请删除异常文件再发送";
    } else {
      isnormalImg.value = 1;
      if (isnormalFile.value != 2) {
        sendTip.value = "请输入问题";
      }
    }
  } else {
    isnormalImg.value = 0;
    if (isnormalFile.value != 2) {
      sendTip.value = "请输入问题";
    }
  }
});

//监听uploadFileLists的变化，如果有变化，就判断是否存在error有值的项，如果有就将IsnoramlFile设置为false
watch(uploadFileLists.value, (newVal) => {
  if (newVal.length > 0) {
    let iserror = newVal.some((item) => item.error);
    if (iserror) {
      isnormalFile.value = 2;
      sendTip.value = "请删除异常文件再发送";
    } else {
      isnormalFile.value = 1;
      if (isnormalImg.value != 2) {
        sendTip.value = "请输入问题";
      }
    }
  } else {
    isnormalFile.value = 0;
    if (isnormalImg.value != 2) {
      sendTip.value = "请输入问题";
    }
  }
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

const removeImgList = async (index: number) => {
  //拿到对应的文件id，删除uploadFileIdcontent 对应fileId的文件
  let id = uploadImgLists.value[index].id;
  if (!id) {
    uploadImgLists.value.splice(index, 1);
    fileList.value.splice(index, 1);
    return;
  }
  const response = await fetch('https://backsys.aiblog.top/Kimi/chat/deletefile', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file_id: id,
    }),
  });
  const responseData = await response.json();
  console.log(responseData);

  uploadFileIdcontent.value.forEach((item, index) => {
    if (item.fileId == id) {
      uploadFileIdcontent.value.splice(index, 1);
    }
  });
  uploadImgLists.value.splice(index, 1);
  fileList.value.splice(index, 1);
};

const removeFileList = async (index: number) => {
  //拿到对应的文件id，删除uploadFileIdcontent对应fileId的文件
  let id = uploadFileLists.value[index].id;
  if (!id) {
    uploadFileLists.value.splice(index, 1);
    fileList.value.splice(index, 1);
    return;
  }
  const response = await fetch('https://backsys.aiblog.top/Kimi/chat/deletefile', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file_id: id,
    }),
  });
  const responseData = await response.json();
  console.log(responseData);
  uploadFileIdcontent.value.forEach((item, index) => {
    if (item.fileId == id) {
      uploadFileIdcontent.value.splice(index, 1);
    }
  });
  uploadFileLists.value.splice(index, 1);
  fileList.value.splice(index, 1);
};

const ChatCompletion = debounce(async () => {
  // 判断用户是否登录
  if (!dataStore.getCookie("Token")) {
    let megtip
    // 判断是否是移动端
    if (isMobile.value) {
      megtip = "请先登录!";
    } else {
      megtip = "请先登录!正在为您跳转登录页面";
    }
    ElMessage.warning(megtip);
    setTimeout(() => {
      router.push("/login");
    }, 1000);
    return;
  }

  //判断 uploadImgLists 和 uploadFileLists 是否存在error有值的项，如果有就不发送
  if (uploadImgLists.value.length > 0) {
    let iserror = uploadImgLists.value.some((item) => item.error);
    if (iserror) {
      return;
    }
  }
  if (uploadFileLists.value.length > 0) {
    let iserror = uploadFileLists.value.some((item) => item.error);
    if (iserror) {
      return;
    }
  }

  //遍历上传的文件id数组，获取文件内容
  if (uploadFileIdcontent.value.length > 0) {
    uploadFileIdcontent.value.forEach((item) => {
      uploadFileContent.value += item.content + "\n";
    });
  }
  if (!searchData.value && !uploadFileContent.value) {
    return;
  }
  if (isAnswer.value) {
    return;
  }

  isAnswer.value = true;
  let Filecontent = uploadFileContent.value;
  if (uploadFileContent.value) {
    let filesystemchatdata = {
      query: "",
      conversation_id: "",
      answer: uploadFileContent.value,
      type: "1",
      uploadListsimg: [],
      uploadListsfile: [],
    };
    ChatlistData.value.push(filesystemchatdata);
  }
  let userchatdata = {
    query: searchData.value ? searchData.value : "这是我上传的文件,请帮我分析一下",
    conversation_id: "",
    answer: "",
    type: "0",
    uploadListsimg: uploadImgLists.value,
    uploadListsfile: uploadFileLists.value,
  };
  ChatlistData.value.push(userchatdata);
  let promptvalue = searchData.value;
  searchData.value = "";


  uploadFileIdcontent.value = [];
  uploadFileContent.value = "";
  uploadFileLists.value = [];
  uploadImgLists.value = [];
  fileList.value = [];


  // 判断当前用户当日对话轮次长度超过30，就不发送
  if (ChatlistData.value.length > 30) {
    isAnswer.value = false;
    // 添加系统消息到聊天列表
    const systemChatData = {
      query: "",
      conversation_id: ConversationId.value,
      answer: "您好，今日对话次数已用完，请明天再来！",
      type: "0",
      uploadListsimg: [],
      uploadListsfile: [],
    };
    ChatlistData.value.push(systemChatData);
    return;
  }

  let params = JSON.stringify({
    Content: promptvalue,
    Filecontent: Filecontent,
    ConversationId: ConversationId.value,
    user_id: dataStore.getCookie("user_id"),
    difyid: id
  });
  const response = await fetch('https://backsys.aiblog.top/Dify/chat/chatstream', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: params,
  });
  // 添加系统消息到聊天列表
  const systemChatData = {
    query: "",
    conversation_id: ConversationId.value,
    answer: "",
    type: "0",
    uploadListsimg: [],
    uploadListsfile: [],
  };
  ChatlistData.value.push(systemChatData);

  // 处理流式数据
  // @ts-ignore
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      let recordchat = JSON.stringify(ChatlistData.value);
      saveChatRecord(recordchat);
      break;
    }
    const chunk = decoder.decode(value);
    console.log(chunk);
    const lines = chunk.split("\n");
    console.log(lines);
    const parsedLines = lines
      .map((line) => line.replace(/^data: /, "").trim())
      .filter((line) => line !== "" && line !== "[DONE]")
    console.log(parsedLines);
    //过滤出json格式的数据
    const jsonLines = parsedLines.filter((line) => {
      try {
        JSON.parse(line);
        return true;
      } catch (e) {
        return false;
      }
    });
    console.log(jsonLines);
    //遍历json格式的数据
    jsonLines.forEach((line) => {
      const data = JSON.parse(line);
      console.log(data);
      if (data.conversation_id) {
        ConversationId.value = data.conversation_id;
      }
      if (data.answer) {
        ChatlistData.value[ChatlistData.value.length - 1].answer += data.answer;
        isAnswer.value = false;
        // 滚动到底部
        const chatBox = document.querySelector(".mainbox");
        chatBox?.scrollTo({
          top: chatBox.scrollHeight + 100,
          behavior: "smooth",
        });
      }
    });
  }
}, 300);

// 上传文件
const UploadFiles = debounce(async (file: MyUploadUserFile) => {
  const formData = new FormData();
  formData.append("file", file.file);

  if (
    file.file.type === "image/png" ||
    file.file.type === "image/jpg" ||
    file.file.type === "image/jpeg" ||
    file.file.type === "image/gif" ||
    file.file.type === "image/bmp" ||
    file.file.type === "image/webp"
  ) {
    uploadImgLists.value.push({
      file: file.file,
      error: "",
      id: '',
      filePath: "",
      loading: true,
    });
  } else {
    uploadFileLists.value.push({
      file: file.file,
      error: "",
      id: '',
      filePath: "",
      loading: true,
      filecontent: fileList.value[0],
      fileType: getFileType(file.file.type),
    });
  }



  const response = await fetch("https://backsys.aiblog.top/Kimi/chat/uploadfile", {
    method: "POST",
    body: formData,
  });
  // 解析 JSON 格式的响应体
  const responseData = await response.json();
  if (responseData.file_object && responseData.file_object.id) {
    GetFileContent(responseData.file_object.id);
    if (
      file.file.type === "image/png" ||
      file.file.type === "image/jpg" ||
      file.file.type === "image/jpeg" ||
      file.file.type === "image/gif" ||
      file.file.type === "image/bmp" ||
      file.file.type === "image/webp"
    ) {
      // 给uploadImgLists对应的的文件最后一个加上个字段id，并将loading设置为false、
      uploadImgLists.value[uploadImgLists.value.length - 1].id = responseData.file_object.id;
      uploadImgLists.value[uploadImgLists.value.length - 1].loading = false;
      uploadImgLists.value[uploadImgLists.value.length - 1].filePath = responseData.file_object.imgurl;

    } else {
      // 给uploadFileLists对应的的文件最后一个加上个字段id，并将loading设置为false、
      uploadFileLists.value[uploadFileLists.value.length - 1].id = responseData.file_object.id;
      uploadFileLists.value[uploadFileLists.value.length - 1].loading = false;
    }
  } else {
    //判断是否是图片
    if (
      file.file.type === "image/png" ||
      file.file.type === "image/jpg" ||
      file.file.type === "image/jpeg" ||
      file.file.type === "image/gif" ||
      file.file.type === "image/bmp" ||
      file.file.type === "image/webp"
    ) {
      //找到uploadImgLists对应的的文件最后一项，加上个字段error  描述为解析失败
      uploadImgLists.value[uploadImgLists.value.length - 1].error = "解析失败";
      uploadImgLists.value[uploadImgLists.value.length - 1].loading = false;
    } else {
      //找到uploadFileLists对应的的文件，加上个字段error  描述为解析失败
      uploadFileLists.value[uploadFileLists.value.length - 1].error = "解析失败";
      uploadFileLists.value[uploadFileLists.value.length - 1].loading = false;
    }
  }
}, 500);

// 读取文件内容
const GetFileContent = async (e: string) => {
  const response = await fetch(`https://backsys.aiblog.top/Kimi/chat/readfile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file_id: e,
    }),
  });
  let responseData = await response.json();
  responseData = JSON.parse(responseData);
  uploadFileIdcontent.value.push({ fileId: e, content: responseData.content });
};

// 查看文件详情
const goDetail = async (item: any) => {

  let fileimgurl = item.filePath;
  let filename = item.filecontent.name;
  const response = await fetch(`https://backsys.aiblog.top/Kimi/chat/readfile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file_id: item.id,
    }),
  });
  let responseData = await response.json();
  responseData = JSON.parse(responseData);
  filedetail.value = {
    fileimgurl: fileimgurl,
    filename: filename,
    filecontent: responseData.content,
  };
};

const Canceldetail = () => {
  filedetail.value = {};
};

const handleExceed = (fileList: UploadUserFile[]) => {
  ElMessage.error(
    `当前限制选择 1 个文件，本次选择了 ${fileList.length} 个文件`
  );
};

const beforeFilelimt: UploadProps["beforeUpload"] = (rawFile) => {
  // 判断用户是否登录
  if (!dataStore.getCookie("Token")) {
    let megtip
    // 判断是否是移动端
    if (isMobile.value) {
      megtip = "请先登录!";
    } else {
      megtip = "请先登录!正在为您跳转登录页面";
    }
    ElMessage.warning(megtip);
    setTimeout(() => {
      router.push("/login");
    }, 1000);
    return false;
  }
  // 限制文件类型，只允许pdf、doc、xlsx、txt、md
  const isAllowType =
    rawFile.type === "application/pdf" ||
    rawFile.type === "application/msword" ||
    rawFile.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    rawFile.type === "application/vnd.ms-excel" ||
    rawFile.type ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    rawFile.type === "application/vnd.ms-powerpoint" ||
    rawFile.type ===
    "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    rawFile.type === "text/plain";
  if (!isAllowType) {
    ElMessage.error("上传文件格式暂不支持，请重新上传!");
    return false; // 返回 false 表示文件上传不通过
  }
};

const beforeFileUpload = (file: UploadUserFile) => {
  if (!file || !file.raw || typeof file.size !== "number") {
    ElMessage.error("文件上传失败，请重新上传!");
    return false; // 返回 false 表示文件上传不通过
  }

  const isLt2M = file.size / 1024 / 1024 < 10;
  if (!isLt2M) {
    ElMessage.error("上传文件大小不能超过 10MB!");
    return false; // 返回 false 表示文件上传不通过
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
  if (document.body.clientWidth < 350) {
    placeholder.value = "尽管问";
    isMobile.value = true;
  } else if (document.body.clientWidth < 768) {
    placeholder.value = "有什么问题尽管问";
    isMobile.value = true;
  } else {
    placeholder.value = "Enter 发送; Shift + Enter 换行";
    isMobile.value = false;
  }
};
//监听页面宽度 如果是移动端则显示提示
window.onresize = debounce(() => {
  if (document.body.clientWidth < 350) {
    placeholder.value = "尽管问";
    isMobile.value = true;
  } else if (document.body.clientWidth < 768) {
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
  top: 20%;
  left: 50%;
  transform: translate(-50%, -20%);
  width: 100%;
  height: calc(100vh - 130px);
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
}

.fileimg .listitem:nth-child(5n + 2),
.fileimg .listitem:nth-child(5n + 3),
.fileimg .listitem:nth-child(5n + 4),
.fileimg .listitem:nth-child(5n + 5) {
  margin-left: 1.25%;
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
  position: relative;
}

.filenotimg .listitem:nth-child(3n + 2),
.filenotimg .listitem:nth-child(3n + 3) {
  margin-left: 2%;
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
  word-break: break-all;

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
  background-color: #fff;
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
  word-break: break-all;
}

.userChat .chatcontent {
  background-color: #2e67fa;
  color: #fff;
  overflow-x: scroll;
}

.errortip {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background-color: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  font-size: 12px;
}

/* 对话文件展示 */
.chatleft {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.userChat .chatcontent {
  display: inline-block;
}

.userChat .filetotallist {
  padding: 14px 0;
}

.userChat .fileimg {
  justify-content: flex-end;
}

.userChat .filenotimg {
  justify-content: flex-end;
}

.filetotalbox {
  position: fixed;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.filetotalbox .filebox {
  width: 90%;
  max-width: 800px;
  max-height: 90%;
  background-color: #f3f5fc;
  border-radius: 10px;
  box-shadow: 0px 8px 25px 0px #0000000d;
  overflow-y: auto;
}

.filetopbox {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  position: sticky;
  top: 0;
  z-index: 99;
}

.filecontent .contentimg {
  width: 100%;
}

.contentimg img {
  width: 100%;
}

.filecontent .contenttext {
  padding: 5px 20px;
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

/* md样式 */
:deep(.markdown-body p) {
  margin: 15px 0;
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

.fileloading {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 4px;
}

@media screen and (max-width: 768px) {
  .answering {
    font-size: 13px;
  }

  .fileimg .listitem {
    width: 32%;
    margin-left: 0%;
    margin-right: 0%;
  }

  .fileimg .listitem:nth-child(3n + 1) {
    margin-left: 0%;
    margin-right: 0%;
  }

  .fileimg .listitem:nth-child(3n + 2),
  .fileimg .listitem:nth-child(3n + 3) {
    margin-left: 2%;
    margin-right: 0%;
  }

  .listitemleft {
    margin-right: 0px;
  }

  .filenotimg .listitem {
    width: 60%;
    margin-left: 0%;
    margin-right: 0%;
  }

  .filenotimg .listitem:nth-child(2n + 1) {
    margin-left: 0%;
    margin-right: 0%;
  }

  .filenotimg .listitem:nth-child(2n + 2) {
    margin-left: 2%;
    margin-right: 0%;
  }

  .mainbox .chatBox {
    padding: 0 10px;
  }

  .container .mainbox {
    height: calc(100vh - 120px);
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
