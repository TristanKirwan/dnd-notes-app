import { useRef, useState } from 'react'
import axios from 'axios'; 
import clsx from 'clsx';

import Container from '../../components/Container/container';
import Input from '../../components/Input/input';
import Button from '../../components/Button/button';
import Link from '../../components/Link/link';

import style from './loginSection.module.scss';


export default function LoginSection(){
  const [loginError, setLoginError] = useState(null)

  const usernameInput = useRef(null)
  const passwordInput = useRef(null)

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
        console.log('result:', result)
      })
      .catch(err => {
        if(err.response.data && (err.response.data.notFound || err.response.data.passwordIncorrect)){
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
          <p className={style.headerText}>Log in</p>
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