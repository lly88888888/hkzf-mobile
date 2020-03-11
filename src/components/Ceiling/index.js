import React, { Component } from 'react'
import styles from './index.module.scss'
export default class Ceiling extends Component {
  componentDidMount () {
    window.addEventListener('scroll',this.windowScroll)
  }
  windowScroll = () => {
    const ceiling = this.ceilingRef.current
    const content = this.contentRef.current
    const { top } = ceiling.getBoundingClientRect()
    if (top <= 0) {
      content.classList.add(styles.fixed)
      ceiling.style.height = this.props.height + 'px'
    } else {
      content.classList.remove(styles.fixed)
      ceiling.style.height = 0 + 'px'
    }
  }
  ceilingRef = React.createRef()
  contentRef = React.createRef()
  componentWillUnmount() {
    // 取消监听
    window.removeEventListener('scroll', this.windowScroll)
  }
  render() {
    return (
      <>
        {/* 占位符 当元素固定定位时没有高度 需要占位符撑起内容高度 */}
        <div ref={this.ceilingRef}></div>
        {/* 真实内容 */}
        <div ref={this.contentRef}>{this.props.children}</div>
      </>
    )
  }
}
