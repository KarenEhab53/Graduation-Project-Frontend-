import React from 'react'
import styles from './Login.module.css'
import { NavLink } from 'react-router-dom';

const Login  = () => {
  return (
    <div className={styles.inputs}>
      <input type="text" placeholder={`Enter your email`} />
      <input type="password" placeholder={`Enter your Password`} />
      <button className={styles.login}>Login</button>
      <NavLink>Forget your password?</NavLink>
      <NavLink to='/auth/sign-up'>You Don't have account</NavLink>
    </div>
  );
}

export default Login 