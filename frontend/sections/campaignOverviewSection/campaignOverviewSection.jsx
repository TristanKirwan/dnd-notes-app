import Container from '../../components/Container/container'
import CampaignCard from '../../components/Cards/CampaignCard/campaignCard'
import CampaignCreationForm from '../../components/Forms/campaignCreationForm/campaignCreationForm'

import style from './campaignOverviewSection.module.scss';

function NoCampaignsMarkup(){
  return (
    <div className={style.noCampaignsContent}>
      <p>
        You have been resting at the inn too long without any adventures! Get started By creating a campaign below.
      </p>
      <CampaignCreationForm />
    </div>
  )
}

export default function CampaignOverviewSection({campaigns}){
  return (
    <section className={style.campaignOverviewSection}>
      <Container containerClass={style.container}>
        {!Array.isArray(campaigns) || campaigns.length === 0 && <NoCampaignsMarkup />}
        {Array.isArray(campaigns) && campaigns.map(campaign => <CampaignCard title={campaign.title} users={campaign.users} id={campaign.id}/>)}
      </Container>
    </section>
  )
}