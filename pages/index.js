const app = getApp()
var NetworkService = require("../utils/NetworkService.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: null,
    tabsManager: [],
    tabsNormal: [],
    globalHeight: app.globalData.windowHeight,
    roleType:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var roleType = options.roleType;
    var scene = app.globalData.scene
    wx.setStorage({
      key: 'roleType',
      data: roleType,
    })
    if(!roleType){
      return
    }
    if (roleType == "manager") {
      if(scene==1047){
        wx.redirectTo({
          url: '/pages/Mhome/index',
        })
      }else{
        this.setData({
          type: "manager",
          tabsManager: [{
            text: '设备列表',
            checked: true,
            icon: '/images/device/dev.png',
            selectedIcon: '/images/device/dev_sel.png',
          }, {
              text: '预约记录',
              checked: false,
              icon: '/images/device/order.png',
              selectedIcon: '/images/device/order_sel.png',
            }, {
            text: '我的',
            checked: false,
            icon: '/images/device/me.png',
            selectedIcon: '/images/device/me_sel.png',
          }]
        })
      }
    }else{
      if (scene == 1047){
        wx.redirectTo({
          url: '/pages/home/index',
        })
      }else{
        this.setData({
          type: "normal",
          tabsNormal: [{
            text: '设备列表',
            checked: true,
            icon: '/images/device/dev.png',
            selectedIcon: '/images/device/dev_sel.png',
          }, {
            text: '预约记录',
            checked: false,
            icon: '/images/device/order.png',
            selectedIcon: '/images/device/order_sel.png',
          }, {
            text: '我的',
            checked: false,
            icon: '/images/device/me.png',
            selectedIcon: '/images/device/me_sel.png',
          }]
        })
      }
    }
  },

  selectTab:function(idx){
    var arr = this.data.tabsManager;
    for(let index in arr){
      if(index == idx){
        arr[index].checked = true
      }else{
        arr[index].checked = false
      }
    }
    this.setData({
      tabsManager : arr,
    })
  },

  bindChange:function(e){
    if(this.data.type == "manager"){
      var arr = this.data.tabsManager;
      var idx = e.currentTarget.dataset.idx;

      for (let index in arr){
        if(index == idx){
          arr[index].checked = true;
        }else{
          arr[index].checked = false;
        }
      };
      this.setData({
        tabsManager: arr,
      })
    }else{
      var arr = this.data.tabsNormal;
      var idx = e.currentTarget.dataset.idx;

      for (let index in arr) {
        if (index == idx) {
          arr[index].checked = true;
        } else {
          arr[index].checked = false;
        }
      };
      this.setData({
        tabsNormal: arr,
      })
    }
  },
})