const app = getApp()
import store from './store'
import saleProduct from "../../services/saleProduct"
import { jump, jumpToAlipayPage, jumpToBusCode } from '../../components/card-component/utils'
const createPage = function (options) {
  return Page(store.register(options))
};
createPage({
  data: {
    checked: false,
    dateList: [],
    days: 7,
    dateTime: '',
    timeChoseLeft: true,
    showPickView: false,

    rightDateTime:'选择整点时刻',
    years: [],
    dates: [],
    minutes: [],
    currentTime: 0,
    pickList:[0],
    pickList1:[0],
    pickList2:[0],
    effectType:1,

    unified: true,
    selectIndex: -1,
    eleCard: {
      //status : 'noReceive',
      //applyUrl:"https://test"
    },
    card: {
      /*
        name:"厦门地铁1日通",
        detail:"支持 厦门地铁电子卡",
        tip1:'2019.9.20 生效',
        tip2:'生效自然日免费乘地铁 限8次',
        price:" 15.99",
        salePrice:" 12.99",
        image:null
       */
    }

  },
  async onLoad(query) {
    app.Tracker.Page.init();
    let { id } = query || {}

    console.log('getLangDate=====')
    this.getLangDate()

    if (id != undefined) {
      await this.loadData(id)
      this.setData({ id })
    }

  },
  async onShow() {

  },

  async loadData(id) {
    console.log("loadData", id)
    // let id=0
    await this.dispatch('$global:getCardDetail', id)
    let card = this.data.$global.card[id] || {}
    this.setData({ card: card.data || {} })

    console.log("card===", this.data.card)

    let { days } = card.data
    let dateList = []

    this.data.effectiveTimePrecision = this.data.card.effectiveTimePrecision || 3
    this.setData({
      effectiveTimePrecision: this.data.effectiveTimePrecision
    })
    console.log("effectiveTimePrecision====", this.data.effectiveTimePrecision)
    if (days) {
      let now = +Date.now()
      for (let i = 0; i < days; i++) {
        let date = now + (i * 86400000)
        dateList.push({ week: this.getWeek(date), monthDay: this.getMonthDay(date), date: date })
      }
      let selectIndex = -1//Math.min(1,days-1)
      //let d= new Date(dateList[selectIndex].date)
      // let effectTime = null// `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()}`
      // let tip1 = null// effectTime +  '生效'  
      // this.setData({ dateList, selectIndex, tip1, effectTime })
      // this.setData({ dateList, selectIndex, tip1 })
    }
    let cardType = card.data.cardType
    if (cardType) {
      console.log("getCardInfo ", cardType)
      await this.dispatch('$global:getCardInfo', cardType)
      let eleCard = this.data.$global.ele_cards[cardType] || {}
      console.log("eleCard ", eleCard)
      this.setData({ eleCard })
    } else {
      console.log("getCardInfo no cardType")
    }
  },

  getLangDate() {
    let dateObj = new Date() //表示当前系统时间的Date对象
    let year = dateObj.getFullYear(); //当前系统时间的完整年份值
    let month = dateObj.getMonth() + 1; //当前系统时间的月份值
    let date = dateObj.getDate(); //当前系统时间的月份中的日

    let hour = dateObj.getHours(); //当前系统时间的小时值
    let minute = dateObj.getMinutes(); //当前系统时间的分钟值
    if (month < 10) {
      month = '0' + month
    }
    if (date < 10) {
      date = '0' + date
    }
    if (hour < 10) {
      hour = '0' + hour
    }
    if (minute < 10) {
      minute = '0' + minute
    }
    let second = dateObj.getSeconds(); //当前系统时间的秒钟值

    let dateTime = year + "." + month + "." + date + " " + hour + ":" + (minute);
    if(!this.data.showPickView){
      this.setData({
        dateTime: dateTime
      })
    }
    
    if(this.data.timeChoseLeft){
      let tip1 = this.data.dateTime 
        //card.tip1
      this.setData({ tip1 })
    }
    // setTimeout(this.getLangDate(),1000);
    setTimeout(() => {
      this.getLangDate()
    }, 1000);
  },

  handleLeft() {
    this.setData({
      timeChoseLeft: true,
      effectType:1,
      showPickView: false,
      rightDateTime:'选择整点时刻',
      years: [],
      dates: [],
      minutes: [],
      currentTime: 0,
      pickList:[0],
      pickList1:[0],
      pickList2:[0],
    })
    this.data.effectTime = this.data.dateTime.replace(".","-").replace(".","-") +':00'
    let tip1 = this.data.dateTime 
    //card.tip1
    this.setData({ tip1 })
  },
  handleRight() {
    this.setData({
      timeChoseLeft: false,
      showPickView: true,
      effectType:2,
      pickList:[0],
      pickList1:[0],
      pickList2:[0],
    })
    if (this.data.effectiveTimePrecision === 1) {
      let currentTime = new Date().getTime()
      let timestamp = new Date().getTime() + 1000 * 60 * 60 * 24
      let effectDay = this.data.card.days || 0
      let endTime = currentTime + 1000 * 60 * 60 * 24 * effectDay
      let dates = this.getDates(timestamp, endTime)
      this.setData({
        dates: dates
      })
      console.log('dates====', dates)
    } else if (this.data.effectiveTimePrecision === 2) {
      let timestamp = new Date().getTime()
      this.data.currentTime = timestamp
      let effectDay = this.data.card.days || 0
      let endTime = timestamp + 1000 * 60 * 60 * 24 * effectDay
      let dates = this.getDates(timestamp, endTime)
      let minutes = ['00']
      let hours = this.getHours(timestamp)
      this.setData({

        dates: dates,
        minutes: minutes,
        hours: hours,
      })
    } else if (this.data.effectiveTimePrecision === 3) {
      let timestamp = new Date().getTime()
      this.data.currentTime = timestamp
      let effectDay = this.data.card.days || 0
      let endTime = timestamp + 1000 * 60 * 60 * 24 * effectDay
      let dates = this.getDates(timestamp, endTime)
      let hours = this.getHours(timestamp)
      let minutes = this.getMinutes(timestamp)
      this.setData({

        dates: dates,
        minutes: minutes,
        hours: hours,
      })
    }

  },
  getMinutes(time) {
    let dateTime = new Date(time).getDate()
    let currentTime = new Date()
    // let effectDay = this.data.card.days || 0
    let minutes = []

    let minute = currentTime.getMinutes()
    console.log('cerrent minute===', minute)
    for (let index = 0; index < 59 - minute; index++) {
      let element = minute + index + 1;
      if (element < 10) {
        element = '0' + element
      }
      minutes.push(element)
    }
    console.log('minutes====', minutes)
    return minutes
  },
  getHours(time) {
    console.log('time====', time)
    let dateTime = new Date(time).getDate()
    let currentTime = new Date()
    // let effectDay = this.data.card.days || 0
    let hours = []

    let hour = currentTime.getHours()
    console.log('cerrent hour===', hour)
    let size 
    if(this.data.effectiveTimePrecision === 3){
      size = 24
    }else {
      size = 23
    }
    for (let index = 0; index < size - hour; index++) {
      let element = hour + index + 1;
      if(this.data.effectiveTimePrecision === 3){
        element = element -1
      }
      if (element < 10) {
        element = '0' + element
      }
      hours.push(element)
    }
    console.log('hours====', hours)
    return hours

  },
  getDates(start, end) {
    var date_all = [], i = 0;
    var startTime = new Date(start);
    var endTime = new Date(end);
    while ((endTime.getTime() - startTime.getTime()) >= 0) {
      var year = startTime.getFullYear();
      var month = (startTime.getMonth() + 1).toString().length == 1 ? "0" + (startTime.getMonth() + 1).toString() : (startTime.getMonth() + 1).toString();
      var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
      date_all[i] = year + "年" + month + "月" + day + "日";
      startTime.setDate(startTime.getDate() + 1);
      i += 1;
    }
    return date_all;
  },
  // pickView 滑动
  onPickViewChange(e) {
    console.log("PickViewValue====", e.detail.value);
    let pickList = e.detail.value
    this.data.pickList = pickList
    if (this.data.effectiveTimePrecision === 2) {
      if (pickList[0] !== 0 && pickList[0] !== this.data.dates.length - 1) {
        console.log('length====', this.data.dates.length)
        let hours = []
        for (let index = 0; index < 24; index++) {
          let element = index;
          if (index < 10) {
            element = '0' + index;

          }
          hours.push(element)
        }
        this.setData({
          hours: hours
        })
      } else if (pickList[0] === 0) {
        let hours = this.getHours(this.data.currentTime)
        this.setData({
          hours: hours
        })
      } else {
        console.log('length -1')
        let hour = new Date(this.data.currentTime).getHours()
        let hours = []
        for (let index = 0; index < hour+1; index++) {
          let element = index;
          if (index < 10) {
            element = '0' + index;

          }
          hours.push(element)
        }
        this.setData({
          hours: hours
        })
      }
    } else if (this.data.effectiveTimePrecision === 3) {
      if (pickList[0] !== 0 && pickList[0] !== this.data.dates.length - 1) {
        console.log('length====', this.data.dates.length)
        let hours = []
        for (let index = 0; index < 24; index++) {
          let element = index;
          if (index < 10) {
            element = '0' + index;

          }
          hours.push(element)
        }
        this.setData({
          hours: hours
        })
        let minutes = []
        for (let index = 0; index < 60; index++) {
          let element = index;
          if (element < 10) {
            element = '0' + element
          }
          minutes.push(element)
        }
        this.setData({
          minutes: minutes
        })
      } else if (pickList[0] === 0) {
        let hours = this.getHours(this.data.currentTime)
        this.setData({
          hours: hours
        })
        let minutes = []
        if (this.data.pickList1[0] === 0) {
           minutes = this.getMinutes(this.data.currentTime)

        } else {
          for (let index = 0; index < 60; index++) {
            let element = index;
            if (element < 10) {
              element = '0' + element
            }
            minutes.push(element)
          }
        }
        this.setData({
          minutes: minutes
        })
      } else {
        console.log('length -1')
        let hour = new Date(this.data.currentTime).getHours()
        let hours = []
        for (let index = 0; index < hour+1; index++) {
          let element = index;
          if (index < 10) {
            element = '0' + index;

          }
          hours.push(element)
        }
        this.setData({
          hours: hours
        })
        let minute = new Date(this.data.currentTime).getMinutes()
        let minutes = []
        if (this.data.pickList1[0] === this.data.hours.length - 1) {

          for (let index = 0; index < minute+1; index++) {
            let element = index;
            if (index < 10) {
              element = '0' + index;

            }
            minutes.push(element)

          }
        } else {
          for (let index = 0; index < 60; index++) {
            let element = index;
            if (element < 10) {
              element = '0' + element
            }
            minutes.push(element)
          }
        }
        this.setData({
          minutes: minutes
        })
      }
    }
  },
  onPickViewChange2(e){
    console.log("PickViewValue====", e.detail.value);
    let pickList = e.detail.value
    this.data.pickList1 = pickList
    if (this.data.effectiveTimePrecision === 3) {
      if (this.data.pickList[0] !== 0 && this.data.pickList[0] !== this.data.dates.length - 1) {
        console.log('length====', this.data.dates.length)
        let hours = []
        for (let index = 0; index < 24; index++) {
          let element = index;
          if (index < 10) {
            element = '0' + index;

          }
          hours.push(element)
        }
        this.setData({
          hours: hours
        })
        let minutes = []
        for (let index = 0; index < 60; index++) {
          let element = index;
          if (element < 10) {
            element = '0' + element
          }
          minutes.push(element)
        }
        this.setData({
          minutes: minutes
        })
      } else if (this.data.pickList[0] === 0) {
        let hours = this.getHours(this.data.currentTime)
        this.setData({
          hours: hours
        })
        let minutes = []
        if (pickList[0] === 0) {
           minutes = this.getMinutes(this.data.currentTime)

        } else {
          for (let index = 0; index < 60; index++) {
            let element = index;
            if (element < 10) {
              element = '0' + element
            }
            minutes.push(element)
          }
        }
        this.setData({
          minutes: minutes
        })
      } else {
        console.log('length -1')
        let hour = new Date(this.data.currentTime).getHours()
        let hours = []
        for (let index = 0; index < hour+1; index++) {
          let element = index;
          if (index < 10) {
            element = '0' + index;

          }
          hours.push(element)
        }
        this.setData({
          hours: hours
        })
        let minute = new Date(this.data.currentTime).getMinutes()
        let minutes = []
        if (pickList[0] === this.data.hours.length - 1) {

          for (let index = 0; index < minute+1; index++) {
            let element = index;
            if (index < 10) {
              element = '0' + index;

            }
            minutes.push(element)

          }
        } else {
          for (let index = 0; index < 60; index++) {
            let element = index;
            if (element < 10) {
              element = '0' + element
            }
            minutes.push(element)
          }
        }
        this.setData({
          minutes: minutes
        })
      }
    }
    
  },
  onPickViewChange3(e){
    let pickList = e.detail.value
    this.data.pickList2 = pickList
  },

  handleComplete() {
    this.setData({
      showPickView:false
    })
    let date = this.data.dates[this.data.pickList[0]]
    let hour
    let minute
    if(this.data.effectiveTimePrecision === 1){
      hour = '00'
      minute ='00'
    }else{
      hour = this.data.hours[this.data.pickList1[0]]
      minute = this.data.minutes[this.data.pickList2[0]]
    }
    let time = date+hour+":"+minute
    time = time.replace("年",".").replace("月",".").replace("日"," ")
    this.setData({
      rightDateTime:time
    })
    let effectTime= this.data.rightDateTime.replace(".","-").replace(".","-") +":00"
    console.log("effectTime===",effectTime)
    this.data.effectTime =  effectTime
    let tip1 = time 
    //card.tip1
    this.setData({ tip1, effectTime })
  },

  getMonthDay(date) {
    let d = new Date(date)
    return (d.getMonth() + 1) + "-" + d.getDate()
  },
  getWeek(data) {
    let weeks = '';
    const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let now = +Date.now();
    if (now - data >= 0) {
      weeks = '今天';
    } else if (now + 86400000 - data >= 0) {
      weeks = '明天';
    } else if (
      now + 86400000 * 2 - data >=
      0
    ) {
      weeks = '后天';
    } else {
      weeks = week[new Date(data).getDay()];
    }
    console.log(weeks, data);
    return weeks;
  },

  handleApply(applyUrl, cardType) {
    let url = applyUrl
    if (this.data.unified) {
      console.log('jumpToBusCode', url)

      jumpToBusCode(cardType);

      return;
    }
    console.log('handleApply', url)
    if (url.indexOf('68687011') > -1) {
      // 极速开卡模式
      jumpToAlipayPage(url);

      return;
    }
    var query = 'from=tinyapp&appId=' + app.appId;

    if (url.indexOf('?') > -1) {
      url += '&' + query;
    } else {
      url += '?' + query;
    }

    jump(url);
  },

  onAppear(e) {
    //type "appear"
    console.log("onAppear", e)
  },
  onSubmit(e) {
    console.log("onSubmit", e)


  },
  onSelected(e) {
    console.log("onSelected", e)
    //currentTarget dataset index
    let index = e.currentTarget.dataset.index
    let dateList = this.data.dateList
    let d = new Date(dateList[index].date)
    if (index == 0 && d.getHours() == 23 && d.getMinutes() >= 45) {
      return
    }
    let effectTime = index == 0 ? `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes() + 1}:${d.getSeconds()}` : `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} 00:00:00`
    let tip1 = `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
    //card.tip1
    this.setData({ selectIndex: index, tip1, effectTime })
  },
  async onPay(e) {
    console.log("onPay", e)
    if (e.detail && e.detail.formId) {
      console.log("formId:", e.detail.formId)
    }
    // let selectIndex = this.data.selectIndex
    // if (selectIndex == -1) {
    //   my.showToast({
    //     content: "请选择生效日期"
    //   });
    //   return
    // }
    let eleCard = this.data.eleCard
    let cardStatus = eleCard && eleCard.status
    let cardNo = eleCard && eleCard.cardNo
    let card = this.data.card
    let cardType = this.data.card.cardType //S0350200
    let formId = e.detail && e.detail.formId
    //cardStatus = 'noReceive'//todo
    
    if(cardStatus==undefined || cardStatus === 'noReceive') {
         my.showLoading({ content: "请稍等" });
         await this.dispatch('$global:getCardInfo',cardType)
         let eleCard = this.data.$global.ele_cards[cardType] || {}
         this.setData({eleCard})  
         cardStatus = eleCard && eleCard.status  
         cardNo = eleCard && eleCard.cardNo
         my.hideLoading()
      // return
    }
    if (cardStatus === 'noReceive') {
      let cardTitle = eleCard.cardTitle || '虚拟卡'
      my.confirm({
        title: '温馨提示',
        content: `未申领${cardTitle}，跳转领卡页面领卡`,
        confirmButtonText: '马上领卡',
        cancelButtonText: '暂不需要',
        success: (result) => {
          if (result.confirm) {
            let applyUrl = eleCard.applyUrl
            this.handleApply(applyUrl, cardType)
          }
        },
      })


      return
    }
    let userId = app.alipayId
    let productCode = this.data.card.productCode

    if(this.data.timeChoseLeft === true) {
       this.data.effectTime = this.data.dateTime.replace(".","-").replace(".","-") +':00'
        // console.log("effectTime====",this.data.effectTime)
        
    }

    let { effectTime,effectType } = this.data
    my.showLoading({ content: "正在下单..." });
    let res = await saleProduct.createOrder({ userId, productCode, effectTime, cardNo ,effectType, formId})
    console.log("createOrder", res)

    if (res && res.success) {
      my.hideLoading();
      let id = res.data.id
      my.tradePay({
        tradeNO: res.data.payUrl,
        success: (res) => {
          console.log("tradePay", res)
          if (res.resultCode == '9000') {
            setTimeout(() => {
              my.reLaunch({
                url: `/pages/result/index?code=0&message=${card.salePrice}&id=${id}`
              })
            }, 100)

          } else {

            if (res.resultCode == '6001') {
              my.navigateTo({
                url: `/pages/purchaseHistory/purchaseHistory`
              })
            } else {
              my.showToast({
                content: res.memo || "未支付"
              });
            }
          }
        },
        fail: (res) => {
          console.error("tradePay", res)
        }
      });
    } else if (res.sub_code == '400041') {
      my.hideLoading();
      my.showToast({
        content: (res && res.message) || "系统开小差了，请稍后再试"
      });
      my.navigateTo({
        url: `/pages/purchaseHistory/purchaseHistory`
      })

    } else {
      my.hideLoading();
      let message = (res && res.message) || "系统开小差了，请稍后再试"
      console.error("createOrder", message)
      my.showToast({
        content: message
      });
    }

  },
  onCardApp() {
    let appId = this.data.card.appId
    appId && my.navigateToMiniProgram({
      appId: appId,
      // path: options.url_path,
      // extraData: url_data,
      //envVersion: 'develop'
      //envVersion:options.envVersion
    })
  }
});
