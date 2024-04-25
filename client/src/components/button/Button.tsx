import React from 'react';
import './button.scss';

interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}


function clickMe() {
    alert("You clicked me!");
  }

const Button: React.FC<ButtonProps> = ({children, className, onClick }) => {
    
    const handleClick = () => {
        if (onClick) {
            onClick(); // Call the onClick function if it exists
        }
    };

    return(
        <>
        
        <button 
            type="button"
            className={`bg-green-400 p-2 rounded-md ${className}`}
            onClick={handleClick} // Add onClick event handler
        >
            {children}
        </button>
        </>
    );
};

export default Button;