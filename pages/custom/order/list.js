const app = getApp()
const util = require('../../../utils/util.js');
const service = util.service;
Page({
  data: {
    currentIndex: "",
    delivering_List: null,
    isEmpty: false,
    pageIndex: 1,
    hasNext: true,
    status: ""
  },
  onLoad: function () {

  },
  getlist: function (opt, callback) {
    var that = this
    service({
      url: '/order/list',
      data: {
        status: opt.status,
        pageSize: opt.pageSize || 5,
        pageNo: opt.page || ""
      },
      method: 'GET'
    }, res => {
      console.log(res.payload);
      typeof callback == "function" && callback(res)
    });
  },
  switchTab: function (e) {
    let index = e.currentTarget.dataset.index,
      that = this,
      status = e.currentTarget.dataset.status || null,
      isEmpty = false;
    this.getlist({ status: status }, res => {
      if (res.result.length == 0) {
        isEmpty = true;
      }

      that.setData({
        isEmpty: isEmpty,
        status: status,
        all_list: res.result,
        hasNext: true,
        pageIndex: 1
      })
    });
    this.setData({
      currentIndex: index
    })

    app.globalData.getOrdList = {
      tab: index,
      status: that.data.status
    }
  },
  onShow: function () {
    var status = 0, currentIndex = 1, that = this;
    if (app.globalData.getOrdList) {
      status = app.globalData.getOrdList.status;
      currentIndex = app.globalData.getOrdList.tab
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          pageHeight: res.windowHeight
        })
      },
    })
    var that = this;
    this.getlist({
      status: status
    }, res => {
      if (!res.payload) {

        return false;
      }
      console.log("currentIndex",currentIndex)
      that.setData({
        currentIndex: currentIndex,
        all_list: res.payload.list
      })
      console.log(this.data.all_list);
    })

  },
  onHide: function () {
    var that = this;
    app.globalData.getOrdList = {
      status: that.data.status,
      tab: that.data.currentIndex
    }
  },
  addScore: function (e) {
    var data = e.currentTarget.dataset.info;
    wx.navigateTo({
      url: '../score/add?id=' + data.id
    })
  },
  makePhoneCall: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
    return false;
  },
  loadMore: function () {
    var pageIndex = this.data.pageIndex,
      status = this.data.status,
      hasNext = this.data.hasNext;
    pageIndex++;
    var that = this;
    this.setData({
      pageIndex: pageIndex
    })
    var orderList = this.data.all_list;
    if (!hasNext) {
      return false;
    }
    this.getlist({
      status: status,
      page: pageIndex
    }, res => {
      var list = orderList.concat(res.result)
      that.setData({
        all_list: list,
        hasNext: res.hasNext
      })
    })
  },
  ordPay(e) {
    var id = e.currentTarget.dataset.id,
      that = this,
      status = this.data.status;
    
  },
  reminderOrd: function (e) {
    var id = e.currentTarget.dataset.id;
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