import { useRouter } from 'next/router';
import clsx from 'clsx';
import Link from '../Link/link';

import { useStore } from '../../store/provider'
import logout from '../../utils/logout'

import style from './navbar.module.scss';

export default function Header(){
  const { state, dispatch } = useStore();
  const { accountDetails } = state
  const router = useRouter();

  function test(){
    logout(dispatch, router)
  }

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
        <div className={style.accountWrapper}>
          <span>
            <i className={clsx(["fas fa-user", style.icon])}></i>
            {accountDetails.username}
          </span>
          <div className={style.accountDropdown}>
            <Link href="/account" passHref>Account</Link>
            <Link onClick={test}>Log out</Link>
          </div>
        </div>
        : 
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