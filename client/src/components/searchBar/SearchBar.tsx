import React, { useEffect } from 'react';
import './search-bar.scss';
import Button from '../button/Button';

interface SearchBarProps {
    input: string;
    setInput: (input: string) => void;
    placeholder?: string;
    buttonText?: string;
    inputClassName?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onButtonClick?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ input, setInput, placeholder = "", buttonText = "Search", inputClassName, onButtonClick = () => {return}, onChange = () => {return}}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onButtonClick();
        }
    };

    function onChangeFunction(e: React.ChangeEvent<HTMLInputElement>){
        setInput(e.target.value);
        onChange(e);
    };

    return (
        <>
            <div className='flex flex-row'>
                <input
                    type="text"
                    value={input} 
                    placeholder={placeholder}  
                    onChange={(e) => onChangeFunction(e)}
                    className={`border-2 p-2 border-light-gray rounded-md ${inputClassName}`} 
                    onKeyDown={handleKeyDown}
                />
                <Button className="mx-2 py-4 px-4 font-medium text-secondary-color bg-white rounded-full hover:bg-black hover:text-white transition duration-300 ease-in-out " onClick={onButtonClick}>
                    {buttonText}
                </Button>

            </div>

        </>
        
    );
};

export default SearchBar;