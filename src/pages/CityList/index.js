import React, { Component } from 'react'
import { NavBar, Toast } from 'antd-mobile'
import axios from 'axios'
import NavHeader from '../../components/NavHeader'
import { getLocationCity,setCity } from '../../utils'
import { List,AutoSizer } from 'react-virtualized'
import './index.scss'

// 要求: 整体是一个对象,键为索引ABCD,值为城市 
function formatCityList (list) {
  const curList = {}
  list.forEach(item => {
    const firstLetter = item.short.slice(0, 1).toUpperCase()
    if (firstLetter in curList) {
      curList[firstLetter].push(item)
    } else {
      curList[firstLetter] = [item]
    }
  })
  const curIndex = Object.keys(curList).sort()
  return {
    curList,
    curIndex
  }
}
// 定义两个常量用于计算 行高度 在代码中尽量不要使用数字 因为无意义

/** 
 * 标题的高度
*/
const TITLE_HEIGHT = 36
/** 
 * 内容的高度
*/
const INNFO_HEIGHT = 50
export default class CityList extends Component {
  state = {
    cityList:{},
    cityIndex: [],
    activeIndex: 0,
    // 判断是否点击了右侧列表
    isClick: false
  }
  async componentDidMount () {
    // 获取所有城市
    const res = await axios.get('http://localhost:8080/area/city', {
      params: {
        level: 1
      }
    })
    const { curList, curIndex } = formatCityList(res.data.body)
    // 获取热门城市
    const res1 = await axios.get('http://localhost:8080/area/hot')
    curList['hotCity'] = res1.data.body
    curIndex.unshift('hotCity')

    // 获取当前定位
    const data = await getLocationCity()
    curList['#'] = [data]
    curIndex.unshift('#')
    this.setState({
      cityIndex: curIndex,
      cityList:curList
    }, () => {
      // 提前计算所有行的高度 要写在获取到城市列表之后 否则报错
      this.listRef.current.measureAllRows()
    })
  }
  // 为了使用List组件自身的方法需要用到ref
  
  listRef = React.createRef()
  //计算每一行的高度 
  formatRowHeight = ({index}) => {
    const { cityList, cityIndex } = this.state
    const categoryList = cityList[cityIndex[index]]
    
    return TITLE_HEIGHT + INNFO_HEIGHT * categoryList.length
  }

  // 处理渲染 标题分类(hotCity变为 热门城市)
  handleCategoryName (name) {
    switch (name) {
      case 'hotCity':
        return '热门城市'
      default:
        return name
    }
  }

  // 处理点击城市进行定位
  handleClickCityName = name => {
    const houseResource =  this.state.cityList['hotCity'].some(item => {
      return name.label === item.label
    })
    if (!houseResource) {
      Toast.info('当前城市暂无房源信息!', 2)
    } else {
      setCity(name) 
      this.props.history.push('/home')
    }
  }
  // 渲染react-virtualized长列表
  rowRenderer = ({ key, index, style }) => {
    const { cityList, cityIndex } = this.state
    const categoryList = cityList[cityIndex[index]]
    return (
      <div key={key} style={style} className="city">
        <div className="title">{this.handleCategoryName(cityIndex[index])}</div>
        {categoryList.map(item => (
          <div className="name" key={item.value} onClick={() => this.handleClickCityName(item)}>{item.label}</div>
        ))}
      </div>
    )
  }
  // 给右侧索引注册点击事件
  handleCategoryClick = (index) => {
    this.setState({
      isClick: true,
      activeIndex: index
    })
    this.listRef.current.scrollToRow(index)    
  }

  // 页面发生滚动触发
  onRowsRendered = ({ startIndex }) => {
    if (!this.state.isClick) {
      if (this.state.activeIndex !== startIndex) {
        this.setState({
          activeIndex:startIndex
        })
      }
    } else {
      this.setState({
        isClick:false
      })
    }
    
  }
  render() {
    return (
      <div className="hk_cityList">
        {/* 顶部 */}
        <NavHeader>城市选择</NavHeader>
        {/* 内容区域 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
            width={width}
            height={height - 45}
            rowCount={this.state.cityIndex.length}
            rowHeight={this.formatRowHeight}
            rowRenderer={this.rowRenderer}
            onRowsRendered={this.onRowsRendered}  
            ref={this.listRef}
            scrollToAlignment="start"
            />
          )}
        </AutoSizer>
        <ul className="city-index">
          {this.state.cityIndex.map((item,index) => (
            <li className="city-index-item" key={item} onClick={()=>this.handleCategoryClick(index)}>
              {/* 判断选中项和索引是否相等 相等高亮 */}
              <span className={this.state.activeIndex === index ? 'index-active':''}>{item ==='hotCity' ? '热': item}</span>
            </li> 
          ))}
          
        </ul>
      </div>
    )
  }
}
