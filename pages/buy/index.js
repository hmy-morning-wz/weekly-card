const app = getApp()

import store from './store'

const createPage = function(options) {
  return Page(store.register(options))
};
createPage({
  data: {
   checked:false,
   card:{
     /*
     name:"厦门地铁1日通",
     detail:"支持 厦门地铁电子卡",
     tip1:'2019.9.20 生效',
     tip2:'生效自然日免费乘地铁 限8次',
     price:" 15.99",
     salePrice:" 12.99",
     image:null,
     saleable:false,
     saleButtonText:"抢购已结束",
     sellInfo:[{
       image:null,
       name:"自选生效时间",
       text:"如选择当日，购买时间前进站的不享受优惠。",
     },{
       name:"自选生效时间",
       text:"如选择当日，购买时间前进站的不享受优惠。",
     },{
       name:"自选生效时间",
       text:"如选择当日，购买时间前进站的不享受优惠。",
     }]
   */
   }
  },
  async onLoad(query) {
    app.Tracker.Page.init();
  let {id} = query || {} 
   if(id!=undefined){     
    await this.loadData(id)
    this.setData({id})
   }
  },
  async onShow() {
     let id = this.data.id
    if(id!=undefined) {
      await this.loadData(id)
    }
  },
  
  async loadData(id){
    console.log("loadData",id)
    await this.dispatch('$global:getCardDetail',id)
    let card = this.data.$global.card[id] || {}
    this.setData({card:card.data||{}})
  },
 
  onAppear(e) {
    //type "appear"
    console.log("onAppear", e)
  },
  onSubmit(e){
 console.log("onSubmit", e)
 let saleable =  this.data.card.saleable
 if(!saleable){
   return
 }
 let checked = this.data.checked
 
 if(!checked){
   my.showToast({    
      content: '请先勾选购买须知'
   });
 }else {
      let id = this.data.id
      my.navigateTo({
            url: `/pages/confirm/index?id=${id}`
     })
 }
},
onCkChange(e){
 console.log("onCkChange", e)//detail:{value: false}
 let checked = e.detail.value
 this.setData({
   checked
 })
},
onGoPage1(e){
  //出行权益卡购买须知
  //    saleNoticeTitle:"购买须知标题1", 
   //     saleNoticeUrl:"https://www.taobao.com",
  //      generalSaleNoticeTitle:"购买须知标题2",
  //      generalSaleNoticeUrl:"https://www.taobao.com",
  let url = this.data.card.saleNoticeUrl
  let url_path = '/pages/webview/webview?url=' + encodeURIComponent(url)
  my.navigateTo({
    url: url_path
  })
},
onGoPage2(e){
  //    saleNoticeTitle:"购买须知标题1",
   //     saleNoticeUrl:"https://www.taobao.com",
  //      generalSaleNoticeTitle:"购买须知标题2",
  //      generalSaleNoticeUrl:"https://www.taobao.com",
    let url = this.data.card.generalSaleNoticeUrl
 
  let url_path = '/pages/webview/webview?url=' + encodeURIComponent(url)
  my.navigateTo({
    url: url_path
  })
},
onCardApp(){
   let appId = this.data.card.appId
   appId &&  my.navigateToMiniProgram({
              appId: appId,
             // path: options.url_path,
             // extraData: url_data,
              //envVersion: 'develop'
              //envVersion:options.envVersion
   })
}
});
