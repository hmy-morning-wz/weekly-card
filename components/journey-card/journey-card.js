import common from '/util/common'
import moment from 'moment'
Component({
  mixins: [],
  data: {
    showTip:0
  },
  props: {item:{}},
  deriveDataFromProps(nextProps) {
       let {item} = nextProps || this.props
    let {productName,mainHueValue,mainMerchantName,effectTime,saleRule,endTime,tip2,effect,remainingDays,productCoverUrl,saleNote} = item

    console.log("deriveDataFromProps item",item)
    effectTime =  effectTime && moment(effectTime).format('YYYY.MM.DD HH:mm')
    endTime =  endTime && moment(endTime).format('YYYY.MM.DD  HH:mm') 
    let effectPeriod = effectTime + " ~ " + endTime
    let image = productCoverUrl &&  (common.crossImage(productCoverUrl,{width:592,height:332} ))
    this.setData( {productName,mainHueValue,mainMerchantName,effectTime,saleRule,tip2,effect,effectPeriod,remainingDays,productCoverUrl,image,saleNote})
    //已生效 剩余7日
    // xxxxx 生效
    //失效 ： xxxxx ~xxxxx
    //（0：未生效；1：已生效；2：已失效）
    //评价中累计优惠了 xxx
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
     showTip1(){
       this.setData({showTip:0})
     },
     showTip2(){
        this.setData({showTip:1})
     
     },
  },
});
