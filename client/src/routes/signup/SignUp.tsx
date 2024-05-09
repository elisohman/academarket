//import React from 'react';
//import logo from './logo.svg';
import './signup.scss';
import Button from '../../components/button/Button';
import TextField from '../../components/textfield/TextField';
import { useNavigate } from 'react-router-dom';
import PopupMessage from '../../components/popupMessage/PopupMessage';
import React, { useState } from 'react';

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

  const handleClick = async () => {

    setPopupMessageClassName('text-red-500');

    let uname_input = document.getElementById("uname_input") as HTMLInputElement;
    let uname = uname_input.value;
    
    let email_input = document.getElementById("email_input") as HTMLInputElement;
    let email = email_input.value;

    let password_input=  document.getElementById('password_input') as HTMLInputElement;
    let password = password_input.value;

    let repeat_password_input = document.getElementById('repeat_password_input') as HTMLInputElement;
    let repeat_password = repeat_password_input.value;
    
    if (uname === '' ){
      setPopupMessage('Please enter a valid username');
      setShowPopup(true);
      return;
    }

    if (email === '' ){
      setPopupMessage('Please enter a valid email');
      setShowPopup(true);
      return;
    }

    if (password === '' || repeat_password === ''){
      setPopupMessage('Please enter a valid password');
      setShowPopup(true);
      return;
    }

    if (password !== repeat_password) {
      setPopupMessage('Passwords do not match');
      setShowPopup(true);
      return;
    }

    const data = {
      username: uname,
      email: email,
      password: password
    };

    try {
      const response = await fetch('http://localhost:8000/api/sign_up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      //const responseData = await response.json();

      if (response.ok) {
        // Handle successful sign-in
        console.log('Successful sign-up:');
        setPopupMessageClassName('text-green-500')
        setPopupMessage('Successfully signed up! Redirecting to login page...');
        setShowPopup(true);  
        // Navigate to home or dashboard page
        setTimeout(() => {
          navigate("/signin");
        }, 1500);
        //navigate("/signin");
      } else {
        // Handle sign-in error
        console.error('Sign-up failed:');
        // You can display an error message to the user if needed
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      // You can display an error message to the user if needed
    }
  };
  return (
    <>
      <div className="sign-in-container size-full bg-slate-100 flex flex-col justify-center items-center gap-y-2">
        <img src={monkey} alt="monkey logo" width="10%" className='p-1 rounded-full'/>

        <form className="flex flex-col gap-y-1">
            <TextField inputClassName="placeholder-slate-600" id="uname_input" type="text" placeholder="Username"/>
            <TextField inputClassName="placeholder-slate-600" id="email_input" type="text" placeholder="E-mail" />
            <TextField inputClassName="placeholder-slate-600" id="password_input" type="password" placeholder="Password" />
            <TextField inputClassName="placeholder-slate-600" id="repeat_password_input" type="password" placeholder="Repeat password" />

            <Button onClick={handleClick} className='w-full mt-2 self-center text-slate-50 uppercase p-3 rounded-md'>Sign up</Button>
        </form>
        
        <Button onClick={returnToSignIn} className='px-4 py-2 mt-1 bg-transparent text-slate-600 text-sm border-solid border rounded-full border-slate-600'>← Return to login</Button>
        <PopupMessage message={popupMessage} show={showPopup} onClose={() => setShowPopup(false)} className={popupMessageClassName}/>

        
   
      </div>
    </>
  );
}



export default SignUp;
