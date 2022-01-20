export default function truncateString(text, maxLength = 150){
  if(typeof(text) !== 'string') return '';
  if(text.length > maxLength ) {
    return `${text.substring(0, maxLength)}...`
  } else {
    return text
  }
}