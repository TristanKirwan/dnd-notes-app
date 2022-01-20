export default function getClassIcon(classname){
  switch(classname){
    case 'barbarian':
      return 'barbaxe';
    case 'bard': 
      return 'guitar';
    case 'cleric':
      return 'clericMace';
    case 'druid':
      return 'natureSickle';
    case 'fighter':
      return 'swordShieldAxe';
    case 'monk':
      return 'fist';
    case 'paladin':
      return 'wingedHelm';
    case 'ranger':
      return 'swordWithPaws';
    case 'rogue':
      return 'maskWithDagger';
    case 'sorcerer':
      return 'fireTear';
    case 'warlock':
      return 'demonEye';
    case 'wizard':
      return 'magicHand';
    default: 
      return 'homebrew'
    }
}