import Store from './store'
import { setEnv } from '/util/env'
import Tracker from '@tklc/miniapp-tracker-sdk'
import common from '/util/common'
import appVersion from './version.json'
import { getUserId, config } from '/util/service'
import {ext as extJson} from "./ext.json"
//const extJson = my.getExtConfigSync()
const env = extJson.env
config({
  appId: extJson.appId,
  hostBaseUrl: env === 'sit' ? 'https://sit-basic-ug.allcitygo.com' : 'https://ztmanage.allcitygo.com:8192'
})
App(
  Store({    
    env: null,  
    extJson,
    replaceConfig: {},
    async onShow(options) {
      const { query, scene } = options
      scene && (this.scene = scene)
      console.log('onShow', options)
    },

    async onLaunch(options) {
      const { query, scene, referrerInfo } = options
      if(query&&query.remove) {
        my.removeStorage({
          key: 'access_token',
          success: function(){}
        });
      }
      Tracker.App.init({
        //appId: '',// 区别不同小程序，可用小程序自己的appId
        server: ['https://webtrack.allcitygo.com:8088/event/upload'],
        version: appVersion.version + '@' + appVersion.date,
        lauchOpts: options,
        stat_auto_click: true,
        appName: extJson.appName,
        appId: extJson.appId,
        //bizScenario: (query && query.bizScenario) || scene || (referrerInfo && referrerInfo.appId) || "",
        mtrDebug: false
      }, this)
      this.scene = scene
      // const extJson = my.getExtConfigSync() // ext.ext // my.getExtConfigSync()   //
      console.log('小程序配置信息', extJson)
      this.extJson = extJson
      this.env = extJson.env
      setEnv(extJson.env)
      this.appId = extJson.appId

      this.replaceConfig = {   
        appId: this.appId,
        appName: extJson.appName     
      }
      extJson.replaceConfig && (this.replaceConfig = Object.assign(this.replaceConfig, extJson.replaceConfig))



      common.checkUpdate()

      await this.loadUserId()

    },
    onError(error) {
      console.error(error)
    },
   
    setUserId(alipayId) {
      this.alipayId = alipayId 
    },
    async loadUserId() {   
      if (!this.alipayId) {
        let userId = await getUserId()
        this.alipayId = userId
        return { success: userId || false }
      }

      return { success: false }
    },
   
  
    onSubmit(e) {
      if (e.detail && e.detail.formId) {
        console.log("formId", e.detail.formId)
        this.formId = e.detail.formId
      }
    },
    async getFormId() {
      if (this.formId) {
        return this.formId
      } else {
        await common.sleep(100)
        return this.formId
      }
    },
    handleIconClick(e) {
      console.log('handleClick', e.currentTarget.dataset)
      if (e.detail && e.detail.formId) {
        console.log("formId", e.detail.formId)
        this.formId = e.detail.formId
      }
      let obj = e.currentTarget.dataset.obj
      if (!obj) {
        console.warn('handleClick dataset obj is undefine')
        return
      }
      let seedName = e.currentTarget.dataset.seedName || obj.seedName || obj.icon_name || obj.text || obj.text_content || obj.mid_text_content || obj.name || obj.url_path || '点击[未命名]'
      let { url_type,
        url_path,
        url_data,
        url_remark,
      } = obj
      let target = {
        seedName,
        url_type,
        url_path,
        url_data,
        url_remark,
      }
      let hashCode = 'h_' + common.hashCode(seedName)
      console.log("Tracker handleClick", seedName, hashCode)  
      my.reportAnalytics(hashCode, target);
      this.handleNavigate(obj)
    },
    async handleNavigate(options) {
      common.handleNavigate(options, this)
    }
  }),
)
