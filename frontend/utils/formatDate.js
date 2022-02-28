export default function formatDate(date){
  //formats a given date to dd/mm/yyyy
  if(!date || typeof(date) !== 'object') return;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  const year = date.getFullYear();

  return `${day}/${month}/${year}`
}