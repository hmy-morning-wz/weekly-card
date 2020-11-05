const app = getApp()
import saleProduct from "../../services/saleProduct"
import store from './store'

const createPage = function(options) {
  return Page(store.register(options))
};
createPage({
  data: {
    recordDetail: {},
    cityType: 0
  },
  async onLoad(query) {
    app.Tracker.Page.init();
    console.log(query,'query')
    if(query.cityType == '1') {
      this.setData({
        cityType: 1
      })
    }
    my.getStorage({
      key: 'recordDetail',
      success: (res) => {
        this.setData({
          recordDetail: res.data
        })
      }
    })
  },
})