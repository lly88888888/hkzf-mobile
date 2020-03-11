import React, { Component } from 'react'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import { Spring } from 'react-spring/renderprops'
import { getLocationCity, API } from '../../../../utils'
import styles from './index.module.scss'

export default class Filter extends Component {
  state = {
    // 决定是否高亮
    isSelected: {
      area: false,
      mode: false,
      price: false,
      more: false
    },
    // 根据openType渲染 FilterPicker还是 FilterMore
    openType: '',
    queryHouseList: {},
    selectedType: {
      area: ["area", "null"],
      mode: ["null"],
      price: ["null"],
      more: []
    }
  }

  componentDidMount () {
    this.getQueryHouseList()
  }

  async getQueryHouseList () {
    const { value } = await getLocationCity()
    const res = await API.get('/houses/condition', {
      params: {
        id: value
      }
    })
    this.setState({
      queryHouseList: res.data.body
    })
  }
  // 子传父 当子组件点击触发父组件事件 使之高亮
  handleSelected = (value) => {
    const newTitleStatus = {
      ...this.state.isSelected
    }    
    Object.keys(this.state.isSelected).forEach(item => {
      const curSelected = this.state.selectedType[item]
      const isSelected = this.getSelectedStatus(item,curSelected)
      if (value === item) {
        newTitleStatus[value] = true
      } else {
        newTitleStatus[item] = isSelected
      }
    })
    this.setState({
      isSelected:newTitleStatus,
      openType: value
    })
  }
  // 动态决定渲染 FilterPicker还是 FilterMore
  renderPickerOrMore () {
    const {
      openType,
      queryHouseList:{area, rentType, price, subway,roomType,floor,oriented,characteristic}
    } = this.state

    // 根据点击类型渲染数据
    let data,rows
    switch (openType) {
      case 'area':
        data = [area, subway]
        rows = 3
        break
      case 'mode':
        data = rentType
        rows = 1
        break
      case 'price':
        data = price
        rows = 1
        break
      case 'more':
        data = { roomType, floor, oriented, characteristic }
        break
      default:
        break
    }
    // 把选中的数据拿出来 方便下次点击回显
    const selected = this.state.selectedType[openType]
    if (openType === 'area' || openType === 'mode' || openType === 'price') {
      /* 前三个菜单对应的内容： */
      return <FilterPicker
              closeMask={this.closeMask}
              data={data}
              rows={rows}
              selected={selected}
              onChange={this.onChange}
              key={openType}/>
    } else if (openType === 'more') {
      /* 最后一个菜单对应的内容： */
      return <FilterMore
              closeMask={this.closeMask}
              data={data}
              onChange={this.onChange}
              selected={selected} />
    } else {
      return null
    }
  }
  // 点击遮罩层 关闭遮罩层
  closeMask = () => {
    const { selectedType,openType } = this.state
    const curSelected = selectedType[openType]
    const isSelected = this.getSelectedStatus(openType,curSelected)
    this.setState({
      isSelected:{
        ...this.state.isSelected,
        [openType]:isSelected
      },
      openType: ''
    })
  }

  // 点击确定把选中得值存起来
  onChange = (value) => {
    const { openType, selectedType } = this.state
    const isSelected = this.getSelectedStatus(openType, value)
    const newSelectType = {
      ...selectedType,
      [openType]: value
    }
    let filters = {}
    filters.rentType = newSelectType['mode'][0]
    filters.price = newSelectType['price'][0]
    filters.more = newSelectType['more'].join(',')
    
    if (newSelectType['area'].length === 2) {
      // area null/id
      // subway null/id
      filters[newSelectType['area'][0]] =newSelectType['area'][1]
    } else {
      if (newSelectType['area'][2] !== 'null') {
        filters[newSelectType['area'][0]] =newSelectType['area'][2]
      } else {
        filters[newSelectType['area'][0]] =newSelectType['area'][1]
      }
    }
    this.props.getFilters(filters)
    this.setState({
      selectedType: newSelectType,
      isSelected: {
        ...this.state.isSelected,
        [openType]:isSelected
      },
      openType: ''
    })
  }

  // 根据selectedType中的值判断是否高亮
  getSelectedStatus = (openType,curSelected) => {
    let isSelected 
      if (openType === 'area' && (curSelected.length !==2 || curSelected[0] !== 'area')) {
        isSelected = true
      } else if (openType === 'mode' && curSelected[0] !== 'null') {
        isSelected = true
      } else if (openType === 'price' && curSelected[0] !== 'null') {
        isSelected = true
      } else if (openType === 'more' && curSelected.length > 0) {
        isSelected = true
      } else {
        isSelected = false
    }
    return isSelected
  }
  renderMask = () => {
    const { openType } = this.state
    const isRenderMask = (openType === 'area' || openType === 'mode' || openType === 'price')
    return (
      <Spring
        to={{ opacity: isRenderMask ? 1 : 0 }}>
        {props => {
          if (props.opacity === 0) {
            return null
          }
          return <div className={styles.mask} onClick={this.closeMask} style={props}/>
        }}
      </Spring>
    )
  }
  render () {
    const { openType } = this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {this.renderMask()}
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle isSelected={this.state.isSelected} handleSelected={this.handleSelected}/>
          {/* 动态决定渲染 FilterPicker还是 FilterMore*/}
          {this.renderPickerOrMore()}
        </div>
      </div>
    )
  }
}
