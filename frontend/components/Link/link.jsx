import Link from 'next/link';
import clsx from 'clsx';

import style from './link.module.scss';

export default function LinkComponent(props){
  return (
    <span className={clsx([style.link, props.class, props.noUnderline && style.noUnderline, props.linkClass])}>
      <Link href={props.href} className={clsx([style.link])}>
        {props.children}
      </Link>
    </span>
  )
}
