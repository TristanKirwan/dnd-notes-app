import makeAuthorizedRequest from "../../utils/makeAuthorizedRequest";

export default function Account() {
  function testFunction(e){
    e.preventDefault();
    let actualFormData = new FormData(e.target);
    const finalFormData = {}
    for (var [key, value] of actualFormData.entries()) { 
      finalFormData[key] = value
    }
    const requestBody = {text: finalFormData.text}
    makeAuthorizedRequest('addNote', requestBody)
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.error(err)
    })
  }

  return (
    <div>
    <h1>This will be the account page.</h1>
    <form onSubmit={testFunction}>
      <input type="textarea" name="text">

      </input>
      <button type="submit">Click me</button>
    </form>
    </div>
  )
}