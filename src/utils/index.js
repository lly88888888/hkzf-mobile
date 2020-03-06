// 主要放一些公共函数 工具之类
import axios from 'axios'

import { getCity, setCity } from './handleCity'
import { API } from './http'
import {BASE_URL} from './url'
// {label:'beijing',ee:'ee'}

// 利用回调函数传递参数
// const getLocationCity = (callback) => {
//   if (!JSON.stringify(localStorage.getItem('locationInfo'))) {
//     // 如果浏览器缓存中没有数据
//     const myCity = new window.BMap.LocalCity()
//       myCity.get(async result => {
//         const res = await axios.get('http://localhost:8080/area/info', {
//           params: {
//             name: result.name
//           }
//         })
//         localStorage.setItem('locationInfo',JSON.stringify(res.data.body))
//         // 由于这是myCity的回调函数的return 外部并未return 所以外部调用返回 undefined 所以 需要用回调函数来把返回值传递出去
//         callback(res.data.body)
//       })
//   } else {
//     // 有数据直接渲染
//     callback(JSON.parse(localStorage.getItem('locationInfo')))
//   }
// }


// 利用Promise传递参数
const getLocationCity = () => {
  if (!getCity()) {
    // 如果浏览器缓存中没有数据
    return new Promise((resolve) => {
      const myCity = new window.BMap.LocalCity()
      myCity.get(async result => {
        const res = await axios.get('http://localhost:8080/area/info', {
          params: {
            name: result.name
          }
        })
        setCity(res.data.body)
        resolve(res.data.body)
      })
    })
  } else {
    // 有数据直接渲染
    return Promise.resolve(getCity())
  }
}
export {
  getLocationCity,
  getCity,
  setCity,
  API,
  BASE_URL
}