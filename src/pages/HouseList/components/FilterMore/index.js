import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import classnames from 'classnames'

import styles from './index.module.scss'

export default class FilterMore extends Component {
  state = {
    selectedFilters: this.props.selected
  }
  // 渲染户型
  renderFilters (filters) {
    const { selectedFilters } = this.state
    // roomType,户型
    // floor,楼层
    // oriented,朝向
    // characteristic 房屋亮点
    // 高亮类名： styles.tagActive
    
    return (
      filters.map(item => (
        <span
          className={classnames(styles.tag, {
          [styles.tagActive]: selectedFilters.indexOf(item.value) === -1 ? false : true
          })}
          key={item.value}
          onClick={()=>this.handleClick(item.value)}>{item.label}
          </span>
      ))
    )
  }
  // 处理点击事件
  handleClick = (value) => {
    const { selectedFilters } = this.state
    let newSelectedFilters
    if (selectedFilters.indexOf(value) > -1) {
      newSelectedFilters = selectedFilters.filter(item=>item !== value)
    } else {
        newSelectedFilters = [
          ...selectedFilters,
          value
        ]
    }
    this.setState({
      selectedFilters: newSelectedFilters
    })    
  }
  onCancel = () => {
    this.setState({
      selectedFilters:[]
    })
  }
  render () {
    const { roomType, floor, oriented, characteristic } = this.props.data    
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={this.props.closeMask} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          closeMask={this.onCancel}
          onOk={() => this.props.onChange(this.state.selectedFilters)}
          cancelText="清除"
          />
      </div>
    )
  }
}
