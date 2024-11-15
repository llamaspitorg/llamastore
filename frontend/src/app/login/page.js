import React from 'react';
import GoogleAuth from '../../components/googleauth'; // Adjust the path if `SignIn` is in a subfolder
import SignInForm from '@/components/signinform';
import '../../styles/login.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const LoginPage = () => {
  return (
    <div>
      <Navbar />
      <div className='container'>
        <h1>Log In</h1>
        <div className='login-form'>
          <SignInForm />
          <p>Don't have an account? <a href='/signup'>Sign Up</a></p>
          <p>Forgot your password? <a href='/reset-password'>Reset Password</a></p>
          <div className='divider'>
            <span></span>
            <p>OR</p>
            <span></span>
          </div>
          <GoogleAuth />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
