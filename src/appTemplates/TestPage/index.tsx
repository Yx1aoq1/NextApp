'use client'

import { useState } from 'react'

import clsx from 'clsx'

import styles from './index.module.scss'

export const TestPage = () => {
  const [open, setOpen] = useState(false)

  const handleMenuClick = () => {
    setOpen(!open)
  }

  return (
    <div className="p-4">
      <div className={clsx(styles.button1, 'mb-4')}>按钮1</div>
      <div className={clsx(styles.button2, 'mb-4')}>按钮2</div>
      <div className={clsx(styles.button3, 'mb-4')}>按钮3</div>

      <button
        type="button"
        aria-label="Toggle menu"
        className={clsx(styles.menuBtn, { [styles.menuBtnActive]: open })}
        onClick={handleMenuClick}
      >
        <span className={styles.menuBtnLine} />
      </button>
    </div>
  )
}
