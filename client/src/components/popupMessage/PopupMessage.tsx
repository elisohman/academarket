import React, { useState, useEffect } from 'react';
import './popup-message.scss';


interface PopupMessageProps {
    message: string;
    show: boolean;
    onClose: () => void;
    duration?: number;
    classColor?: string;
    tailwindPadding?: string;
    className?: string;
}

const PopupMessage: React.FC<PopupMessageProps> = ({ message, show, onClose, duration=2000, classColor = 'text-slate-500', className='', tailwindPadding='p-5'}) => {
    useEffect(() => {
      const timeout = setTimeout(() => {
        onClose();
      }, duration);
  
      return () => clearTimeout(timeout);
    }, [show]);
   

    return (
        <div className={`flex justify-center items-center ${tailwindPadding}`}>
            <div className={`${show ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 ease-in-out absolute self-center ${classColor} ${className}`}>
                <p className = "select-none">
                    {message}
                </p>
            </div>
        </div>
    );

};

export default PopupMessage;
