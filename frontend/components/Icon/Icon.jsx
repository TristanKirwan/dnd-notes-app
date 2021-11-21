import Dndlogo from './icons/dndLogo';
import CampaignIcon from './icons/campaign';
import Scroll from './icons/scroll'
import Users from './icons/users'
import d20 from './icons/d20'
import BeerTankard from './icons/homebrew'
import Oneshot from './icons/oneshot'
import Clock from './icons/clock'
import Spanner from './icons/spanner'
import Trash from './icons/trash'

const icons = {
  dndlogo: Dndlogo,
  campaign: CampaignIcon,
  scroll: Scroll,
  users: Users,
  d20: d20,
  beertankard: BeerTankard,
  shotSkull: Oneshot,
  clock: Clock,
  spanner: Spanner,
  trash: Trash
};

function Icon({ type = null, ...rest }) {
  const IconComp = icons[type];
  if (!type || type === '' || IconComp === undefined) return null;
  return <IconComp {...rest} />;
}

export default Icon;