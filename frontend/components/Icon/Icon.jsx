import Dndlogo from './icons/dndLogo';
import CampaignIcon from './icons/campaign';
import Scroll from './icons/scroll'
import Users from './icons/users'

const icons = {
  dndlogo: Dndlogo,
  campaign: CampaignIcon,
  scroll: Scroll,
  users: Users
};

function Icon({ type = null, ...rest }) {
  const IconComp = icons[type];
  if (!type || type === '' || IconComp === undefined) return null;
  return <IconComp {...rest} />;
}

export default Icon;