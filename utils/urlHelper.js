var util = require('./util.js');

const appConfig = {
  // DOMAIN:'https://janssen.wechat.ilabservice.com/yskj/api/v2/',
  
  // DOMAIN:'https://management.njbpstest.ilabservice.cloud/platform/wechat/api/v3/',//南京测试地址
  DOMAIN: 'https://management.njbpsdev.ilabservice.cloud/platform/wechat/api/v3/',//南京测试地址
  

};

const urlMap = {
  "getKey": 'openid/key',//获取key
  // "sendKey": 'auth/code',//传key给后端
  "isExist":'customer/openid/check',//判断用户是否存在
  "getCode":'unsecure/verification/code',//获取手机验证码
  "login":'customer/verify/verification/{code}',//核对验证码并登陆
  "powerOn":'customer/{phone}/power/on',//终端通电
  "powerOff":'customer/{phone}/power/off',//终端断电
  "appointTime":"customer/lease/{phone}/{serialNo}",//查询当前用户，当前设备，最近预约时间
  "deviceList":"customer/device_list",//查询设备列表
  "deviceDetail": "customer/lease/assets/{id}/info",//查询设备详情 "GET"
  "userInfo":"customer/user",//查询个人信息
  "queryRecord": "customer/lease/record",//查询用户预约记录
  "getDeviceDetail":"customer/assets/{id}/lease/occupied/time",   //查询占用时间段
  "orderDevice": "customer/assets/{id}/lease",  //创建预约  "POST"
  "changeOrderStatus":"customer/assets/share/setting",  //修改设备预约状态  "PUT"
  "orderDeviceList": "customer/assets/info", //查询可预约设备
  "queryAudit": "audit",   //获取审核列表
  "auditDetail": "audit/enterprise/{id}",  //获取企业审核详情
  "startAudit": "audit/start?bizType={bizType}&key={key}&type={type}&uid={uid}&id={id}&status={status}", //审核  POST
  "queryDeviceId": "customer/device/{serialNo}", //扫码查询当前设备id

};
const urlHelper = {
  getUrlWithParams: (key, params) => {
    var url = appConfig.DOMAIN + urlMap[key];

    var paramStr = '';
    if (params) {
      paramStr = util.toQueryString(params);
      paramStr = ((url.indexOf('?') > -1) ?
        '&' :
        '?') + paramStr;
    }
    return url + paramStr;
  },


  getUrl: (key) => {
    let url = urlMap[key];
    return appConfig.DOMAIN + url;
  },
  getTrueUrl: (url) => {
    return appConfig.DOMAIN + url;
  },

  getSprWithParams: (key, params) => {
    var url = urlMap[key];

    var paramStr = '';
    if (params) {
      paramStr = util.toQuerySpring(params, url);
    }
    var sd = appConfig.DOMAIN + paramStr;
    return sd
  },

  replaceWithParams: (key, params) => {
    var url = urlMap[key];
    var paramStr = '';
    if (params) {
      paramStr = util.toRelpaceSpring(params, url);
    }
    var sd = appConfig.DOMAIN + paramStr;
    return sd
  },

  getBaseDomain: () => {
    return appConfig.DOMAIN;
  },

}
module.exports = urlHelper;