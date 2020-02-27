/**
 * 整个项目入口文件 --- 负责导入App根组件 渲染根组件
 */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'antd-mobile/dist/antd-mobile.css'
import './index.css'
import './assets/fonts/iconfont.css'
ReactDOM.render(<App />,document.getElementById('root'))
