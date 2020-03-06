import React from 'react'
import { NavBar } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import classnames from 'classnames'
import Types from 'prop-types'
import styles from './index.module.scss'
function NavHeader (props) {
  return (
    <div className={classnames({
      [styles.navHeader]:!!styles.navHeader,
      [props.className]: !!props.className
    })}>
      <NavBar
      mode="light"
      icon={<i className="iconfont icon-back"></i>}
      onLeftClick={() => props.history.go(-1)}
      >{props.children}</NavBar>
    </div>
  )
}
NavHeader.propTypes = {
  children: Types.string.isRequired
}

/** 
 * import { withRouter } from 'react-router-dom'
 * withRouter  这是一个高阶组件，只要包装另外一个组件，这个组件就可以直接获取到路由信息了。
 */ 
export default withRouter(NavHeader)
