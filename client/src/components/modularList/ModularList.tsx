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



import React from 'react';


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
    let headers: any[] = [];
    let items: any[] = [];
    if (content.headers && content.items){
        headers = content.headers;
        items = content.items;
    }
    
    return (
        <div className={`bg-slate-100 bg-transparent vscreen:text-smallerer my-2 ${className}`}>
            <div className="grid px-2 pb-2 items-center " style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>                            
                {headers.map((header, index) => (
                            <div key={index} className={`${index in headerColumnClassName ? headerColumnClassName[index] : ""}`}>
                                {headerColumnContentAddon[index] ? header+headerColumnContentAddon[index] : header}
                            </div>
                        ))}

            </div>
            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                {items.map((item: any) => (
                <div
                    key={item.id}
                    className="grid px-2 py-2 border-b last:border-none cursor-pointer hover:bg-gray-100 items-center content-center vscreen:text-smaller vscreen:truncate transition duration-200 ease-in-out"
                    style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }} 
                    onClick={() => onItemClick(item)}
                >
                    {headers.map((header, index) => (
                    <div key={index} className={`${itemsColumnClassFunc(index, item[index])}`}>
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