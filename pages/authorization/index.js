const app = getApp()
var NetworkService = require("../../utils/NetworkService.js")
var util = require("../../utils/util.js")

Page({
  data: {
    url: '',
  },
  onLoad: function(options) {
    // wx.redirectTo({
    //   url: '/pages/home/index',
    // })
    var that = this;
    if (app.globalData.scene == 1047) {
      var params = decodeURIComponent(options.scene)
    
      var bizType1 = params.split('&')[0]
      var serial1 = params.split('&')[1]
      app.globalData.bizType = bizType1;
      app.globalData.serial = serial1;
    } else if(app.globalData.scene == 1043) {

    }
    else {
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
            console.log(res)
            app.globalData.phone = res.data.phone;
            app.globalData.userId = res.data.userId;
            app.globalData.roleTypedemo = res.data.roleType;
            if (app.globalData.scene == 1047){
              // 系统管理员和设备管理员可以进行通断电
              if (roleTypes == 'USER_COMPANY_MANAGER' || roleTypes == 'USER_DEVICE_OWNER') {      
                wx.redirectTo({
                  url: '/pages/Mhome/index',
                })
              } else {
                wx.redirectTo({
                  url: '/pages/home/index',
                })
              }
            }else{
              //根据roleTypes的不同判断显示的tabbar是否相同
              // 系统管理员可以进入带审核的首页
              if (roleTypes == 'USER_COMPANY_MANAGER') {
                wx.redirectTo({
                  url: '/pages/index?roleType=manager',
                })
              } else if (roleTypes == 'USER_DEPARTMENT_MANAGER') {
                wx.redirectTo({
                  url: '/pages/index?roleType=depManager',
                })
              } else if (roleTypes == 'USER_DEVICE_OWNER'){
                wx.redirectTo({
                  url: '/pages/index?roleType=deviceManager',
                })
              } else {
                wx.redirectTo({
                  url: '/pages/index?roleType=normal',
                })
              }
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
        // wx.showToast({
        //   title: '请求失败！！！',
        //   icon: 'none'
        // })
      })
  },
})