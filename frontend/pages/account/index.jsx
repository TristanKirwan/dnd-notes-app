import cookies from 'next-cookies';
import jsonwebtoken from 'jsonwebtoken';

import makeAuthorizedRequest from "../../utils/makeAuthorizedRequest";

export async function getServerSideProps(context) {
  const { accessToken } = cookies(context)
  const { res } = context
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
  let shouldRedirect = false;
  if(!accessToken) {
    shouldRedirect = true
  } else {
    jsonwebtoken.verify(accessToken, accessTokenSecret, (err, user) => {
      if(err) {
        shouldRedirect = true
      }
    })
  }

  if(shouldRedirect){
    res.writeHead(307, {
      Location: '/login',
      'Set-Cookie': 'accessToken=deleted; Expires=Thu, 31 Oct 2000 07:28:00 GMT;'
    })
    res.end();
  }

  // Get connected campaigns of this account :)

  return {props: {}}
}


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