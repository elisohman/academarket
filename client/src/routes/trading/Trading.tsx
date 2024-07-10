import PageWrapper from "../../components/pagewrapper/PageWrapper";
import Button from '../../components/button/Button';
import ChartComponent from "../../components/chart/ChartComponent";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useRef } from "react";
import { generateCandlestickData } from "./DataGenerator";
import Switch from "../../components/switch/Switch";
import TextField from "../../components/textfield/TextField";
import SearchBar from "../../components/searchBar/SearchBar";
import ModularList from "../../components/modularList/ModularList";
import sendRequest from "../../utils/request";
import { ACCESS_TOKEN } from "../../utils/constants";
import { getToken } from "../../utils/network";

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
    const allCourses = useRef<any>(); // keeps track of all courses while making multiple searches
    const [courses, setCourses] = useState<any>({headers: [], items: []});
    const navigate = useNavigate();
    const [balance, setBalance] = useState<string>('');
    const [isBuying, setIsBuying] = useState<boolean>(true);

    const candlestickData = generateCandlestickData();

    const fetchEconomics = async (accessToken : string) => {
        const response = await sendRequest('/user_info', 'GET', undefined, accessToken);
        if (response.ok) {
            const responseData = await response.json();
            setBalance(responseData.balance);
        } else {
            console.log("Error when getting user info");
        }
    }

    const fetchCourses = async (accessToken : string) => {
        /*
            There exists a race condition, if access token needs to be refreshed at the same time as get requests
            then access token is unathorized. Minor problem though when access token has a lifetime that isn't super short (15 seconds)
        */
        const response = await sendRequest('/all_courses', 'GET', undefined, accessToken);

        if (response.ok) {
            const courseData = await response.json();
            allCourses.current = courseData; // save all courses as a ref for searches
            setCourses(allCourses.current);
        }
        else {
            console.log(accessToken);
            console.log("Error when getting course data");
        }
    }

    const callCourseFetchTradeData = async () => {
        const token = await getToken();
        fetchCourseTradeData(token);
    }

    const [courseTradeData, setCourseTradeData] = useState<any>(null);
    const fetchCourseTradeData = async (accessToken : string) => {
        const courseTradeDataURL = '/get_course_data?course='+selectedCourseCode // file in public directory
        try {
            const response = await sendRequest(courseTradeDataURL, 'GET', undefined, accessToken);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            console.log(jsonData);
            setCourseTradeData(jsonData); // Object { course_code: "SNOP20", name: "Hur man diskar en Pensel, med flerfaldigt prisbelönta Göran Östlund", price: 13013, price_history: null }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        
    };
    
    const fetchAllData = async () => {
        //const token = localStorage.getItem(ACCESS_TOKEN);
        const token = await getToken();
        console.log("Awaited token (fetchAllData): "+token)
        if (token) {
            fetchEconomics(token);
            fetchCourses(token);
            if (activeSection === 'trade') {
                fetchCourseTradeData(token);
            }

        }
    };
    
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
        if (allCourses.current) {

            const filteredItems = allCourses.current.items.filter((item: any) => {
                const courseCode = item[0];
                return courseCode.includes(searchTextRef.current.toUpperCase());
            });
            setCourses({ headers: allCourses.current["headers"], items: filteredItems });
        }
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

    const itemsContentAddon = {
        2: " APE",
    };

    const [activeSection, setActiveSection] = useState<string>('browse'); // State to switch sections

    const predefinedValues = [50, 100, 500, 1000];

    const [amount, setAmount] = useState<number>(0);

    const handleButtonClick = (value: number) => {
        setAmount(value);
      };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            const numValue = value === '' ? 0 : parseInt(value);
            setAmount(numValue);
        }
    };

    const returnToList = () => {
        if (isFromPortfolio){
            navigate('/portfolio');
        } else {
            navigate('/trading');
        }
    };

    useEffect(() => {
        //const token = getToken();
        console.log("Fetch all data useEffect ran, test token:")
        //console.log(token)
        fetchAllData();
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
    
    useEffect(() => {
        if (activeSection == 'trade') {
            callCourseFetchTradeData();
        }
    }, [activeSection]);

    const buyStock = async () => {   
        // await getToken();
        const token = await getToken();
        console.log("I got the token man"); console.log(token);
        if (token) {
            if (!courseTradeData) {
                console.error('No course data');
                return;
            }
            let courseCode: string = courseTradeData["course_code"];
            let buyAmount: number = amount;
            if (buyAmount <= 0) {
                console.error('Invalid amount');
                return;
            }
            const requestBody = {
                course_code: courseCode, 
                amount: buyAmount,
            }
            const response = await sendRequest('/buy_stock/', 'POST', requestBody, token);
            if (response.ok) {
                console.log('Stock bought successfully');
                fetchAllData();
            } else {
                console.error('Error buying stock');
            }
        }
    };    

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
                    </div>
                </div>
                    <ModularList content={courses} itemsColumnClassFunc={checkColumnContent} headerColumnClassName={columnHeaderClasses} itemsColumnContentAddon={itemsContentAddon} onItemClick={handleRowClick} ></ModularList>
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                            </svg>
                            </Button>

                            
                        </div>
                        <div className="pb-5 pl-5 self-start gap-5">
                                <p className="font-medium text-secondary-color">{courseTradeData ? courseTradeData["course_code"] : "Loading..."}</p>
                                <p className="font-medium text-sky-400">{courseTradeData ? courseTradeData["price"] + " APE" : "Loading..."}</p>     
    
                        </div>
                        <div className="flex grow w-full px-5 pb-5">
                            <ChartComponent data={candlestickData}/>
                        </div>
                    </div>
                    <div id="trade_window" className="p-5 bg-primary-color max-w-fit rounded-3xl">
                        <div className="flex flex-col h-full">
                            <h1 className="text-white mb-8 font-medium select-none">Make a trade</h1>
                            <Switch onToggle={setIsBuying}></Switch>
                            <div className="mt-8">
                                <p className="text-light-gray font-medium select-none">Amount</p>
                                <TextField 
                                    inputClassName={amount === 0 ? "w-full p-3 rounded-md border-2 bg-transparent text-emerald-200 select-none" : "w-full p-3 rounded-md border-2 bg-transparent text-white"} 
                                    id="amount-field" 
                                    type="text" 
                                    onChange={handleInputChange} 
                                    value={amount === 0 ? '' : amount.toString()}
                                />
                            </div>
                            <div id="amount_preset_numbers" className="mt-2 gap-3 flex select-none">
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
                            <Button className="mt-auto font-semibold text-secondary-color mt-8 bg-white rounded-full py-4 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={buyStock}>{isBuying ? "BUY" : "SELL"}</Button>

                        </div>
                    </div>
            </div>
        </PageWrapper>
    );
    }
    
};

export default Trading;