//import React from 'react';
//import logo from './logo.svg';
import './signup.scss';
import Button from '../../components/button/Button';
import TextField from '../../components/textfield/TextField';
import { Navigate, useNavigate } from 'react-router-dom';
const monkey = './assets/images/bg-monkeys.jpg';
//const monkey = './assets/images/minimalistic-monkey';

function SignUp() {
  const navigate = useNavigate(); // Get history object
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
      <div className="sign-in-container size-full bg-cyan-400 flex flex-col justify-center items-center gap-y-2">
        <img src={monkey} alt="monkey logo" width="10%" className='p-1 rounded-full'/>
        
        <h1 className='text-3xl font-bold underline text-center p-1'>Sign up</h1>
        
        
        <form className="flex flex-col gap-y-1">
            <TextField id="uname_input" type="text" label="Username:" placeholder=""/>
            <TextField id="email_input" type="text" label="E-mail:" placeholder=""/>
            <TextField id="password_input" type="password" label="Password:" placeholder=""/>
            <TextField id="repeat_password_input" type="password" label="Repeat password:" placeholder=""/>

            <Button onClick={handleClick} className='bg-blue-700 border-blue-800'>Sign up</Button>
        </form>
        

        
      </div>
    </>
  );
}



export default SignUp;
