import React, { useState, useEffect } from 'react';
import './popup-message.scss';


interface PopupMessageProps {
    message: string;
    show: boolean;
    onClose: () => void;
    duration?: number;
    className?: string;
}

const PopupMessage: React.FC<PopupMessageProps> = ({ message, show, onClose, duration=1000, className }) => {
    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
      const timeout = setTimeout(() => {
        //setIsVisible(!isVisible);
        onClose();
      }, duration); // Change the duration as needed
  
      return () => clearTimeout(timeout);
    }, [show]);
   

    return (
        <div className="flex justify-center items-center p-5">
            <div className={`${show ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 ease-in-out text-slate-500 absolute self-center ${className}`}>
                <p>
                    {message}
                </p>
            </div>
        </div>
    );

};

export default PopupMessage;
