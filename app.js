//app.js
const app = getApp()
var NetworkService = require("./utils/NetworkService.js")
App({
  globalData: {
    version: "1.0.0",
    appid: "wx4fe36997b6081216", // 您的小程序的appid
    statusBarHeight: 0,
    isIpx: false,
    windowHeight: 0,
    windowWidth: 0,
    scene: '', //场景值
    bizType: '', //请求接口要用的
    key: '', //请求接口要用的
    serial: '', //请求接口要用的
    phone: '', //请求接口要用的
  },
  onLaunch: function(options) {
    let that = this;
    //设置全局scene
    var scene = options.scene;
    that.globalData.scene = scene;
    console.log("app.js__onShow_scene==" + scene)

    //设置全局变量
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.statusBarHeight = res.statusBarHeight * 2;
        that.globalData.windowWidth = res.windowWidth;
        let ratio = 750 / res.windowWidth;
        let height = res.windowHeight * ratio;
        that.globalData.windowHeight = height;

        //判断是否是iphonex
        var model = res.model
        if (model.search('iPhone X') != -1) {
          that.globalData.isIpx = true;
          that.globalData.statusBarHeight = 88;
        } else {
          that.globalData.isIpx = false;
        }
      }
    })
  },

})