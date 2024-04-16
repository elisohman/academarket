//import React from 'react';
//import logo from './logo.svg';
import './signin.scss';
import Button from '../../components/button/Button';
import TextField from '../../components/textfield/TextField';
import { useNavigate } from 'react-router-dom';
const monkey = './assets/images/bg-monkeys.jpg';

function SignIn() {
  const navigate = useNavigate(); // Get history object

  const handleClick = () => {
    navigate("/signup"); // Navigate to "/signup" route
  };
  return (
    <>
      <div className="sign-in-container size-full bg-cyan-400 flex flex-col justify-center items-center gap-y-2">
        <img src={monkey} alt="monkey logo" width="10%" className='p-1 rounded-full'/>
        <h1 className='text-3xl font-bold underline text-center p-1'>Sign in</h1>
        
        
        <form action="home" className="flex flex-col gap-y-1">
          <TextField id="email_input" type="text" label="E-mail:" />
          <TextField id="password_input" type="password" label="Password:" />
          <Button>Sign in</Button>
        </form>

        <div className=''>
          <Button onClick={handleClick} className='w-40 bg-blue-700 border-blue-800'>Register new account</Button>
        </div>
        
        
      </div>
    </>
  );
}



export default SignIn;
