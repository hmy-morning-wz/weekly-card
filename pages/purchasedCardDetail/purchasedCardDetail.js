const app = getApp()
import saleProduct from "../../services/saleProduct"
import store from './store'

const createPage = function (options) {
  return Page(store.register(options))
};
createPage({
  data: {
    allBenefitAmount: 0,
    scrollHeight: 600,
    recordList: [

    ],
    benefitNum: 0,
    starList: [
      {
        hasChosed: false
      },
      {
        hasChosed: false
      },
      {
        hasChosed: false
      },
      {
        hasChosed: false
      },
      {
        hasChosed: false
      },
    ],
    canAssess: true,
    showBottom: false,
    showStep: false,

  },
  async onLoad(query) {
    app.Tracker.Page.init();
    this.setData({ publicId: (app.extJson&&app.extJson.publicId) })
    let { benefitCode, evaluate } = query || {}
    await this.dispatch('$global:updateSystemInfo')
    let systemInfo = this.data.$global.systemInfo
    let windowHeight = systemInfo.windowHeight
    let windowWidth = systemInfo.windowWidth //360
    let pixelRatio = (windowWidth && (750 / windowWidth)) || systemInfo.pixelRatio || 1
    let scrollHeight = windowHeight - (198 / pixelRatio)
    this.setData({ scrollHeight, windowHeight, pixelRatio })
    let res2 = await saleProduct.listBenefitUseageRecord({ benefitCode, pageNum: 1, pageSize: 1000 })
    console.log('listBenefitUseageRecord ', res2)
    let allBenefitAmount = 0
    if (res2 && res2.success && res2.data.records) {
      let recordList = res2.data.records.map((t) => {
        allBenefitAmount = allBenefitAmount + (+t.benefitAmount)
        return t
      })

      allBenefitAmount = allBenefitAmount.toFixed(2)
      this.setData({ recordList, allBenefitAmount, benefitNum: res2.data.total, showStep: recordList.length <= 4 })
    } else {
      this.setData({ recordList: [], allBenefitAmount: 0, showStep: true })
    }
    let res = await saleProduct.getCardDetail(benefitCode)
    console.log('getCardDetail ', res)
    if (res && res.success) {
      let card = res.data
      card.tip2 = "已累计优惠" + allBenefitAmount + "元"

      this.setData({ card, canAssess: card.effect === 2 })
    }


    await this.dispatch('$global:getConfig')
    let config = this.data.$global.config
    this.setData({ config })
    if (evaluate) {
      this.showEvaluate();
    }
  },
  async onShow() {

  },
  onGoAlipayRecord(eve) {
    // let cityType = this.data.card.cityType
    // if(cityType === 1) {
    my.setStorage({
      key: 'recordDetail', data: eve.currentTarget.dataset && eve.currentTarget.dataset.obj, success: () => {
        let url_path = `/pages/recordDetail/recordDetail?cityType=${this.data.card && this.data.card.cityType}`
        my.navigateTo({
          url: url_path
        })
      }
    })
    // } else {
    //   let cardType =this.data.card.cardType
    //   let url  = 'alipays://platformapi/startapp?appId=20000076&returnHome=NO&extReq=%7B%22cardType%22%3A%20%22'+cardType+'%22%7D&bizSubType=75%3b107&showSearch=false&title=%E4%B9%98%E8%BD%A6%E8%AE%B0%E5%BD%95'
    //   my.ap.navigateToAlipayPage({
    //     path: url
    //   });
    // }
  },

  onPageScroll({ scrollTop }) {
    // console.log('onPageScroll=====',scrollTop)
  },
  preferentialHandle(e) {
    console.log('preferentialHandle')
  },
  useIntroduceHandle(e) {
    console.log('useIntroduceHandle')

    let url = this.data.config.useNoticeUrl
    let url_path = '/pages/webview/webview?url=' + encodeURIComponent(url)
    my.navigateTo({
      url: url_path
    })

  },

  async showEvaluate() {
    let starList = [
      {
        hasChosed: false
      },
      {
        hasChosed: false
      },
      {
        hasChosed: false
      },
      {
        hasChosed: false
      },
      {
        hasChosed: false
      },
    ]
    let id = this.data.card.id
    let res = await saleProduct.getEvaluate(id)
    console.log('getEvaluate ', res)
    if (res && res.success) {
      let { suggest, satisfaction } = res.data

      if (satisfaction) {
        for (let i = 0; i < satisfaction; i++) {
          starList[i].hasChosed = true
        }
      } else {

      }
      this.setData({
        suggest: suggest || "",
        satisfaction: satisfaction || 0,
        starList
      })
    } else {
      let suggest = ""
      let satisfaction = 0
      this.setData({
        suggest,
        satisfaction,
        starList
      })
    }

    this.setData({
      showBottom: true
    })
    this.journeyCard && this.journeyCard.showTip2()
  },
  onBlurTextarea(e) {
    console.log('onBlurTextarea', e)
    let suggest = e.detail.value
    this.setData({ suggest })
  },
  async assessHandle(e) {
    if (this.data.canAssess) {
      /* if(this.data.card.evaluate==1){
           my.showToast({
         content: '已评价',
         duration: 3000,
         success: () => {
         },
       });
         return
       }*/
      this.showEvaluate();
    } else {
      my.showToast({
        content: '请在使用到期后评价',
        duration: 3000,
        success: () => {
        },
      });
    }
  },
  assessCloseHandle(e) {
    this.setData({
      showBottom: false
    })
    this.journeyCard && this.journeyCard.showTip1()
  },
  satisfactionHandle(e) {
    console.log('e=====', e)
    if (this.data.card.evaluate != 0) {

      return
    }
    let obj = e.currentTarget.dataset.obj
    let currentIndex = e.currentTarget.dataset.index
    for (let index = 0; index < this.data.starList.length; index++) {
      const element = this.data.starList[index];
      if (index <= currentIndex) {
        element.hasChosed = true
      } else {
        element.hasChosed = false
      }
    }
    console.log('starList=====', this.data.starList)
    this.setData({
      starList: this.data.starList,
      starIndex: currentIndex
    })

  },
  bindFormSubmit(e) {
    if (this.data.card.evaluate != 0) {
      this.setData({
        showBottom: false
      })
      this.journeyCard && this.journeyCard.showTip1()
      return
    }
    if (this.data.starList[0].hasChosed) {
      if (e.detail.value.textarea) {
        let suggest = e.detail.value.textarea
        let satisfaction = this.data.starIndex + 1
        let id = this.data.card.id
        console.log('addEvaluate', {
          id, userId: app.alipayId,
          satisfaction,
          suggest
        })
        saleProduct.addEvaluate({
          id, userId: app.alipayId,
          satisfaction,
          suggest
        }).then((res) => {
          if (res && res.success) {
            let card = this.data.card
            card.evaluate = 1
            this.setData({ card })
          }
          res && res.success && my.showToast({
            content: "评价成功",
            duration: 3000,
            success: (res) => {

            },
          });
          this.setData({
            showBottom: false
          })
          this.journeyCard && this.journeyCard.showTip1()
        })

      } else {
        my.showToast({
          content: "请填写意见和建议",
          duration: 3000,
          success: (res) => {

          },
        });
      }
    } else {
      my.showToast({
        content: "请先选择满意度",
        duration: 3000,
        success: (res) => {

        },
      });
    }

    // my.alert({
    //   content: e.detail.value.textarea,
    // });
  },
  onPopupClose(e) {

  },
  onScrollToUpper(e) {
    console.log('e===onScrollToUpper==', e)
    let { recordList, showStep } = this.data
    if (showStep && recordList) {
      this.setData({
        showStep: recordList.length <= 4
      })
    }
  },
  lower(e) {
    console.log('e===lower==', e)
    if (!this.data.showStep) {
      this.setData({
        showStep: true
      })
    }
  },
  scroll(e) {
    // console.log('e===scroll==', e)
  },

  saveJourneyRef(ref) {
    console.log('saveJourneyRef')
    this.journeyCard = ref
  },

  toTakeBus() {
    // console.log(this.data.card)
    my.ap.navigateToAlipayPage({
      path: 'alipays://platformapi/startapp?appId=200011235&source=applet&cardType=' + this.data.card.cardType
    });
  }
});
