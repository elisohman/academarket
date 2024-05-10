//import React from 'react';
//import logo from './logo.svg';
import './signin.scss';
import Button from '../../components/button/Button';
import TextField from '../../components/textfield/TextField';
import PopupMessage from '../../components/popupMessage/PopupMessage';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
const monkey = './assets/images/bg-monkeys.jpg';

const SignIn: React.FC = () => {
  const navigate = useNavigate(); // Get history object
  const goToSignUp = () => {
    navigate("/signup");

  }
  
const [showPopup, setShowPopup] = useState(false);
const [popupMessage, setPopupMessage] = useState('');

const handleClick = async () => {
    let uname_input = document.getElementById("uname_input") as HTMLInputElement;
    let uname = uname_input.value;
    let password_input=  document.getElementById('password_input') as HTMLInputElement;
    let password = password_input.value;
    
    if (uname === '') {
      setPopupMessage('Please enter a username');
      setShowPopup(true);
      return;
    }
    if (password === '') {
      setPopupMessage('Please enter a password');
      setShowPopup(true);
      return;
    }

    const data = {
      username: uname,
      password: password
    };

    try {
      const response = await fetch('http://localhost:8000/api/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        console.error('Sign-in failed:');
        console.log(response.status);
        setPopupMessage('Please enter valid credentials');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error during sign-in:', error);

      // You can display an error message to the user if needed
    }
  };
    
  return (
    <>
      <div className="sign-in-container size-full bg-slate-100 flex flex-col justify-center items-center gap-y-2">
        <img src={monkey} alt="monkey logo" width="10%" className='p-1 rounded-full'/>
        
        <form className="flex flex-col gap-y-1">
          <TextField inputClassName="placeholder-slate-600" id="uname_input" type="text" placeholder="Username" />
          <TextField inputClassName="placeholder-slate-600" id="password_input" type="password" placeholder="Password"/>
          <Button className='w-full mt-2 self-center text-slate-50 uppercase p-3 rounded-md' onClick={handleClick}>Sign in</Button>
        </form>

        <div className=''>
          <Button onClick={goToSignUp} className='px-4 py-2 mt-1 bg-transparent text-slate-600 text-sm border-solid border rounded-full border-slate-600'>Sign up here →</Button>
        </div>
        <PopupMessage message={popupMessage} show={showPopup} onClose={() => setShowPopup(false)} classColor='text-red-500'/>
      </div>
    </>
  );
}



export default SignIn;
