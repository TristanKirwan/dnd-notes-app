import Container from '../Container/container';
import Icon from '..//Icon/icon'
import clsx from 'clsx';

// import getDateString from '../../utils/getDateString';
import getDateString from '../../utils/getDateString';
import getCampaignIcon from '../../utils/getCampaignIcon';
import capitalizeWord from '../../utils/capitalizeWord'


import style from './campaignDetailBlock.module.scss'


export default function CampaignDetailBlock({campaign, editCallBack, deleteCallBack, mayEditForm}){
  const { title, description, startDate, dm, users, type } = campaign || {}
  const showMetaData = startDate || dm || users;
  const dateString = getDateString(startDate)
  
  const iconType = getCampaignIcon(type)

  function deleteCampaign() {
    console.log('deleting')
  }

  return (
    <Container containerClass={style.container}>
        <div className={style.campaignHeader}>
          {title && <h1 className={style.campaignTitle}>{title}</h1> }
          <div className={style.optionsContainer}>
            <div className={clsx([style.buttonWrapper, !mayEditForm && style.disabledButtonWrapper])}>
              <button onClick={mayEditForm ? editCallBack : null} className={style.changeCampaignButton}>
                <Icon type="spanner" className={style.icon}/>
                Edit 
              </button>
              {!mayEditForm && <span className={style.notAllowedOverlay}>Only the DM may edit the campaign</span>}
            </div>
            <div className={clsx([style.buttonWrapper, !mayEditForm && style.disabledButtonWrapper])}>
              <button onClick={mayEditForm ? deleteCampaign : null} className={style.changeCampaignButton}>
                <Icon type="trash" className={style.icon}/>
                Delete
              </button>
              {!mayEditForm && <span className={style.notAllowedOverlay}>Only the DM may delete the campaign</span>}
            </div>
          </div>
        </div>
        {showMetaData && <div className={style.metaDataContainer}>
          <span className={style.metaInstance}>
            <Icon type={iconType} className={style.icon}/>
            {capitalizeWord(type)}
          </span>
          <span className={style.metaInstance}>
            <Icon type="d20" className={style.icon} />
            {dm}
          </span>
          <span className={style.metaInstance}>
            <Icon type="clock" className={style.icon} />
            {dateString}
          </span>
        </div>}
        {description && <p className={style.description}>{description}</p>}
        {Array.isArray(users) && users.length > 0 && <div className={style.usersContainer}>
          <Icon type="users" className={style.icon}/>
          {users.map(user => <span key={user} className={style.userInstance}>{user}</span>)}
        </div>}
      </Container>
  )
}