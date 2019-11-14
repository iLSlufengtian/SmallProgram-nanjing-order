const app = getApp()
var NetworkService = require("../../utils/NetworkService.js")
var Utils = require("../../utils/util.js")


Component({
  properties: {},
  data: {
    deviceArr1: [],
    deviceArr2: [],
    deviceArr3: [],
    deviceArr4: [],
    isIpx: getApp().globalData.isIpx,
    height: 240,
    statusBarHeight: 60,
    num: '',
    showModal: false,
    showModal1: false,
    deviceId: '',
    len: '',
    roleName: null,
    userId: null,
    page: 0,
    size: 20,
  },
  lifetimes: {
    created: function () {
      var that = this
      that.getOrderDevice();
      // that.userInfo()
      // wx.getStorage({
      // key: 'userInfo',
      // success: function (res) {
      //   if (res && res.data) {
      //     console.log(res)
      //     that.setData({
      //       userId: res.data.id,
      //       roleName: res.data.roleName == 'USER_BASIC_VIEW' ? false : true
      //     }, () => {
            
              // that.getOrderDevice()
            
    //       })
    //     }
    //   }
    // })
    },
  },
  ready: function () {
    // console.log("萨基")
    var that = this;
    // wx.getStorage({
    //   key: 'userInfo',
    //   success: function (res) {
    //     if (res && res.data) {
    //       console.log(res)
    //       that.setData({
    //         userId: res.data.id,
    //         roleName: res.data.roleName == 'USER_BASIC_VIEW' ? false : true
    //       }, () => {

            that.getOrderDevice()

    //       })
    //     }
    //   }
    // })
    // that.getOrderDevice();
  },
  methods: {
    
    hideModal: function (e) {
      var that = this
      that.setData({
        showModal: false
      });
    },
    isIpx: function () {
      var that = this
      if (that.data.isIpx == true) {
        that.setData({
          height: 260,
          statusBarHeight: 100,
        })
      }
    },

    bindNumInput: function (e) {
      var that = this
      that.setData({
        num: e.detail.value
      })
    },

    delInput: function (e) {
      var that = this
      that.setData({
        num: ""
      }, () => {
        that.refresh();
      })
    },
    goSearch: function (e) {
      this.getOrderDevice();

    },

    refresh: function () {
      this.getOrderDevice();
 
      console.log('刷新')
    },
    getOrderDevice: function () {
      var that = this;
      var conf = {
        method: "GET",
        params: {
          bizType: app.globalData.bizType,
          offset: that.data.page,
          limit: that.data.size,
          userId: app.globalData.userId,
          assetsName: that.data.num,
          limit: 1000000,
          offset: 0,
        }
      };
      NetworkService.call("orderDeviceList", conf,
        function (res) {
          console.log(res)
          if (res && res.code == 0) {
            var arr = res.data
            // if (arr.length < 5 && arr.length !== 0) {
            //   that.setData({
            //     len: "container1",
            //   })
            // } else {
            //   that.setData({
            //     len: "container",
            //   })
            // }
            if (!Utils.isEmptyArr(arr)) {
              let arr1 = [];
              let arr2 = [];
              for (let i = 0; i < arr.length; i++) {
                if (i % 2 == 0) {
                  arr1.push(arr[i])
                } else {
                  arr2.push(arr[i])
                }
              }
              for (let index in arr1) {
                if (arr1[index].photo == null) {
                  arr1[index].photo = "../../images/device/device.png"
                }
              }
              for (let index in arr2) {
                if (arr2[index].photo == null) {
                  arr2[index].photo = "../../images/device/device.png"
                }
              }
              that.setData({
                deviceArr1: arr1,
                deviceArr2: arr2,
              });
            }
          } else {
            wx.showToast({
              title: '未查找到数据',
              icon: 'none'
            })
          }
        }
      )
    },


    search: function () {
      var that = this
      var conf = {
        method: "GET",
        params: {
          bizType: app.globalData.bizType,
          offset: that.data.page,
          limit: that.data.size,
          userId: that.data.userId,
          assetsName: that.data.num,
          limit: 1000000,
          offset: 0,
        }
      };
      NetworkService.call("orderDeviceList", conf,
        function (res) {
          if (res && res.code == 0) {
            var arr = res.data

            // if (arr.length < 5 && arr.length !== 0) {
            //   that.setData({
            //     len: "container1",
            //   })
            // }else{
            //   that.setData({
            //     len:"container",
            //   })
            // }
            if (!Utils.isEmptyArr(arr)) {
              let arr3 = [];
              let arr4 = [];
              for (let i = 0; i < arr.length; i++) {
                if (i % 2 == 0) {
                  arr3.push(arr[i])
                } else {
                  arr4.push(arr[i])
                }
              }
              for (let index in arr3) {
                if (arr3[index].photo == null) {
                  arr3[index].photo = "../../images/device/device.png"
                }
              }
              for (let index in arr4) {
                if (arr4[index].photo == null) {
                  arr4[index].photo = "../../images/device/device.png"
                }
              }
              that.setData({
                deviceArr1: arr3,
                deviceArr2: arr4,
              });
              console.log(that.data.roleName)
            } else {
              wx.showToast({
                title: '请输入正确查询信息',
                icon: 'none'
              })
            }
          }
        },
        function (error) {
          wx.showToast({
            title: '请求网络失败',
          })
        }
      )
    },




    goDetail2: function (e) {
 
      var id = e.target.dataset.id;
      if (id == 'undefined') {
        return
      }
      wx.navigateTo({
        url: "/pages/device/detail/index?id=" + id
      });
    },


  },

})