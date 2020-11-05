import {
  request
} from '../util/service'


export default {
 
  queryPageJson: async (data) => {
    const originData = await request(`/operation-push/push/page`,data, {
      on: false,
      //data: mockData
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return {
        success: true,
        data: originData.data
      }
    }
    my.hideLoading()

    return {
      success: false
    }
  },
  
}

