import clsx from 'clsx';
import Link from 'next/link';

import style from './button.module.scss';

export default function Button({isLink = false, href= "", callBack = null, children = "", hasArrow = false, type = null, buttonClass = null}){
  
  
  if(isLink && href)return(
    <span className={clsx([style.button, style.linkButton, buttonClass])}>
      <Link href={href}>
        {children}
      </Link>
      {hasArrow && <i className={clsx(["fas fa-long-arrow-alt-right", style.arrow])}></i>}
    </span>
  )
  return (
    <button onClick={callBack} className={clsx([style.button, buttonClass])} type={type}>
      {children}
      {hasArrow && <i className={clsx(["fas fa-long-arrow-alt-right", style.arrow])}></i>}
    </button>
  )
}