const app = getApp()
import store from './store'
import saleProduct from "../../services/saleProduct"
const createPage = function(options) {
  return Page(store.register(options))
};
createPage({
  data: {
    cardList:[
       ],
    showLife: false,
    configLoad: false

  },
  async onLoad() {
    app.Tracker.Page.init();
    my.hideBackHome();
    this.setData({publicId:app.extJson.publicId})
     await this.dispatch('$global:getConfig')
 let config = this.data.$global.config
 this.setData({config},() => {
      this.setData({
        configLoad: true
      })
    })
  },
  async onShow() {
    this.loadData()
  },
  async loadData(){
     saleProduct.getRedDot(app.alipayId).then((res)=>{
        console.log('getRedDot',res)
         if(res && res.success){
        this.setData({redDot:res.data.redDot})
         }
     })
    let res =  await saleProduct.getCardList(app.alipayId)
     console.log('getCardList',res)
     if(res && res.success){
     let cardList = res.data.map((res)=>{
          return res
     })
     this.setData({cardList})
     }
  },
  // 已失效点击
  loseEffectHandle(){
    console.log('已失效点击===')
    my.navigateTo({url:'../loseEfficacyCard/loseEfficacyCard'})
  },
  // 购买记录点击
  purchaseHistoryHandle() {
    my.navigateTo({url:'../purchaseHistory/purchaseHistory'})
  },
  purchasedCardHandle(e) {
     let obj = e.currentTarget.dataset.obj
    my.navigateTo({url:`../purchasedCardDetail/purchasedCardDetail?benefitCode=${obj.benefitCode}`})
  },

  buyCardHandle() {
    my.redirectTo({
      url: '/pages/index/index'
    });     
  },

  onTouchStart() {
    console.log('onTouchStart===')
  },
  onTouchMove() {
    console.log('onTouchMove====')
  },
  onScroll() {
    console.log('onScroll====')
  }
  
 
  
});
