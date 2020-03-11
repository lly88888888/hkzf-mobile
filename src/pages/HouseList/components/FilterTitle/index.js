import React from 'react'

import { Flex } from 'antd-mobile'

import classnames from 'classnames'

import styles from './index.module.scss'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

export default function FilterTitle (props) {
  return (
    <Flex align="center" className={styles.root}>
      {titleList.map(item => {
        return (
          <Flex.Item key={item.type} className={styles.item} onClick={() => props.handleSelected(item.type)}>
            {/* 选中类名： selected */}
            <span className={classnames(styles.dropdown, {
              [styles.selected]: props.isSelected[item.type]
            })}>
              <span>{item.title}</span>
              <i className="iconfont icon-arrow" />
            </span>
          </Flex.Item>
        )
      })}
    </Flex>
  )
}
