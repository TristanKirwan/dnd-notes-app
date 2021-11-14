import Container from '../../components/Container/container';
import AccountPageCard from '../../components/Cards/AccountPageCard/accountPageCard';
import { useStore } from '../../store/provider'

import style from './accountItemsSection.module.scss';

export default function AccountItemsSection({hasAccountPageTitle}) {
  const { state, dispatch } = useStore();
  const { accountDetails } = state

  return (
    <section className={style.accountItemsSection}>
      <Container containerClass={style.container}>
        {hasAccountPageTitle && <h2 className={style.title}>My Account</h2>}
        <h3 className={style.sectionTitle}>My items</h3>
        <div className={style.cardContainer}>
          <AccountPageCard title={"Campaigns"} description={"See the adventures you are currently embarking on"} icon={"campaign"} link={"/account/campaigns"} />
          <AccountPageCard title={"Notes"} description={"View all the notes that help you and your friends on your adventures"} icon={"scroll"} link={"/account/notes"}/>
        </div>
      </Container>
    </section>
  )
}