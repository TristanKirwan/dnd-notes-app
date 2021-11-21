export default function getDateString(date){
  if(!date) return;
  let dateToUse = null;
  if(typeof(date) === 'string')
  {
    dateToUse = new Date(date);
  }
  const year = dateToUse.getFullYear();
  const monthDay = dateToUse.getDate() ;
  const month = dateToUse.getMonth() + 1;
  return `${monthDay}-${month}-${year}`
}