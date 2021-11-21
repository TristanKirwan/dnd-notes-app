export default function capitalizieWord(word){
  if(typeof(word) !== 'string') return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}