/**
 * 根组件 --- 处理路由
 */

import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Home from '../src/pages/Home'
import CityList from './pages/CityList'
export default function App () {
  return (
    <Router>
      <div>
        {/* 重定向 */}
        <Route path="/" render={() =><Redirect to="/home"/>}></Route>
        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
      </div>
    </Router>
  )
}   
