import Dndlogo from './icons/dndLogo';
import CampaignIcon from './icons/campaign';
import Scroll from './icons/scroll'

const icons = {
  dndlogo: Dndlogo,
  campaign: CampaignIcon,
  scroll: Scroll
};

function Icon({ type = null, ...rest }) {
  const IconComp = icons[type];
  if (!type || type === '' || IconComp === undefined) return null;
  return <IconComp {...rest} />;
}

export default Icon;