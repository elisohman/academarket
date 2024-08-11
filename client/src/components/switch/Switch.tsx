import { useState, useEffect } from 'react';

interface SwitchProps {
  onToggle?: (isBuy: boolean) => void;
  bgColor?: string;
}

const Switch: React.FC<SwitchProps> = ( {onToggle = () => {}, bgColor = 'bg-primary-color'}) => {
    const [isBuy, setIsBuy] = useState(true);
  
    const toggleSwitch = () => {
      let switchedIsBuy = !isBuy;
      onToggle(switchedIsBuy);
      setIsBuy(switchedIsBuy);
    };
  
    return (
        <div 
          className={`relative items-center rounded-full cursor-pointer w-full h-12`} 
          onClick={toggleSwitch}
        >
          <div 
            className={`absolute top-0 bottom-0 w-12 bg-white rounded-full flex items-center justify-center z-50 ${isBuy ? 'left-0' : 'left-[calc(100%-3rem)]'}`}
          >
            <span className={'text-2xl select-none'}>
              {isBuy ? '+' : '-'}
            </span>
          </div>
          <div dir={isBuy ? "rtl" : "ltr"} className={`absolute ${bgColor} flex items-center w-3/5 h-full rounded-full text-white px-4 ${isBuy ? 'border-[3px] z-10 border-white' : 'border z-0'}`}>
            <span className={`flex-1 select-none ${isBuy ? 'font-semibold' : 'font-light'}`}>BUY</span>
          </div>
          <div dir={isBuy ? "rtl" : "ltr"} className={`absolute ${bgColor} flex items-center w-3/5 left-[40%] h-full rounded-full text-white px-4 ${!isBuy ? 'border-[3px] z-10 border-white' : 'border z-0'}`}>
            <span className={`flex-1 select-none ${!isBuy ? 'font-semibold' : 'font-light'}`}>SELL</span>
          </div>
        </div>
      );
    };
  
  export default Switch;