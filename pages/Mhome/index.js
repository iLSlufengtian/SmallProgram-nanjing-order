const app = getApp()
var NetworkService = require("../../utils/NetworkService.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: getApp().globalData.isIpx,
    height: 170,
    globalHeight: getApp().globalData.windowHeight,
    scene: getApp().globalData.scene,
    device: [],
    deviceId:null,
    imgUrl: 'http://i3.sinaimg.cn/ty/k/2010-09-07/U4933P6T12D5189535F44DT20100907150724.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.isIpx();
    that.getDevice();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDevice();
  },

  isIpx: function (isIpx) {
    var that = this
    if (that.data.isIpx == true) {
      that.setData({
        height: 210
      })
    }
  },

  getDevice: function () {
    var that = this
    var conf = {
      method: "GET",
      params: {
        key: app.globalData.key,
        bizType: app.globalData.bizType,
        phone: app.globalData.phone,
        searchKey: app.globalData.serial,
      }
    }
    NetworkService.call("deviceList", conf,
      function (res) {
        if (res && res.code == 0) {
          if(res.data.photoUrl == null){
            that.setData({
              imgUrl: "../../images/device/device.png"
            })
          }else{
            that.setData({
              imgUrl: res.data.photoUrl
            })
          }
          that.setData({
            device: res.data,
            deviceId: res.data[0].deviceId
          })
        }else {
          that.queryDeviceId();
        }
      }, function (error) {
        wx.showToast({
          title: '获取设备失败',
        })
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    )
  },
  //没有预约，查询设备id
  queryDeviceId: function () {
    var that = this;
    var conf = {
      method: "GET",
      urlParams: true,
      params: {
        serialNo: app.globalData.serial,
        bizType: app.globalData.bizType,
        key: app.globalData.key,
        // serialNo: 'NJBPS'+that.data.id
      }
    };
    NetworkService.call("queryDeviceId", conf,
      function (res) {
        if (res && res.code == 0) {
          var data = res.data;
          that.setData({
            deviceId: data.deviceId
          })
        } else {
          wx.showToast({
            title: res.message,
          });
        }
      },
      function (error) {
        wx.hideLoading();
      }
    )
  },
  powerOn: function () {
    var that = this
    wx.showLoading({
      title: '正在通电..',
    })
    that.setData({
      showModal: false
    })
    var conf = {
      method: "POST",
      urlParams: true,
      params: {
        key: app.globalData.key,
        bizType: app.globalData.bizType,
        phone: app.globalData.phone,
        deviceId: that.data.device[0].deviceId,
      }
    };
    NetworkService.call("powerOn", conf,
      function (res) {
        if (res && res.code == 0) {
          wx.showToast({
            title: '通电成功',
          })
          that.setData({
            power: true
          })
        } else if (res.code == 10014) {
          wx.showToast({
            title: '通电指令超时',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '通电失败',
            icon: 'none'
          })
        }
      },
      function (error) {
        wx.showToast({
          title: '通电失败',
          icon: 'none'
        })
      }
    )
  },

  powerOff: function () {
    var that = this
    wx.showLoading({
      title: '正在断电..',
    })
    that.setData({
      showModal1: false
    })
    var conf = {
      method: "POST",
      urlParams: true,
      params: {
        key: app.globalData.key,
        bizType: app.globalData.bizType,
        phone: app.globalData.phone,
        deviceId: that.data.device[0].deviceId,
      }
    };
    NetworkService.call("powerOff", conf,
      function (res) {
        if (res && res.code == 0) {
          wx.showToast({
            title: '断电成功',
          })
          that.setData({
            power: false
          })
        } else if (res.code == 10014) {
          wx.showToast({
            title: '断电指令超时',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '断电失败',
            icon: 'none'
          })
        }
      },
      function (error) {
        wx.showToast({
          title: '断电失败',
          icon: 'none'
        })
      }
    )
  },

  goToHome: function () {
    var that = this
    app.globalData.scene = 1001;
    wx.redirectTo({ 
      url: '/pages/index?roleType=manager',
    })
  },
  goToOrder: function () {
    var that = this;
    // app.globalData.scene = 1001;
    wx.navigateTo({
      url: '/pages/device/detail/index?id=' + that.data.deviceId,
    })
  },

})
