//import React from 'react';
//import logo from './logo.svg';
import './signup.scss';
import Button from '../../components/button/Button';
import TextField from '../../components/textfield/TextField';
import { useNavigate } from 'react-router-dom';
import PopupMessage from '../../components/popupMessage/PopupMessage';
import React, { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
//import sendRequest from '../../utils/request';

const monkey = './assets/images/bg-monkeys.jpg';
//const monkey = './assets/images/minimalistic-monkey';

const SignUp: React.FC = () => {
  const navigate = useNavigate(); // Get history object
  const returnToSignIn = () => {
    navigate("/signin");
  }

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');    
  //var popupMessageClassName = '';
  const [popupMessageClassName, setPopupMessageClassName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const { signUp } = useAuthContext();

  const handleSignup = async () => {

    setPopupMessageClassName("text-red-500");
    
    if (username === '' ){
      setShowPopup(false);
      setPopupMessage('Please enter a valid username');
      setShowPopup(true);
      return;
    }

    if (email === '' ){
      setPopupMessage('Please enter a valid email');
      setShowPopup(true);
      return;
    }

    if (password === '' || repeatPassword === ''){
      setPopupMessage('Please enter a valid password');
      setShowPopup(true);
      return;
    }

    if (password !== repeatPassword) {
      setShowPopup(false);
      setPopupMessage('Passwords do not match');
      setShowPopup(true);
      return;
    }

    const status = await signUp(username, email, password, repeatPassword);

      if (status === 201) {
        console.log('Successful sign-up:');
        localStorage.setItem('signupSuccess', 'true');
        navigate("/signin");  
        
      } else {
        console.log(status)
        setPopupMessage('Unsuccesful sign-up. Perhaps the user already exists?');
        setShowPopup(true); 
        console.error('Sign-up failed:');
      }
  };
  return (
    <>
      <div className="sign-in-container size-full bg-slate-100 flex flex-col justify-center items-center gap-y-2">
        <img src={monkey} alt="monkey logo" width="10%" className='p-1 rounded-full'/>

        <form className="flex flex-col gap-y-1">
            <TextField inputClassName="placeholder-slate-600" id="uname_input" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <TextField inputClassName="placeholder-slate-600" id="email_input" type="text" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <TextField inputClassName="placeholder-slate-600" id="password_input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <TextField inputClassName="placeholder-slate-600" id="repeat_password_input" type="password" placeholder="Repeat password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}/>

            <Button onClick={handleSignup} className='bg-primary-color w-full mt-2 self-center text-slate-50 uppercase p-3 rounded-md'>Sign up</Button>
        </form>
        
        <Button onClick={returnToSignIn} className='px-4 py-2 mt-1 bg-transparent text-slate-600 text-sm border-solid border rounded-full border-slate-600'>← Return to login</Button>
        <PopupMessage message={popupMessage} show={showPopup} onClose={() => setShowPopup(false)} classColor={popupMessageClassName}/>

        
   
      </div>
    </>
  );
}



export default SignUp;
