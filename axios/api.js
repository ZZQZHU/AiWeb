
import request from './http.js';

const WebAPI = "https://form.hrflag.com/WebAPI/";
const WebAPITest = "http://116.62.189.123:5000/";


const API = {
    //调用接口方法 get geturl post posturl
    SendVefLog(param) { //发送短信验证码
        return request.posturl(WebAPITest + 'DEIUserInfo/LogginSendSMS', param);
    },
    UserLogin(param) { //用户登录
        return request.posturl(WebAPITest + 'DEIUserInfo/AccountLoggin', param);
    },
    getIPAddress() { //获取IP地址
        return request.getNoHeaders('https://api.ip138.com/ip/?datatype=jsonp&token=bb7ae2ac668da329b5ef844f46a4f160');
    },
    LoginRecords(param){ //登录记录
        return request.post(WebAPITest + 'DEIUserInfo/AddLogginInfo', param);
    }
};

export default API;