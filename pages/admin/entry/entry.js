
const util = require('../../../utils/util.js');
const service = util.service;
const { $Toast } = require('../../../dist/base/index');
Page({
  data: {
    current: 'tab1',
    userList: [],
    examList: []
  },
  onLoad: function (options) { 
    this.initData('tab1');
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
    if(detail.key=='tab1'){
      this.initData('tab1');
    } else {
      this.initData('tab2');
    }
  },
  onChange(event) {
    const detail = event.detail;
    this.setData({
      'switch1': detail.value
    })

  },
  initData: function(status) {
    if(status=='tab1') {
      service({
        url: '/adm/getUserList',
        method: 'POST'
      }, (data) => {
        console.log(data);
        if (data.responseCode == "SC0000") {
          this.setData({
            userList: data.payload
          })
        } else {
          $Toast({
            content: data.responseMessage,
            type: 'error'
          });
        }
      })
    } else if(status == 'tab2') {
      service({
        url: '/adm/getExamList',
        method: 'POST'
      }, (data) => {
        console.log(data);
        if (data.responseCode == "SC0000") {
          this.setData({
            examList: data.payload
          })
        } else {
          $Toast({
            content: data.responseMessage,
            type: 'error'
          });
        }
      })
    }
    
  },
  passExam(userId, id) {
     
  }

});