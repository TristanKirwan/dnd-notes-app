import clsx from 'clsx';
import Link from '../Link/link'

import { useStore } from '../../store/provider'

import style from './navbar.module.scss';

export default function Header(){
  const { state, dispatch } = useStore();
  const { accountDetails } = state

  return (
  <nav className={style.nav}>
    <div className={style.nameContainer}>
      <Link href="/" passHref noUnderline>
        <a className={style.desktopName}>
          Dungeons & Notes
        </a>
      </Link>
      <Link href="/" passHref noUnderline>
        <a className={style.mobileName}>
          <span>D</span>
          <span>&</span>
          <span>N</span>
        </a>
      </Link>
    </div>

    <div>
      <div>
        {accountDetails ? 
        <Link href="/account" passHref>
          <a>
            <i className={clsx(["fas fa-user", style.icon])}></i>
            {accountDetails.username}
          </a>
        </Link> : 
        <span>
          <Link href="/login">Log in</Link>
        </span>}
      </div>
      <div>

      </div>
    </div>
    <hzt className={style.horizontalLine}></hzt>
  </nav>
  )
}