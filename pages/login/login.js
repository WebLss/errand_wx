// pages/login/login.js
const app = getApp();
import { getUserAndBind } from '../../utils/api.js'
const { $Toast } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: [{
      id: 'A',
      name: '超级管理员',
    }, {
      id: 'B',
      name: '业务员'
    }, {
      id: 'C',
      name: '普通用户'
    }],
    current: '普通用户',
    position: 'left',
    checked: false,
    disabled: false,
    username: 'admin',
    password: '123456',
    errorMsg: ''
  },
  handleFruitChange({ detail = {} }) {
    console.log(detail);
    this.setData({
      current: detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  bindUser: function() {
    console.log(this.data.username, this.data.password);
    if(this.data.username != '' && this.data.password != '') {
      this.setData({
        errorMsg: ''
      })
      let username = this.data.username;
      let password = this.data.password;
      let role = this.data.current;
      //2、调用获取用户信息接口
      wx.login({
        success: function (res) {
          console.log(res)
          //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
          console.log(username,"ffff");
          if (res.errMsg == "login:ok" && res.code != '') {
            wx.showLoading({
              title: '请耐心等待',
              mask: true
            })
            wx.request({
              url: app.globalData.baseUrl + '/login/bindUser',//自己的服务接口地址
              method: 'POST',
              header: {
                "Content-Type": "applciation/json"
              },
              dataType: 'json',
              data: { username: username, password: password, 
                      role: role, code: res.code },
              success: function (data) {
                wx.hideLoading();
                //4.解密成功后 获取自己服务器返回的结果
                if (data.data.status == 0) {
                  var userInfo_ = data.data.userInfo;
                  $Toast({
                    content: '绑定成功！',
                    type: 'success'
                  });
                  setTimeout(()=> {
                    wx.switchTab({
                      url: '/pages/start/start',
                    })
                  },1500)
                } else {
                  $Toast({
                    content: data.data.responseMessage,
                    type: 'error'
                  });
                  
                  // this.setData({
                  //   errorMsg: data.data.responseMessage
                  // })
                }
              },
              fail: function () {
                wx.hideLoading();
                this.setData({
                  errorMsg: '系统错误'
                })
              }
            })
          }
        },
        fail: function () {
          console.log('获取用户信息失败')
        }
      })
    } else {
      this.setData({
        errorMsg: '用户名或密码不能为空'
      })
    }
    // wx.login({
    //   success: function (res) {
    //     var code = res.code;//登录凭证
    //     console.log('code', res);
    //     // wx.navigateTo({
    //     //   url: '../login/login',
    //     // })
    //     getUserAndBind(code, username, password, current);
    //   },
    //   fail: function () {
    //     console.log('登陆失败')
    //   }
    // })
  },


  setName({detail = {}}){
    console.log(detail.detail)

    this.setData({
      username: detail.detail.value
    })
  },
  setPwd({ detail = {} }) {
    this.setData({
      password: detail.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})