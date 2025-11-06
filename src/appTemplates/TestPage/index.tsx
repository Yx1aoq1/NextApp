import clsx from 'clsx'

import styles from './index.module.scss'

export const TestPage = () => {
  return (
    <div className="p-4">
      <div className={clsx(styles.button1, 'mb-4')}>按钮1</div>
      <div className={clsx(styles.button2, 'mb-4')}>按钮2</div>
      <div className={clsx(styles.button3, 'mb-4')}>按钮3</div>
    </div>
  )
}
