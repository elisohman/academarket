import React from 'react';
import './search-bar.scss';
import Button from '../button/Button';

interface SearchBarProps {
    input: string;
    setInput: (input: string) => void;

    placeholder?: string;
    inputClassName?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onButtonClick?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ input, setInput, placeholder = "", inputClassName, onButtonClick}) => {
    return (
        <>
            <div className='flex flex-row'>
            <input
                type="text"
                value={input} 
                placeholder={placeholder}  
                onChange={(e) => setInput(e.target.value)}
                className={`border-2 p-1 border-light-gray rounded-md ${inputClassName}`} 
            />
            <Button className="px-6 mx-2 font-semibold text-secondary-color mt-4 bg-white rounded-full py-4 hover:bg-black hover:text-white transition duration-300 ease-in-out"
                    onClick={onButtonClick}>
                Search
            </Button>

            </div>

        </>
        
    );
};

export default SearchBar;