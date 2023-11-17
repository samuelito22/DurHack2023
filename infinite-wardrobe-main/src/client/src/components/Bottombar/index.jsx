import React from 'react'
import styles from "./styles.module.css"
import { useLocation } from 'react-router-dom';

function Bottombar() {
  let location = useLocation();

  return (
    <section className={styles.container}>
      <div className={styles.button}>
      <a href="/" className={`${styles.button_text} ${location.pathname === "/" && styles.button_text_active}`}>Wardrobe</a>
        {location.pathname === "/" && <div className={styles.button_active}/>}
        </div>
      <div className={styles.button}>
        <a href='/upload' className={`${styles.button_text} ${location.pathname === "/upload" && styles.button_text_active}`}>Camera</a>
        {location.pathname === "/upload" && <div className={styles.button_active}/>}
        </div>
    </section>
  )
}

export default Bottombar