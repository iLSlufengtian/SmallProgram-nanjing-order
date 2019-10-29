const app = getApp()
var NetworkService = require("../../utils/NetworkService.js")
var util = require("../../utils/util.js")

Page({
  data: {
    url: '',
  },
  onLoad: function(options) {
    var that = this;
    if (app.globalData.scene == 1047) {
      var params = decodeURIComponent(options.scene)
    
      var bizType1 = params.split('&')[0]
      var serial1 = params.split('&')[1]
      app.globalData.bizType = bizType1;
      app.globalData.serial = serial1;
    } else {
      app.globalData.bizType = '1';
    }
    that.getKey();
  },

  getKey() {
    var that = this;
    var conf = {
      method: "GET",
      params: {
        bizType: app.globalData.bizType,
      }
    }
    NetworkService.call("getKey", conf,
      function(res) {
        if (res && res.code == 0) {
          app.globalData.key = res.data
          that.getOpenid(res.data);
        }
      },
      function(error) {
        wx.showToast({
          title: '获取key错误',
          icon: 'none',
        })
      }
    )
  },

  getOpenid(key) {
    this.setData({
      // url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd8eaf358e1442a50&redirect_uri=https%3A%2F%2Fmanagement.njbpstest.ilabservice.cloud%2Fplatform%2Fwechat%2Fapi%2Fv3%2Fauth%2Fcode&response_type=code&scope=snsapi_base&state=' +key
      url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd8eaf358e1442a50&redirect_uri=https%3A%2F%2Fmanagement.njbpsdev.ilabservice.cloud%2Fplatform%2Fwechat%2Fapi%2Fv3%2Fauth%2Fcode&response_type=code&scope=snsapi_base&state=' + key
    });
    wx.showLoading({
      title: '正在加载...',
    })
  },


  onbindload: function(res) {
    var that = this
    var conf = {
      method: "POST",
      params: {
        bizType: app.globalData.bizType,
        key: app.globalData.key
      }
    };
    NetworkService.call('isExist', conf,
      function(res) {
        if (res && res.code == 0) {
          var roleTypes = res.data.roleType
          if (res.success == true) {
            app.globalData.phone = res.data.phone;
            if (roleTypes == 'USER_COMPANY_MANAGER') {
              wx.redirectTo({
                url: '/pages/index?roleType=manager',
              })
            } else {
              wx.redirectTo({
                url: '/pages/index?roleType=normal',
              })
            }
          } else {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }
        } else {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      },
      function(error) {
        wx.redirectTo({
          url: '/pages/login/login',
        })
        wx.showToast({
          title: '请求失败！！！',
          icon: 'none'
        })
      })
  },
})