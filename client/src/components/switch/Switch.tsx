import { useState } from 'react';


const Switch: React.FC = () => {
    const [isBuy, setIsBuy] = useState(true);
  
    const toggleSwitch = () => {
      setIsBuy(!isBuy);
    };
  
    return (
        <div 
          className={`relative items-center rounded-full cursor-pointer w-full h-12`} 
          onClick={toggleSwitch}
        >
          <div 
            className={`absolute top-0 bottom-0 w-12 bg-white rounded-full flex items-center justify-center z-50 ${isBuy ? 'left-0' : 'left-[calc(100%-3rem)]'}`}
          >
            <span className={'text-2xl'}>
              {isBuy ? '+' : '-'}
            </span>
          </div>
          <div dir={isBuy ? "rtl" : "ltr"} className={`absolute bg-primary-color flex items-center w-3/5 h-full rounded-full text-white px-4 ${isBuy ? 'border-[3px] z-10 border-white' : 'border z-0'}`}>
            <span className={`flex-1 ${isBuy ? 'font-semibold' : 'font-light'}`}>BUY</span>
          </div>
          <div dir={isBuy ? "rtl" : "ltr"} className={`absolute bg-primary-color flex items-center w-3/5 left-[40%] h-full rounded-full text-white px-4 ${!isBuy ? 'border-[3px] z-10 border-white' : 'border z-0'}`}>
            <span className={`flex-1 ${!isBuy ? 'font-semibold' : 'font-light'}`}>SELL</span>
          </div>
        </div>
      );
    };
  
  export default Switch;