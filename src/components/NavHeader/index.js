import React from 'react'
import { NavBar } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import './index.scss'
function NavHeader(props) {
  return (
    <div className="navHeader">
      <NavBar
      mode="light"
      icon={<i className="iconfont icon-back"></i>}
      onLeftClick={() => props.history.go(-1)}
      >{props.children}</NavBar>
    </div>
  )
}
/** 
 * import { withRouter } from 'react-router-dom'
 * withRouter  这是一个高阶组件，只要包装另外一个组件，这个组件就可以直接获取到路由信息了。
 */ 
export default withRouter(NavHeader)
