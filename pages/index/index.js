const app = getApp()
import common from '/util/common'
import store from './store'
import saleProduct from "../../services/saleProduct"
const LEN = 4
const createPage = function(options) {
  return Page(store.register(options))
};
createPage({
  data: {
    cardList:[],
    loaded:false,
    showLife: true,
    configLoad: false
  },
  async onLoad(query) {   
    app.Tracker.Page.init();    
    this.setData({publicId:app.extJson.publicId,query})
    my.showLoading({content:"加载中...",delay:500});
    this.dispatch('$global:updateSystemInfo')
   // const extJson = my.getExtConfigSync()
    const env = app.env
    if(env==='sit'){
      my.setNavigationBar({
         title:'众城通-出行权益卡[测试]'
      });
    }else {
       my.setNavigationBar({
         title:'众城通-出行权益卡'
      });
    }
  
    if(query.cardType) {
      let res = my.setStorageSync({ key: 'queryData', data: query });
    } else {
      let queryData = my.getStorageSync({ key: 'queryData' });      
      this.setData({
        query: queryData.data
      })
    }
    await this.dispatch('$global:getConfig')
    let config = this.data.$global.config
    this.setData({config},() => {
      this.setData({
        configLoad: true
      })
    })
    
    await this.loadData(false,this.data.query)
     this.setData({loaded:true},()=>{
      my.hideLoading();
   })  
  },
  async onShow() {
     let loaded = this.data.loaded
     if(loaded) {
       this.loadData(loaded,this.data.query)
     }
  
  },
  
  async loadData(loaded,query){
    let t0 = +Date.now()
     let cardTypeList
     let sort
    if(query && query.cardType) {
    /*  if(query.cardType.indexOf(",")>-1) {
        cardTypeList = query.cardType.split(",")
      }*/
      cardTypeList = query.cardType // [query.cardType].join()
      sort = query.closeAll ? '' : 1
    }  
    await app.loadUserId()
    let userId = app.alipayId
    let res = await saleProduct.getH5SaleProductList(cardTypeList?{cardTypeList,sort,userId}:{userId});
    let t1 = +Date.now()
    console.log("getH5SaleProductList",res);

     if(res && res.data && res.data.length){
       let cardList = res.data.map((item)=>{
         return{
          id:item.id,
          saleStatus:item.saleStatus,
          name:item.saleTitle,//"厦门地铁1日通",
          price:item.originalPrice,//"100.00",
          image:item.productCoverUrl && (item.productCoverUrl.indexOf("http")>-1) &&(common.crossImage(item.productCoverUrl,{width:200,height:136} )),//"/images/index/bg.png",
          detail:item.saleNote,//"支持 厦门地铁电子卡",      
          salePrice:item.salePrice,//"50.01"
          mainHueValue: item.mainHueValue
        }
       })
       if(loaded) {
         let len = this.data.cardList.length || LEN
         let cardList0 = cardList.slice(0,len)
         this.setData({cardList:cardList0,cardListAll:cardList})
       }
       else if( cardList.length>LEN){
        let cardList0 = cardList.slice(0,LEN)
       this.setData({cardList:cardList0,cardListAll:cardList})
       }else {    
          this.setData({cardList,cardListAll:cardList})
       }
     }
     let t2 = +Date.now()
     console.log("loadData",(t2-t0),(t1-t0))
     /*
        this.setData({cardList:[{
          name:"厦门地铁1日通",
          price:"100.00",
          image:"/images/index/bg.png",
          detail:"支持 厦门地铁电子卡",
          id:0,
          salePrice:"50.01"
        },{
          name:"厦门地铁2日通",
          price:"1.00",
          image:null,
          detail:"支持 厦门地铁电子卡",
          id:1,
          salePrice:"0.01"
        },{
          name:"厦门地铁2日通",
          price:"1.00",
          image:null,
          detail:"支持 厦门地铁电子卡",
          id:1,
          salePrice:"0.01"
        },{
          name:"厦门地铁2日通",
          price:"1.00",
          image:null,
          detail:"支持 厦门地铁电子卡",
          id:1,
          salePrice:"0.01"
        },{
          name:"厦门地铁2日通",
          price:"1.00",
          image:null,
          detail:"支持 厦门地铁电子卡",
          id:1,
          salePrice:"0.01"
        },{
          name:"厦门地铁2日通",
          price:"1.00",
          image:null,
          detail:"支持 厦门地铁电子卡",
          id:1,
          salePrice:"0.01"
        }]})*/
  },
  onFollow() {
    console.log("onFollow")
  },
  onAppear(e) {
    //type "appear"
    console.log("onAppear", e)
  },

  onMyCard() {
    console.log("onMyCard")
 
      my.redirectTo({
            url: "/pages/myJourneyCard/myJourneyCard"
     })
  },
    onViewCard(e) {
    console.log("onViewCard")
    let obj = e.currentTarget.dataset.obj
    my.navigateTo({
            url: `/pages/buy/index?id=${obj.id}`
    })
  },
  onViewHelp(){
  let url = this.data.config.useNoticeUrl  
  let url_path = '/pages/webview/webview?url=' + encodeURIComponent(url)
  my.navigateTo({
    url: url_path
  })

  },
  onReachBottom() {
    // 页面被拉到底部
     console.log("onReachBottom")
     let {cardList,cardListAll} = this.data
     if(cardList.length < cardListAll.length) {
       let index = cardList.length
       let list = cardListAll.slice(index,index+LEN)
       cardList = cardList.concat(list)
       this.setData({cardList})
     }
  },
});
