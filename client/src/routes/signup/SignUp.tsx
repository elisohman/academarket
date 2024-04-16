//import React from 'react';
//import logo from './logo.svg';
import './signup.scss';
import Button from '../../components/button/Button';
import TextField from '../../components/textfield/TextField';
const monkey = './assets/images/bg-monkeys.jpg';
//const monkey = './assets/images/minimalistic-monkey';

function SignUp() {
  
  return (
    <>
      <div className="sign-in-container size-full bg-cyan-400 flex flex-col justify-center items-center gap-y-2">
        <img src={monkey} alt="monkey logo" width="10%" className='p-1 rounded-full'/>
        
        <h1 className='text-3xl font-bold underline text-center p-1'>Sign up</h1>
        
        
        <form action="home" className="flex flex-col gap-y-1">
            <TextField id="uname_input" type="text" label="Username:" />
            <TextField id="email_input" type="text" label="E-mail:" />
            <TextField id="password_input" type="password" label="Password:" />
            <TextField id="repeat_password_input" type="password" label="Repeat password:" />

            <Button className='bg-blue-700 border-blue-800'>Sign up</Button>
        </form>
        

        
      </div>
    </>
  );
}



export default SignUp;
