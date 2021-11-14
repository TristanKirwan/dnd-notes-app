import GenericCard from '../genericCard';
import Icon from '../../Icon/icon';

import style from './campaignCard.module.scss';

export default function CampaignCard({title = '', users = [], id=''}){
  const extraContent = <div className={style.extraContentContainer}>
    <span className={style.iconContainer}>
      <Icon type="users" fill="var(--color-white)"/>
    </span>
    <div className={style.usersContainer}>
      {users.map(user => <span className={style.username}>{user}</span>)}
    </div>
  </div>


  return(
    <GenericCard title={title} icon={"campaign"} link={`/account/campaigns/${id}`} extraContent={extraContent} description="test"/>
  )
}