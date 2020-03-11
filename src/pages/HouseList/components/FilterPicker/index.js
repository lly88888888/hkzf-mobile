import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'


export default class FilterPicker extends Component {  
  state = {
    value: this.props.selected
  }
  onChange = (value) => {
    this.setState({
      value
    })    
  }
  render () {
    const { data, rows } = this.props
    return (
      <>
        {/* 选择器组件： */}
        <PickerView data={data} value={this.state.value} cols={rows} onChange={this.onChange} />

        {/* 底部按钮 */}
        <FilterFooter closeMask={this.props.closeMask} onOk={()=>this.props.onChange(this.state.value)}/>
      </>
    )
  }
}
