//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    currentIndex: 1,
    userInfo: {},
    hasUserInfo: false,
    markers: [],
    rule: "",
    isSlide: true,
    visibleButton: false,
    heightLightStyle: "",
    slideRules: false,
    isBindPhone: true,
    pick: null,
    send: null,
    distance: 0,
    cost: 0,
    isToday: true
  },
  onLoad: function () {
    
  },
  // 展开form
  slideForm: function (e) {
    var index = e.currentTarget.dataset.index,
      task_type = index == 1 ? "help" : "buy";
    if (index == 1) {
      this.setData({
        send: null
      })
      this.getRecentAddr('from')
    } else {
      this.setData({
        pick: null
      })
      this.getRecentAddr('to')
    }
    this.setData({
      currentIndex: index,
      task_type: task_type
    });
  },
  // 获取地址
  getAddress: function () {
    if (!app.globalData.indexTab) {
      return false;
    }
    var that = this,
      distance = {},
      send = that.data.send,
      pick = that.data.pick,
      hours = that.data.hours,
      minutes = that.data.minutes;
    service({
      url: '/rest/wx/apis/user/address/use',
      data: {
        id: app.globalData.addressId,
        "type": app.globalData.addressType == 1 ? 'from' : 'to'
      },
      method: 'POST'
    }, res => {
      // pick
      if (app.globalData.addressType == 1) {
        pick = res;
        that.setData({
          pick: {
            latitude: res.latitude,
            longitude: res.longitude,
            address: res.address,
            name: res.name,
            phone: res.phone,
            area_name: res.areaName,
            adcode: res.zipCode
          }
        })
      } else if (app.globalData.addressType == 2) {
        send = res;
        that.setData({
          send: {
            latitude: res.latitude,
            longitude: res.longitude,
            address: res.address,
            name: res.name,
            phone: res.phone,
            area_name: res.areaName,
            adcode: res.zipCode
          }
        })
      }
      if (send && pick) {
        that.calculateDistance(send, pick, () => {
          var distance = that.data.distance;
          that.setData({
            distance: distance
          })
          that.getCost(distance)


        })
      }
    }, err => {
      wx.showToast({
        title: err,
        icon: "none"
      })
    })


  },
  // 获取最近使用地址
  getRecentAddr: function (t) {
    var that = this;
    // service({
    //   url: '/rest/wx/apis/user/address/recent',
    //   data: {
    //     "type": t
    //   },
    //   method: 'GET'
    // }, res => {
    //   if (t == 'from') {
    //     that.setData({
    //       pick: res
    //     })
    //   } else {
    //     that.setData({
    //       send: res
    //     })
    //   }
    //   var pick = that.data.pick, send = that.data.send
    //   if (pick && send) {
    //     that.calculateDistance(pick, send)
    //   }
    // })
  }
 
})
