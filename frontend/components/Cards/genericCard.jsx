import clsx from 'clsx';

import Link from '../Link/link'
import Icon from '../Icon/icon';

import style from './genericCard.module.scss';

export default function AccountPageCard({title, description = '', icon, footerText = 'View all', link = '', extraContent = null}) {
  return (
    <Link href={link}>
      <div className={style.accountPageCard}>
        <span className={style.cardHeader}>
          <Icon type={icon} className={style.icon}/>
          <h5 className={style.title}>{title}</h5>
        </span>
        <div className={style.cardBody}>
          {description && <p className={style.description}>{description}</p>}
          {extraContent && extraContent}
        </div>
        <div className={style.cardFooter}>
          {footerText} <i className={clsx(["fas fa-long-arrow-alt-right", style.arrow])}></i>
        </div>
      </div>
    </Link>
  )
}