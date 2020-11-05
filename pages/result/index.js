const app = getApp()

import store from './store'

const createPage = function(options) {
  return Page(store.register(options))
};
createPage({
  data: {
   code :-1,
   msg1:"结果",
   msg2:"服务异常",
   buttonText:"查看权益卡"

  },
  async onLoad(qurey) {
    app.Tracker.Page.init()   
     // my.hideBackHome();
    let {code ,message, id} = qurey || {}
    console.log('onLoad',qurey)
    let msg1,msg2,result,title,buttonText
    if(code=='0') {
      msg1 = "支付金额"
      result = "success"
      title="支付成功"  
      buttonText= "查看权益卡"
      msg2 = "¥ "+message
    }else if(code=='9') {
      msg1 = "退卡结果"
      result = "success"
      title="退卡结果"  
      buttonText= "返回"
      msg2 = message || "系统开小差了,请稍后再试"
    }else{
      msg1 = "失败原因"
     result = "fail"
     title="支付失败" 
     buttonText= "重新购买"
     msg2 = message || "系统开小差了,请稍后再试"
    }
   
    this.setData({code,result,msg1,msg2,buttonText,id})
     my.setNavigationBar({
        title
     });

  },
  async onShow() {
  
  },
  

  onAppear(e) {
    //type "appear"
    console.log("onAppear", e)
  },
  onSubmit(e){
 console.log("onSubmit", e)
 let code = this.data.code
  if(code==='0'){
     my.redirectTo({
            url: "/pages/myJourneyCard/myJourneyCard"
     })
  }else if(code==='9'){
      my.navigateBack()
  }else {
    my.navigateBack({
      
    });
  }

},
 events: {
    onBack() {
      console.log('onBack');
     
    },
  },

});
