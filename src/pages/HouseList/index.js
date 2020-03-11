import React, { Component } from 'react'
import SearchHeader from '../../components/SearchHeader'
import HouseItem from '../../components/HouseItem'
import NoHouse from '../../components/NoHouse'
import Filter from './components/Filter'
import Ceiling from '../../components/Ceiling'
import { Flex, Toast } from 'antd-mobile'
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
import { getLocationCity, API} from '../../utils'
import styles from './index.module.scss'
export default class HouseList extends Component {
  state = {
    location: '上海',
    houseList: [],
    count: 0,
    startIndex: 1,
    stopIndex: 20,
    isLoaded: false
  }
  async componentDidMount () {
    this.filters = {}
    const data = await getLocationCity()
    this.setState({
      location: data.label,
    })
    this.area = data.value
    await this.getHouseList()

  }

  getHouseList = async () => {
    Toast.loading('加载中...',0)
    const {
      startIndex,
      stopIndex
      } = this.state
    const res = await API.get('/houses', {
      params: {
        cityId: this.area,
        ...this.filters,
        start: startIndex,
        end: stopIndex
      }
    })
    Toast.hide()
    const { list,count } = res.data.body  
    
    if (count !== 0) {
      Toast.info(`共加载了${count}套房源`, 1)
    }
    this.setState({
      houseList: list,
      count,
      isLoaded: true
    })
  }
  getFilters = (filters) => {
    this.filters = filters
    this.getHouseList()
    // 当每次搜索房源时 返回顶部
    window.scrollTo(0,0)
  }
  // 负责跟踪每一行的加载状态
  isRowLoaded = ({ index }) => {
    return !!this.state.houseList[index]
  }
  // 加载更多时的回调函数 返回一个promise对象 当加载完成后调用 resolve()
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(async resolve => {
      // 发送请求，获取数据
      // 获取当前定位城市
      // const { value } = await getCurrentCity()

      const res = await API.get('/houses', {
        params: {
          ...this.filters,
          cityId: this.area,
          start: startIndex,
          end: stopIndex
        }
      })
      const { list, count } = res.data.body

      // 将获取到的数据，存储到 list 中
      this.setState({
        // 注意： 是追加数据，而不是覆盖数据！！！
        list: [...this.state.houseList, ...list],
        count
      })

      // 数据加载完成时：
      resolve()
    })
  }
  // 渲染房屋信息 virtualized
  rowRenderer = ({ key, index, style }) => {
    const {houseList} = this.state
    const data = houseList[index]
    if (data) {
      return (
        <div key={key} style={style}>
          <HouseItem {...data} onClick={(value)=>this.props.history.push(`/details/${value}`)}></HouseItem>
        </div>
      )
    } else {
      return <div key={key} style={style}>
        <div className={styles.placeholder}></div>
      </div>
    }
  }

  // 无房源数据
  renderNoHouse () {
    const { isLoaded, count } = this.state
    if (isLoaded && count === 0) {
      return (
        <NoHouse>暂无房源数据,换个搜索条件吧亲~</NoHouse>
      )
    }
    return null
  }
  render() {
    return (
      <div className="house">
        {/* 顶部搜索框 */}
        <Flex className={styles.houseList}>
          <i className="iconfont icon-back" onClick= {()=>this.props.history.go(-1)}></i>
          <SearchHeader cityName={this.state.location} className={styles.searchHeader}></SearchHeader>
        </Flex>
        {/* 分类查询房源信息 */}
        <Ceiling height={40}>
          <Filter getFilters={this.getFilters}></Filter>
        </Ceiling>
        {/* 房源信息 */}
        {/*  
          WindowScroller
          允许根据窗口的滚动位置滚动表或列表组件的组件。
          height,  视口的高度
          isScrolling,  是否在滚动
          scrollTop     到页面的滚动距离


          InfiniteLoader
          当用户在列表中向上或向下滚动时，管理及时获取数据的组件。
          isRowLoaded  负责跟踪每一行的加载状态
          loadMoreRows  加载更多时的回调函数 是一个promise对象 当加载完成后调用 resolve()
          rowCount  列表中的行数
           minimumBatchSize 修改每次加载的条数
          onRowsRendered 这个函数应该作为子对象的onrowsrender属性传递。当用户滚动时，它通知加载程序。

          registerChild  ref
        */}
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={this.state.count}
          minimumBatchSize={15}
          >
            {({ onRowsRendered, registerChild }) => (
              <WindowScroller>
                {({ height, isScrolling, scrollTop }) => (
                  <AutoSizer>
                    {({ width }) => (
                      <List
                        width={width}
                        isScrolling={isScrolling}
                        onRowsRendered={onRowsRendered}
                        rowCount={this.state.count}
                        height={height - 45}
                        rowHeight={120}
                        rowRenderer={this.rowRenderer}
                        ref={registerChild}
                        scrollToAlignment="start"
                        scrollTop={scrollTop}
                        autoHeight
                        className={styles.list}
                      />
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            )}
        </InfiniteLoader>
        {this.renderNoHouse()}
      </div>
    )
  }
}
