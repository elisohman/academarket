import PageWrapper from "../../components/pagewrapper/PageWrapper";
import Button from '../../components/button/Button';
import ChartComponent from "../../components/chart/ChartComponent";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useRef } from "react";
import { generateCandlestickData } from "./DataGenerator";
import Switch from "../../components/switch/Switch";
import TextField from "../../components/textfield/TextField";
import SearchBar from "../../components/searchBar/SearchBar";
import ModularList from "../../components/modularList/ModularList";
import sendRequest from "../../utils/request";
import { ACCESS_TOKEN } from "../../utils/constants";

const coursesExampleData = { // Proposed structure for courses (backend should return in a similar format) -Jack
    headers: ['Course Code', 'Course Name', 'Price', 'Price Change (24h)'],
    items: [
        ['LNCH01', 'Lunchföreläsning med Dr. Göran Östlund', 6000, '+5%'],
        ['TÄTÄ24', "Urbans linjär algebra crash course", 900, '-2%'],
    ]
}


const Trading = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCourseCode = urlParams.get('course');
    const isFromPortfolio = urlParams.get('fromPortfolio');

    const coursesBase = coursesExampleData;
    const [courses, setCourses] = useState<any>(coursesBase);
    const navigate = useNavigate();
    
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

    
    
    const [searchText, setSearchText] = useState<string>('');
    const searchTextRef = useRef<string>(searchText);
    const updateSearchText = (text: string) => {
        setSearchText(text);
        searchTextRef.current = text;
    }


    const handleRowClick = (course: any) => {
        navigate(`/trading?course=${course[0]}`, { state: { course } });
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
            2: "col-span-1 justify-self-end pr-16 vscreen:pr-2 text-sky-400 font-light",
            3: "col-span-1 justify-self-end pr-16 vscreen:pr-3 " + priceChangeColor(content.toString())
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
        2: "col-span-1 justify-self-end pr-16 vscreen:pr-2 text-center font-medium",
        3: "col-span-1 justify-self-end text-center font-medium",
    } as { [key: number]: string };  





    const [activeSection, setActiveSection] = useState<string>('browse'); // State to switch sections

    const [data, setData] = useState<any>(null);
    const dataURL = './assets/data/temp-data.json' // file in public directory
    const candlestickData = generateCandlestickData();

    const predefinedValues = [50, 100, 500, 1000];

    const [amount, setAmount] = useState<number | string>('');

    const handleButtonClick = (value: number) => {
        setAmount(value);
      };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            const numValue = value === '' ? '' : parseInt(value);
            setAmount(numValue);
        }
    };

    const returnToList = () => {
        if (isFromPortfolio){
            navigate('/portfolio');
        } else {
            navigate('/trading');
        }
    }
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(dataURL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setData(jsonData['TATA24']['course_code']);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        let token = localStorage.getItem(ACCESS_TOKEN);
        if (token){
            fetchEconomics(token);
            fetchData();
        }
        
         
    }, []);

    useEffect(() => {
        console.log(selectedCourseCode);
        if (selectedCourseCode) {
            setActiveSection('trade');
        }
        else {
            setActiveSection('browse');
        }
    }, [selectedCourseCode]);


    if (activeSection === "browse"){
        return (
            <PageWrapper>
                <div className="overflow-auto bg-sky-50 rounded p-4 flex flex-col ">

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

                    <ModularList content={courses} itemsColumnClassFunc={checkColumnContent} headerColumnClassName={columnHeaderClasses} onItemClick={handleRowClick} ></ModularList>
                </div>

            </PageWrapper>
        )
    } else {
        return (
            <PageWrapper>
                <div className="size-full flex flex-row gap-5 rounded-3xl">
                    <div id="graph_window" className="bg-light-gray grow shrink rounded-3xl flex flex-col justify-center items-center">
                        <div className="self-start pt-4">
                            <Button className="size-10 pl-2" onClick={() => returnToList()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                            </svg>
                            </Button>


                        </div>
                        <div className="pb-5 pl-5 self-start gap-5">
                                <p className="font-medium text-secondary-color">{data}</p>     
                        </div>
                        <div className="flex grow w-full px-5 pb-5">
                            <ChartComponent data={candlestickData}/>
                        </div>
                    </div>
                    <div id="trade_window" className="p-5 bg-primary-color max-w-fit rounded-3xl">
                        <div className="flex flex-col h-full">
                            <h1 className="text-white mb-8 font-medium select-none">Make a trade</h1>
                            <Switch/>
                            {/*<div id="button-container" className="flex gap-4">
                                <Button className='w-full mt-8 self-center text-slate-50 uppercase py-2 px-8 bg-primary-color border-2'>Buy</Button>
                                <Button className='w-full mt-8 self-center text-slate-50 uppercase py-2 px-8 bg-red-400 border-2'>Sell</Button>
                            </div>*/}
                            <div className="mt-8">
                                <p className="text-light-gray font-medium select-none">Amount</p>
                                <TextField 
                                    inputClassName="w-full p-3 rounded-md border-2 bg-transparent text-white" 
                                    id="amount-field" 
                                    type="text" 
                                    onChange={handleInputChange} 
                                    value={amount}
                                />
                            </div>
                            <div className="mt-2 gap-3 flex select-none">
                                {predefinedValues.map((value) => {
                                    return (
                                        <div 
                                            key={value} 
                                            className="flex px-3 rounded-full border-2 border-light-gray text-xs text-light-gray cursor-pointer hover:bg-white hover:text-[#4ADE80] transition duration-300 ease-in-out"
                                            onClick={() => handleButtonClick(value)}
                                        >
                                            {value}
                                        </div>
                                    )
                                })}
                            </div>
                            <Button className="mt-auto font-semibold text-secondary-color mt-8 bg-white rounded-full py-4 hover:bg-black hover:text-white transition duration-300 ease-in-out">CONTINUE</Button>

                        </div>
                    </div>
            </div>
        </PageWrapper>
    );
    }
    
};

export default Trading;