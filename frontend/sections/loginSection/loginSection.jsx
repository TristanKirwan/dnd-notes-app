import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'; 
import clsx from 'clsx';

import Container from '../../components/Container/container';
import Input from '../../components/Input/input';
import Button from '../../components/Button/button';
import Link from '../../components/Link/link';

import setAccessToken from '../../utils/setAccessToken'
import { useStore } from '../../store/provider'

import style from './loginSection.module.scss';


export default function LoginSection(){
  const [loginError, setLoginError] = useState(null)

  const usernameInput = useRef(null)
  const passwordInput = useRef(null)

  const router = useRouter();
  const { dispatch } = useStore();

  async function submitLoginForm(e){
    e.preventDefault();
    const username = usernameInput.current.value
    const password = passwordInput.current.value
    
    if(username && password) {
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        username: username,
        password: password
      })
      .then(result => {
        const token = result.data.accessToken
        setAccessToken(token)
        dispatch({type: 'LOGIN', payload: {
          username: username
        }})
        router.push('/')
      })
      .catch(err => {
        console.error(err)
        if(err.response && err.response.data && (err.response.data.notFound || err.response.data.passwordIncorrect)){
          setLoginError('The combination of username/password is incorrect. Please try again.')
          passwordInput.current.value = '';
        }
      })
    }
  }

  function onInputFocus(){
    if(!loginError) return
    setLoginError(null)
  }

  return (
    <section className={style.loginSection}>
      <Container>
        <div className={style.loginCard}>
          <h2 className={style.headerText}>Log in</h2>
            <form className={clsx([style.loginForm, loginError && style.hasError])} onSubmit={submitLoginForm}>
              <div className={style.inputGroup}>
                <Input type="text" inputCallBack={onInputFocus} required passedRef={usernameInput} passedClass={style.loginInput}  hasLabel labelText={"Username"} id="register-Username"></Input>
              </div>
              <div className={style.inputGroup}>
                <Input type="password" inputCallBack={onInputFocus} required passedRef={passwordInput} passedClass={style.loginInput}  hasLabel labelText={"Password"} id="register-Password"></Input>
              </div>
              {loginError && <p className={style.formError}>
                {loginError}
              </p>}
              <div className={style.ctaContainer}>
                <Button href="/login" type="submit">
                  Log in
                </Button>
                <Link href={"/register"} linkClass={style.loginLink}>No account yet?</Link>
              </div>
            </form>
        </div>
      </Container>
    </section>
  )
}