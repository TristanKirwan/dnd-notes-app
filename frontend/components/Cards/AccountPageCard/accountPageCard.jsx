import clsx from 'clsx';

import Link from '../../Link/link'
import Icon from '../../Icon/icon';
import Button from '../../Button/button'

import style from './accountPageCard.module.scss';

export default function AccountPageCard({title, description, icon, footerText = 'View all', link = ''}) {
  return (
    <Link href={link}>
      <div className={style.accountPageCard}>
        <span className={style.cardHeader}>
          <Icon type={icon} className={style.icon}/>
          <h5 className={style.title}>{title}</h5>
        </span>
        <div className={style.cardBody}>
          <p className={style.description}>{description}</p>
        </div>
        <div className={style.cardFooter}>
          {footerText} <i className={clsx(["fas fa-long-arrow-alt-right", style.arrow])}></i>
        </div>
      </div>
    </Link>
  )
}