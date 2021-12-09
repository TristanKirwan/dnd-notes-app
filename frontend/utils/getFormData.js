export default function getFormData(form){
  if(!form) return {};

  const formData = new FormData(form);
  const finalFormData = {}

  for (var [key, value] of formData.entries()) { 
    finalFormData[key] = value
  }
  return finalFormData
}