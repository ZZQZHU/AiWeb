// useLoginModal.ts
import { ref } from 'vue';
import axios from 'axios';
import { useDataStore } from '../../store/index.ts';


export function useLoginModal() {
    const username = ref('');
    const password = ref('');
    const overtime = ref(false);
    const WxLoginimg = ref('');
    const loading = ref(true);
    const ws = ref<any>(null);
    const dataStore = useDataStore();


    const getWxImg = async () => {
        overtime.value = false;
        const random = Math.random().toString(36).substr(2);
        const time = new Date().getTime();
        let randomStr = 'AI' + time + random;
        randomStr = randomStr.substr(0, 25);
        console.log(randomStr);
        let params = {
            scene: randomStr,
            page: 'pages/autologin/autologin'
        }

        const response = await axios.post("https://backsys.aiblog.top/wxapi/wxlogin/getwxacode", params, {
            headers: { 'Content-Type': 'application/json' },
            responseType: 'arraybuffer'
        });
        const blob = new Blob([response.data], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        WxLoginimg.value = url;
        loading.value = false;

        if (ws.value) {
            ws.value.close();
        }

        ws.value = new WebSocket('wss://websys.aiblog.top/');
        ws.value.onopen = function () {
            console.log('连接成功');
            ws.value.send(JSON.stringify({ event: 'identify', data: { identification: randomStr, clientType: 'Web' } }));
        };

        ws.value.onmessage = function (event: any) {
            console.log('接收到消息');
            let data = JSON.parse(event.data);
            if (data.event == 'registrationComplete') {
                console.log('注册成功');
                dataStore.setCookie("Token", data.data.token, 24);
                dataStore.setCookie("refreshToken", data.data.refreshToken, 24 * 7);
                ws.value.close();
                dataStore.closeModal();
            }
        };

        setTimeout(() => {
            overtime.value = true;
        }, 300000);
    };


    return {
        username,
        password,
        overtime,
        WxLoginimg,
        loading,
        ws,
        getWxImg,
    };
}
