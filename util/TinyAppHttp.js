
const HOST_BASE_URL ='https://ztmanage.allcitygo.com:8192'//'https://sit-basic-ug.allcitygo.com'//sit-tcapp-gateway.allcitygo.com'// 'http://172.31.254.206:5002'// 'https://ztmanage.allcitygo.com:8192' // 'https://sit-basic-ug.allcitygo.com'
const APP_VERSION = '1.0.0'


const TAG = '[REQUEST]'


const TIMEOUT = 10000;

function logger(tag, ...payload) {
    console.debug(`%c ${TAG}[${tag}]`, 'color: #9E9E9E; font-weight: bold', ...payload);
}

const qs= {
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
      if(data[key] instanceof Array  &&data[key].length ){
             data[key].forEach(t=>{
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

/**
 * 获取用户的Token信息并发送异步求情
 * @param {*} config
 * _request_ 的第一个参数必须是url
 */
function _request_(config) {
    let {
        url,
        method,
        data,
        headers,
        timeout,
    } = config;
    
    headers = Object.assign(getHeader(config), headers)
    if (headers['content-type'] && headers['content-type'].indexOf('application/json') > -1) {
        data = JSON.stringify(data)
    }

    logger('my.request', method, url, headers, data);

    let t0 = +Date.now()
    return new Promise((resolve, reject) => {
        try {
            my.request({
                url,
                method,
                headers,
                data,
                timeout: timeout || TIMEOUT,
                success: res => {
                    let t1 = +Date.now()
                    let spendTime = t1 - t0
                    logger('my.request spendTime', url, spendTime);
                    if (spendTime > 2000) {
                        let app = getApp()
                        app.Tracker && app.Tracker.calc('request_spendTime_long', spendTime,{url})
                    }
                    resolve(res.data);
                },
                fail: error => {
                    //{data: {…}, headers: {…}, status: 400, error: 19, errorMessage: "http status error"}
                    //status: 401
                    console.warn(TAG + "request fail", url)
                    //let app = getApp()
                    //app.Tracker && app.Tracker.err('api_fail',{...error,url})
                    if(error.status===401 || error.status===403){
                        return  resolve({code:"401"});
                    }
                    reject(error);
                },
                complete: () => {


                }
            })
        } catch (e) {
            console.warn(TAG + "request catch error", e)
            reject(e);
        }
    });
}

class InterceptorManager {
    constructor() {
        this.handlers = [];
    }

    use(fulfilled, rejected, autoAddAuth = false) {
        this.handlers.unshift({
            fulfilled: fulfilled,
            rejected: rejected,
            isAutoAuth: autoAddAuth
        });
        return this.handlers.length - 1;
    }

    forEach(fn) {
        const newHandles = [];
        this.handlers.forEach(h => {
            if (h !== null) {
                fn(h);
            }
            /*
              if (!h.isAutoAuth) {
                newHandles.push(h);
              }*/
        });
        this.handlers = newHandles;
    }
}


function silenceAuthCode() {
    return new Promise((resolve, reject) => {
        try {
            my.getAuthCode({
                scopes: 'auth_base',
                success: (res) => {
                    resolve(res);
                },
                fail: (e) => {
                    reject(e);
                    /*
                      my.alert({
                          title: '授权失败，请稍后再试',
                          complete: () => reject(res)
                      });
                      */
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

function getSystemInfoSync() {
   return new Promise((resolve, reject) => {
      my.getSystemInfo({
        success: (res) => {
           
          resolve(res)
        },
        fail:(err)=>{
          reject(err)
        }
      })
    })   
  }

function sleep(time) {
    logger('sleep', time)
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                logger('sleep timeout')
                resolve()
            }, time || 1000)
        } catch (e) {
            reject(e);
        }
    });
}

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (e) {
    var t = 16 * Math.random() | 0,
        r = 'x' === e ? t : 3 & t | 8;
    return r.toString(16);
  });
}
 function makeUrl(url,data){     
     let index = url && url.indexOf('?')      
     return index && index>-1?  url + "&"+qs.stringify(data): url + "?"+qs.stringify(data)
  }


function getHeader(data = {}) {   
    let  APP_ID = data.appId || getApp().appId
    if( !APP_ID ) {
       const {appId} =  (my.canIUse('getAppIdSync')  &&  my.getAppIdSync() ) || {}
       APP_ID = appId
       console.log("APP_ID",APP_ID)
    }

    let res = {
        'content-type': 'application/json',
        // 'Authorization': 'Bearer '+data.access_token,
        'app_id': APP_ID ,
        'app_version': data.appVersion || APP_VERSION, //$global.appVersion 
        'device_id': data.deviceId ,
        'device_os': data.platform ,
        'device_name': data.model ,
    }
    if (data.access_token) {
        res.access_token = data.access_token
        res.Authorization = 'Bearer ' + data.access_token
    }
    return res
}


function getStorageSync({key}) {
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
}

async function loadToken() {
    let res = await getStorageSync({key: 'access_token'})
    let now = +Date.now()
    if (res  && res.data && res.data.success&&  res.data.expireTime > now) {
       /* let app = getApp()
        app.setUserId && app.setUserId(res.data.open_user_id)
        app.alipayId = res.data.open_user_id
        app.Tracker && app.Tracker.setUserId(res.data.open_user_id)*/
        logger('loadToken success', res.data.expireTime);
        return res.data
    } else {
        logger('loadToken none',res);
        return {
            success: false
        }
    }
}


export default class TinyAppHttp {
    constructor(instanceConfig) {
        /*
        * instanceConfig 参数
        * bizCode NOTNULL
        * exitAppWhenRefuseAuth Boolean 拒绝授权时退出app
        */
        // if (!instanceConfig.bizCode) {
        //   throw new Error('bizCode不可以为空');
        // }
        this.ready = false
        this._request_id = 0        
        this.defaults = Object.assign(
            {
                // exitAppWhenRefuseAuth: false,
                autoToken: true,
            },
            instanceConfig
        );
        this.hostBaseUrl = instanceConfig && instanceConfig.hostBaseUrl || HOST_BASE_URL
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        };
        this.sendList = []
        this.request_token_err = 0
        this.do_request_token = false
        this.request_token_time = 0
        this._request_err = 0
        this.systemInfo  = {}
        setTimeout(()=>{
            this.start()
        },100)      

    }

async _refresh_token(config = {}) {
        logger('------正在刷新token------');

        try {
            if(this.token &&this.token.success ){
            let {refresh_token}= this.token
            let res = await _request_({
                url: this.hostBaseUrl + '/auth/refresh_token',
                method: 'POST',
                data: {refresh_token: refresh_token},
                ... config
            })
            //{"code":"0","data":{"access_token":"60A7845C11506C457419D0547BA77F44","refresh_token":"87C0532BE47DF258B71EC9925F382487","expires_in":604800,"token_type":"","scope":"","open_user_id":"2088702372862094"},"msg":"","biz_suc":true,"suc":true,"message":""}
            // {"code":"0","data":{"access_token":"348CFE2736B6BADBCEE7B4A0FBA0B721","refresh_token":"348CFE2736B6BADBCEE7B4A0FBA0B721","expires_in":604800,"token_type":"","scope":""},"msg":"","biz_suc":true,"suc":true,"message":""}
            if (res && res.code === '0' && res.data) {
                logger('------_refresh_token access_token success------');
                let result = res.data
                result.timestamp = +Date.now()
                let expires_in = result.expires_in || 3600
                result.expireTime = result.timestamp + ((expires_in - 600) * 1000)
                result.success = true
                //open_user_id
                let app = getApp()
                app.setUserId && app.setUserId(res.data.open_user_id)
                app.alipayId = result.open_user_id           
                let Tracker = app.Tracker || $global.Tracker               
                Tracker && Tracker.setUserId(result.open_user_id)
                //logger('access_token success',result);
                my.setStorage({key: 'access_token', data: result})

                return result
            }else {
                 let app = getApp()
                 //app.Tracker && app.Tracker.err('/auth/refresh_token',{...res})
            }
            }
       
        } catch (e) {          
            console.warn(TAG + "_refresh_token error", e)
        }
    }


    async _request_token(config={}) {
        logger('------正在进行授权------');
        let t0 = Date.now()
        try {
            if (this.request_token_err >= 10) {
                logger('_request_token 错误次数太多');
                if(Date.now()-this.request_token_time>60000){
                    this.request_token_err = 0
                }
                return
            }
            if(this.do_request_token){
                logger('_request_token 正在授权中');
                await sleep(1000)
                return  await loadToken()
            }
            this.request_token_time = +Date.now()

            this.do_request_token = true
            let silenceRes = await silenceAuthCode();
            const {authCode} = silenceRes;
            logger('------静默授权成功------');
            let res = await _request_({
                url: this.hostBaseUrl + '/uaa/open/alipay_auth_login?authcode='+authCode,
                method: 'POST',
                data: {authcode: authCode},
                ... config
            })
            //{"code":"0","data":{"access_token":"60A7845C11506C457419D0547BA77F44","refresh_token":"87C0532BE47DF258B71EC9925F382487","expires_in":604800,"token_type":"","scope":"","open_user_id":"2088702372862094"},"msg":"","biz_suc":true,"suc":true,"message":""}
            // {"code":"0","data":{"access_token":"348CFE2736B6BADBCEE7B4A0FBA0B721","refresh_token":"348CFE2736B6BADBCEE7B4A0FBA0B721","expires_in":604800,"token_type":"","scope":""},"msg":"","biz_suc":true,"suc":true,"message":""}
            if (res && res.code === '0' && res.data) {
                logger('------alipay_auth_login access_token success------');
            
                let result = res.data
                result.timestamp = +Date.now()
                let expires_in = result.expires_in || 3600
                result.expireTime = result.timestamp + ((expires_in - 600) * 1000)
                result.success = true
                //open_user_id
                let app = getApp()
                app.setUserId && app.setUserId(res.data.open_user_id)
                app.alipayId = result.open_user_id
                //app.Tracker && app.Tracker.setUserId(result.open_user_id)
                 let Tracker = app.Tracker || $global.Tracker               
                 Tracker && Tracker.setUserId(app.alipayId)
                //logger('access_token success',result);
                my.setStorage({key: 'access_token', data: result,success:()=>{
                   let t1 = Date.now()
                   logger('------alipay_auth_login access_token setStorage success------',(t1-t0));
                }})

                

                this.do_request_token = false
                return result
            } else {
                this.request_token_err++
                //let app = getApp()
                //app.Tracker && app.Tracker.err('/uaa/open/alipay_auth_login',{...res})
            }
            this.do_request_token = false
        } catch (e) {
            this.request_token_err++
            this.do_request_token = false
            console.warn(TAG + "_request_token error", e)
        }
    }

    logger(tag, _request_id, ...payload) {
        console.debug(`%c${TAG}[%d][${tag}]`, 'color: #9E9E9E; font-weight: bold', _request_id, ...payload);
    }


    autoAddLogger(config) {
        this.interceptors.request.use(
            async request => {
                this.logger('interceptors request', config._request_id, request);
                return request;
            },
            error => {
                return Promise.reject(error);
            }
        );
        this.interceptors.response.use(
            async response => {
                this.logger('interceptors response', config._request_id, response);

                //my.hideLoading({});
                return response;
            },
            error => {
                this.logger('interceptors response error', config._request_id, error);
                 //my.hideLoading({});
                return Promise.reject(error);
            }
        );
    }
    async config(config){
       this.defaults = Object.assign(
          this.defaults || {},
            config
        ); 
     if(  this.defaults.hostBaseUrl) this.hostBaseUrl = this.defaults.hostBaseUrl
    }

    async start() {
        try {
            if (!this.ready) {
                let systemInfo =  await getSystemInfoSync()
                let ret =  await getStorageSync({key:'deviceId'})
                if(ret  && ret.data ){
                  systemInfo.deviceId = ret.data
                }else {
                  systemInfo.deviceId = guid()
                  my.setStorage({
                    key: 'deviceId',  
                    data: systemInfo.deviceId,  
                    success: (res) => {
                      
                    },
                  });
                }
                this.systemInfo  = systemInfo
                 
                //await sleep(10000)
                if ((!this.token) || (!this.token.success)) {
                    let response = await loadToken();
                    this.token = response || {}
                }
                if ((!this.token) || (!this.token.success)) {
                    this.logger('in funcation start() token false or not success so do _request_token L463',0);
                    let response = await this._request_token({...systemInfo, ...this.defaults});
                    this.token = response || {}
                }               
                 let userId = this.token && this.token.open_user_id
                 if(userId){
                 this.logger('start userId', 0, userId);
                 let app = getApp()
                 app.setUserId && app.setUserId(userId)
                 app.alipayId =userId  
                 let Tracker = app.Tracker || $global.Tracker               
                 Tracker && Tracker.setUserId(userId)
                 }
            }
        } catch (e) {
            console.error(TAG, e)
        }
        //let res = await this._refresh_token({...this.systemInfo, ...this.defaults})
        this.ready = true
        this.logger('start ready ',0);
        this.requestList(1)
        return this.ready
    }

    async getUserId(){
        let token = await  this.getToken()
        return token && token.open_user_id
    }

    async getToken(){
        try {

            //await sleep(10000)
            if ((!this.token) || (!this.token.success)) {
                let response = await loadToken();
                this.token = response || {}
            }
            if ((!this.token) || (!this.token.success)) {
                this.logger('in funcation getToken() token flase or not success or _request_err so do _request_token',0,this.token);
                let response = await this._request_token(this.systemInfo);
                this.token = response || {}
            }

        } catch (e) {
            console.error(TAG, e)
        }
        return this.token
    }

    requestList(len) {
        try {
            let that = this
            let count = 0
            this.logger('start sendList ', 0, this.sendList.length);
            while (this.sendList && this.sendList.length) {
                let send = this.sendList.shift()
                let {config, resolve, reject} = send

                that.request(config).then(
                    res => {
                        resolve(res)
                    },
                    err => {
                        reject(err)
                    }
                )
                /*     send && send.then(res => {
                         return that.request(res)
                     })*/
                count = count + 1
                if (len && count >= len) break
            }
        } catch (e) {
            console.error(TAG, e)
        }

    }

    _request(config) {
        return new Promise((resolve,reject)=>{
            this.sendList.push({config,resolve,reject})
        })
    }


    autoAddAuthorization(config) {
        this.interceptors.request.use(
            async request => {
                //this.logger('Authorization', config._request_id);
                try {                      
                  
                    if ((!this.token) || (!this.token.success)) {
                        let response = await loadToken();
                        this.token = response || {}
                    }
                    if ((!this.token) || (!this.token.success) ||  (this._request_err>10)) {
                        this.logger('token flase or not success or _request_err so do _request_token');
                        this._request_err = 0
                        let response = await this._request_token(config);
                        this.token = response || {}
                    }
                } catch (e) {
                    console.error(TAG, e)
                }
                 if(this.do_request_token){
                               this.logger('RefreashToken', config._request_id, "request await");
                               await sleep(3000)
                        }
                if (this.token && this.token.success) {
                    request.access_token = this.token.access_token
                }
                return request;
            },
            error => {
                return Promise.reject(error);
            }
        );
        this.interceptors.response.use(
            async response => {
                if (response) {
                    let {
                        code
                    } = response;
                    try {
                        if (code === '401' || code === '403' ) {                            
                            this.logger('RefreashToken', config._request_id, response);
                            if(this.do_request_token){
                               this.logger('RefreashToken', config._request_id, "await");
                               await sleep(3000)
                            }else {
                            this.logger('code  401 or 403  so do _request_token L463');
                            let res = await this._request_token()
                            this.token = res || {}
                            }
                            if (this.token && this.token.success) {
                                config.access_token = this.token.access_token
                                let ret = await _request_(config);
                                 this.logger('RefreashToken', config._request_id, '_request_ again');
                                return ret;
                            }else {
                              this.logger('RefreashToken', config._request_id, '_request_token fail');
                            }
                        }
                    } catch (e) {
                        console.warn(TAG + "RefreashToken catch error", e)
                    }
                    this.requestList(1)
                }

                return response
            },
            error => {
                this._request_err++
                this.requestList(1)
                return Promise.reject(error);
            }
        );
    }


    dispatchRequest(config) {
        //let that = this
        // 这里是请求的真正发起地方返回promise
        return _request_(config).then(
            response => {

                return response;
            },
            reason => {

                return Promise.reject(reason);
            }
        );
    }


    request(config) {
        try {

            if (typeof config === 'string') {
                config = {};
                config.url = arguments[0];
            } else {
                config = config || {};
            }
            config._request_id = this._request_id++

            // 参数结构({url: '', data: {}, method: '', headers: {}})
            const {businessConfig} = config;
            // 合并参数
            config = {... this.systemInfo, ...this.defaults, ...config};
            config.method = config.method ? config.method.toLowerCase() : 'get';
            config.headers = businessConfig.headers || {};
            if(config.method === 'get' ){             
              if(config.data && typeof config.data ==='object' && Object.keys(config.data).length)
                {
                  config.url =makeUrl(config.url ,config.data)
                }
            config.data = undefined
            }else {
               config.data = config.data || {}
            }
           // config.data = config.method === 'get' ? undefined : (config.data || {});
            if (config.url.indexOf('https:') == -1 && config.url.indexOf('http:') == -1) {
                config.url = config.url.indexOf('/') == 0 ? this.hostBaseUrl + config.url : this.hostBaseUrl + '/' + config.url
            }

            this.autoAddLogger(config)
            config.autoToken && this.autoAddAuthorization(config);


            // 载入拦截器
            let chain = [this.dispatchRequest, undefined];
            let promise = Promise.resolve(config);
            this.interceptors.request.forEach(interceptor => {
                chain.unshift(interceptor.fulfilled, interceptor.rejected);
            });
            this.interceptors.response.forEach(interceptor => {
                chain.push(interceptor.fulfilled, interceptor.rejected);
            });
            while (chain.length) {
                promise = promise.then(chain.shift(), chain.shift());
            }
            return promise;
        } catch (err) {
            console.error(TAG, err);
        }
    }


}

['get', 'post'].forEach(method => {
    TinyAppHttp.prototype[method] = function (config) {
        config.method = method;
        return this.ready && (!this.do_request_token) ? this.request(config) : this._request(config)
    };
});
