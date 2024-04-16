import React from 'react';
import './text-field.scss';

interface TextFieldProps {
    id: string;
    label: string;
    type: string;
}

const TextField: React.FC<TextFieldProps> = ({id, label, type}) => {
    return(
        <>

        <label htmlFor={id}>{label}</label>
        <input id={id} type={type} />

        </>
    );
};

export default TextField;