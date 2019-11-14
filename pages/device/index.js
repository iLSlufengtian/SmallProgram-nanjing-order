const app = getApp()
var NetworkService = require("../../utils/NetworkService.js")
var Utils = require("../../utils/util.js")


Component({
  properties: {},
  data: {
    deviceArr1: [],
    deviceArr2: [],
    deviceArr3:[],
    deviceArr4:[],
    isIpx: getApp().globalData.isIpx,
    height:240,
    statusBarHeight: 60,
    num:'',
    showModal:false,
    showModal1:false,
    deviceId:'',
    len:'',
    roleName: null,
    userId:null,
    page:0,
    size:20,
  },
  lifetimes:{
    created:function(){
      var that = this
      that.getDevice();
    //   wx.getStorage({
    //   key: 'userInfo',
    //   success: function (res) {
    //     if (res && res.data) {
    //       that.setData({
    //         userId: res.data.id,
    //         roleName: res.data.roleName == 'USER_BASIC_VIEW' ? false : true
    //       },()=>{
    //         //  if(that.data.roleName==false){
    //         //    console.log('普通')
    //         //   that.getOrderDevice()
    //         //  }else{
    //         //    console.log('不普通1')
    //            that.getDevice();
    //         //  }
    //       })
    //     }
    //   }
    // })
    },
  },
  ready: function(){ 
    // console.log("萨基")
    var that = this;
    that.getDevice();
    // wx.getStorage({
    //   key: 'userInfo',
    //   success: function (res) {
    //     if (res && res.data) {
    //       console.log(res)
    //       that.setData({
    //         userId: res.data.id,
    //         roleName: res.data.roleName == 'USER_BASIC_VIEW' ? false : true
    //       }, () => {
  
    //           that.getDevice();
  
    //       })
    //     }
    //   }
    // })
   },
  methods: {
    hideModal: function (e) {
      var that = this
      that.setData({
        showModal: false
      });
    },
    // onPullDownRefresh: function () {
    //   console.log("下拉刷新");

    // },
    // onReachBottom: function () {
    //   console.log('到底了')
    //   // if (this.data.isMore) {
    //   //   this.searchScrollLower()
    //   // } else {
    //   //   util.showErrorToast('没有更多数据')
    //   // }
    // },
    hideModal1: function (e) {
      var that = this
      that.setData({
        showModal1: false
      });
    },

    showModal: function (e) {
      var that = this
      var id = e.currentTarget.dataset.proid;
      var res = e.currentTarget.dataset.res;
      if(res==0){
        that.setData({
          showModal: true,
          deviceId: id
        })
      }
    },

    showModal1: function (e) {
      var that = this
      var id = e.currentTarget.dataset.proid;
      var res = e.currentTarget.dataset.res;
      if (res == 0) {
        that.setData({
          showModal1: true,
          deviceId: id
        })
      }
    },

    isIpx: function () {
      var that = this
      if (that.data.isIpx == true){
        that.setData({
          height: 260,
          statusBarHeight: 100,
        })
      }
    },

    bindNumInput:function(e){
      var that = this
      that.setData({
        num:e.detail.value
      })
    },

    delInput: function(e) {
      var that = this
      that.setData({
        num:""
      },()=>{
        that.refresh();
      })
    },
    goSearch: function(e){
      var that = this;
      that.getDevice();
      // if (that.data.roleName == false) {
      //   console.log('普通')
      //   that.getOrderDevice()
      // } else {
      //   console.log('不普通')
      //   that.getDevice();
      // }
    },

    refresh:function(){
      var that = this
      that.getDevice();
      // if (that.data.roleName == false) {
      //   console.log('普通')
      //   that.getOrderDevice()
      // } else {
      //   console.log('不普通')
      //   that.getDevice();
      // }
      console.log('刷新')
    },
 
    getDevice:function(){
      var that = this
      var conf = {
        method:"GET",
        params:{
          key: app.globalData.key,
          bizType: app.globalData.bizType,
          phone: app.globalData.phone,
          searchKey: that.data.num,
        }
      };
      NetworkService.call("deviceList",conf,
        function(res){
          if(res && res.code==0){
            var arr = res.data
            // if(arr.length < 5 && arr.length !== 0){
            //   that.setData({
            //     len: "container1",
            //   })
            // }else{
            //   that.setData({
            //     len:"container",
            //   })
            // }
            if (!Utils.isEmptyArr(arr)){
              let arr5 = [];
              let arr6 = [];
              for(let i=0; i<arr.length;i++){
                if(i % 2==0){
                  arr5.push(arr[i])
                }else{
                  arr6.push(arr[i])
                }
              }
              for(let index in arr5){
                if(arr5[index].photoUrl == null){
                  arr5[index].photoUrl = "../../images/device/device.png"
                }
              }
              for (let index in arr6) {
                if (arr6[index].photoUrl == null) {
                  arr6[index].photoUrl = "../../images/device/device.png"
                }
              }
              that.setData({
                deviceArr3:arr5,
                deviceArr4:arr6,
              });
            }else{
              wx.showToast({
                title: '未查找到数据',
                icon:'none'
              })
            }
          }
        },
        function(error){
          wx.showToast({
            title: '请求网络失败',
          })
        }
      )
    },

    search:function(){
      var that = this
      var conf = {
        method: "GET",
        params: {
          key: app.globalData.key,
          // key: '15725923514766b71b7',
          bizType: app.globalData.bizType,
          phone: app.globalData.phone,
          searchKey: that.data.num,
        }
      };
      NetworkService.call("deviceList", conf,
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
                if (arr3[index].photoUrl == null) {
                  arr3[index].photoUrl = "../../images/device/device.png"
                }
              }
              for (let index in arr4) {
                if (arr4[index].photoUrl == null) {
                  arr4[index].photoUrl = "../../images/device/device.png"
                }
              }
              that.setData({
                deviceArr3: arr3,
                deviceArr4: arr4,
              });
              console.log(that.data.roleName)
            } else {
              wx.showToast({
                title: '请输入正确查询信息',
                icon:'none'
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

    powerOn: function (e) {
      var that = this
        that.setData({
          showModal: false
        })
      wx.showLoading({
        title: '正在通电..',
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
              title:'通电成功',
            })
          }else if(res.code == 10014){
            wx.showToast({
              title: '通电指令超时',
              icon: 'none'
            })
          }else{
            wx.showToast({
              title: '通电失败',
              icon: 'none'
            })
          }
        },
        function (error) {
          that.setData({
            showModal: false
          })
          wx.showToast({
            title:'通电失败',
            icon:'none'
          })
        }
      )
    },

    powerOff:function(e){
      var that = this
      that.setData({
        showModal1: false
      })
      wx.showLoading({
        title: '正在断电..',
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
        function(res) {
          if (res && res.code == 0) {
            wx.showToast({
              title:'断电成功',
            })
          }else if(res.code == 10014){
            wx.showToast({
              title: '断电指令超时',
              icon: 'none'
            })
          }else{
            wx.showToast({
              title: '断电失败',
              icon:'none'
            })
          }
        },
        function(error) {
          that.setData({
            showModal1:false
          })
          wx.showToast({
            title:'断电失败',
            icon:'none'
          })
        }
      )
    },

    goDetail:function(e){
      var id = e.target.dataset.id;
      if (id =='undefined'){
        return
      }
      wx.navigateTo({
        url: "/pages/device/detail/index?id="+id
      });
    },

    // goDetail2: function (e) {
    //   console.log(e)
    //   var id = e.target.dataset.id
    //   wx.navigateTo({
    //     url: "/pages/device/detail/index?id=" + id
    //   });
    // },


  },

})