//import React from 'react';
//import logo from './logo.svg';
import './signup.scss';
import Button from '../../components/button/Button';
import TextField from '../../components/textfield/TextField';
import { Navigate, useNavigate } from 'react-router-dom';
const monkey = './assets/images/bg-monkeys.jpg';
//const monkey = './assets/images/minimalistic-monkey';

const SignUp: React.FC = () => {
  const navigate = useNavigate(); // Get history object
  const returnToSignIn = () => {
    navigate("/signin");
  }
  const handleClick = async () => {
   


    let uname_input = document.getElementById("uname_input") as HTMLInputElement;
    let uname = uname_input.value;
    let password_input=  document.getElementById('password_input') as HTMLInputElement;
    let password = password_input.value;
    
    const data = {
      username: uname,
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
        // Navigate to home or dashboard page
        navigate("/signin");
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

            <Button onClick={handleClick} className='w-full mt-2 self-center text-slate-50 uppercase p-3'>Sign up</Button>
        </form>
        
        <Button onClick={returnToSignIn} className='w-32 h-10 mt-1 bg-transparent text-slate-600 text-sm border-solid border rounded-3xl border-slate-600'>← Return to login</Button>

        
      </div>
    </>
  );
}



export default SignUp;
