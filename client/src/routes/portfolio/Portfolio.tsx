import PageWrapper from "../../components/pagewrapper/PageWrapper";
import { useNavigate } from 'react-router-dom';
import SearchBar from "../../components/searchBar/SearchBar";
import ModularList from "../../components/modularList/ModularList";

import { useState, useEffect, useRef } from "react";
import sendRequest from "../../utils/request";
import { ACCESS_TOKEN } from "../../utils/constants";


const coursesExampleData = { // Proposed structure for courses (backend should return in a similar format) -Jack
    headers: ['Course Code', 'Course Name', 'Amount', 'Total Value', 'Price Change (24h)'],
    items: [
        ['LNCH01', 'Lunchföreläsning med Dr. Göran Östlund', 12, 1000, '+5%'],
        ['TÄTÄ24', "Urbans linjär algebra crash course", 5, 750, '-2%'],
    ]
}

const Portfolio: React.FC = () => {
    const coursesBase = coursesExampleData;
    const [courses, setCourses] = useState<any>(coursesBase);
    const navigate = useNavigate();
    
    const [searchText, setSearchText] = useState<string>('');
    const searchTextRef = useRef<string>(searchText);
    const updateSearchText = (text: string) => {
        setSearchText(text);
        searchTextRef.current = text;
    }
    const [balance, setBalance] = useState<string>('');

    const fetchEconomics = async (access_token : string) => {
        const response = await sendRequest('/user_info', 'GET', undefined, access_token);

        if (response.ok) {
            const responseData = await response.json();
            setBalance(responseData.balance);
        } else {
            console.log("Error when getting user info");
        }

    }



    const handleRowClick = (course: any) => {
        navigate(`/trading?course=${course[0]}&fromPortfolio=true`, { state: { course } });
    };
    
    function handleSearch () {
        //alert(`Searching for: ${searchText}`);
        const filteredItems = coursesBase.items.filter((item: any) => {
            const courseCode = item[0];
            return courseCode.includes(searchTextRef.current.toUpperCase());
        });
        setCourses({ headers: coursesBase["headers"], items: filteredItems });
    };
    const priceChangeColor = (content: string) => {
        if (content.charAt(0) === "-") {
            return "text-red-500";
        } else {
            return "text-green-500";
        }
    };
    
    const onSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleSearch();
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

    const columnHeaderClasses = {
        0: "col-span-1 justify-self-start text-center font-medium",
        1: "col-span-1 justify-self-start text-center font-medium",
        2: "col-span-1 justify-self-end text-center font-medium",
        3: "col-span-1 justify-self-end text-center font-medium",
        4: "col-span-1 justify-self-end text-center font-medium"
    } as { [key: number]: string };  


    useEffect(() => {
        let token = localStorage.getItem(ACCESS_TOKEN);
        if (token){
            fetchEconomics(token);
        }
    }, []);

   
    return (
        <PageWrapper>
        <div className="vscreen:text-smaller">
            <div className="overflow-auto bg-slate-100 rounded flex flex-col p-4 ">
                <div className="flex flex-row">
                    <div className="flex flex-col">
                        
                        <p className="vscreen:text-small ">Available funds</p>
                        <div className="flex flex-row py-1.5">  
                            <p className="text-4xl vscreen:text-large font-extralight decoration-0">APE</p>
                            <p className="text-4xl vscreen:text-large font-medium ml-2">{balance}</p>
                        </div>
                        <div className="flex flex-row vscreen:text-small">  
                            <p className="font-semibold text-green-400">+42</p>
                            <p className="px-1.5 "> since yesterday</p>
                        </div>

                    </div>
                    <div className="flex flex-col self-end mx-8">  
                        <SearchBar input={searchText} setInput={updateSearchText} onButtonClick={handleSearch} placeholder="Search course code..." onChange={onSearchTextChange}></SearchBar>
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
                 <ModularList content={courses} itemsColumnClassFunc={checkColumnContent} headerColumnClassName={columnHeaderClasses} onItemClick={handleRowClick} ></ModularList>
                </div>
            </div>
             
        </div>
        </PageWrapper>
    );
};

export default Portfolio;