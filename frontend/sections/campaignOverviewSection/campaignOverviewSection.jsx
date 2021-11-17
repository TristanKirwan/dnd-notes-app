import Container from '../../components/Container/container'
import CampaignCard from '../../components/Cards/CampaignCard/campaignCard'

import style from './campaignOverviewSection.module.scss';

export default function CampaignOverviewSection({campaigns}){
  return (
    <section className={style.campaignOverviewSection}>
      <Container containerClass={style.container}>
        {campaigns.map(campaign => <CampaignCard title={campaign.title} users={campaign.users} id={campaign.id}/>)}
      </Container>
    </section>
  )
}