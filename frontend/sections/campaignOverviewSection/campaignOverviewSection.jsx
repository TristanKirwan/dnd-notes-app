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
  const [showCreationForm, setShowCreationForm] = useState(false)

  return (
    <section className={style.campaignOverviewSection}>
      {showCreationForm ? 
        <div>
          <Container containerClass={style.container}>
            <Link onClick={() => setShowCreationForm(false)} linkClass={style.backToOverviewButton}>
              <i className={clsx(["fas fa-long-arrow-alt-left", style.arrow])}></i>Go back
            </Link>
            <CampaignCreationForm />
          </Container>
        </div>
      : 
        <Container containerClass={clsx([style.container, style.campaignCardContainer])}>
          {!Array.isArray(campaigns) || campaigns.length === 0 && <NoCampaignsMarkup />}
          {Array.isArray(campaigns) && campaigns.map(campaign => <CampaignCard title={campaign.title} users={campaign.users} id={campaign.id}/>)}
          <div className={style.buttonContainer}>
            <Button callBack={() => setShowCreationForm(true)}>Create a campaign</Button>
          </div>
      </Container>}
    </section>
  )
}