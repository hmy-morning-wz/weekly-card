const app = getApp()
import store from './store'
import saleProduct from "../../services/saleProduct"
const createPage = function(options) {
  return Page(store.register(options))
};
createPage({
  data: {
   hasEvaluate:false,
    loseList:[
      
    ]

  },
  async onLoad() {
    app.Tracker.Page.init();
    this.setData({publicId:app.extJson.publicId})

  },
  async onShow() {
    my.showLoading({delay:100});
       await this.loadData()
    my.hideLoading();  
   
  },
  purchasedCardHandle(e){
     let obj = e.currentTarget.dataset.obj
    my.navigateTo({url:`../purchasedCardDetail/purchasedCardDetail?benefitCode=${obj.benefitCode}`})
  },
  onEvaluate(e){
     let obj = e.currentTarget.dataset.obj
     my.navigateTo({url:`../purchasedCardDetail/purchasedCardDetail?benefitCode=${obj.benefitCode}&evaluate=1`})
  },
  async loadData(){
    
   let res =  await  saleProduct.getLoseEfficacyCardList(app.alipayId)
   console.log('getLoseEfficacyCardList',res)
   if(res && res.success &&  res.data.length ){   
         let loseList = res.data.map((item,index)=>{
           item.hasEvaluate= item.evaluate==1;
           item.effect=2
          // item.updateTime = Date.now();
          // item.productName =   item.productName+'-' + index
           return item
    })
     this.setData({loseList})
   }else {
           this.setData({noneText:"空空如也"})
    }
  }
  
  })

