import React from 'react'
import {Flex} from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import styles from './index.module.scss'
import classnames from 'classnames'
import Types from 'prop-types'
function SearchHeader(props) {
  return (
    <Flex className={classnames(styles.header, {
        [props.className]:!!props.className
      })} justify="between">
        <Flex className={styles.headerLeft}>
          <div className="headerLocation" onClick={()=>props.history.push('/citylist')}>
            <span>{props.cityName}</span>
            <i className="iconfont icon-arrow"></i>
          </div>
          <div className={styles.headerSearch}>
            <i className="iconfont icon-seach"></i>
            <span>请输入小区或地址</span>
          </div>
        </Flex>
        <i className="iconfont icon-map" onClick={()=>props.history.push('/map')}></i>
      </Flex>
  )
}
SearchHeader.propTypes = {
  cityName: Types.string.isRequired
}
export default withRouter(SearchHeader)