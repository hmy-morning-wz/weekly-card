
export const downloadImage =  async (image)=> {
  try {
    let res = await getStorageSync({ key: image })
    if (res && res.success && res.data) {
      console.log('image getStorageSync image url', res.data)
      let ret = await getSavedFileInfo({ apFilePath: res.data })
      if (ret && ret.size) return res.data
    }
  } catch (err) {
    console.warn('image getStorageSync image', err)
  }

  return new Promise((resolve, reject) => {
    console.log('image downloadImage url', image)
    my.downloadFile({
      url: image,//'http://img.alicdn.com/tfs/TB1x669SXXXXXbdaFXXXXXXXXXX-520-280.jpg',
      success({ apFilePath }) {
        /* my.previewImage({
           urls: [apFilePath],
         });*/
        my.saveFile({
          apFilePath: apFilePath,
          success: (res) => {
            console.log(JSON.stringify(res))
            //apFilePath
            my.setStorage({
              key: image, // 缓存数据的key
              data: res.apFilePath, // 要缓存的数据
              success: (res) => {

              },
            });
          },
        });
        resolve(apFilePath)
      },
      fail(res) {
        console.warn('image downloadFile fail', res)
        reject(res)
        /*
        my.alert({
          content: res.errorMessage || res.error,
        });*/
      },
    });
  })
}

function request({ url }) {
  return new Promise((resolve, reject) => {
    console.log('image request url', url)
    my.request({
      url: url,
      success: (res) => {
        console.log('image request success', res)
        let data = {}
        if (res && res.status === 200) {
          data.success = true
          data.data = res.data
        } else {
          data.success = false
        }
        resolve(data)
      },
      fail: (err) => {
        console.warn('image request fail', err)
        reject(err)
      },
      complete: () => {

      }
    })
  })
}
function getSavedFileInfo({ apFilePath }) {
  return new Promise((resolve, reject) => {
    my.getSavedFileInfo({
      apFilePath: apFilePath,// 'https://resource/apml953bb093ebd2834530196f50a4413a87.video',
      success: (res) => {
        console.log('image', JSON.stringify(res))
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })

  })
}

function getStorageSync({ key }) {
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