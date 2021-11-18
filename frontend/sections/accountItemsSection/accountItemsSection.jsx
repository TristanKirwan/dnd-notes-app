import Container from '../../components/Container/container';
import GenericCard from '../../components/Cards/genericCard';
import { useStore } from '../../store/provider'

import style from './accountItemsSection.module.scss';

export default function AccountItemsSection() {
  const { state, dispatch } = useStore();
  const { accountDetails } = state

  return (
    <section className={style.accountItemsSection}>
      <Container containerClass={style.container}>
        <h3 className={style.sectionTitle}>My items</h3>
        <div className={style.cardContainer}>
          <GenericCard title={"Campaigns"} description={"See the adventures you are currently embarking on"} icon={"campaign"} link={"/account/campaigns"} />
          <GenericCard title={"Notes"} description={"View all the notes that help you and your friends on your adventures"} icon={"scroll"} link={"/account/notes"}/>
        </div>
      </Container>
    </section>
  )
}