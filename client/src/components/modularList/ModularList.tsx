// !! PLEASE READ THESE INSTRUCTIONS IF CONFUSED ABOUT HOW TO USE THIS COMPONENT !!
// This list component is, as per its namesake, a very modular list component, but some of the functionality may not be that straight forward,
// so here's some explanations of how to pass all the parameters (you can also check the Portfolio route for a use case).
//
// The "content" parameter expects a dictionary with two keys: "headers" and "items". 
// The "headers" key should contain an array of strings, which will be used as the headers of the list, 
// while the "items" key should contain an array of arrays, where each inner array represents a row in the list. 
// The inner arrays of the items must have the same length as the "headers" array, and the elements should 
// correspond to the correct values of the columns.
//
// Example:
// const courses = {
//     headers: ['Course Code', 'Course Name', 'Amount', 'Total Value', 'Price Change (24h)'],
//     items: [
//         ['LNCH01', 'Lunchföreläsning med Dr. Göran Östlund', 12, 1000, '+5%'],
//         ['TÄTÄ24', "Urbans linjär algebra crash course", 5, 750, '-2%'],
//     ]
// }
//
//
// The "itemsColumnClassFunc" parameter is a (optional) function that takes the index of the relevant column and 
// the content of  the current cell, and is expected to return className string with Tailwind CSS classes that 
// should be applied for cells in that column.
//
// Example function to be passed:
// const checkColumnContent = (index: number, content: any) => {
//     const columnClassArguments = {
//         0: "col-span-1 justify-self-start text-ellipsis overflow-hidden",
//         1: "col-span-1 justify-self-start italic font-light line-clamp-2 mr-8 text-ellipsis overflow-hidden",
//         2: "col-span-1 justify-self-end text-slate-400",
//         3: "col-span-1 justify-self-end text-sky-400 font-light",
//         4: "col-span-1 justify-self-end pr-16 vscreen:pr-3 " + someFunction(content.toString())
//     } as { [key: number]: string };  

//     if (index in columnClassArguments){
//         return columnClassArguments[index];
//     }
//     else{
//         return "";
//     }
// };
//
//
// The "headerColumnClassName" parameter is a (optional) parameter that allows you to pass a dictionary with 
// column indexes as keys, whose values correspond to className strings that will be applied to that columns 
// cell in the header.
//
// Example:
// const columnHeaderClasses = {
//     0: "col-span-1 justify-self-start text-center font-medium",
//     1: "col-span-1 justify-self-start text-center font-medium",
//     2: "col-span-1 justify-self-end text-center font-medium",
//     3: "col-span-1 justify-self-end text-center font-medium",
//     4: "col-span-1 justify-self-end text-center font-medium"
// } as { [key: number]: string };  
//
//
// The "onItemClick" parameter is simply a function that will be called when a row is clicked, expecting to
// send the item that was clicked as an argument.
//
//
// Lastly we have the "className" parameter, which will be applied to the outermost div of the component.



import React, { useEffect, useState } from 'react';
import ArrowIcon from '../../style/icons/ArrowIcon';


interface ModularListProps{
    content: {[key: string]: any[]};
    itemsColumnClassFunc?: (index: number, content: any) => string;
    itemsColumnContentAddon?: { [key: number]: string };
    headerColumnClassName?: { [key: number]: string };
    headerColumnContentAddon?: { [key: number]: string };
    onItemClick?: (item: any) => void;
    className?: string;
};


const ModularList: React.FC<ModularListProps> = ({content, itemsColumnClassFunc = () => "", itemsColumnContentAddon = {}, headerColumnClassName = {}, headerColumnContentAddon = {}, onItemClick = () => {}, className}) => {
    
    const [sortConfig, setSortConfig] = React.useState<{key: number | null, direction: 'ascending' | 'descending' | null}>({
        key: null,
        direction: null
    });

    const [sortedItems, setSortedItems] = useState(content.items || []);

    let headers: any[] = [];
    let items: any[] = [];
    if (content.headers && content.items){
        headers = content.headers;
        items = content.items;
    }

    const getContentType = (content: any) => {
        if (typeof content === 'number') {
            return 'number';
        }
        if (typeof content === 'string') {
            return 'string';
        }
        return 'string';
    }

    const sortItems = (columnIndex: number) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === columnIndex && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        const sortedItems = [...items].sort((a, b) => {
            const aValue = a[columnIndex];
            const bValue = b[columnIndex];

            const aType = getContentType(aValue);
            const bType = getContentType(bValue);

            console.log(aType, bType);

            if (aType === 'number' && bType === 'number') {
                return direction === 'ascending' ? bValue - aValue : aValue - bValue;
            } else if(aType === 'string' && bType === 'string'){
                return direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else {
                return 0;
            }
        });

        setSortConfig({ key: columnIndex, direction });
        setSortedItems(sortedItems);
    }

    useEffect(() => {
        setSortedItems(content.items);
    }, [content.items]);
    
    return (
        <div className={`bg-slate-100 bg-transparent vscreen:text-smallerer my-2 ${className}`}>
            <div className="grid px-2 pb-3 items-center " style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>                            
                {headers.map((header, index) => (
                            <div 
                                key={`header-${index}`} // Added unique key for headers
                                className={`cursor-pointer hover:bg-light-gray-darker rounded-md px-2 ${index in headerColumnClassName ? headerColumnClassName[index] : ""}` + `${sortConfig.key === index ? " bg-light-gray-darker" : ""}`}
                                onClick={() => sortItems(index)}>
                                {headerColumnContentAddon[index] ? header+headerColumnContentAddon[index] : header}
                                {sortConfig.key === index && (sortConfig.direction === 'ascending' ? <ArrowIcon className="ml-1 w-4 h-4 inline"/> : <ArrowIcon className="ml-1 w-4 h-4 inline transform rotate-180" />)}
                            </div>
                        ))}

            </div>
            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
            {sortedItems.map((item, itemIndex) => (
                <div
                    key={item.id || itemIndex} // Ensure each row has a unique key
                    className={`odd:bg-white even:bg-light-gray hover:bg-light-gray-darker grid px-2 h-16 border-b last:border-none cursor-pointer hover:bg-gray-100 items-center content-center vscreen:text-smaller vscreen:truncate transition duration-300 ease-in-out`}
                    style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }} 
                    onClick={() => onItemClick(item)}
                >
                    {headers.map((header, index) => (
                    <div key={`cell-${itemIndex}-${index}`} // Added unique key for cells
                     className={`px-2 ${itemsColumnClassFunc(index, item[index])}`}>
                        {itemsColumnContentAddon[index] ? item[index]+itemsColumnContentAddon[index] : item[index]}
                    </div>
                    ))}
                </div>
                ))}
            </div>
        </div>
    );
};

export default ModularList;