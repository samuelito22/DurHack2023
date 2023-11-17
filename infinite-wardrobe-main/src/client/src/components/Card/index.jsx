import React from 'react'
import styles from "./styles.module.css"

function Card({imgUrl, title}) {
  return (
    <div className={styles.container}>
        <img src={imgUrl} className={styles.image}/>
        <h3 className={styles.title}>{title}</h3>
    </div>
  )
}

export default Card