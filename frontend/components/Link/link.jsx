import Link from 'next/link';
import clsx from 'clsx';

import style from './link.module.scss';

export default function LinkComponent({linkClass = '', noUnderline = false, href='/', children, onClick = null}){
  if(onClick !== null) {
    return (
      <span className={clsx([style.link, noUnderline && style.noUnderline, linkClass])}>
        <button className={clsx([style.link])} onClick={onClick}>
        {children}
      </button>
    </span>
    )
  }
  return (
    <span className={clsx([style.link, noUnderline && style.noUnderline, linkClass])}>
      <Link href={href} className={clsx([style.link])}>
        {children}
      </Link>
    </span>
  )
}
