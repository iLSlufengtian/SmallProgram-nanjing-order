const app = getApp()
var NetworkService = require("../../utils/NetworkService.js")
var util = require("../../utils/util.js")
// var token = wx.getStorageSync('token');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    height: 180,
    radioValues: null,
    finishedDatas: [],
    dataLoaded: false,
    openDatas: [],
    processingDatas: [],

    clazz: [],
    userId: "",
    cancelOrderId: null,
    leaseId: null,
    hiddenmodalput1: true,
    hiddenmodalput2: true,
    hiddenmodalput: true,
    audit: false, //false代表未审核 true代表审核记录
    id: null,
    judgeUser: app.globalData.roleTypedemo == 'USER_COMPANY_MANAGER' ? false : true,
    pid: null,
  },

  pageLifetimes: {
    show: function () {
      var that = this
      that.queryRecord("0"); //待处理
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
  ready: function () {
    let that = this;
    that.queryRecord("0"); //待处理
   
    that.setData({
      height: getApp().globalData.isIpx ? 210 : 180,
      radioValues: [{
        'value': app.globalData.roleTypedemo == "USER_COMPANY_MANAGER" ? '企业审核' : '个人审核',
        'selected': true
      },
      {
        'value': '审核记录',
        'selected': false
      },
      ],
      judgeUser: app.globalData.roleTypedemo == 'USER_COMPANY_MANAGER' ? false : true,
    })
    that.clazzStatus();
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 刷新
    refresh: function () {
      var that = this;
      that.queryRecord("0"); //企业审核
      that.queryRecord("1"); //审核记录
      setTimeout(function () {
        that.selectComponent('#manageren').stopRefresh();
      }, 1000)
    },

    queryRecord: function (type) {
      console.log(this.data)
      var that = this;
      var conf = {
        method: "GET",
        params: {
          key: app.globalData.key,
          type: app.globalData.roleTypedemo == 'USER_COMPANY_MANAGER'?1:0,
          bizType: app.globalData.bizType,
          record: type==0?false:true
        }
      };
      // wx.showLoading({
      //   title: '正在加载...',
      // })

      NetworkService.call("queryAudit", conf,
        function (res) {
          wx.hideLoading();
          if (res && res.code == 0) {
            var datas = res.data;
            // for (var i = 0; i < datas.length; i++) {
            //   //   datas[i].context = JSON.parse(datas[i].context);
            //   //   datas[i].start = datas[i].context.startTime
            //   datas[i].startTime = util.dateFttt("yyyy-MM-dd hh:mm", datas[i].startTime)
            //   //   datas[i].gmtCreate = util.dateFttt("yyyy-MM-dd hh:mm", datas[i].gmtCreate);
            //   datas[i].finishTime = util.dateFtttt("hh:mm", datas[i].endTime)
            // }

            if (type == "0") {
              that.setData({
                finishedDatas: datas,
                dataLoaded: true
              })
            }
            if (type == "1") {
              that.setData({
                openDatas: res.data,

              })
            }
            // if (type == "2") {
            //   that.setData({
            //     processingDatas: res.data,
            //   })
            // }
          } else {
            wx.showToast({
              title: '网络失败',
            })
          }
        },
        function (error) {
          wx.showToast({
            title: '请求网络失败',
          })
          wx.hideLoading();
        }
      );
    },

    goHandleDetail: function(e){
      var id = e.currentTarget.dataset.taskid
      wx.navigateTo({
        url: "/pages/handle/handleDetail/index?id="+id
      });
    },

    goAgree: function(e){
      var id= e.currentTarget.dataset.aid;
      var uid = e.currentTarget.dataset.auid;
      var that = this;
      wx.showLoading({
        title: '正在加载...',
      })
      var conf = {
        method: "POST",
        urlParams: true,
        params: {
          bizType: app.globalData.bizType,
          key: app.globalData.key,
          type: 0,
          uid: uid,
          id: id,
          status: 1
        }
      }
      NetworkService.call("startAudit", conf,
        function (res) {
          wx.hideLoading();
          if (res && res.code == 0) {
            wx.showToast({
              title: '已同意',
            });
            that.queryRecord("0"); //企业审核
            // setTimeout(function () {
            //   wx.navigateBack()
            // }, 500)
          } else {
            wx.showToast({
              title: res.message,
            });
          }
        },
        function (error) {
          wx.hideLoading();
        }
      );
    },
    goDisagree: function (e) {
      var id = e.currentTarget.dataset.bid;
      var uid = e.currentTarget.dataset.buid;
      var that = this;
      wx.showLoading({
        title: '正在加载...',
      })
      var conf = {
        method: "POST",
        urlParams: true,
        params: {
          bizType: app.globalData.bizType,
          key: app.globalData.key,
          type: 0,
          uid: uid,
          id: id,
          status: 2
        }
      }
      NetworkService.call("startAudit", conf,
        function (res) {
          wx.hideLoading();
          if (res && res.code == 0) {
            wx.showToast({
              title: '已拒绝',
            });
            that.queryRecord("0"); //企业审核
            // setTimeout(function () {
            //   wx.navigateBack()
            // }, 500)
          } else {
            wx.showToast({
              title: res.message,
            });
          }
        },
        function (error) {
          wx.hideLoading();
        }
      );
    },
    //取消预约
    // cancelRecord: function () {
    //   var that = this;
    //   wx.showLoading({
    //     title: '请稍等...',
    //   })
    //   var conf = {
    //     method: "DELETE",
    //     urlParams: true,
    //     params: {
    //       id: that.data.deviceId,
    //       leaseId: that.data.leaseId,
    //     }
    //   };

    //   NetworkService.call("cancelRecord", conf,
    //     function (res) {
    //       wx.hideLoading();
    //       if (res && res.data) {
    //         wx.showToast({
    //           title: '取消成功',
    //         })

    //         that.queryRecord("1"); //代表已同意
    //         that.queryRecord("0")

    //       } else {
    //         wx.showToast({
    //           title: '取消失败',
    //         })
    //       }
    //     },
    //     function (error) {
    //       wx.showToast({
    //         title: '取消失败',
    //       })
    //       wx.hideLoading();
    //     }
    //   );
    // },

    // clickcancelOrdered1(e) {

    //   var that = this;
    //   var leaseId = e.currentTarget.dataset.leaseid;
    //   var deviceId = e.currentTarget.dataset.deviceid;
    //   var finishtime = e.currentTarget.dataset.finishtime;
    //   var endDate = util.dateFtp('yyy/MM/dd', e.currentTarget.dataset.starttime);
    //   var endDateTime = endDate + ' ' + finishtime;
    //   endDateTime = util.ftTimeLong(endDateTime);
    //   var clickCancelTime = Date.parse(new Date());
    //   var cancelable0 = e.currentTarget.dataset.cancelable0;


    //   var idx = e.currentTarget.dataset.idx;
    //   wx.showToast({
    //     title: that.data,
    //   })

    //   if (!cancelable0) {
    //     return;
    //   }

    //   that.setData({
    //     deviceId: deviceId,
    //     leaseId: leaseId,
    //   }, () => {
    //     if (endDateTime < clickCancelTime) {
    //       that.cancelOrdered2()
    //     } else {
    //       that.cancelOrdered()
    //     }
    //   })

    // },

    // onTapCancel1() {
    //   this.setData({
    //     hiddenmodalput1: true
    //   })
    // },

    // onTapCancel2() {
    //   this.setData({
    //     hiddenmodalput2: true
    //   })
    // },

    // onTapConfirm1() {
    //   var that = this;
    //   this.cancelRecord()
    //   this.setData({
    //     hiddenmodalput1: true
    //   })
    // },

    // onTapConfirm2() {
    //   this.setData({
    //     hiddenmodalput2: true
    //   })
    // },

    // clickcancelOrdered2(e) {
    //   var that = this;
    //   var newTime = new Date().getTime()
    //   var leaseId = e.currentTarget.dataset.leaseid;
    //   var deviceId = e.currentTarget.dataset.deviceid;
    //   var cancelable = e.currentTarget.dataset.cancelable;
    //   var idx = e.currentTarget.dataset.idx;

    //   // if (that.data.openDatas[idx].start-newTime<1800000){
    //   //   wx.showToast({
    //   //     title: '时间已过期或会议即将开始，无法取消',
    //   //     icon:'none'
    //   //   })
    //   //   that.queryRecord("1");
    //   //   return;
    //   // }
    //   if (!cancelable) {
    //     return;
    //   }
    //   // if (that.data.openDatas[idx].start < newTime) {
    //   //   wx.showToast({
    //   //     title: '会议已经开始，无法取消',
    //   //     icon: 'none'
    //   //   })
    //   //   that.queryRecord("1");
    //   //   return;
    //   // }

    //   that.setData({
    //     deviceId: deviceId,
    //     leaseId: leaseId,
    //   }, () => {
    //     that.cancelOrdered()
    //   })


    // },

    //弹出取消预订弹窗
    // cancelOrdered() {
    //   this.setData({
    //     hiddenmodalput: false,
    //   })
    // },

    // cancelOrdered2() {
    //   this.setData({
    //     hiddenmodalput2: false,
    //   })
    // },

    //暂不取消
    // onTapCancel() {
    //   this.setData({
    //     hiddenmodalput: true,
    //   })
    // },
    // // 确认取消
    // onTapConfirm: function () {
    //   var that = this;
    //   this.cancelRecord()
    //   this.setData({
    //     hiddenmodalput: true,
    //   })
    // },


    indexChanged: function (e) {
      // 点中的是组中第个元素
      var index = e.target.dataset.index;
      // 读取原始的数组
      var radioValues = this.data.radioValues;
      for (var i = 0; i < radioValues.length; i++) {
        // 全部改为非选中
        radioValues[i].selected = false;
        // 当前那个改为选中
        radioValues[index].selected = true;
      }
      if (index == 0) {
        this.queryRecord(0); //待处理
      }
      if (index == 1) {
        this.queryRecord(1); //已同意
      }

      // if (index == 2) {
      //   this.queryRecord(2); //已拒绝
      // }

      // 写回数据
      this.setData({
        radioValues: radioValues
      });
      // clazz状态
      this.clazzStatus();
    },
    clazzStatus: function () {
      /* 此方法分别被加载时调用，点击某段时调用 */
      // class样式表如"selected last","selected"
      var clazz = [];
      // 参照数据源
      var radioValues = this.data.radioValues;
      for (var i = 0; i < radioValues.length; i++) {
        // 默认为空串，即普通按钮
        var cls = '';
        // 高亮，追回selected
        if (radioValues[i].selected) {
          cls += 'selected ';
        }
        // 最后个元素, 追加last
        if (i == radioValues.length - 1) {
          cls += 'last ';
        }
        //去掉尾部空格
        cls = cls.replace(/(\s*$)/g, '');
        clazz[i] = cls;
      }
      // 写回数据
      this.setData({
        clazz: clazz
      });
    },

  }
})