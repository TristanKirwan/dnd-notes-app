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
import BarbAxe from './icons/barbaxe';
import Guitar from './icons/guitar';
import ClericMace from './icons/clericMace';
import NatureSickle from './icons/natureSickle';
import SwordShieldAxe from './icons/swordShieldAxe';
import Fist from './icons/fist'
import WingedHelm from './icons/wingedHelm';
import SwordWithPaws from './icons/swordWithPaws';
import MaskWithDagger from './icons/maskWithDagger';
import FireTear from './icons/fireTear';
import DemonEye from './icons/demonEye';
import MagicHand from './icons/magicHand';

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
  trash: Trash,
  barbaxe: BarbAxe,
  guitar: Guitar,
  clericMace: ClericMace,
  natureSickle: NatureSickle,
  swordShieldAxe: SwordShieldAxe,
  fist: Fist,
  wingedHelm: WingedHelm,
  swordWithPaws: SwordWithPaws,
  MaskWithDagger: MaskWithDagger,
  FireTear: FireTear,
  demonEye: DemonEye,
  magicHand: MagicHand
};

function Icon({ type = null, ...rest }) {
  const IconComp = icons[type];
  if (!type || type === '' || IconComp === undefined) return null;
  return <IconComp {...rest} />;
}

export default Icon;