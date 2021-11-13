import cookies from 'next-cookies';
import RegisterSection from '../../sections/registerSection/registerSection';

export async function getServerSideProps(context) { 
  const { accessToken } = cookies(context)
  const { res } = context
  let shouldRedirect = false;
  if(accessToken) {
    shouldRedirect = true
  }

  if(shouldRedirect){
    res.writeHead(307, {
      Location: '/account',
    })
    res.end();
  }

  return {props: {}}
}

export default function Register(){
  return (
    <RegisterSection />
  )
}