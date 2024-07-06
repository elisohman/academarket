import PageWrapper from "../../components/pagewrapper/PageWrapper";
import { useNavigate } from 'react-router-dom';
import SearchBar from "../../components/searchBar/SearchBar";
import ModularList from "../../components/modularList/ModularList";

import { useState, useEffect } from "react";


const coursesBase = { // Proposed structure for courses (backend should return in a similar format) -Jack
    headers: ['Course Code', 'Course Name', 'Amount', 'Total Value', 'Price Change (24h)'],
    items: [
        ['LNCH01', 'Lunchföreläsning med Dr. Göran Östlund', 12, 1000, '+5%'],
        ['TÄTÄ24', "Urbans linjär algebra crash course", 5, 750, '-2%'],
    ]
}

const Portfolio: React.FC = () => {

    const [searchText, setSearchText] = useState<string>('');
    const [courses, setCourses] = useState<any>(coursesBase);
    const generateTradingSiteUrl = (course: any) => {
        const baseUrl = "https://trading-site.com/trade"; // Replace with your trading site URL
        const queryParams = new URLSearchParams({
            code: course.code,
            name: course.name,
            amount: course.amount.toString(),
            totalValue: course.totalValue.toString(),
            valueChange: course.valueChange,
        }).toString();

        return `${baseUrl}?${queryParams}`;
    };
      
    const navigate = useNavigate();

    const handleRowClick = (course: any) => {
        navigate(`/trading?course=${course[0]}`, { state: { course } });
    };
    const handleSearch = () => {
        alert(`Searching for: ${searchText}`);
    };
    const priceChangeColor = (content: string) => {
        if (content.charAt(0) === "-") {
            return "text-red-500";
        } else {
            return "text-green-500";
        }
    };

    const checkColumnContent = (index: number, content: any) => {
        const columnClassArguments = {
            0: "col-span-1 justify-self-start text-ellipsis overflow-hidden",
            1: "col-span-1 justify-self-start italic font-light line-clamp-2 mr-8 text-ellipsis overflow-hidden",
            2: "col-span-1 justify-self-end text-slate-400",
            3: "col-span-1 justify-self-end text-sky-400 font-light",
            4: "col-span-1 justify-self-end pr-16 vscreen:pr-3 " + priceChangeColor(content.toString())
        } as { [key: number]: string };  

        if (index in columnClassArguments){
            return columnClassArguments[index];
        }
        else{
            return "";
        }
    };
    // Can I make this function check the content of the div of which class it is part of?
    const columnHeaderClasses = {
        0: "col-span-1 justify-self-start text-center font-medium",
        1: "col-span-1 justify-self-start text-center font-medium",
        2: "col-span-1 justify-self-end text-center font-medium",
        3: "col-span-1 justify-self-end text-center font-medium",
        4: "col-span-1 justify-self-end text-center font-medium"
    } as { [key: number]: string };  


    //className="sm:text-smaller md:text-small lg:text-medium xl:text-large 2xl:text-larger"
    //
    return (
        <PageWrapper>
        <div className="vscreen:text-smaller">
            <div className="overflow-auto bg-slate-100 rounded flex flex-col p-4 ">
                <div className="flex flex-row">
                    <div className="flex flex-col">
                        
                        <p className="vscreen:text-small ">Available funds</p>
                        <div className="flex flex-row py-1.5">  
                            <p className="text-4xl vscreen:text-large font-extralight decoration-0">APE</p>
                            <p className="text-4xl vscreen:text-large font-medium ml-2">32,210</p>
                        </div>
                        <div className="flex flex-row vscreen:text-small">  
                            <p className="font-semibold text-green-400">+42</p>
                            <p className="px-1.5 "> since yesterday</p>
                        </div>

                    </div>
                    <div className="flex flex-col self-end mx-8">  
                        <p className="">THIS IS A SEARCH BAR</p>
                        <SearchBar input={searchText} setInput={setSearchText} onButtonClick={handleSearch} placeholder="Search course..."></SearchBar>
                        {
                            //<TestSearchBar
                            //placeholder='Sök på ärendenummer...'
                            //onChange={(e: any) => { setSearchText(e.target.value) }}
                            //onKeyDown={(e: any) => { handleSearch() }}
                            //value={searchText}/>
                        }
                        <SearchBar input={searchText} setInput={setSearchText} onButtonClick={handleSearch} placeholder="Search course..."></SearchBar>
                        {
                            //<TestSearchBar
                            //placeholder='Sök på ärendenummer...'
                            //onChange={(e: any) => { setSearchText(e.target.value) }}
                            //onKeyDown={(e: any) => { handleSearch() }}
                            //value={searchText}/>
                        }
                    </div>
                </div>
                <div className="py-4">
                 <ModularList content={courses} itemsColumnClassFunc={checkColumnContent} headerColumnClassName={columnHeaderClasses} onItemClick={handleRowClick}></ModularList>
                </div>
            </div>
             
        </div>
        </PageWrapper>
    );
};

export default Portfolio;