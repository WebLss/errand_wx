const app = getApp()
const util = require('../../../utils/util.js');
const service = util.service;
const { $Message } = require('../../../dist/base/index');
Page({
  data: {

  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderId: options.orderId
    })
    this.getOrder({
      "orderId": options.orderId
    })
  },
  onShow: function () {

  },
  getOrder: function (opt) {
    var that = this;
    service({
      url: '/order/find',
      data: opt,
      method: 'GET'
    }, res => {
      if (res.responseCode === 'SC0000') {
        that.setData({
          order: res.payload
        })
      } else if (res.responseCode === 'ER0001') {
        wx.showToast({
          title: res.responseMessage,
          icon: "none"
        });
      }
    }, error => {
      console.log(error)
    })
  },
  makePhoneCall: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  ordPay: function () {
    var id = this.data.id
    payment(id, () => {
      app.globalData.getOrdList.status = ""
      app.globalData.getOrdList.tab = "1"
      wx.switchTab({
        url: 'list'
      })
    })
  },
  reminderOrd: function () {
    var id = this.data.id;
    service({
      url: '/rest/wx/apis/ord/reminder',
      data: {
        id: id
      },
      method: 'GET',
      hideLoading: true
    }, res => {
      wx.showToast({
        title: res.message,
        duration: 3000,
        icon: "none",
        mask: true
      })
    }, err => {
      wx.showToast({
        title: err,
        icon: "none",
        duration: 3000,
        mask: true
      })
    })
  }
})