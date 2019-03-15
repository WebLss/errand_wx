const app = getApp();
const util = require('../../../utils/util.js');
const service = util.service;
Page({
  data: {
    isEmpty: false,
    input: '',
    react: false,
    title: null,
    orderType: null,
    addressType: null,
    sortMode: 'last_use_time',
    currentPage: 1,
    currentAddress:null
  },
  clearInput: function () {
    this.setData({
      input: "",
      isEmpty: false
    })
    this.getlist()
  },
  searchInput: function (e) {
    let value = e.detail.value;
    if (value) {
      this.setData({
        isEmpty: true,
        input: value
      })
      this.getlist()
    } else {
      this.setData({
        isEmpty: false,
        input: ''
      })
      this.getlist()
    }
  },
  onLoad: function (options) {
    let that = this;
    // 选择地址
    // if (options.orderType !== undefined && options.orderType !== "null") {
    //   wx.setNavigationBarTitle({
    //     title: options.title || "地址管理"
    //   });
    //   var masterAddressIsNull = true;
    //   if (options.orderType == 1) {
    //     if (options.addressType == 2) {
    //       masterAddressIsNull = false;
    //     }
    //   }
    //   if (options.orderType == 2) {
    //     if (options.addressType == 1) {
    //       masterAddressIsNull = false;
    //     }
    //   }
    //   if (options.master) {
    //     this.setData({
    //       master: 1,
    //       sortMode: 'master'
    //     })
    //   }
    //   that.setData({
    //     orderType: options.orderType,
    //     addressType: options.addressType,
    //     title: options.title,
    //     react: true,
    //     masterAddressIsNull: masterAddressIsNull
    //   })

    // } else {
    //   wx.setNavigationBarTitle({
    //     title: "地址管理",
    //     masterAddressIsNull: false
    //   });
    // }
    // this.setData({
    //   setMasterUrl: 'search?master=1&title=' + options.title + '&orderType=' + options.orderType + '&addressType=' + options.addressType
    // })
    console.log("执行中。。。。。");
    this.getlist()

  },
  onShow: function () {

  },
  getlist: function (opt) {
    var that = this,
      key = that.data.input;
      // data = that.data,
      // orderType = data.orderType,
      // addressType = data.addressType,
      // latIng = app.globalData.latIng,
      // master = data.master,
      // sortMode = data.sortMode,
      // currentPage = data.currentPage;

    service({
      url: '/address/list',
      data: {
        name: key
      }
    }, res => {
      console.log(res);
      if (!res.payload.length) {
        that.setData({
          listIsNull: true,
          addressList: null
        })
        console.log(that.data.addressList)
        return false;
      }
      that.setData({
        addressList: res.payload,
        listIsNull: false
      });
      
      for (let i = 0; i < res.payload.length; i++) {
        if (res.payload[i].latitude == app.globalData.latIng.latitude && res.payload[i].longitude == app.globalData.latIng.longitude) {
          that.setData({
            currentAddress: res.payload[i]
          })
        } 
      }
      console.log("currentAddress:" + this.currentAddress);
      
    });
  },
  chooseAddress: function (e) {
    let data = e.currentTarget.dataset.info
    if (!this.data.react) {
      return false;
    }
    app.globalData.indexTab = this.data.orderType;
    app.globalData.addressType = this.data.addressType;
    app.globalData.addressId = data.id;
    wx.switchTab({
      url: '../../index/index'
    })
  },
  deleteAddress: function (e) {
    let that = this;
    wx.showModal({
      content: '地址删除后将无法恢复，您确定要删除吗？',
      success: res => {
        if (res.cancel) {
          return false;
        }
        service({
          url: '/rest/wx/apis/user/address/delete',
          method: 'POST',
          data: {
            id: e.currentTarget.dataset.id
          }
        }, res => {
          service({
            url: '/rest/wx/apis/user/address/list'
          }, res => {
            if (!res.result.length) {
              that.setData({
                listIsNull: true,
                addressList: null
              })
              return false;
            }
            that.setData({
              addressList: res.result
            })
          });
        })
      }
    })
  },
  editAddress: function (e) {
    var info = e.currentTarget.dataset.info,
      data = this.data;
    wx.redirectTo({
      url: 'add?id=' + info.id + '&lat=' + info.latitude + '&lng=' + info.longitude + '&address=' + info.address + '&name=' + info.name + '&phone=' + info.phone + '&areaName=' + info.area_name + '&addressType=' + data.addressType + '&orderType=' + data.orderType + '&title=' + data.title
    })
  }
})