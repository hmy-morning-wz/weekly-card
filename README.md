# install
npm install @tklc/miniapp-tracker-sdk --registry=http://10.0.0.122:7001
启用 component2 编译

# UI
https://lanhuapp.com/web/#/item/project/board?pid=d2a65e7b-d6d8-40f3-975d-6d8c2e5a15a1

# 接口文档
见API-DOC.md

#webview 跳转url带userId方法

例子:
url='/pages/webview/webview?url='+encodeURIComponent('https://www.taobao.com/#test?userId={userId}&appId={appId}')
   
   
/pages/webview/webview?url=https%3A%2F%2Fwww.taobao.com%2F%23test%3FuserId%3D%7BuserId%7D%26appId%3D%7BappId%7D
 self
{userId} 会被替换



# 埋点说明
页面加载埋点自动，需每个page init

点击埋点 xml配置
~~~
<view class="service-item" a:for="{{my_service_icon.ele_icons}}" >
                <image class="icon-logo" src="{{item.icon_img}}" mode="widthFix"  
                data-group="卡面" data-index="{{index}}"
                data-obj="{{item}}" 
                onTap="handleIconClick"/>
                <text class="text">{{item.icon_name}}</text>
            </view>
~~~
 data-obj  里要带 icon_name ，url_path，url_type，url_data，url_remark， 点击事件会传过去

data-group="卡面" data-index="{{index}}"

page js 方法
~~~
const app = getApp()
createPage({
....
,
  async onLoad() {
    app.Tracker.Page.init() //埋点init 每个page都需要，自动埋页面onShow事件
    ,
  handleIconClick(e){
    app.handleIconClick(e)
  },
  ....
~~~

app.js 统一封装
~~~
 handleIconClick(e) {
      console.log('handleClick', e.currentTarget.dataset)

      this.handleNavigate(obj)
    },
    async handleNavigate(options) { //跳转
 ....
    }
   

~~~

组件里面:

didMount() {
    getApp().Tracker.Component.init(this)
    ....





# 产品原型

