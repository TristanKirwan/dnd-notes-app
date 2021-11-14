import jsonwebtoken from 'jsonwebtoken';

// This function should be called in the getServerSideProps of protected pages, and will fail if the user either has no access token, or it is invalid.
// The res provided by Next.js will reroute the user to the login page.

export default function checkTokenOnProtectedRoute(accessToken, res){
  // This should never happen. It cannot redirect but nonetheless we will say we have redirected as navigation can be stopped in the pages mounting.
  if(!accessToken || !res) {
    return true
  }
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
    return true
  }

  return false;
}