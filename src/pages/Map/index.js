import React, { Component } from 'react'
import { NavBar } from 'antd-mobile'
import './index.scss'

export default class Map extends Component {
  componentDidMount () {
     // 因为需要获取到容器id，也就是要进行DOM操作，所以，我们在该钩子函数中来初始化
    // 1 创建百度地图实例对象
    // 参数 表示容器对象的id
    // 注意： 该代码会报错，错误信息 'BMap' is not defined
    // 修改方式： 使用 window 来获取全局对象 BMap 就可以了
    const map = new window.BMap.Map('container')

    // 2 创建地图中心点坐标
    // 第一个参数：表示 经度
    // 第二个参数：表示 纬度
    const point = new window.BMap.Point(116.404, 39.915)

    // 3 使用中心点来初始化百度地图到页面中
    // center 中心 / zoom 缩放
    // 第一个参数：地图中心点坐标
    // 第二个参数：表示地图缩放级别
    map.centerAndZoom(point, 15)
  }

  render() {
    return (
      <div className="hk_map">
        <NavBar
          mode="light"
          icon={<i className="iconfont icon-back"></i>}
          onLeftClick={() => this.props.history.go(-1)}
        >地图找房</NavBar>
        {/* 地图容器 */}
        <div id="container" />
      </div>
    )
  }
}
