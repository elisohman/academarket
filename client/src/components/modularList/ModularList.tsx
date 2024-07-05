import React from 'react';

interface ModularListProps{
    content: {[key: string]: any[]};
    itemsColumnClassFunc?: (index: number, content: any) => string;
    headerColumnClassName?: { [key: number]: string };
    onClickFunction?: (item: any) => void;
    className?: string;
};

const ModularList: React.FC<ModularListProps> = ({content, itemsColumnClassFunc: bodyColumnClassArgsFunc = () => "", headerColumnClassName = {}, onClickFunction = () => {}, className}) => {
    let headers = content.headers;
    let items = content.items;
    return (
        <div className="bg-slate-100 bg-transparent vscreen:text-smallerer my-2">
            <div className="grid px-2 pb-2 items-center " style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>                            
                {headers.map((header, index) => (
                            <div key={index} className={`${index in headerColumnClassName ? headerColumnClassName[index] : ""}`}>
                                {header}
                            </div>
                        ))}

            </div>
            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                {items.map((item: any) => (
                <div
                    key={item.id}
                    className="grid px-2 py-2 border-b last:border-none cursor-pointer hover:bg-gray-100 items-center content-center vscreen:text-smaller vscreen:truncate"
                    style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }} 
                    onClick={() => onClickFunction(item)}
                >
                    {headers.map((header, index) => (
                    <div key={index} className={`${bodyColumnClassArgsFunc(index, item[index])}`}>
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