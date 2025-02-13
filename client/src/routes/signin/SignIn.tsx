//import React from 'react';
//import logo from './logo.svg';
import './signin.scss';
import Button from '../../components/button/Button';
import TextField from '../../components/textfield/TextField';
import PopupMessage from '../../components/popupMessage/PopupMessage';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {useAuthContext} from '../../contexts/AuthContext';
import { useUserContext } from '../../contexts/UserContext';

const monkey = './assets/images/bg-monkeys.jpg';

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const goToSignUp = () => {
    navigate("/signup");
  }
  
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupMessageColor, setPopupMessageColor] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {signIn, authTokens, user} = useAuthContext();
  
  // This useEffect part is to correctly show the message (once!) after a new successful sign up has redirected the user here // Jack
  useEffect(() => {
    if (localStorage.getItem('signupSuccess') === 'true') {
      
        setPopupMessageColor('text-green-500');
        setPopupMessage('Successfully signed up!');
        localStorage.removeItem('signupSuccess');
        return () =>  setShowPopup(true);
    }
  }, [showPopup]);
  
  useEffect(() => {
    if (authTokens && user) {
      navigate('/dashboard');
    }
  }, [authTokens, user, navigate]);

const handleSignin = async () => {
  if (username === '') {
    setPopupMessageColor('text-red-500');
    setPopupMessage('Please enter a username');
    setShowPopup(true);
    return;
  }
  if (password === '') {
    setPopupMessageColor('text-red-500');
    setPopupMessage('Please enter a password');
    setShowPopup(true);
    return;
  }

  const status = await signIn(username, password);
  console.log('status:', status);
  if (status === 200) {
    setShowPopup(false);
  } else {
    setPopupMessageColor('text-red-500');
    setPopupMessage('Please enter valid credentials');
    setShowPopup(true);
  }
}
/*

    try {
      const response = await sendRequest('/sign_in/', 'POST', data);
      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem('access_token', responseData.access);
        localStorage.setItem('refresh_token', responseData.refresh);
        setShowPopup(false);
        console.log('Sign-in successful');
        navigate("/dashboard");
      } else {
        console.error('Sign-in failed:');
        console.log(response.status);
        setPopupMessageColor('text-red-500');
        setPopupMessage('Please enter valid credentials');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };
  */

  return (
    <>
      <div className="sign-in-container size-full bg-slate-100 flex flex-col justify-center items-center gap-y-2">
        <img src={monkey} alt="monkey logo" width="10%" className='p-1 rounded-full'/>
        
        <form className="flex flex-col gap-y-1">
          <TextField inputClassName="placeholder-slate-600" id="uname_input" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
          <TextField inputClassName="placeholder-slate-600" id="password_input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <Button className='bg-primary-color w-full mt-2 self-center text-light-gray uppercase p-3 rounded-md hover:bg-primary-color-darker transition-all duration-300 ease-in-out' onClick={handleSignin}>Sign in</Button>
        </form>

        <div className=''>
          <Button onClick={goToSignUp} className='px-4 py-2 mt-1 bg-transparent text-secondary-color text-sm border-solid border rounded-full border-secondary-color hover:bg-secondary-color hover:text-light-gray transition-all duration-300 ease-in-out'>Sign up here →</Button>
        </div>
        <PopupMessage message={popupMessage} show={showPopup} onClose={() => setShowPopup(false)} classColor={popupMessageColor}/>
      </div>
    </>
  );
}



export default SignIn;
