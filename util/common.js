
const qs = {
  parse: function(str) {
    if (!str || str.length == 0) return {}
    let list = str.split('&')
    if (!list || list.length == 0) return {}
    let out = {}
    for (let index = 0; index < list.length; index++) {
      let set = list[index].split('=')
      set && set.length > 1 && (out[set[0]] = decodeURIComponent(set[1]))
    }
    return out
  },
  stringify: function(data) {
    if (!data) return ''
    let list = []
    for (let key in data) {
      if (data[key] instanceof Array && data[key].length) {
        data[key].forEach(t => {
          list.push(key + '=' + encodeURIComponent(t))
        })
      }
      else {
        list.push(key + '=' + encodeURIComponent(data[key]))
      }
    }
    return list.join('&')
  }
}

function intValue(num) {
  var MAX_VALUE = 0x7fffffff;
  var MIN_VALUE = 0x00;//-0x80000000;  
  if (num > MAX_VALUE || num < MIN_VALUE) {
    return num &= 0x7FFFFFFF;
  }
  return num;
}
function isNull(str) {
  return str === undefined || str === null || str === '' || str.length === 0
}

export default {
  qs,
  getSystemInfoSync: () => {
    return new Promise((resolve, reject) => {
      my.getSystemInfo({
        success: (res) => {

          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  getStorageSync: ({ key }) => {
    return new Promise((resolve, reject) => {
      my.getStorage({
        key: key,
        success: (res) => {

          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  setStorageSync: ({ key,data }) => {
    return new Promise((resolve, reject) => {
      my.setStorage({
        key,
        data,
        success: (res) => {

          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  makeUrl: (url, data) => {
    let index = url && url.indexOf('?')
    return index && index > -1 ? url + "&" + qs.stringify(data) : url + "?" + qs.stringify(data)
  },
  hashCode: (strKey) => {
    var hash = 0;
    if (!isNull(strKey)) {
      for (var i = 0; i < strKey.length; i++) {
        hash = hash * 31 + strKey.charCodeAt(i);
        hash = intValue(hash);
      }
    }
    return hash.toString(16);
  },

  sleep: (time) => {

    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {

          resolve()
        }, time || 1000)
      } catch (e) {
        reject(e);
      }
    });
  },
  replaceJSON: (json, config = {}) => {
    let keys = config && Object.keys(config)
    let jsonString = typeof json === 'string' ? json : JSON.stringify(json)
    keys && keys.forEach((key) => {
      // /需要替换的字符串/g  var patt1=new RegExp("e");
      let keyName = new RegExp(`{${key}}`, 'g')
      config[key] && jsonString.indexOf(keyName) && (jsonString = jsonString.replace(keyName, config[key]))
    })
   let jsonObject = jsonString.indexOf("{") > -1 && jsonString.indexOf('}') > -1 && JSON.parse(jsonString)
    return jsonObject
  },
  handleNavigate: async (options, app) => {
    app = app || getApp()
    console.log('跳转', options.url_type, options.url_path)
    try {
      switch (options.url_type) {
        case 'selfWebview':
          let url_path = '/pages/webview/webview?url=' + encodeURIComponent(options.url_path)
          my.navigateTo({
            url: url_path
          })
          break
        case 'self':
          my.navigateTo({
            url: options.url_path
          })
          break
        case 'balanceSmkOut':
          console.log('跳转查看余额', app.account, app.data.account)
          if (!app.data.account) {
            await app.getAccount()
          }
          app.specialUrl = `${options.url_path}?status=${app.account.status}&money=${app.account.wmoney}`
          my.call('startApp', {
            appId: '20000067',
            param: {
              url: app.specialUrl,
              chInfo: 'ch_2019031163539131'
            }
          })
          break
        case 'balanceSmk':
          console.log('跳转查看余额', app.account, app.data.account)
          if (!app.data.account) {
            await app.getAccount()
          }
          app.specialUrl = `${options.url_path}?status=${app.account.status}&money=${app.account.wmoney}`
          my.navigateTo({
            url: `/pages/webview/webview?special=1`
          })
          break
        case 'smk': {
          let url = options.url_path ? options.url_path.split('?') : options.url_path
          if (url.length > 1) {
            app.specialUrl = `${options.url_path}&token=${app.token}&channel=${app.channel}`
          } else {
            app.specialUrl = `${url}?token=${app.token}&channel=${app.channel}`
          }
          my.navigateTo({
            url: `/pages/webview/webview?special=1`
          })
        }
          break
        case 'smkOut': {
          let url_path = options.url_path
          if (url_path.indexOf('{userId}') > -1) {
            url_path = url_path.replace('{userId}', app.alipayId)
          }
          if (url_path.indexOf('{appId}') > -1) {
            url_path = url_path.replace('{appId}', app.appId)
          }

          if (url_path.indexOf('{formId}') > -1) {
            await app.getFormId()
            app.formId && (url_path = url_path.replace('{formId}', app.formId))
          }
          if (url_path.indexOf('{cityCode}') > -1) {
            url_path = url_path.replace('{cityCode}', app.cityInfo.cityCode)
          }
          if (url_path.indexOf('{cityName}') > -1) {
            url_path = url_path.replace('{cityName}', app.cityInfo.cityName)
          }

          let url = url_path ? url_path.split('?') : url_path

          if (url.length > 1) {
            app.specialUrl = `${url_path}&token=${app.token}&channel=${app.channel}`
          } else {
            app.specialUrl = `${url}?token=${app.token}&channel=${app.channel}`
          }
          my.call('startApp', {
            appId: '20000067',
            param: {
              url: app.specialUrl,
              chInfo: 'ch_2019031163539131'
            }
          })
          console.log('startApp 20000067', app.specialUrl)
        }
          break
        case 'startApp':{
          let url_data = options.url_data || {}
            if (typeof url_data === 'string' && url_data.indexOf('{') >= 0) {
              try {
                url_data = JSON.parse(url_data)
              } catch (err) {
                console.warn(err)
              }
          }
        let url_path = options.url_path
         if (url_path) {              
              if (url_path.indexOf('{userId}') > -1) {
                url_path = url_path.replace('{userId}', app.alipayId)
              }
              if (url_path.indexOf('{appId}') > -1) {
                url_path = url_path.replace('{appId}', app.appId)
              }
              if (url_path.indexOf('{formId}') > -1) {
                await app.getFormId()
                app.formId && (url_path = url_path.replace('{formId}', app.formId))
              }
              if (url_path.indexOf('{cityCode}') > -1) {
                url_path = url_path.replace('{cityCode}', app.cityInfo.cityCode)
              }
              if (url_path.indexOf('{cityName}') > -1) {
                url_path = url_path.replace('{cityName}', app.cityInfo.cityName)
              }             
          }
          let param = { 
            chInfo:'ch_'+app.appId           
          }
          
          options.appId =   options.appId || options.url_remark || '20000042'
          if( options.appId==='20000042') {
            param.publicBizType =  options.publicBizType ||  'LIFE_APP'
            param.publicId =  options.publicId || '2018052160219015'
           
          }        
          Object.assign(param,url_data)
          url_path && (param.url = url_path)
          console.log('startApp',param)

          my.call('startApp', {
            appId: (options.appId ),
            param
            /*param: {
              publicBizType: options.publicBizType,
              publicId: options.publicId,
              chInfo: options.chInfo
            }*/
          })
        }
          break
        case 'alipay':
          console.log(options.url_path)
          my.ap.navigateToAlipayPage({
            path: options.url_path,
            fail: (err) => {
              my.alert({
                content: JSON.stringify(err)
              })
            }
          })
          break
        case 'miniapp':
          // console.log('跳转', options)
          {
            let url_data = options.url_data || {}
            if (typeof url_data === 'string' && url_data.indexOf('{') >= 0) {
              try {
                url_data = JSON.parse(url_data)
              } catch (err) {
                console.warn(err)
              }
            }
            if (url_data && url_data.url) {
              let url_path = url_data.url
              if (url_path.indexOf('{userId}') > -1) {
                url_path = url_path.replace('{userId}', app.alipayId)
              }
              if (url_path.indexOf('{appId}') > -1) {
                url_path = url_path.replace('{appId}', app.appId)
              }
              if (url_path.indexOf('{formId}') > -1) {
                await app.getFormId()
                app.formId && (url_path = url_path.replace('{formId}', app.formId))
              }
              if (url_path.indexOf('{cityCode}') > -1) {
                url_path = url_path.replace('{cityCode}', app.cityInfo.cityCode)
              }
              if (url_path.indexOf('{cityName}') > -1) {
                url_path = url_path.replace('{cityName}', app.cityInfo.cityName)
              }
              url_data.url = url_path
            }
            console.log('miniapp跳转', options.url_remark, options.url_path, url_data)
            my.navigateToMiniProgram({
              appId: options.url_remark,
              path: options.url_path,
              extraData: url_data,
              //envVersion: 'develop'
              //envVersion:options.envVersion
            })
          }
          break
        case 'h5Out': {
          let url = options.url_path
          if (url.indexOf('{userId}') > -1) {
            url = url.replace('{userId}', app.alipayId)
          }
          if (url.indexOf('{appId}') > -1) {
            url = url.replace('{appId}', app.appId)
          }
          if (url.indexOf('{formId}') > -1) {
            await app.getFormId()
            app.formId && (url = url.replace('{formId}', app.formId))
          }
          if (url.indexOf('{cityCode}') > -1) {
            url = url.replace('{cityCode}', app.cityInfo.cityCode)
          }
          if (url.indexOf('{cityName}') > -1) {
            url = url.replace('{cityName}', app.cityInfo.cityName)
          }
          my.call('startApp', {
            appId: '20000067',
            param: {
              url: url,
              chInfo: 'ch_2019031163539131'
            }
          })
          console.log('startApp 20000067', url)
        }
          break
        case 'none':
        case '':
          break
        default:
          break
      }
    } catch (err) {
      console.error(err)
    }

  },
  //通过杭州通外跳
  judgeNavigate: async (options, app) => {
    app = app || getApp()
    await app.loadUserId()

    // console.log('直接跳转出去', `https://life.96225.com/city/index.html?from=singlemessage&isappinstalled=0#/activeDetial?id=${options.id}&token=${app.token}&channel=${app.channel}`)
    switch (options.type) {
      case 'h5Out': {
        let url_path = options.url
        if (url_path.indexOf('{userId}') > -1) {
          url_path = url_path.replace('{userId}', app.alipayId)
        }
        if (url_path.indexOf('{appId}') > -1) {
          url_path = url_path.replace('{appId}', app.appId)
        }

        if (app.formId && url_path.indexOf('{formId}') > -1) {
          url_path = url_path.replace('{formId}', app.formId)
        }
        if (url_path.indexOf('{cityCode}') > -1) {
          url_path = url_path.replace('{cityCode}', app.cityInfo.cityCode)
        }
        if (url_path.indexOf('{cityName}') > -1) {
          url_path = url_path.replace('{cityName}', app.cityInfo.cityName)
        }

        my.call('startApp', {
          appId: '20000067',
          param: {
            url: url_path,
            chInfo: 'ch_2019031163539131'
          }
        })
      }
        break
      case 'smkOut':
        if (!app.token) app.token = 'null'
        my.call('startApp', {
          appId: '20000067',
          param: {
            url: `https://life.96225.com/city/index.html?from=singlemessage&isappinstalled=0#/activeDetial?id=${options.id}&token=${app.token}&channel=${app.channel}`,
            chInfo: 'ch_2019031163539131'
          }
        })
        break
      case 'startApp':
        my.call('startApp', {
          appId: (options.appId || '20000042'),
          param: {
            publicBizType: options.publicBizType,
            publicId: options.publicId,
            chInfo: options.chInfo
          }
        })
        break
      case 'alipay':
        console.log(options.url)
        my.ap.navigateToAlipayPage({
          path: options.url,
          fail: (err) => {
            my.alert({
              content: JSON.stringify(err)
            })
          }
        })
        break
      case 'miniapp':
        my.navigateToMiniProgram({
          appId: options.remark,
          path: options.url,
          extraData: options.data || {}
        })
        break
      default:
        break
    }
  },
  checkUpdate: () => {
    try {
      if (my.canIUse('getUpdateManager')) {

        const updateManager = my.getUpdateManager()
        updateManager.onCheckForUpdate(function(res) {
          // 请求完新版本信息的回调
          console.log(res.hasUpdate)
        })
        updateManager.onUpdateReady(function() {
          my.confirm({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })

        updateManager.onUpdateFailed(function() {
          // 新版本下载失败
        })
      }
    } catch (err) {
      console.error(err)
    }
  },
  crossImage: function(src,opt={} )  {
if (!src){
return "";
}
let {width,height} = opt
let distImage =src
if(src.indexOf('noOssProcess')==-1){
if (src.indexOf('aliyuncs.com')>-1 || src.indexOf('images.allcitygo.com')>-1){
  if(src.indexOf('http://')>-1 ) src = src.replace('http://','https://')
let  ossProcess =  width?`?x-oss-process=image/resize,m_fill,h_${height||width},w_${width}/format,webp`:'?x-oss-process=image/format,webp';
distImage  =  `${src}${ossProcess}`;
}
}



return distImage;
}

}