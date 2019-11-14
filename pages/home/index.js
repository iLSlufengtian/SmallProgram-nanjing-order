const app = getApp()
var NetworkService = require("../../utils/NetworkService.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: getApp().globalData.isIpx,
    height1: 104,
    height2: 166,
    showModal: false,
    showModal1: false,
    showModal2: false,
    deviceId: '',
    power: false,
    startTime: '',
    endTime: '',
    globalHeight: getApp().globalData.windowHeight,
    checkOn: false,
    scene: getApp().globalData.scene,
    isAppoint: true,
    setInter: '',
    id:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // this.setData({
    //   id:options.id
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    that.isIpx();
    that.getAppointTime();

    that.data.setInter = setInterval(
      function () {
        that.getAppointTime();
      }, 1000 * 10);
  },

  isIpx: function (isIpx) {
    var that = this
    if (that.data.isIpx == true) {
      that.setData({
        height1: 152,
        height2: 214
      })
    }
  },

  detached: function() {
    clearInterval(this.data.setInter)
  },

  //隐藏modal
  hideModal: function (e) {
    var that = this
    that.setData({
      showModal: false
    });
  },

  hideModal1: function (e) {
    var that = this
    that.setData({
      showModal1: false
    });
  },

  hideModal2: function (e) {
    var that = this
    that.setData({
      showModal2: false
    });
  },

  getAppointTime: function () {
    var that = this
    var conf = {
      method: "GET",
      urlParams: true,
      params: {
        key: app.globalData.key,
        bizType: app.globalData.bizType,
        phone: app.globalData.phone,
        serialNo: app.globalData.serial
        // serialNo: 'NJBPS'+that.data.id
      }
    };
    NetworkService.call("appointTime", conf,
      function (res) {
        if (res && res.code == 0) {
          var data = res.data
          var h1 = new Date(data.startTime).getHours()
          var m1 = new Date(data.startTime).getMinutes()
          var h2 = new Date(data.endTime).getHours()
          var m2 = new Date(data.endTime).getMinutes()
          if (m1 == "0") {
            m1 = m1 + "0"
          }
          if (m2 == "0") {
            m2 = m2 + "0"
          }
          var start = h1 + ':' + m1
          var end = h2 + ':' + m2
          if (res && data.check_on == true) {
            that.setData({
              checkOn: true,
              startTime: start,
              endTime: end,
              deviceId: data.deviceId
            })
          } else if (res && data.check_on == false) {
            that.setData({
              startTime: start,
              endTime: end,
              deviceId: data.deviceId
            })
          }
        } else {
          that.queryDeviceId();
          that.setData({
            isAppoint: false
          })
        }
      },
      function (error) {
        // wx.showToast({
        //   title: '获取预约时间失败',
        //   icon: 'none'
        // })
        // that.queryDeviceId();
        // that.setData({
        //   isAppoint: false
        // })
      }
    )
  },
  //没有预约，查询设备id
  queryDeviceId: function(){
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
        wx.hideLoading();
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


  clickBtn: function () {
    var that = this
    if (that.data.isAppoint == false) {
      return
    }
    if (that.data.checkOn == false) {
      that.setData({
        showModal2: true
      })
      return
    }
    if (that.data.power == false) {
      that.setData({
        showModal: true
      })
    } else {
      that.setData({
        showModal1: true
      })
    }

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
        deviceId: that.data.deviceId,
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
    // that.getAppointTime()
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
        deviceId: that.data.deviceId,
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
    app.globalData.scene = 1001;
    wx.redirectTo({
      url: '/pages/index?roleType=normal',
    })
  },
  goToOrder: function () {
    var that = this;
    // app.globalData.scene = 1001;
    wx.navigateTo({
      url: '/pages/device/detail/index?id=' + that.data.deviceId,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

})

// Component({
//   properties: {},
//   // data: {
//   //   isIpx: getApp().globalData.isIpx,
//   //   height1: 104,
//   //   height2: 166,
//   //   showModal: false,
//   //   showModal1: false,
//   //   showModal2: false,
//   //   deviceId: '',
//   //   power: false,
//   //   startTime: '',
//   //   endTime: '',
//   //   globalHeight: getApp().globalData.windowHeight,
//   //   checkOn: false,
//   //   scene: getApp().globalData.scene,
//   //   isAppoint: true,
//   //   setInter: '',
//   // },
//   // ready: function() {
//   //   var that = this
//   //   that.isIpx();
//   //   that.getAppointTime();

//   //   that.data.setInter = setInterval(
//   //     function() {
//   //       that.getAppointTime();
//   //     }, 1000 * 5);
//   // },
  

//   // detached: function() {
//   //   clearInterval(this.data.setInter)
//   // },
//   methods: {
//     // isIpx: function(isIpx) {
//     //   var that = this
//     //   if (that.data.isIpx == true) {
//     //     that.setData({
//     //       height1: 152,
//     //       height2: 214
//     //     })
//     //   }
//     // },

//     // //隐藏modal
//     // hideModal: function(e) {
//     //   var that = this
//     //   that.setData({
//     //     showModal: false
//     //   });
//     // },

//     // hideModal1: function(e) {
//     //   var that = this
//     //   that.setData({
//     //     showModal1: false
//     //   });
//     // },

//     // hideModal2: function(e) {
//     //   var that = this
//     //   that.setData({
//     //     showModal2: false
//     //   });
//     // },

//     // getAppointTime:function(){
//     //   var that = this
//     //   var conf = {
//     //     method:"GET",
//     //     urlParams:true,
//     //     params:{
//     //       key: app.globalData.key,
//     //       bizType: app.globalData.bizType,
//     //       phone: app.globalData.phone,
//     //       serialNo:app.globalData.serial
//     //     }
//     //   };
//     //   NetworkService.call("appointTime",conf,
//     //     function(res){
//     //       if(res && res.code == 0){
//     //         var data = res.data
//     //         var h1 = new Date(data.startTime).getHours()
//     //         var m1 = new Date(data.startTime).getMinutes()
//     //         var h2 = new Date(data.endTime).getHours()
//     //         var m2 = new Date(data.endTime).getMinutes()
//     //         if (m1 == "0") {
//     //           m1 = m1 + "0"
//     //         }
//     //         if (m2 == "0") {
//     //           m2 = m2 + "0"
//     //         }
//     //         var start = h1 + ':' + m1
//     //         var end = h2 + ':' + m2
//     //         if (res && data.check_on == true) {
//     //           that.setData({
//     //             checkOn: true,
//     //             startTime: start,
//     //             endTime: end,
//     //             deviceId: data.deviceId
//     //           })
//     //         } else if (res && data.check_on == false) {
//     //           that.setData({
//     //             startTime: start,
//     //             endTime: end,
//     //             deviceId: data.deviceId
//     //           })
//     //         }
//     //       }else{
//     //         that.setData({
//     //           isAppoint:false
//     //         })
//     //       }
//     //     },
//     //     function(error) {
//     //       wx.showToast({
//     //         title: '获取预约时间失败',
//     //         icon: 'none'
//     //       })
//     //     }
//     //   )
//     // },

//     // clickBtn:function(){
//     //   var that = this
//     //   if (that.data.isAppoint == false) {
//     //     return
//     //   }
//     //   if (that.data.checkOn == false) {
//     //     that.setData({
//     //       showModal2: true
//     //     })
//     //     return
//     //   }
//     //   if(that.data.power == false){
//     //     that.setData({
//     //       showModal: true
//     //     })
//     //   }else{
//     //     that.setData({
//     //       showModal1: true
//     //     })
//     //   }
      
//     // },

//     // powerOn: function() {
//     //   var that = this
//     //   wx.showLoading({
//     //     title: '正在通电..',
//     //   })
//     //   that.setData({
//     //     showModal: false
//     //   })
//     //   var conf = {
//     //     method:"POST",
//     //     urlParams:true,
//     //     params:{
//     //       key: app.globalData.key,
//     //       bizType: app.globalData.bizType,
//     //       phone: app.globalData.phone,
//     //       deviceId: that.data.deviceId,
//     //     }
//     //   };
//     //   NetworkService.call("powerOn",conf,
//     //     function(res){
//     //       if (res && res.code == 0) {
//     //         wx.showToast({
//     //           title: '通电成功',
//     //         })
//     //         that.setData({
//     //           power: true
//     //         })
//     //       } else if (res.code == 10014) {
//     //         wx.showToast({
//     //           title: '通电指令超时',
//     //           icon: 'none'
//     //         })
//     //       } else {
//     //         wx.showToast({
//     //           title: '通电失败',
//     //           icon: 'none'
//     //         })
//     //       }
//     //     },
//     //     function(error){
//     //       wx.showToast({
//     //         title: '通电失败',
//     //         icon:'none'
//     //       })
//     //     }
//     //   )

//     // }
//   },


//   // powerOff: function() {
//   //   var that = this
//   //   // that.getAppointTime()
//   //   wx.showLoading({
//   //     title: '正在断电..',
//   //   })
//   //   that.setData({
//   //     showModal1: false
//   //   })
//   //   var conf = {
//   //     method: "POST",
//   //     urlParams: true,
//   //     params: {
//   //       key: app.globalData.key,
//   //       bizType: app.globalData.bizType,
//   //       phone: app.globalData.phone,
//   //       deviceId: that.data.deviceId,
//   //     }
//   //   };
//   //   NetworkService.call("powerOff", conf,
//   //     function(res) {
//   //       if (res && res.code == 0) {
//   //         wx.showToast({
//   //           title: '断电成功',
//   //         })
//   //         that.setData({
//   //           power: false
//   //         })
//   //       } else if (res.code == 10014) {
//   //         wx.showToast({
//   //           title: '断电指令超时',
//   //           icon: 'none'
//   //         })
//   //       } else {
//   //         wx.showToast({
//   //           title: '断电失败',
//   //           icon: 'none'
//   //         })
//   //       }
//   //     },
//   //     function(error) {
//   //       wx.showToast({
//   //         title: '断电失败',
//   //         icon: 'none'
//   //       })
//   //     }
//   //   )
//   // },

//   // goToHome: function() {
//   //   app.globalData.scene=1001;
//   //   wx.redirectTo({
//   //     url: '/pages/index?roleType=normal',
//   //   })
//   // }
// })