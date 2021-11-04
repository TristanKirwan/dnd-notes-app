import dndlogo from './icons/dndLogo';

const icons = {
  dndlogo: dndlogo
};

function Icon({ type = null }) {
  const IconComp = icons[type];
  if (!type || type === '') return null;
  return <IconComp />;
}

export default Icon;