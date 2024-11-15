import React from 'react';
import GoogleAuth from '../../components/googleauth'; // Adjust the path if `SignIn` is in a subfolder
import SignUpForm from '@/components/signupform';
import '../../styles/login.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const SignUp = () => {
  return (
    <div>
      <Navbar />
      <div className='container'>
        <h1>Sign Up</h1>
        <div className='login-form'>
          <SignUpForm />
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

export default SignUp;
