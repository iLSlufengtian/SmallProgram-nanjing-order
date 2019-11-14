const app = getApp()
var NetworkService = require("../../utils/NetworkService.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    phone: '',
    // phone:'15988400277',//自己测试方便
    yzm:'',
    height:124,
    showModal:false,
    btnYzm:true,
    second:60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  //隐藏modal
  hideModal: function (e) {
    var that = this
    that.setData({
      showModal: false
    });
  },

  out:function(){
    var that = this
    that.setData({
      showModal: false
    });
    wx.navigateBack({
      delta:0
    })
  },

  isIpx: function (isIpx) {
    var that = this
    if (that.data.isIpx == true) {
      that.setData({
        height: 164
      })
    }
  },

  bindTelInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  bindYzmInput: function (e) {
    this.setData({
      yzm: e.detail.value
    })
  },

  //获取验证码
  getYzm:function(){
    var that = this;
    if (that.data.phone == "" || !that.data.phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    if (that.data.phone.trim().length != 11) {
      wx.showToast({
        title: '手机号号码有误',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    // if (!(/^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/.test(that.data.phone))) {
    //   wx.showToast({
    //     title: '手机号号码有误',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return;
    // }

    wx.request({
      url: 'https://management.njbpsdev.ilabservice.cloud/platform/web/api/v3/unsecure/verification/code?phone='+ that.data.phone +'&bizType=' + that.data.bizType + '&type=1' ,
      success(res){
        wx.showToast({
          title: '验证码已经发送',
          icon: 'none'
        })
        //请求成功开始倒计时
        that.timer()
      },
      fail(error){
        wx.showToast({
          title: '获取验证码失败',
          icon: 'none'
        })
      }
    })
  },

  timer:function(){
    var that = this
    that.setData({
      btnYzm:false
    })
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(() => {
        var sec = that.data.second;
        sec--;
        that.setData({
          second: sec,
          btnText: sec + 's'
        })
        if (that.data.second <= 0) {
          that.setData({
            second: 60,
            btnYzm:true
          })
          resolve(setTimer)
        }
      }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

  login:function(){
    var that =  this
    if(that.data.phone == ''){
      wx.showToast({
        title: '手机号码不能为空',
        icon:'none'
      })
      return
    }
    if (that.data.yzm == '') {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none'
      })
      return
    }
    // app.globalData.phone = that.data.phone

    var conf = {
      method:"POST",
      urlParams:true,
      params:{
        code:that.data.yzm,
        phone:that.data.phone,
        key: app.globalData.key,
        bizType: app.globalData.bizType
      }
    };
    NetworkService.call("login",conf,
    function(res){
      if(res && res.code==0){
        console.log(res)
        app.globalData.phone = that.data.phone;
        app.globalData.userId = res.data.userId;
        app.globalData.roleTypedemo = res.data.roleType;
        if (res.success == false) {
          that.setData({
            showModal: true
          })
          return
        }else{
          var roleTypes = res.data.roleType
          // 登陆成功，只有系统管理员和公司管理员在底部显示审核按钮
          if (roleTypes == 'USER_COMPANY_MANAGER') {
            wx.redirectTo({
              url: '/pages/index?roleType=manager',
            })
          } else if (roleTypes == 'USER_DEVICE_OWNER') {
            wx.redirectTo({
              url: '/pages/index?roleType=deviceManager',
            })
          } else if (roleTypes == 'USER_DEPARTMENT_MANAGER') {
            wx.redirectTo({
              url: '/pages/index?roleType=depManager',
            })
          }else {
            wx.redirectTo({
              url: '/pages/index?roleType=normal',
            })
          }
          wx.showToast({
            title: '登录成功',
            icon: 'none',
          })
        }
      }else{
        that.setData({
          showModal: true
        })
        return
      }
    },
    function(error){
      that.setData({
        showModal:true
      })
    }
    )
  }
})