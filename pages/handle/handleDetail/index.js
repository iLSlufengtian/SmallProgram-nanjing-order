// pages/device/detail/index.js
const app = getApp()
var NetworkService = require("../../../utils/NetworkService.js")
var util = require("../../../utils/util.js")
import urlHelper from "../../../utils/urlHelper.js"

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
    id: null,
    one: "block", //判断图片全屏前是否隐藏
    ones: "none", //判断图片全屏后是否隐藏
    phoneheight: " ", //按比例缩放后图片高
    phoneWidth: " ", //按比例缩放后图片宽

    auditData: null,
    imageUrl1:null,
    imageUrl2: null,
    uid:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    this.setData({
      id: id,
    });
    this.queryData()
  },

  onReady: function() {

  },


  queryData: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var conf = {
      method: "GET",
      urlParams: true,
      params: {
        id: that.data.id,
        bizType: app.globalData.bizType,
        key: app.globalData.key
      }
    }
    NetworkService.call("auditDetail", conf,
      function(res) {
        if (res && res.data) {
          console.log(res)
          var data = res.data;
          var url = JSON.parse(data.identityCard)
          
          // setTimeout(function(){
          wx.hideLoading();
          that.setData({
            auditData: data,
            imageUrl1:url[0],
            imageUrl2: url[1],
            uid:data.uid
            // enableSharing: data.enableSharing == 1 ? true : false
          })
         
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

  clickImg: function (e) {
    var imgUrl = e.currentTarget.dataset.img;
    wx.previewImage({
      urls: [imgUrl], //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  agreeAudit: function(){
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
        type:1,
        uid:that.data.uid,
        id: that.data.id,
        status:1
      }
    }
    NetworkService.call("startAudit", conf,
      function (res) {
        wx.hideLoading();
        if (res && res.code == 0) {
          wx.showToast({
            title: '审核已通过',
          });
          setTimeout(function () {
            wx.navigateBack()
          }, 500)
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

disagreeAudit: function () {
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
          type: 1,
          uid: that.data.uid,
        id: that.data.id,
          status: 2
        }
    }
    NetworkService.call("startAudit", conf,
      function (res) {
        wx.hideLoading();
        if (res && res.code == 0) {
          wx.showToast({
            title: '拒绝该申请',
          });
          setTimeout(function () {
            wx.navigateBack()
            // wx.navigateTo({
            //   url: '/pages/handle/index',
            // })
          }, 500)
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