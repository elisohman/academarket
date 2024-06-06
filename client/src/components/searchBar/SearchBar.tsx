import React from 'react';
import './search-bar.scss';
import Button from '../button/Button';

interface SearchBarProps {
    input: string;
    placeholder?: string;
    inputClassName?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ input = "", placeholder = "", inputClassName}) => {
    return (
        <>
            <div className='flex flex-row'>
            <input
                value={input} 
                placeholder={placeholder}  
                className={`border-2 p-1 border-light-gray rounded-md ${inputClassName}`} 
            />
            <Button className="px-6 mx-2 font-semibold text-secondary-color mt-4 bg-white rounded-full py-4 hover:bg-black hover:text-white transition duration-300 ease-in-out">Search</Button>

            </div>

        </>
        
    );
};

export default SearchBar;