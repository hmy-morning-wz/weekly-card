const app = getApp()

import store from './store'
import saleProduct from "../../services/saleProduct"
import common from '/util/common'
const LEN = 20
const createPage = function (options) {
  return Page(store.register(options))
};
createPage({
  data: {
    historyList: [

    ],
    historyListAll: [],
    configLoad: false

  },
  async onLoad() {
    app.Tracker.Page.init();
    this.setData({ publicId: app.extJson.publicId })
    await this.dispatch('$global:getConfig')
    let config = this.data.$global.config
    this.setData({ config},() => {
      this.setData({
        configLoad: true
      })
    })



  },
  async onShow() {
    console.log("onShow")
    my.showLoading({ delay: 100 });
    this.loadData()
  },

  async  loadData(cb) {
    let res = await saleProduct.getUserOrderList(app.alipayId)
    console.log("getUserOrderList", res)

    if (res && res.success) {
      let historyList = res.data.map((item) => {
        //orderStatusText orderStatus	Integer	4	可选	订单状态（1：待付款；2.付款成功；-1：交易关闭）
        // 订单状态分别为（1：待支付、2：支付成功、0：已退卡、-1：支付取消）
        // 生效状态（effect）也已添加
        switch (item.orderStatus) {
          case 1:
            item.orderStatusText = '待支付'
            break;
          case 2:
            item.orderStatusText = '支付成功'
            break;
          case 0:
            item.orderStatusText = '已退卡'
            break;
          case -1:
            item.orderStatusText = '支付取消'
            break;
          default:
            item.orderStatusText = null
            break;
        }
        // item.orderStatusText = item.orderStatus===1?'待付款':(item.orderStatus===2?'付款成功':'交易关闭')
        item.returnText = item.orderStatus === 2 && item.effect == 0 ? '生效前可退' : null
        //item.updateTime = Date.now();
        return item
      })
      let callback = () => {
        if (cb) {
          // my.showLoading();
          setTimeout(() => {
            my.hideLoading();
            cb()
          }, 500)
        } else {
          my.hideLoading();
        }

      }
      // my.showLoading({content:""});
      let loaded = this.data.historyListAll && this.data.historyListAll.length
      if (loaded) {
        let len = this.data.historyList.length || LEN
        let historyList0 = historyList.slice(0, len)
        this.setData({ historyList: historyList0, historyListAll: historyList }, callback)
      }
      else if (historyList.length > LEN) {
        let historyList0 = historyList.slice(0, LEN)
        this.setData({ historyList: historyList0, historyListAll: historyList }, callback)
      } else {
        this.setData({ historyList, historyListAll: historyList }, callback)
      }


    } else {
      my.hideLoading();
      my.showToast({
        content: (res && res.message) || "系统开小差了，请稍后再试"
      });
    }
  },

  onTouchStart() {
    console.log('onTouchStart===')
  },
  onTouchMove() {
    console.log('onTouchMove====')
  },
  onScroll() {
    console.log('onScroll====')
  },

  onItemTap(e) {
    let index = e.currentTarget.dataset.index
    let historyList = this.data.historyList
    let item = historyList[index]
    if (item.orderStatus === 1) {
      item.showReturn = !item.showReturn
      this.setData({ historyList })
    }
    if (item.orderStatus === 2 && item.effect == 0) {
      item.showReturn = true
      this.setData({ historyList })
    }
  },

  goPay(e) {
    let obj = e.currentTarget.dataset.obj
    console.log("goPay", obj)
    let id = obj.id
    my.tradePay({
      tradeNO: obj.payUrl,
      success: (res) => {
        console.log("tradePay", res)
        this.loadData()
        if (res.resultCode == '9000') {
          setTimeout(() => {
            my.reLaunch({
              url: `/pages/result/index?code=0&message=${obj.needPayPrice}&id=${id}`
            })
          }, 100)
        } else {

          if (res.resultCode == '6001') {

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
  },
  async returnMoney(e) {

    my.showLoading({ content: "正在处理中..." });
    let obj = e.currentTarget.dataset.obj
    //item.orderStatus===1?'待付款':(item.orderStatus===2?'付款成功':'交易关闭')
    if (obj.orderStatus === 1) {
      let res = await saleProduct.cancelOrder(obj.orderNo) //
      console.log("cancelOrder", res)
      this.loadData()
      if (res && res.success) {
        my.showToast({
          content: "取消订单成功"
        });

      } else {
        my.showToast({
          content: (res && res.message) || "系统开小差了，请稍后再试"
        });
      }

    } else if (obj.orderStatus === 2) {
      my.confirm({
        title: '温馨提示',
        content: '确认要退卡吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        success: async (result) => {
          if (result.confirm) {
            let res = await saleProduct.refundOrder(obj.orderNo)
            console.log("refundOrder", res)

            if (res && res.success) {
              //my.showLoading({content:"正在处理中..."});
              let count = 0
              do {
                await common.sleep(1000)
                let refundRes = await saleProduct.getRefundOrder(obj.orderNo)
                console.log("getRefundOrder", refundRes)
                if (refundRes.success && refundRes.data && refundRes.data.refundStatus == 1) {
                  await this.loadData(() => {
                    console.log("navigateTo 退卡成功")
                    my.navigateTo({
                      url: `/pages/result/index?code=9&message=退卡成功`
                    })
                  })
                  return
                }
              } while (count++ < 10)
              this.loadData()
              my.showToast({
                content: "系统开小差了，请稍后再试"
              });
            } else {
              my.showToast({
                content: (res && res.message) || "系统开小差了，请稍后再试"
              });
              this.loadData()
            }
          } else {
            my.hideLoading()
          }
        },
      });
    }
    else {
      my.hideLoading();
    }

  }

  , onReachBottom() {
    // 页面被拉到底部
    console.log("onReachBottom")
    let { historyList, historyListAll } = this.data
    if (historyList.length < historyListAll.length) {
      my.showLoading({ delay: 100 });
      let index = historyList.length
      let list = historyListAll.slice(index)//,index+LEN)
      historyList = historyList.concat(list)
      this.setData({ historyList, reachBottom: historyList.length >= historyListAll.length }, () => {
        my.hideLoading()
      })
    } else {
      if (!this.data.reachBottom) this.setData({ reachBottom: true })
    }
  },
});
