import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios'

import Container from '../../components/Container/container';
// import Icon from '../../components/Icon/Icon';
import Input from '../../components/Input/input';
import Button from '../../components/Button/button';
import Link from '../../components/Link/link';


import style from './registerSection.module.scss'

export default function RegisterSection(){

  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null)
  const router = useRouter();

  const usernameInput = useRef(null)
  const passwordInput = useRef(null)
  const confirmPasswordInput = useRef(null)

  function checkConfirmPassword(){
    const passwordsMatch = passwordInput.current.value === confirmPasswordInput.current.value
    if(!passwordsMatch) {
      const errorObject = {
        text: 'The confirmed password does not match the entered password.',
        listItems: null
      }
      setConfirmPasswordError(errorObject)
    }
    return passwordsMatch
  }

  function checkPasswordValidity(){
    const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
    const enteredPassword = passwordInput.current.value;

    const passwordIsValid = passwordRegex.test(enteredPassword)
    if(!passwordIsValid) {
      const errorObject = {
        text: 'The entered password is invalid. Your password must contain at least:',
        listItems: ['8 characters', '1 number', '1 capital letter', '1 lowercase letter', '1 special character']
      }
      setPasswordError(errorObject)
    }
    return passwordIsValid
  }


  async function submitRegisterForm(e) {
    e.preventDefault();
    const username = usernameInput.current.value
    const password = passwordInput.current.value
    
    const confirmIsValid = checkConfirmPassword();
    const passwordIsValid = checkPasswordValidity();
    if(confirmIsValid && passwordIsValid) {
      const result = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        username: username,
        password: password
      })
      .then((res) => {
        if(res.status === 200){
          router.push('/login')
        }
      })
      .catch(err => {
        if(err.response){
          if(err.response.data && err.response.data.userNameExists) {
            const errorObject = {
              text: 'This username is already in use.',
              listItems: null
            }
            setUsernameError(errorObject)
          }
        }
      })
    }
  }


  return (
    <section className={style.registerSection}>
      <Container>
        <div className={style.registerCard}>
          <h2 className={style.headerText}>Start your adventure</h2>
            <form className={style.registrationForm} onSubmit={submitRegisterForm}>
              <div className={style.inputGroup}>
                <Input type="text" required passedRef={usernameInput} hasLabel labelText={"Username"} id="register-Username" error={usernameError}></Input>
              </div>
              <div className={style.inputGroup}>
                <Input type="password" required passedRef={passwordInput} hasLabel labelText={"Password"} id="register-Password" error={passwordError}></Input>
              </div>
              <div className={style.inputGroup}>
                <Input type="password" required passedRef={confirmPasswordInput} hasLabel labelText={"Confirm Password"} id="register-Confirm-Password" error={confirmPasswordError}></Input>
              </div>
              <div className={style.ctaContainer}>
                <Button href="/login" type="submit">
                  Register
                </Button>
                <Link href={"/login"} linkClass={style.loginLink}>Already have an account?</Link>
              </div>
            </form>
        </div>
      </Container>
  </section>
  )
}