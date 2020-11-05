import { GlobalStore } from 'herculex'
import { getCardInfo } from './components/card-component/utils/'
import saleProduct from "./services/saleProduct"
import pageJson from './services/pageJson'
import common from '/util/common'
import moment from 'moment'
export default new GlobalStore({
  state: {
     systemInfo:{},
     config:{},
     card:{},
     ele_cards:{},
     cardListStatus:{}
  },
  mutations: {


    UPDATE_SYSTEM: (state, sys) => {
      //console.log('设置系统信息', sys)
      state.systemInfo = sys
    },
        CARD_INFO: (state, cardInfo) => {
      console.log('设置卡片信息 CARD_INFO', cardInfo)
      let t = {}
      if (cardInfo && cardInfo.data) {
        let cardType = cardInfo.cardType
        let data = cardInfo.data
        t.cardTitle = data.cardTitle
        t.cardType = cardType
       // t.balanceMode = data.balanceMode
        t.cardLogo = data.styleConfig && data.styleConfig.logoUrl
        t.imageUrl = data.styleConfig && data.styleConfig.imageUrl
        t.applyUrl = data.extInfo && data.extInfo.cardApplyUrl
        t.status = data.cardModels && data.cardModels.length > 0 ? 'received' : 'noReceive'
        t.cardNo = data.cardModels && data.cardModels.length > 0 ? data.cardModels[0].cardNo : ''
        state.ele_cards[cardType] = t
        if (data && data.cardModels && data.cardModels.length > 0) {
          state.cardListStatus[cardType] = true
        }
      } else {
        let cardType = cardInfo.cardType
        state.ele_cards[cardType] = {}
      }

    },
    SET_CONFIG_JSON:(state, res) => {
    
      state.config = res
    },
    SET_CARD_JSON:(state, res) => {    
      state.card[res.id] = res
    },
  },
  plugins: ['logger'],
  actions: {
    // 获取系统信息
    async updateSystemInfo({ commit }) {
      console.log('updateSystemInfo->')
      let res = await common.getSystemInfoSync() // 阻塞式获取系统信息
     // console.log('getSystemInfoSync', res)
      let versionCodes = res.version.split(".").map((t) => parseInt(t));
      let version = versionCodes[0] * 10000 + versionCodes[1] * 100 + versionCodes[2];
      if (version < 100132) {
        my.showToast({
          type: 'success',
          content: '您当前支付宝版本过低，须更新'
        })
        my.canIUse('ap.updateAlipayClient')
        my.ap.updateAlipayClient()
      } else {
        let sdkVersionCodes = my.SDKVersion.split(".").map((t) => parseInt(t));
        let sdkVersion = sdkVersionCodes[0] * 10000 + sdkVersionCodes[1] * 100 + sdkVersionCodes[2];
        if (sdkVersion < 11100) {// 1.11.0
          my.showToast({
            type: 'success',
            content: '您当前支付宝基础库版本过低，须更新'
          })
          my.canIUse('ap.updateAlipayClient') && my.ap.updateAlipayClient()
        }
      }
      // console.log('成功获取系统信息', res)
      commit('UPDATE_SYSTEM', res)
    },

   
    async getPageJSON({ commit }, pageUrl) {
      console.log('getPageJSON', pageUrl)
      let app = getApp()
      await app.loadUserId()
      let appId = app.appId
      let aliUserId = app.alipayId
      let item = app.extJson.pageJson.filter((t) => {
        return t.pageUrl === pageUrl
      })
      if (item && item.length > 0) {
        let { locationId, templateId } = item[0]
        let local = null
        try {
          let ret = await common.getStorageSync({ key: `PAGE_JSON_${locationId}_${templateId}` })
          console.log('getPageJSON getStorageSync', ret)
          local = ret && ret.success && ret.data && ret.data.data
          if (ret && ret.success && ret.data && (Date.now() - ret.data.timestamp) < 30 * 60000) {
            commit('SET_PAGE_JSON', {
              pageUrl,
              data: ret.data.data
            })
            pageJson.queryPageJson({ appId, aliUserId, locationId, templateId }).then((res) => {
              console.log('getPageJSON queryPageJson then', res)
              if (res && res.success && res.data) {
                commit('SET_PAGE_JSON', {
                  pageUrl,
                  data: res.data
                })
                my.setStorage({
                  key: `PAGE_JSON_${locationId}_${templateId}`,
                  data: {
                    timestamp: Date.now(),
                    data: res.data
                  },
                  success: (res) => {
                    console.log('getPageJSON setStorage success')
                  }
                })
              }
            })
            console.log('getPageJSON use Storage')
            return
          }
        } catch (err) {
          console.warn(err, 'getStorageSync fail')
        }

        let res = await pageJson.queryPageJson({ appId, aliUserId, locationId, templateId })
        console.log('getPageJSON queryPageJson await', res)
        if (res && res.success && res.data) {
          commit('SET_PAGE_JSON', {
            pageUrl,
            data: res.data
          })
          my.setStorage({
            key: `PAGE_JSON_${locationId}_${templateId}`,
            data: {
              timestamp: Date.now(),
              data: res.data
            },
            success: (res) => {
              console.log('getPageJSON setStorage success')
            }
          })
        } else if (local) {
          console.log('getPageJSON queryPageJson fail use local')
          commit('SET_PAGE_JSON', {
            pageUrl,
            data: local
          })
        }
        //return res
      } else {
        console.warn('getPageJSON no config ', pageUrl)
      }


    },
    async getCardInfo({ commit },cardType){
        console.log('[store] getCardInfo', cardType)
        let res = await getCardInfo(cardType)
        console.log('获取卡信息成功', res)
             // res && ( app.replaceConfig.cardName = res.cardTitle)
        commit('CARD_INFO', { cardType: cardType, data: res })
    },
    async getConfig({ commit,state}) {
      //getSaleGeneralCfg
      if(state.config &&state.config.success ) {
        console.log("getConfig success",state.config);
        return
      }
        let res = await saleProduct.getSaleGeneralCfg();
        console.log("getSaleGeneralCfg",res);
        if(res&&res.success){
        commit('SET_CONFIG_JSON', {
          success:true,
            page_footer:res.data.perSaleFootnote,//"更多出行权益，尽在众城通",
            page_kefu:res.data.afterSaleFootnote,//'- 售后详询 95188 或在生活号截图留言-'
              useNoticeTitle:res.data.useNoticeTitle,
        useNoticeUrl:res.data.useNoticeUrl,
        saleNoticeTitle:res.data.saleNoticeTitle,
        saleNoticeUrl:res.data.saleNoticeUrl,
        purchaseListDisplay: res.data.purchaseListDisplay,
        rightsCardDisplay: res.data.rightsCardDisplay,
        purchaseRecordDisplay: res.data.purchaseRecordDisplay
          })
        }
     },
    async getCardDetail({ commit,state },cardId) {

      if(state.card &&state.card[cardId] &&state.card[cardId].success ) {
        console.log("getCardDetail success",state.card[cardId]);
        return
      }
            let res = await saleProduct.getH5SaleProductCfgById(cardId);
     console.log("getCardDetail getH5SaleProductCfgById",res);
     let card={}
      let res2 = await saleProduct.getSalePublicizeCfgList(cardId);
     console.log("getCardDetail getSalePublicizeCfgList",res2);
     /*{
     name:"厦门地铁1日通",//saleTitle
     detail:"支持 厦门地铁电子卡",//saleNote
     tip1:'2019.9.20 生效',
     tip2:'生效自然日免费乘地铁 限8次',
     price:" 15.99",
     salePrice:" 12.99",
     image:null,//productCoverUrl
     saleable:true,
     saleButtonText:"立即抢购",
     cardType:'T0350200',//'T0610800',//'T0330381',//'T0350200',//'T0330100',
     days:7, //effectDay
      tips:[{
     text:"1. 生效日期如选择今天，购买时间前进站的不享受优惠。",
   },{
     text:" 2. 购买生效后不能退卡",
   }],
     sellInfo:[{  //saleRule
       image:null,
       name:"自选生效时间",
       text:"如选择当日，购买时间前进站的不享受优惠。",
     },{
       name:"销售信息2",
       text:"如选择当日，购买时间前进站的不享受优惠。",
     },{
       name:"销售信息3xxxxxxxxxxxxxxxxxxx很长很长",
       text:"如选择当日，购买时间前进站的不享受优惠购买时间前进站的不享受优惠购买时间前进站的不享受优惠购买时间前进站的不享受优惠测试。",
     }]

   }*/
   /**
    * 
    * 
    * 
    * 
    * 
    */
     if(res && res.success){
        card = res.data || {}
        card.name = card.saleTitle
        card.detail = card.saleNote
        card.image = card.productCoverUrl && (card.productCoverUrl.indexOf('http')>-1) &&  (common.crossImage(card.productCoverUrl,{width:592,height:332}))
        card.days = +card.effectDay  
        if(card.saleStartTime && card.saleEndTime) {
        let s = card.saleStartTime.replace(/\-/g, "/");
        let e = card.saleEndTime.replace(/\-/g, "/");
        let startDate =  new Date(Date.parse(s)) 
        let endDate =  new Date(Date.parse(e)) 
        card.saleable =  (startDate<= Date.now()) &&  (endDate>= Date.now() )
        console.log("getH5SaleProductCfgById saleable=",card.saleable,startDate,endDate);
        let startDateText =  startDate && moment(startDate).format('M.D')  || ''
        card.saleButtonText =  card.saleable?"立即抢购":(( Date.now()>endDate)?"抢购已结束":(startDateText+"开始抢购"))
        }
         card.price=card.originalPrice//"15.99"
         card.salePrice=card.salePrice//12.99"
         //card.tip1='2019.9.20 生效'
         card.tip2=card.saleRule//'生效自然日免费乘地铁 限8次'
        // card.cardType='T0350200'
         card.appId= card.appletAppId//'2019041563851989' 2019052965361719
         card.tips=[{
            text: card.orderConfirmation//"1. 生效日期如选择今天，购买时间前进站的不享受优惠。",
             }]
      
        //productCode 
        //saleStartTime
        //saleEndTime
       
     }


      if(res2 && res2.success){
         card.cardDetailsGuide  = res2.data.cardDetailsGuide
         card.saleNoticeTitle= res2.data.saleNoticeTitle//:"购买须知标题1", 
  card.saleNoticeUrl= res2.data.saleNoticeUrl && (res2.data.saleNoticeUrl.indexOf("http")>-1) && res2.data.saleNoticeUrl//:"https://www.taobao.com",
 card.generalSaleNoticeTitle= res2.data.generalSaleNoticeTitle//:"购买须知标题2",
  card.generalSaleNoticeUrl= res2.data.generalSaleNoticeUrl && (res2.data.generalSaleNoticeUrl.indexOf("http")>-1) && res2.data.generalSaleNoticeUrl//:"https://www.taobao.com",
         card.sellInfo =res2.data.salePublicizeCfgList && res2.data.salePublicizeCfgList.map((item)=>{
           return {
                   image: item.iconUrl &&  (common.crossImage(item.iconUrl,{width:112,height:112})) ,
                   name:item.title,
                   text:item.content,
           }
         })
    /*  card.sellInfo=[{  //saleRule
       image:null,
       name:"自选生效时间",
       text:"如选择当日，购买时间前进站的不享受优惠。",
     },{
       name:"销售信息2",
       text:"如选择当日，购买时间前进站的不享受优惠。",
     },{
       name:"销售信息3xxxxxxxxxxxxxxxxxxx很长很长",
       text:"如选择当日，购买时间前进站的不享受优惠购买时间前进站的不享受优惠购买时间前进站的不享受优惠购买时间前进站的不享受优惠测试。",
     }]*/
     
      }
        
        commit('SET_CARD_JSON', {           
            id:cardId,
            data:card,
            success:res && res.success  && res2 && res2.success
          })
     }
  }
    
 

})
