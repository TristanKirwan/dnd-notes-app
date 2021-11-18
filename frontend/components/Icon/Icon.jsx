import Dndlogo from './icons/dndLogo';
import CampaignIcon from './icons/campaign';
import Scroll from './icons/scroll'
import Users from './icons/users'
import d20 from './icons/d20'
import BeerTankard from './icons/homebrew'
import Oneshot from './icons/oneshot'

const icons = {
  dndlogo: Dndlogo,
  campaign: CampaignIcon,
  scroll: Scroll,
  users: Users,
  d20: d20,
  beertankard: BeerTankard,
  shotSkull: Oneshot
};

function Icon({ type = null, ...rest }) {
  const IconComp = icons[type];
  if (!type || type === '' || IconComp === undefined) return null;
  return <IconComp {...rest} />;
}

export default Icon;