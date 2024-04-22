//import React from 'react';
//import logo from './logo.svg';
import './signin.scss';
import Button from '../../components/button/Button';
import TextField from '../../components/textfield/TextField';
import { useNavigate } from 'react-router-dom';
const monkey = './assets/images/bg-monkeys.jpg';

function SignIn() {
  const navigate = useNavigate(); // Get history object
  const goToSignUp = () => {
    navigate("/signup");

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
      const response = await fetch('http://localhost:8000/api/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      console.log('We sending!');
      console.log(response);
      //const responseData = await response.json();

      if (response.ok) {
        // Handle successful sign-in
        console.log('Successful sign-in:');
        // Navigate to home or dashboard page
        navigate("/home");
      } else {
        // Handle sign-in error
        console.error('Sign-in failed:');
        // You can display an error message to the user if needed
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      // You can display an error message to the user if needed
    }
  };
    
  return (
    <>
      <div className="sign-in-container size-full bg-cyan-400 flex flex-col justify-center items-center gap-y-2">
        <img src={monkey} alt="monkey logo" width="10%" className='p-1 rounded-full'/>
        <h1 className='text-3xl font-bold underline text-center p-1'>Sign in</h1>
        
        
        <form className="flex flex-col gap-y-1">
          <TextField id="uname_input" type="text" label="Username:" />
          <TextField id="password_input" type="password" label="Password:" />
          <Button onClick={handleClick}>Sign in</Button>
        </form>

        <div className=''>
          <Button onClick={goToSignUp} className='w-40 bg-transparent border-none'>Register new account</Button>
        </div>
        
        
      </div>
    </>
  );
}



export default SignIn;
