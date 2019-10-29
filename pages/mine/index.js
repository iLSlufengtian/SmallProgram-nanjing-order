const app = getApp()
var NetworkService = require("../../utils/NetworkService.js")
var util = require("../../utils/util.js")

Component({
  properties:{},
  data: {
    globalHeight: getApp().globalData.windowHeight,
    showImg:true,
    marginLeft:30,
    scene:getApp().globalData.scene,
    userInfo:[],
    name:''
  },
  ready:function(options){
    var that = this
    that.isNormalLogin();
    wx.getStorage({
      key: 'roleType',
      success: function(res) {
          if (res.data == 'manager') {
          that.setData({
            showImg: false,
            marginLeft:54
          })
        }
      },
    })
    that.userInfo();
  },
  methods:{
    isNormalLogin:function(){
      var that = this
      if(that.data.scene !== 1047){
        that.setData({
          showImg:false
        })
      }
    },

    backAction:function(){
      wx.navigateBack()
    },

    userInfo:function(){
      var that = this
      console.log(app.globalData.bizType)
      console.log(app.globalData.key)
      console.log(app.globalData.phone)

      var conf = {
        method:"GET",
        params:{
          bizType:app.globalData.bizType,
          key:app.globalData.key,
          phone:app.globalData.phone
        }
      }
      NetworkService.call("userInfo",conf,
        function(res){
          console.log(res)
          if(res && res.code == 0){
            var username = ''
            switch (res.data.roleName){
              case "USER_COMPANY_MANAGER":
                username = '系统管理员';
                break;
              case "USER_DEPARTMENT_MANAGER":
                username = '公司管理员';
                break;
              case "USER_DEVICE_OPERATOR":
                username = '设备使用者';
                break;
              case "USER_FINANCIAL_AUDITOR":
                username = '财务管理员';
                break;
              case "USER_GARDEN":
                username = '园内用户';
                break;
              case "USER_BASIC_VIEW":
                username = '普通用户';
                break;
            }
            that.setData({
              userInfo:res.data,
              name: username
            })
            wx.setStorage({
              key: 'userInfo',
              data: res.data,
            })
          }
        },function(error){
          wx.showToast({
            title: '获取个人信息失败',
            icon:'none'
          })
        }
      )
    },

    // out:function(){
    //   wx.redirectTo({
    //     url: '/pages/login/login',
    //   })
    // }

  }
})