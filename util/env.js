const cardManageDomain = 'https://ech5.allcitygo.com' // https://sitsit-ech5.allcitygo.com  https://ech5.allcitygo.com
const DefaultDomain =''//  'https://operation.allcitygo.com'


const map = 'https://restapi.amap.com'


const sit_cardManageDomain = 'https://sit-ech5.allcitygo.com' // https://sitsit-ech5.allcitygo.com  https://ech5.allcitygo.com
const sit_DefaultDomain =''

const mock_DefaultDomain ='http://yapi.unservice.net/mock/23'// 'https://sit-operation.allcitygo.com'

var env = undefined

export function setEnv(newEnv) {
    newEnv && (env = newEnv)
}

export default function getDomain(urlType) {
    let domain = ""
    //////测试
    if (env && env === 'sit') {
        domain = ""
        if (urlType === 'default') {
            domain = sit_DefaultDomain
        } else if (urlType === 'cardManageDomain') {
            domain = cardManageDomain
        } 

    }  if (env && env === 'mock') {
        domain = ""
        if (urlType === 'default') {
            domain = mock_DefaultDomain
        } else if (urlType === 'cardManageDomain') {
            domain = cardManageDomain
        } 

    } else
    //////正式
    {
        if (urlType === 'default') {
            domain = DefaultDomain
        } else if (urlType === 'cardManageDomain') {
            domain = cardManageDomain
        }
    }
    return domain
}
