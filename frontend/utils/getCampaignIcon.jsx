const iconmapping = {
  'oneshot': 'shotSkull',
  'homebrew': 'beertankard',
  'classic': 'campaign'
}

export default function getCampaignIcon(type){
  if(!type) return 'campaign';
  switch(type){
    case 'oneshot':
     return 'shotSkull';
    case 'homebrew':
      return 'beertankard';
    default: 
      return 'campaign'
  }
}