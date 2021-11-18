import { useState } from 'react';
import clsx from 'clsx'

import Container from '../../components/Container/container';
import Button from '../../components/Button/button';
import Link from '../../components/Link/link';
import CampaignCard from '../../components/Cards/CampaignCard/campaignCard';
import CampaignCreationForm from '../../components/Forms/campaignCreationForm/campaignCreationForm';

import style from './campaignOverviewSection.module.scss';

function NoCampaignsMarkup(){
  return (
    <div className={style.noCampaignsContent}>
      <p>
        You have been resting at the inn too long without any adventures! Get started By creating a campaign below.
      </p>
    </div>
  )
}

export default function CampaignOverviewSection({campaigns}){
  const [mappableCampaigns, setMappableCampaigns] = useState(campaigns)
  const [showCreationForm, setShowCreationForm] = useState(false)

  function onSuccessFulCampaignAddition(result){
    const newMappableCampaigns = [...mappableCampaigns]
    newMappableCampaigns.push(result)
    setMappableCampaigns(newMappableCampaigns)
    setShowCreationForm(false)
  }

  return (
    <section className={style.campaignOverviewSection}>
      {showCreationForm ? 
        <div>
          <Container containerClass={style.container}>
            <Link onClick={() => setShowCreationForm(false)} linkClass={style.backToOverviewButton}>
              <i className={clsx(["fas fa-long-arrow-alt-left", style.arrow])}></i>Go back
            </Link>
            <CampaignCreationForm successCallBack={onSuccessFulCampaignAddition}/>
          </Container>
        </div>
      : 
        <Container containerClass={clsx([style.container, style.campaignCardContainer])}>
          {!Array.isArray(mappableCampaigns) || mappableCampaigns.length === 0 && <NoCampaignsMarkup />}
          {Array.isArray(mappableCampaigns) && mappableCampaigns.map(campaign => <CampaignCard
            title={campaign.title}
            description={campaign.description}
            type={campaign.type}
            dm={campaign.dm}
            users={campaign.users}
            id={campaign.id}
            key={campaign.id}/>
          )}
          <div className={style.buttonContainer}>
            <Button callBack={() => setShowCreationForm(true)}>Create a campaign</Button>
          </div>
      </Container>}
    </section>
  )
}