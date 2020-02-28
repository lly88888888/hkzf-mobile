/**
 * 根组件 --- 处理路由
 */

import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Home from '../src/pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
export default function App () {
  return (
    <Router>
      <div className="app">
        {/* 重定向 */}
        <Route exact path="/" render={() =><Redirect to="/home"/>}></Route>
        <Route path="/home" component={Home}></Route>
        <Route exact path="/citylist" component={CityList}></Route>
        <Route exact path="/map" component={Map}></Route>
      </div>
    </Router>
  )
}   
