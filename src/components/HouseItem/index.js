import React from 'react'
import { BASE_URL } from '../../utils'
import classnames from 'classnames'
import types from 'prop-types'
import styles from './index.module.scss'
export default function HouseItem({houseImg,desc,tags,title,price,onClick,houseCode}) {
  return (
    <div className={styles.house} onClick={()=>onClick(houseCode)}>
          <div className={styles.imgWrap}>
            <img
              className={styles.img}
              src={`${BASE_URL}${houseImg}`}
              alt=""
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>
              {title}
            </h3>
            <div className={styles.desc}>{desc}</div>
            <div>
            {tags.map((item, index) => {
              const tagClass = index >= 3 ? 'tag3' : ('tag'+(index+1))
              return (
                <span className={classnames(styles.tag,styles[tagClass])} key={index}>
                {item}
              </span>
                )
              }
              )}
            </div>
            <div className={styles.price}>
              <span className={styles.priceNum}>{price}</span> 元/月
            </div>
          </div>
      </div>
  )
}
HouseItem.propTypes = {
  houseImg: types.string.isRequired,
  desc: types.string.isRequired,
  tags: types.array.isRequired,
  title: types.string.isRequired,
  price: types.number.isRequired
}
