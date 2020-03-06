import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader'
import { getLocationCity, API,BASE_URL } from '../../utils'
import classnames from 'classnames'
import styles from './index.module.scss'

const BMap = window.BMap

// 覆盖物样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}
export default class Map extends Component {
  state = {
    isHouseShow: false,
    houseList: []
  }
  async componentDidMount () {
    const { label:cityName,value } = await getLocationCity()
    // 1 创建百度地图实例对象
    // 参数 表示容器对象的id
    // 注意： 该代码会报错，错误信息 'BMap' is not defined
    // 修改方式： 使用 window 来获取全局对象 BMap 就可以了
    const map = new BMap.Map('container')
    this.map = map
    // 2 创建地图中心点坐标
    // 第一个参数：表示 经度
    // 第二个参数：表示 纬度
    // const point = new BMap.Point(longitude, latitude)
    // 地址解析 提供地址 转换成经纬度
    // 创建地址解析器实例     
    const myGeo = new BMap.Geocoder()      
    // 将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(null, point => {      
      if (point) {
        // 3 使用中心点来初始化百度地图到页面中
        // center 中心 / zoom 缩放
        // 第一个参数：地图中心点坐标
        // 第二个参数：表示地图缩放级别
          map.centerAndZoom(point, 11)
          // 发送axios请求 获取区镇数据
          this.renderOverlays(value)
          //比例尺
          map.addControl(new BMap.ScaleControl())
          //平移缩放控件
          map.addControl(new BMap.NavigationControl())
        }      
     }, 
      cityName)
    map.addEventListener('movestart', () => {
      this.setState({
        isHouseShow: false
      })      
    })
  }

  // 获取渲染房源覆盖物的全部数据
  renderOverlays = async value => {
    const res = await API.get('/area/map', {
      params: {
        id: value
      }
    })
    const { nextlevel,type } = this.getTypeAndZoom()
    res.data.body.forEach(item => {
      const {
        label: area,
        value,
        coord: { latitude, longitude },
        count } = item
        const point = new BMap.Point(longitude, latitude)
        this.createOverlays(area,value,point,count,nextlevel,type)
    })
   }
  // 获取房源类型和缩放值
  getTypeAndZoom = () => {
    let level = this.map.getZoom()
    let nextlevel
    let type
    if (level === 11) {
      nextlevel = 13
      type = 'circle'
    } else if (level === 13) {
      nextlevel = 15
      type = 'circle'
    } else {
      type = 'rect'      
    }
    return {
      nextlevel,
      type
    }
   }
  // 根据覆盖物类型创建覆盖物
  createOverlays = (area,value,point,count,nextlevel,type) => {
    
    if (type === 'circle') {
      this.createCircle(area,value,point,count,nextlevel)
    } else {
      this.createRect(area,value,point,count)
    }
   }
  // 创建圆形覆盖物
  createCircle = (area,value,point,count,nextlevel) => {
    // 添加覆盖物
    const opts = {
      position: point,    // 指定文本标注所在的地理位置
      offset: new BMap.Size(35, -35)    //设置文本偏移量
    }
    const label = new BMap.Label(
      `
      <div class="${styles.bubble}">
        <p class="${styles.name}">${area}</p>
        <p>${count}套</p>
      </div>`, opts)  // 创建文本标注对象
      label.setStyle(labelStyle)
    label.addEventListener('click', () => {
      // 点击哪个覆盖物，就以哪个覆盖物为中心进行放大地图
      // 所以，只要把当前被点击的覆盖物的 坐标 传进来，就可以以当前点为中心放大地图了
      this.map.centerAndZoom(point, nextlevel)
      this.timerId = setTimeout(() => {
        this.map.clearOverlays()
      }, 0)
      // 点击获取小区数据
      this.renderOverlays(value)
      this.map.setZoom(nextlevel)
      
    })
    this.map.addOverlay(label) 
   }
  componentWillMount () {
     clearTimeout(this.timerId)
  }
  
  // 将点击小区展示到页面可视区中心
  showHouseCenter (e) {
    const centerX = window.innerWidth / 2      
    const centerY = (window.innerHeight - 330) / 2 
    const {clientX,clientY} = e.changedTouches[0]
    const offsetX = centerX - clientX
    const offsetY = centerY - clientY
    // 将点击小区展示到页面可视区中心
    this.map.panBy(offsetX,offsetY)
  }
  async getHouseList (value) {
    const res = await API.get('/houses', {
      params: {
        cityId: value
      }
    })
    this.setState({
      isHouseShow: true,
      houseList:res.data.body.list
    })
    console.log(this.state.houseList)
  }
  renderHouseList () {
    return this.state.houseList.map(item => (
        <div className={styles.house} key={item.houseCode}>
          <div className={styles.imgWrap}>
            <img
              className={styles.img}
              src={`${BASE_URL}${item.houseImg}`}
              alt=""
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>
              {item.title}
            </h3>
            <div className={styles.desc}>{item.desc}</div>
            <div>
            {item.tags.map((item, index) => {
              const tagClass = index >= 3 ? 'tag3' : ('tag'+(index+1))
              return (
                <span className={classnames(styles.tag,styles[tagClass])} key={index}>
                {item}
              </span>
                )
              }
              )}
            </div>
            <div className={styles.price}>
              <span className={styles.priceNum}>{item.price}</span> 元/月
            </div>
          </div>
      </div>
    ))
  }
  // 创建矩形覆盖物
  createRect = (area,value,point,count) => {
    // 添加覆盖物
    const opts = {
      position: point,    // 指定文本标注所在的地理位置
      offset: new BMap.Size(-50, -28)    //设置文本偏移量
    }
    const label = new BMap.Label(
      `
      <div class="${styles.rect}">
        <span class="${styles.housename}">${area}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `, opts)  // 创建文本标注对象
    label.addEventListener('click', (e) => {
      this.showHouseCenter(e)
      this.getHouseList(value)
    })
    label.setStyle(labelStyle)
    this.map.addOverlay(label) 
   }
  
  render() {
    return (
      <div className={styles.hkMap}>
        <NavHeader className={styles.mapFindHouse}>地图找房</NavHeader>
        {/* 地图容器 */}
        <div id="container" className={styles.container} />
        {/* 房屋列表结构 */}
        <div className={classnames(styles.houseList,{[styles.show]:this.state.isHouseShow})}>
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/home/houselist">
              更多房源
            </a>
          </div>
          <div className={styles.houseItems}>
            {this.renderHouseList()}
          </div>
        </div>
      </div>
    )
  }
}
