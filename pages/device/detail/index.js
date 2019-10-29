// pages/device/detail/index.js
const app = getApp()
var NetworkService = require("../../../utils/NetworkService.js")
var util = require("../../../utils/util.js")
import urlHelper from "../../../utils/urlHelper.js"
import {
  getTimes
} from './times'

Page({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    currentDay: util.dateFtp("yyy-MM-dd", new Date().getTime()),
    timeSlot: getTimes(),

    showModalX: false,
    sendTime: '10s',
    waitTime: 10,
    inter: null,
    deviceId: null,
    deviceData: null,
    showCalendar: false,
    showTimeSlot: true,
    showModal: false,
    dayLegal: true, //预约的日期是否合法

    timeStr: '请选择预约时间',
    timeStr1: '',
    timeStr2: '',
    startTime: null,
    endTime: null,
    preGray: true,
    afterGray: false,
    enableSharing: false,

    userId: null,
    roleName: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var deviceId = options.id;

    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        if (res && res.data) {
          console.log(res)
          that.setData({
            userId: res.data.id,
            roleName: res.data.roleName == 'USER_BASIC_VIEW' ? false : true
          })
        }
      }
    })

    this.setData({
      deviceId: deviceId,
    })
    // let that = this;
    that.queryDeviceData()
  },

  onReady: function() {
    let that = this;
    that.queryDeviceData()
  },

  // 根据deviceId拿到设备详情
  queryDeviceData: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var conf = {
      method: "GET",
      urlParams: true,
      params: {
        id: that.data.deviceId,
        bizType: app.globalData.bizType
      }
    }
    NetworkService.call("deviceDetail", conf,
      function(res) {
        if (res && res.data) {
          console.log(res)
          var data = res.data;
          // setTimeout(function(){
          wx.hideLoading();
          that.setData({
            deviceData: data,
            enableSharing: data.enableSharing == 1 ? true : false
          })
          // },500)
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '请求网络失败',
          })
        }
      },
      function(err) {

      }
    )

  },

  // 管理员设置设备是否可预约
  switchChange: function() {
    var that = this;
    that.setData({
      enableSharing: !that.data.enableSharing
    },()=>{
      wx.showModal({
        title: '提示',
        content: '确认将设备调设置为可预约（不可预约）吗',
        success(res) {
          if (res.confirm) {
            var a2 = [];
            a2.push(parseInt(that.data.deviceId));
            that.changeStatus(a2);
          } else if (res.cancel) {
            that.setData({
              enableSharing: !that.data.enableSharing
            })
            console.log('用户点击取消')
          }
        }
      })
    })
  },

  changeStatus: function (arr) {
    var that = this;
    var conf = {
      method: "PUT",
      params: {
        bizType: app.globalData.bizType,
        userId: that.data.userId,
        notEnableAssets: arr,
      }
    }
    NetworkService.call("changeOrderStatus", conf,
      function (res) {
        console.log(res)



      },
      function (err) {

      }
    )
  },
  // 点击立即预约，判断时间是否已经选择，未选择，弹出时间选择日历；选择过，弹出协议
  judgeTime: function() {
    var that = this;
    if (that.data.timeStr != '请选择预约时间') {
      // 弹出协议
      that.setData({
        showModalX: true,
      }, () => {
        that.data.inter = setInterval(function() {
          that.setData({
            sendTime: that.data.waitTime + 's',
            waitTime: that.data.waitTime - 1
          })
          if (that.data.waitTime < 0) {
            clearInterval(that.data.inter)
            that.setData({
              sendTime: '确定',
            })
          }
        }, 1000)
      })

    } else {
      // 进行时间选择
      that.showDelModal()
    }
  },

  // 协议点击确定
  // goConfirm: function() {
  //   var that = this;
  //   if (that.data.sendTime !== '确定') {
  //     return false;
  //   }
  //   that.setData({
  //     showModalX: false,
  //   })
  // },

  goCancel: function() {
    var that = this;
    clearInterval(that.data.inter)
    that.setData({
      showModalX: false,
      sendTime: '10s',
      waitTime: 10
    })
  },

  
  onConfimModal: function() {
    var that = this;
    if (that.data.sendTime!="确定"){
      return;
    }else{
      clearInterval(that.data.inter)
      that.setData({
        showModalX: false,
      })
    }
  },


  doOrderDevice: function() {
    var that = this;
    if (!that.data.startTime) {
      wx.showToast({
        title: '请先选择预约时间',
        duration: 1000
      });
      this.showDelModal();
      return;
    }

    if (that.data.sendTime !== '确定') {
      wx.showToast({
        title: '您未同意预约规则，请重新选择时间',
        duration: 1000
      });
      this.judgeTime();
      return;
    }

    wx.showLoading({
      title: '请稍等...',
    })

    var conf = {
      urlParams: true,
      method: "POST",
      params: {
        id: that.data.deviceId,
        lesseeId: that.data.userId,
        bizType: app.globalData.bizType,
        startTime: util.ftTimeLong(that.data.startTime.replace(/\-/g, "/")), //2019-06-08 12:00:00
        endTime: util.ftTimeLong(that.data.endTime.replace(/\-/g, "/")), //2019-06-08 15:00:00
      }
    }
    NetworkService.call("orderDevice", conf,
      function(res) {
        wx.hideLoading();
        if (res && res.code == 0) {
          wx.showToast({
            title: '预约成功',
          });

          setTimeout(function() {
            wx.navigateBack()
          }, 500)
        } else {
          wx.showToast({
            title: res.message,
          });
        }
      },
      function(error) {
        wx.hideLoading();
      }
    );

  },

  getDeviceDetail: function(str) {
    var that = this;

    var start = new Date(str).setHours(0, 0, 0, 0);
    var end = new Date(str).setHours(23, 59, 59, 999);
    var today = new Date().setHours(0, 0, 0, 0)

    if (today == start) {
      var one = new Date().setHours(6, 0, 0, 0);
      var now = new Date().getTime();
      var now30 = now + 1800000;
      that.setWhiteAndGray(today, one, now30);
    }

    if (today != start) {
      that.setWhite();
    }

    var conf = {
      urlParams: true,
      method: "GET",
      params: {
        id: that.data.deviceId,
        // startTime: start,
        // endTime: end,
        bizType: app.globalData.bizType
      }
    }
    //获取房间预约详情
    // 调用查询占用时间段接口
    NetworkService.call("getDeviceDetail", conf,
      function(res) {
        console.log(res)
        if (res && res.data) {
          var arr = res.data
          if (arr.length > 0) {
            arr.map((item, idx) => {
              console.log("getDeviceDetail==" + str + ",startTime==" + item.startTime + ",endTime==" + item.endTime + ",status==" + item.status + ",companyName==" + item.companyName);
              that.setGrayAndYellow(str, item.startTime, item.endTime, item.status, item.companyName);

            })
          }
        }
      },
      function(error) {
        var sa = error;
      }
    );
  },


  onTapPre: function(e) {
    if (this.data.preGray == true) {
      return;
    }
    var stamp = new Date(this.data.currentDay).setHours(0, 0, 0, 0);
    var newStamp = stamp - (1000 * 60 * 60 * 24);
    var newCurrent = util.dateFtp("yyy-MM-dd", newStamp);
    var now = new Date().setHours(0, 0, 0, 0);

    this.setData({
      currentDay: newCurrent,
    }, () => {
      this.getDeviceDetail(newCurrent);
    })
  },


  onTapAft: function(e) {
    if (this.data.afterGray == true) {
      return;
    }
    var stamp = new Date(this.data.currentDay).setHours(0, 0, 0, 0);
    var newStamp = stamp + (1000 * 60 * 60 * 24);
    var newCurrent = util.dateFtp("yyy-MM-dd", newStamp);
    var now = new Date().setHours(0, 0, 0, 0);

    this.setData({
      currentDay: newCurrent,
    }, () => {
      this.getDeviceDetail(newCurrent);
    })
  },

  setGray() {
    var datas = this.data.timeSlot;
    for (let i = 0; i < datas.length; i++) {
      datas[i].imageType = 1;
      datas[i].imageSource = '/images/order/gray.png';
      datas[i].company = ""
    };
    this.setData({
      timeSlot: datas,
      preGray: false,
    })
  },

  setWhite() {
    var datas = this.data.timeSlot;
    for (let i = 0; i < datas.length; i++) {
      datas[i].imageType = 0;
      datas[i].imageSource = '/images/order/white.png';
      datas[i].company = ""
    };
    this.setData({
      timeSlot: datas,
      preGray: false,
    })
  },

  //设置白色和灰色
  setWhiteAndGray(today, start, end) {
    var datas = this.data.timeSlot;
    console.log("end: " + end)
    for (let i = 0; i < datas.length; i++) {
      //循环遍历每条选择时间段
      var arr = datas[i].timeList.split("~");
      var todayStr = util.dateFtp("yyy-MM-dd", today);
      // one: 选择时间段的开始  
      var one = util.ftTimeLong(todayStr + " " + arr[0]);
      // two: 选择时间段的结束    
      var two = util.ftTimeLong(todayStr + " " + arr[1]);
      if (one >= start && two < end) {
        datas[i].imageType = 1;
        datas[i].imageSource = '/images/order/gray.png';
        datas[i].company = ""
      } else {
        datas[i].imageType = 0;
        datas[i].imageSource = '/images/order/white.png';
        datas[i].company = ""
      }
    }
    this.setData({
      timeSlot: datas,
      preGray: true,
    })
  },

  // imageType 设置黄色和灰色
  // 0,白色，可预约
  // 1,灰色，已预约，
  // 2 黄色  正在审核的预约 
  // 3 绿色  我的预约
  setGrayAndYellow: function(str, start, end, status, companyName) {
    var datas = this.data.timeSlot;
    for (let i = 0; i < datas.length; i++) {
      var arr = datas[i].timeList.split("~");

      var one = util.ftTimeLong(str + " " + arr[0]);
      var two = util.ftTimeLong(str + " " + arr[1]);

      if (one >= start && two <= end) {
        // if (status == 0) {
        //   //预占用状态
        //   datas[i].imageType = 2;
        //   datas[i].imageSource = '/images/order/yellow.png';
        //   datas[i].company = companyName
        // }

        // if (status == 1) {
          //已审核通过
          datas[i].imageType = 1;
          datas[i].imageSource = '/images/order/gray.png';
          datas[i].company = companyName
        // }
      }
    }
    this.setData({
      timeSlot: datas
    })
  },

  confirmTimeSelect() {
    if (!this.data.dayLegal) {
      // 日期不合法
      var current = util.dateFtp("yyy-MM-dd", new Date().getTime());
      this.setData({
        showModal: false,
        currentDay: current,
        dayLegal: true,
        timeStr: '请选择预约时间',
        timeStr1: '',
        timeStr2: '',
      }, () => {
        this.getDeviceDetail(current);
      })
    } else {
      this.setData({
        showModal: false,
      }, () => {
        this.setTimeStr();
        this.judgeTime();
      })
    }
  },

  setTimeStr() {
    // 获取到当天的数组列表，根据imageType的不同进行判断用户选择了哪些，3代表刚选择，1代表灰色，0代表未选择，猜测2代表其他用户选择
    var datas = this.data.timeSlot;
    var currentDay = this.data.currentDay;
    var startIndex = null;
    var endIndex = null;
    for (let i = 0; i < datas.length; i++) {
      if (datas[i].imageType == 3) {
        if (startIndex == null) {
          startIndex = i;
        }
        endIndex = i;
      }
    }
    if (startIndex == null) {
      return;
    }
    var start = datas[startIndex].timeList;
    var end = datas[endIndex].timeList;
    var startArr = start.split("~")
    var endArr = end.split("~")

    var arr = currentDay.split("/");

    var startTime = startArr[0];
    var endTime = endArr[1];
    this.setData({
      // timeStr: arr[0] + "年" + arr[1] + "月" + arr[2] + "日 " + startTime + "~" + endTime,
      timeStr:'',
      timeStr1: arr[0] + "年" + arr[1] + "月" + arr[2] + "日 ",
      timeStr2: startTime + "~" + endTime,
      showModal: false,
      startTime: currentDay + " " + startTime,
      endTime: currentDay + " " + endTime,
    })

  },

  // 0,白色，可预约
  // 1,灰色，已预约，
  // 2 黄色  正在审核的预约 
  // 3 绿色  我的预约
  onTapTimes: function(e) {
    var id = e.currentTarget.dataset.index
    var datas = this.data.timeSlot;
    if (datas[id].imageType == 0) {
      var sid;
      datas.map((item, idx) => {
        if (item.imageType == 3) {
          sid = idx; //获取第一次点击的id
        }
      })

      if (sid != null && id < sid) {
        for (let i = id; i < sid; i++) {
          if (datas[i].imageType == 1) {
            //已预约
            wx.showToast({
              title: '请选择连续时间段',
            })
            return;
          } else {
            datas[i].imageType = 3;
            datas[i].imageSource = '/images/order/green.png';
          }
        }
      }
      if (sid != null && sid < id) {
        for (let i = sid; i <= id; i++) {
          if (datas[i].imageType == 1) {
            //已预约
            wx.showToast({
              title: '请选择连续时间段',
            })
            return;
          } else {
            datas[i].imageType = 3;
            datas[i].imageSource = '/images/order/green.png';
          }
        }
      }

      if (sid == null) {
        datas[id].imageType = 3;
        datas[id].imageSource = '/images/order/green.png';
      }
      this.setData({
        timeSlot: datas
      })
      return;
    };

    if (datas[id].imageType == 3) {
      datas.map((item, idx) => {
        if (idx <= id && datas[idx].imageType == 3) {
          datas[idx].imageType = 0;
          datas[idx].imageSource = '/images/order/white.png';
        }
      })
      this.setData({
        timeSlot: datas
      })
      return;
    }
  },
  hideCalendar(event) {
    if (event.detail) {
      this.setData({
        currentDay: event.detail.date.replace(/-/g, '/'),
        showCalendar: false,
        showTimeSlot: true
      }, () => {
        this.onDaySelected();
      })
    } else {
      this.setData({
        showCalendar: false,
        showTimeSlot: true
      })
    }
  },

  onDaySelected() {
    //判断选中的天数和当前时间相比较分角色
    // 小房间只能提供今天，明天的预定，大房间只能提供一个月内的预定。管理员不受任何限制
    var stamp = new Date(this.data.currentDay).setHours(0, 0, 0, 0);
    var now = new Date().setHours(0, 0, 0, 0);
    // if (this.data.roleType != "manager") {
    //不是管理员
    // if (this.data.roomType == "large") {
    // var max = now + 30 * 24 * 60 * 60 * 1000;
    // if (stamp >= max) {
    //   this.setData({
    //     dayLegal: false, //选中的日期不合法
    //     afterGray: true,
    //   }, () => {
    //     this.setGray();
    //   })
    //   return;
    // }
    // if (!this.data.dayLegal) {
    this.setData({
      dayLegal: true, //选中的日期合法
      afterGray: false,
    })
    // }
    this.getDeviceDetail(this.data.currentDay);
    // }

    // if (this.data.roomType == "small") {
    //   var max = now + 2 * 24 * 60 * 60 * 1000;
    // if (stamp >= max) {
    //   // 选中的日期不接受预约,所有的时间段置灰色。
    //   this.setData({
    //     dayLegal: false, //选中的日期是否接受预约
    //     afterGray: true,
    //   }, () => {
    //     this.setGray();
    //   })
    // //   return;
    // }
    // 选中的日期可以接受预约,请求线上的已预约信息
    // if (!this.data.dayLegal) {
    this.setData({
      dayLegal: true, //选中的日期是否接受预约
      afterGray: false,
    })
    // }
    this.getDeviceDetail(this.data.currentDay);
    // }
    // } else {
    //   //是管理员
    //   this.getDeviceDetail(this.data.currentDay);
    // }
  },

  showCalendar() {
    console.log('点击选择时间')
    this.setData({
      showCalendar: true,
      showTimeSlot: false
    })
  },

  // 1，点击请选择时间，弹出遮罩和日历选择
  showSlectModal(e) {
    this.showDelModal();
  },

  //关闭时间段选择
  closeTimeSelect() {
    this.hideDelModal();
  },

  // 弹出遮罩和日历选择
  showDelModal() {
    // 日历显示动画
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(800).step()
    this.setData({
      animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
      showModal: true
    })
    this.getDeviceDetail(this.data.currentDay);

    setTimeout(() => {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export() // export 方法每次调用后会清掉之前的动画操作。
      })
      console.log(this)
    }, 200)
  },

  hideDelModal() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 600,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModal: false
      })
    }.bind(this), 200)
  },





  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})