import GenericCard from '../genericCard';
import Icon from '../../Icon/icon';

import style from './campaignCard.module.scss';

export default function CampaignCard({title = '', description= '', dm = '', users = [], id='', type='classic'}){
  const extraContent = <div className={style.extraContentContainer}>
    <div className={style.dmSection}>
      <span className={style.iconContainer}><Icon type="d20" /></span>
      <span>{dm}</span>
    </div>
    <div className={style.usersSection}>
      <span className={style.iconContainer}>
        <Icon type="users" fill="var(--color-white)"/>
      </span>
      <div className={style.usersContainer}>
        {users.map(user => <span className={style.username}>{user}</span>)}
      </div>
    </div>
  </div>

  const iconmapping = {
    'oneshot': 'shotSkull',
    'homebrew': 'beertankard',
    'classic': 'campaign'
  }


  return(
    <GenericCard title={title} icon={iconmapping[type] || 'campaign'} link={`/account/campaigns/${id}`} extraContent={extraContent} description={description} footerText="View campaign"/>
  )
}