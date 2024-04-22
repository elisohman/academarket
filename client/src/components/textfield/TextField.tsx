import React from 'react';
import './text-field.scss';

interface TextFieldProps {
    id: string;
    inputClassName?: string;

    label?: string;
    placeholder?: string;

    type: string;
}

const TextField: React.FC<TextFieldProps> = ({id, inputClassName, label ="", placeholder="",type}) => {
    return(
        <>
        
            <label htmlFor={id}>{label}</label>
            <input className={`border-2 p-1 border-slate-250 rounded-md ${inputClassName}`} id={id} type={type} placeholder={placeholder} />
        </>
    );
};

export default TextField;