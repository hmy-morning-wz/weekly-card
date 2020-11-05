import {
  request
} from '../util/service'

const mock  = false
export default {
 //【周期卡小程序接口】选购出行权益列表 /operation-mall/h5SaleProduct/getH5SaleProductList
  getH5SaleProductList: async (data) => {
    const originData = await request(`/operation-mall/h5SaleProduct/getH5SaleProductList`,data, {
      on: mock,
      delay:1000,
      data: {data:[{
        id:1,
        saleTitle:'售卖产品标题1',//宣传标注	
        saleNote:'标题'+(+Date.now()),
        productCoverUrl:'https://images.allcitygo.com/20191016102344732uiW5tn.jpg',  
        salePrice:'10',
        originalPrice:'100',
        saleStatus:'1'
      },{
        id:2,
        saleTitle:'售卖产品标题2',//宣传标注	
        saleNote:'标题下方说明2',
        productCoverUrl:'https://images.allcitygo.com/20191016102344732uiW5tn.jpg',  
        salePrice:'20',
        originalPrice:'200',
        saleStatus:'1'
      },{
        id:2,
        saleTitle:'售卖产品标题2',//宣传标注	
        saleNote:'标题下方说明2',
        productCoverUrl:'https://images.allcitygo.com/20191016102344732uiW5tn.jpg',  
        salePrice:'20',
        originalPrice:'200',
        saleStatus:'1'
      },{
        id:2,
        saleTitle:'售卖产品标题2',//宣传标注	
        saleNote:'标题下方说明2',
        productCoverUrl:'https://images.allcitygo.com/20191016102344732uiW5tn.jpg',  
        salePrice:'20',
        originalPrice:'200',
        saleStatus:'1'
      },{
        id:2,
        saleTitle:'售卖产品标题2',//宣传标注	
        saleNote:'标题下方说明2',
        productCoverUrl:'https://images.allcitygo.com/20191016102344732uiW5tn.jpg',  
        salePrice:'20',
        originalPrice:'200',
        saleStatus:'1'
      },{
        id:2,
        saleTitle:'售卖产品标题2',//宣传标注	
        saleNote:'标题下方说明2',
        productCoverUrl:'https://images.allcitygo.com/20191016102344732uiW5tn.jpg',  
        salePrice:'20',
        originalPrice:'200',
        saleStatus:'1'
      },{
        id:2,
        saleTitle:'售卖产品标题2',//宣传标注	
        saleNote:'标题下方说明2',
        productCoverUrl:'https://images.allcitygo.com/20191016102344732uiW5tn.jpg',  
        salePrice:'20',
        originalPrice:'200',
        saleStatus:'1'
      },{
        id:2,
        saleTitle:'售卖产品标题2',//宣传标注	
        saleNote:'标题下方说明2',
        productCoverUrl:'https://images.allcitygo.com/20191016102344732uiW5tn.jpg',  
        salePrice:'20',
        originalPrice:'200',
        saleStatus:'1'
      },{
        id:2,
        saleTitle:'售卖产品标题2',//宣传标注	
        saleNote:'标题下方说明2',
        productCoverUrl:'https://images.allcitygo.com/20191016102344732uiW5tn.jpg',  
        salePrice:'20',
        originalPrice:'200',
        saleStatus:'1'
      },{
        id:2,
        saleTitle:'售卖产品标题2',//宣传标注	
        saleNote:'标题下方说明2',
        productCoverUrl:'https://images.allcitygo.com/20191016102344732uiW5tn.jpg',  
        salePrice:'20',
        originalPrice:'200',
        saleStatus:'1'
      },{
        id:2,
        saleTitle:'售卖产品标题2',//宣传标注	
        saleNote:'标题下方说明2',
        productCoverUrl:'https://images.allcitygo.com/20191016102344732uiW5tn.jpg',  
        salePrice:'20',
        originalPrice:'200',
        saleStatus:'1'
      }]    
      }
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR && originData.data) {
      return {
        success: true,
        data: originData.data,
        message:originData.sub_msg || originData.msg
      }
    }

    return {
      success: false,
      message:originData.sub_msg || originData.msg
    }
  },
  //【周期卡小程序接口】通过主键id获取周期卡信息  /operation-mall/h5SaleProduct/getH5SaleProductCfgById
    getH5SaleProductCfgById: async (id) => {
    const originData = await request(`/operation-mall/h5SaleProduct/getH5SaleProductCfgById?id=${id}`,{}, {
      on: mock,
      data: {data:{
        id:1,
        saleTitle:'售卖产品标题1',//宣传标注	
        saleNote:'标题下方说明1',
        productCoverUrl:'',  
        saleStartTime:'2010-01-01',
        saleEndTime:'2021-01-01',
        effectDay:1,
        saleRule:"生效自然日免费乘车限8次",
        salePrice:100,
        originalPrice:99,
        orderConfirmation:"1. 生效日期如选择今天，购买时间前进站的不享受优惠。",
        cardType:"T0350200",
        appletAppId:"2019041563851989"
      }    
      }
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR  && originData.data) {
      return {
        success: true,
        data: originData.data,
        message:originData.sub_msg || originData.msg
      }
    }

    return {
      success: false,
      message:originData.sub_msg || originData.msg
    }
  },
//【通用配置管理】获取通用配置 http://sit-operation.allcitygo.com:80/operation-mall/saleGeneralCfg/getSaleGeneralCfg
 getSaleGeneralCfg: async () => {
    const originData = await request(`/operation-mall/saleGeneralCfg/getSaleGeneralCfg`,{}, {
      on: mock,
      data: {data:{
        
        propagandaSlogan:'越乘越优惠',//宣传标注	
        perSaleFootnote:'更多出行权益，尽在 众城通',
        afterSaleFootnote:'售后详询 95188 或在生活号截图留言',  
        useNoticeTitle:'权益卡使用说明',
        useNoticeUrl:"https://www.taobao.com",
        saleNoticeTitle:"",
        saleNoticeUrl:"https://www.taobao.com",
      }    
      }
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('getSaleGeneralCfg返回数据：', originData);
    if (!originData.API_ERROR  && originData.data) {
      return {
        success: true,
        data: originData.data,
        message:originData.sub_msg || originData.msg
      }
    }

    return {
      success: false,
      message:originData.sub_msg || originData.msg
    }
  },
//【宣传点信息管理】获取以下权益接口 http://sit-operation.allcitygo.com:80/operation-mall/salePublicizeCfg/getSalePublicizeCfgList
 getSalePublicizeCfgList: async (id) => {
    const originData = await request(`/operation-mall/salePublicizeCfg/getSalePublicizeCfgList?saleCfgId=${id}`,{}, {
      on: mock,
      data: {data:{
        saleCfgId:0,
        cardDetailsGuide:"你将获得以下权益",
        saleNoticeTitle:"购买须知标题1",
        saleNoticeUrl:"https://www.taobao.com",
        generalSaleNoticeTitle:"购买须标题标题标题标题标题标题标题标题知标题2",
        generalSaleNoticeUrl:"https://www.taobao.com",
        salePublicizeCfgList:[{
          saleCfgId:1,
          iconUrl:"",
          title:"自选生效时间",
          content:"如选择当日，购买时间前进站的不享受优惠。",
        },{
          saleCfgId:1,
          iconUrl:"",
          title:"销售信息2",
          content:"如选择当日，购买时间前进站的不享受优惠。",
        }]
      }}
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR  && originData.data) {
      return {
        success: true,
        data: originData.data,
        message:originData.sub_msg || originData.msg
      }
    }

    return {
      success: false,
      message:originData.sub_msg || originData.msg
    }
  },

  //3.1.1确认购买
// 业务功能描述：确认购买按钮接口 /createOrder
/*
userId	String	64	必选	用户id
productCode	String	32	必选	购买的产品
effectTime	String	32	必选	产品生效时间
cardNo	String	32	必选	卡号

返回
payUrl	String	256	可选	支付链接
orderNo	String	64	可选	订单号
 */
 createOrder: async (data) => {
    const originData = await request(`/operation-order/benefitCard/createOrder`,data, {
      on: mock,
      data: {data:{
        orderNo:"123456"
      }}
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR && originData.code=='20000' && originData.data) {
      return {
        success: true,
        data: originData.data,
        message:originData.sub_msg || originData.msg
      }
    }

    return {
      success: false,
      code:originData.code,
      sub_code:originData.sub_code,
      message:originData.sub_msg || originData.msg
    }
  },
 //3.1.2我的出行权益卡
//业务功能描述：根据用户userId获取用户出行权益卡列表。
/*
userId	String	64	必选	用户id

返回参数
id	Integer	11	必选	用户权益卡表id
productCode	String	32	必选	购买的产品
productName	String	32	必须	购买产品名
mainMerchantName	String	32	必选	电子公交卡商户
effectTime	String	32	必选	产品生效时间
effect	Integer	4	必选	是否生效（0：未生效；1：已生效；2：已失效）
remainingDays	Integer	4	可选	剩余天数
saleRule	String	64	必须	卡面显示规则
productCoverUrl	String	512	必须	封面链接
 */
 getCardList: async (userId) => {
    const originData = await request(`/operation-order/benefitCard/getCardList?userId=${userId}`,{}, {
      on: mock,
      data:{
      data: [{
        id:0,
        productCode :'购买的产品1',
        productName	:'厦门地铁1日通'+(+Date.now()), 
        mainMerchantName:'厦门地铁电子卡', 
        effectTime :'2019-12-31',
        effect  :1,
        remainingDays  :6,
        saleRule:"生效自然日免费乘车限8次",
        productCoverUrl	  :'',
      },{
        id:0,
        productCode :'购买的产品2',
        productName	:'厦门地铁1日通'+(+Date.now()), 
        mainMerchantName:'厦门地铁电子卡', 
        effectTime :'2019-12-31',
        effect  :1,
        remainingDays  :6,
        saleRule:"生效自然日免费乘车限8次",
        productCoverUrl	  :'',
      }/*,{
        id:1,
        productCode :'购买的产品2',
        productName	:'购买产品名2', 
        mainMerchantName:'电子公交卡商户2', 
        effectTime :'2019-12-31',
        effect  :1,
        remainingDays  :6,
        saleRule  :'dddd',
        productCoverUrl	  :'',
      }*/]
    }}, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR  && originData.data) {
      return {
        success: true,
        data: originData.data,
        message:originData.sub_msg || originData.msg
      }
    }

    return {
      success: false,
      message:originData.sub_msg || originData.msg
    }
  },

//3.1.3已失效上的红点
//业务功能描述：根据用户userId获取已失效上的红点是否展示。
/**
 * 返回参数
redDot	Integer	4	必选	红点是否展示（0：不展示；1：展示）
 */
 getRedDot: async (userId) => {
    const originData = await request(`/operation-order/benefitCard/getRedDot?userId=${userId}`,{}, {
      on: mock,
     data: {data:{redDot:0}}
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR  && originData.data) {
      return {
        success: true,
        data: originData.data,
        message:originData.sub_msg || originData.msg
      }
    }

    return {
      success: false,
      message:originData.sub_msg || originData.msg
    }
  },

//3.1.4获取用户购买记录
//业务功能描述：根据用户userId获取用户的购买记录。
/**
 * orderNo	String	64	可选	订单号
orderStatus	Integer	4	可选	订单状态（1：待付款；2.付款成功；-1：交易关闭）
productCode	String	32	必选	购买的产品
productName	String	32	必须	购买产品名
needPayPrice	BigDecimal	10	必选	应付金额
orderTime	String	10	可选	下单时间
payUrl	String	256	可选	支付链接
 */
 getUserOrderList: async (userId) => {
    const originData = await request(`/operation-order/benefitCard/getUserOrderList`,{userId,pageSize:1000,page:1}, {
      on: mock,
      delay:3000,
     data: {data:[{
       orderNo:"订单号1",
       orderStatus:1,
       productCode:"购买的产品",
       productName:"购买产品名"+(+Date.now()),
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
       effect:0
     },{
       orderNo:"订单号2",
       orderStatus:2,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:2,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:1
     },{
       orderNo:"订单号2",
       orderStatus:0,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     },{
       orderNo:"订单号2",
       orderStatus:-1,
       productCode:"购买的产品",
       productName:"购买产品名",
       needPayPrice:"应付金额",
       orderTime:"2019-12-31",
       payUrl:"",
        effect:0
     }]}
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR  &&  originData.code ==='20000') {
      return {
        success: true,
        data: originData.data || [],
        message:originData.sub_msg || originData.msg
      }
    }

    return {
      success: false,
      message:originData.sub_msg || originData.msg
    }
  },

//3.1.5取消订单
//业务功能描述：取消订单。
 cancelOrder: async (orderNo) => {
    const originData = await request(`/operation-order/benefitCard/cancelOrder`,{orderNo}, {
         on: mock,
         delay:10000,
     data: {code:'20000',data:{}}
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR &&originData.code ==='20000' ) {
      return {
        success: true,
        data: originData.data,
        message:originData.sub_msg || originData.msg
      }
    }

    return {
      success: false,
      message:originData.sub_msg || originData.msg
    }
  },
  
//3.1.6退卡退款
//业务功能描述：退卡退款。
 refundOrder: async (orderNo) => {
    const originData = await request(`/operation-order/benefitCard/refundOrder`,{orderNo}, {
      on: mock,
        delay:10000,
     data: {code:'20000',data:{}}
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR &&originData.code ==='20000' ) {
      return {
        success: true,
        data: originData.data,
        message:originData.sub_msg || originData.msg
      }
    }

    return {
      success: false,
      message:originData.sub_msg || originData.msg
    }
  },

//3.1.7卡详情
//业务功能描述：根据用户userId获取用户出行权益卡详情。
/**
id	Integer	11	必选	用户权益卡表id
productCode	String	32	必选	购买的产品
productName	String	32	必须	购买产品名
mainMerchantName	String	32	必选	电子公交卡商户
effectTime	String	32	必选	产品生效时间
endTime	String	32	必选	产品结束时间
saleRule	String	64	必须	卡面显示规则
effect	Integer	4	必选	是否生效（0：未生效；1：已生效；2：已失效）
remainingDays	Integer	4	可选	剩余天数
evaluate	Integer	4	必选	评价（0：未评价；1：已评价）
productCoverUrl	String	512	必须	封面链接 */
 getCardDetail: async (id) => {
    const originData = await request(`/operation-order/benefitCard/getCardDetail?benefitCode=${id}`,{}, {
           on: mock,
     data: {data:{
       id:1,
       productCode:"购买的产品",
       productName:"购买产品名",
       mainMerchantName:"电子公交卡商户",
       effectTime:"2019-12-01",
       endTime:"2019-12-09",
       saleRule:"生效自然日免费乘车限8次",
       effect:2,
       remainingDays:6,
       productCoverUrl:"",
       evaluate:1
       }}
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR  && originData.data) {
      return {
        success: true,
        data: originData.data,
        message:originData.sub_msg || originData.msg
      }
    }

    return {
      success: false,
      message:originData.sub_msg || originData.msg
    }
  },
//3.1.8已失效权益卡
//业务功能描述：根据用户userId获取用户已失效权益卡列表。
/**
 * id	Integer	11	必选	用户权益卡表id
productCode	String	32	必选	购买的产品
productName	String	32	必须	购买产品名
mainMerchantName	String	32	必选	电子公交卡商户
effectTime	String	32	必选	产品生效时间
endTime	String	32	必选	产品结束时间
saleRule	String	64	必须	卡面显示规则
evaluate	Integer	4	必选	评价（0：未评价；1：已评价）
 * 
 */
 getLoseEfficacyCardList: async (userId) => {
    const originData = await request(`/operation-order/benefitCard/getLoseEfficacyCardList?userId=${userId}`,{}, {
          on: mock,
     data: {data:[{
       id:1,
       productCode:'购买的产品',
       productName:'购买产品名'+(+Date.now()),
       mainMerchantName:'电子公交卡商户',
       effectTime:'2019-12-01',
       endTime:'2019-12-08',
       saleRule:"生效自然日免费乘车限8次",
       evaluate:0,
       },{
       id:2,
      productCode:'购买的产品',
       productName:'购买产品名',
       mainMerchantName:'电子公交卡商户',
       effectTime:'2019-12-01',
       endTime:'2019-12-08',
       saleRule:"生效自然日免费乘车限8次",
       evaluate:1,
       },{
       id:3,
      productCode:'购买的产品',
       productName:'购买产品名',
       mainMerchantName:'电子公交卡商户',
       effectTime:'2019-12-01',
       endTime:'2019-12-08',
       saleRule:"生效自然日免费乘车限8次",
       evaluate:1,
       },{
       id:4,
      productCode:'购买的产品',
       productName:'购买产品名',
       mainMerchantName:'电子公交卡商户',
       effectTime:'2019-12-01',
       endTime:'2019-12-08',
       saleRule:"生效自然日免费乘车限8次",
       evaluate:1,
       },{
       id:5,
      productCode:'购买的产品',
       productName:'购买产品名',
       mainMerchantName:'电子公交卡商户',
       effectTime:'2019-12-01',
       endTime:'2019-12-08',
       saleRule:"生效自然日免费乘车限8次",
       evaluate:1,
       }]}
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR  && originData.data) {
      return {
        success: true,
        data: originData.data,
        message:originData.sub_msg || originData.msg
      }
    }

    return {
      success: false,
      message:originData.sub_msg || originData.msg
    }
  },

//3.1.9添加评价
//业务功能描述：添加用户评价。
/**
 * id	Integer	11	必选	用户权益卡表id
userId	String	64	必选	用户id
satisfaction	Integer	8	必选	使用满意度
suggest	String	1024	可选	使用意见和建议
 * 
 */
 addEvaluate: async (data) => {
    const originData = await request(`/operation-order/benefitCard/addEvaluate`,data, {
      on: mock,
     data: {data:{
       id:1,
       satisfaction:3,
       suggest:""
       }}
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR  && originData.code==='20000') {
      return {
        success: true,
        data: originData.data,
        message:originData.sub_msg || originData.msg
      }
    }

    return {
      success: false,
      message:originData.sub_msg || originData.msg
    }
  },
   getEvaluate: async (id) => {
    const originData = await request(`/operation-order/benefitCard/getEvaluate?id=${id}`,{}, {
      on: mock,
     data: {data:{
       id:1,
       satisfaction:3,
       suggest:"评价评价评价评价评价评价评价"
       }}
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR  && originData.data) {
      return {
        success: true,
        data: originData.data,
        message:originData.sub_msg || originData.msg
      }
    }

    return {
      success: false,
      message:originData.sub_msg || originData.msg
    }
  },
  //todo 消费记录
  //operation-order/benefitCard/listBenefitUseageRecord
  listBenefitUseageRecord: async (data) => {
    const originData = await request(`/operation-order/benefitCard/listBenefitUseageRecord`,data, {
      on: mock,
     data: {data:{
       records:[{
totalBenefitAmount:1,
cityCode:'2334',
cityName:"cityName",
lineName:'xxxx',
bizTime:'2019',
transId:'dd',
bizOrderAmount:3,
realAmount:99,
benefitAmount:1
       },{
totalBenefitAmount:1,
cityName:"cityName",
cityCode:'2334',
lineName:'xxxx',
bizTime:'2019',
transId:'dd',
bizOrderAmount:3,
realAmount:99,
benefitAmount:1
       },{
totalBenefitAmount:1,
cityCode:'2334',
lineName:'xxxx',
bizTime:'2019',
transId:'dd',
bizOrderAmount:3,
realAmount:99,
benefitAmount:1
       },{
totalBenefitAmount:1,
cityCode:'2334',
lineName:'xxxx',
bizTime:'2019',
transId:'dd',
bizOrderAmount:3,
realAmount:99,
benefitAmount:1
       },{
totalBenefitAmount:1,
cityCode:'2334',
lineName:'xxxx',
bizTime:'2019',
transId:'dd',
bizOrderAmount:3,
realAmount:99,
benefitAmount:1
       }]
     }}
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR  && originData.data) {
      return {
        success: true,
        data: originData.data,
        message:originData.sub_msg || originData.msg
      }
    }

    return {
      success: false,
      message:originData.sub_msg || originData.msg
    }
  },
   getRefundOrder: async (orderNo) => {
    const originData = await request(`/operation-order/benefitCard/getRefundOrder?orderNo=${orderNo}`,{}, {
      on: mock,
     data: {
       code:'20000',
       data:{
      "refundOrderNo": "r20191210120045288236",
    "orderNo": "20191210120025233458",
    "refundAmt": 0.01,
    "refundStatus": 1,
    "refundReason": "自动退款",
    "refundTime": "2019-12-10 12:00:48",
    "gmtCreate": "2019-12-10 12:00:46",
    "gmtModified": "2019-12-10 12:00:48"
       }}
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR  && originData.code=='20000') {
      return {
        success: true,
        data: originData.data,
        message:originData.sub_msg || originData.msg
      }
    }

    return {
      success: false,
      message:originData.sub_msg || originData.msg
    }
  },
}

