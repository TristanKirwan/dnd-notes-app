import Container from '../../components/Container/container';
import Icon from '../../components/Icon/icon'

import getDateString from '../../utils/getDateString';
import getCampaignIcon from '../../utils/getCampaignIcon';
import capitalizeWord from '../../utils/capitalizeWord'

import style from './campaignDetailSection.module.scss';

export default function CampaignDetailSection({title, description, startDate, dm, users, type}) {
  const showMetaData = startDate || dm || users;
  const dateString = getDateString(startDate)
  
  const iconType = getCampaignIcon(type)

  // TODO: Add related notes, tags, characters!


  function editCampaign(){
    console.log('editing')
  }

  function deleteCampaign() {
    console.log('deleting')
  }


  return (
    <section>
      <Container containerClass={style.container}>
        <div className={style.campaignHeader}>
          {title && <h1 className={style.campaignTitle}>{title}</h1> }
          <div className={style.optionsContainer}>
            <button onClick={editCampaign} className={style.changeCampaignButton}>
              <Icon type="spanner" className={style.icon}/>
              Edit 
            </button>
            <button onClick={deleteCampaign} className={style.changeCampaignButton}>
              <Icon type="trash" className={style.icon}/>
              Delete
            </button>
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
    </section>
  )
}