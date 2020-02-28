import React, { Component } from 'react'
import { Carousel, Flex, Grid} from 'antd-mobile'
import axios from 'axios'
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
import './index.scss'

const FlexItemList = [
  { src: nav1, title:'整租',path: '/home/houselist'},
  { src: nav2, title:'合租',path: '/home/houselist'},
  { src: nav3, title:'地图找房',path: '/map'},
  { src: nav4, title:'去出租',path: '/rent'}
]
export default class Index extends Component {
  state = {
    swiper: [],
    imgHeight: 212,
    isCarousel: false,
    groups: [],
    news: []
  }
  componentDidMount () {
    this.getSwiper()   
    this.getGroups()
    this.getNews()
  }

  // 获取轮播图图片 发送请求
  async getSwiper () {
    const res = await axios.get('http://localhost:8080/home/swiper')
    this.setState({
      swiper: res.data.body,
      isCarousel: true,
    })    
  }
  // 获取租房小组信息
  async getGroups () {
    const res = await axios.get('http://localhost:8080/home/groups', {
      params: {
        area:'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    console.log(res)
    
    this.setState({
      groups: res.data.body,
    })  
  }

  // 获取新闻资讯信息
  async getNews () {
    const res = await axios.get('http://localhost:8080/home/news', {
      params: {
        area:'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    console.log(res)
    
    this.setState({
      news: res.data.body,
      isCarousel: true,
    })  
  }

  // 条件渲染轮播图
  renderCarousel () { 
    if (!this.state.isCarousel) {
      return null 
    }
    return (
      <Carousel
          infinite
          autoplay
        >
          {this.state.swiper.map(val => (
            <a
              key={val}
              href="http://www.alipay.com"
              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
              <img
                src={`http://localhost:8080${val.imgSrc}`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </a>
          ))}
        </Carousel>
    )
  }
  
  // menus菜单点击事件
  handleMenus = (path)=> {
    this.props.history.push(path)
    
  }
  render () {
    return (
      <div className="hk_index">
        {/* 轮播+导航 */}
        <div className="swiper_search">
          {/* 
            轮播图 
            autoplay  自动切换 boolean
            infinite  是否循环播放
            before/after Change  切换面板前/后的回调函数
          */}
          {this.renderCarousel()}
          <Flex className="header" justify="between">
            <Flex className="header_left">
              <div className="header_location" onClick={()=>this.props.history.push('/citylist')}>
                <span>上海</span>
                <i className="iconfont icon-arrow"></i>
              </div>
              <div className="header_search">
                <i className="iconfont icon-seach"></i>
                <span>请输入小区或地址</span>
              </div>
            </Flex>
            <i className="iconfont icon-map" onClick={()=>this.props.history.push('/map')}></i>
          </Flex>
        </div>
        {/* 菜单 */}
        <Flex className="menus">
          {FlexItemList.map(item => (
            <Flex.Item onClick={()=>this.handleMenus(item.path)} key={item.title}>
              <img src={item.src} alt=""/>
              <h3>{item.title}</h3>
            </Flex.Item>  
          ))}
          
        </Flex>
        {/* 租房小组 */}
        <div className="groups">
          <Flex justify="between" className="groups-title">
              <h3>租房小组</h3>
              <span>更多</span>
            </Flex>
          <Grid
            data={this.state.groups}
            activeStyle
            columnNum={2}
            hasLine={false}  
            renderItem={item => (
              <Flex className="grid-item" justify="between">
                <div className="desc">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )} />
          </div>
        {/* 最新资讯 */}
        <div className="news">
          <h3>最新资讯</h3>
          {this.state.news.map(item => (
            <Flex justify='between' className="news-flex" key={item.title} align='start'>
              <div className="img">
              <img src={`http://localhost:8080${item.imgSrc}`} alt=""/>
              </div>
              <div className="innfo">
                <h3>{item.title}</h3>
                  <Flex justify='between'>
                    <span>{item.from}</span>
                  <span>{item.date}</span>
                  </Flex>
              </div>
            </Flex>
        ))}
        </div>
      </div>
    )
  }
}
