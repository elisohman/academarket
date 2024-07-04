import React from 'react';

interface ModularListProps{
    headers: string[]; // give an array of strings with name of col
    items?: any;
    onClickFunction?: (item: any) => void;
    className?: string;
};

const ModularList: React.FC<ModularListProps> = ({headers, items, onClickFunction = () => {}, className}) => {


    return (
            <div className="bg-slate-100 rounded p-4 bg-transparent vscreen:text-smaller">
                <div className="grid gap-4 items-center content-center mb-2" style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>                            
                    {headers.map((header, index) => (
                                <div key={index} className="">
                                    {header}
                                </div>
                            ))}

                        </div>
                        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                            {items.map((item: any) => (
                            <div
                                key={item.id}
                                className="grid gap-4 py-2 border-b last:border-none cursor-pointer hover:bg-gray-100"
                                style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }} 
                                onClick={() => onClickFunction(item)}
                            >
                                {headers.map((header, index) => (
                                <div key={index} className="">
                                    {item[index]}
                                </div>
                                ))}
                            </div>
                            ))}
                        </div>
                </div>
    );
};

export default ModularList;