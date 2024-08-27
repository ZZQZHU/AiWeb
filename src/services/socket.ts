import { io } from 'socket.io-client';


// const socket = io('ws://192.168.178.1:8880/');
// const socket = io('http://118.178.88.52:8880/');
const socket = io('wss://websys.aiblog.top/');




// const socket = io('http://localhost:3000', {
//   path: '/ws' // 确保路径与服务器端设置一致
//   // reconnection: false, //关闭自动重连
// });
export default socket;

