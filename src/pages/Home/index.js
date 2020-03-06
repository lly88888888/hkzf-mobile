import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Index from '../Index'
import HouseList from '../HouseList'
import Information from '../Information'
import ProFile from '../ProFile'
import { TabBar } from 'antd-mobile'
import styles from './index.module.scss'


const tabBarItemList = [
  {title:'首页', icon:'icon-ind', path: '/home'},
  {title:'找房', icon:'icon-findHouse', path: '/home/houselist'},
  {title:'资讯', icon:'icon-infom', path: '/home/information'},
  {title:'我的', icon:'icon-my', path: '/home/profile'}
]
export default class Home extends Component {
  state = {
    // 控制选中项
    selectedTab: this.props.location.pathname,
    // 控制标签栏TabBar是否显示
    hidden: false,
  }
  componentDidUpdate (prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
    
  }
  render () {
    return (
      <div className={styles.hkHome}>
        {/* 页面分为两个模块,上面模块为动态变化的 */}
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/houselist" component={HouseList}></Route>
        <Route path="/home/information" component={Information}></Route>
        <Route path="/home/profile" component={ProFile}></Route>
        {/* 下方为tabBar 固定的 */}
        <div className={styles.tabBar}>
          <TabBar
            unselectedTintColor="#949494"
            tintColor="#21B97A"
            barTintColor="white"
            hidden={this.state.hidden}>
            {tabBarItemList.map(item => {
              return (
                <TabBar.Item
                  title={item.title}
                  key={item.title}
                  icon={<i className={`iconfont ${item.icon}`}></i> }
                  selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
                  selected={this.state.selectedTab === item.path}
                  onPress={() => {
                    this.props.history.push(item.path)
                  }}
                >
                </TabBar.Item>
              )
            })}
          </TabBar>
        </div>
      </div>
    )
  }
}
