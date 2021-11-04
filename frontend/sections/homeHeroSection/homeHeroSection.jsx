import Container from '../../components/Container/container';
import Button from '../../components/Button/button';
import Link from '../../components/Link/link';

import style from './homeHeroSection.module.scss';

export default function HomeHeroSection(){
  return (
    <section className={style.sectionContainer}>
      <Container containerClass={style.contentContainer}>
        <h1 className={style.heroTextContainer}>
          {/* <span>Share <span className={style.emphasizedHeroText}>Notes</span>, <span className={style.emphasizedHeroText}>Adventures</span> and <span className={style.emphasizedHeroText}>Good times</span></span> */}
          <span className={style.heroText}>Great <span className={style.emphasizedHeroText}>Adventures</span> require good <span className={style.emphasizedHeroText}>Notes</span></span>
        </h1>
        <p className={style.introduction}>A good <span className={style.emphasizedIntroText}>adventurer</span> makes notes on their journey. A good <span className={style.emphasizedIntroText}>friend</span>  shares them with their party.</p>
        <div className={style.ctaContainer}>
          <Button isLink href="/login" hasArrow>
            Register account
          </Button>
          <Link href={"/login"} linkClass={style.loginLink}>Or, log-in instead.</Link>
        </div>
      </Container>
    </section>
  )
}