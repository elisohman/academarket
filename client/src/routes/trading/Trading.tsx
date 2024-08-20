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
//import sendRequest from "../../utils/request";
import { ACCESS_TOKEN } from "../../utils/constants";
//import { getToken } from "../../utils/network";
import PopupMessage from "../../components/popupMessage/PopupMessage";
//import { useBalance } from "../../contexts/UserContext";
import updateUserInfo from "../../components/topbar/TopBar"
import constants from '../../algorithm_constants.json';
import useAPI from "../../utils/network";
import { useAuthContext } from "../../contexts/AuthContext";
import { useUserContext } from "../../contexts/UserContext";

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
    const isFromPortfolioParam = urlParams.get('fromPortfolio');
    // const [isFromPortfolio, setIsFromPortfolio] = useState<boolean>(isFromPortfolioParam === 'true');
    const allCourses = useRef<any>(); // keeps track of all courses while making multiple searches
    const [courses, setCourses] = useState<any>({headers: [], items: []});
    const navigate = useNavigate();
    //const [balance, setBalance] = useState<string>('');
    const [isBuying, setIsBuying] = useState<boolean>(true);
    const {userInfo, updateUserInfo} = useUserContext();
    const [ balance, setBalance ] = useState(userInfo.balance);
    const sendRequest = useAPI();

    const [candlestickData, setCandleStickData] = useState<any>(generateCandlestickData());
    const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
    /*const fetchEconomics = async (accessToken : string) => {
        const response = await sendRequest('/user_info', 'GET');
        if (response.ok) {
            const responseData = await response.json();
            setBalance(responseData.balance);
            
        } else {
            console.log("Error when getting user info");
        }
    }*/

    const fetchCourses = async () => {
        /*
            There exists a race condition, if access token needs to be refreshed at the same time as get requests
            then access token is unathorized. Minor problem though when access token has a lifetime that isn't super short (15 seconds)
        */
       try {
              const response = await sendRequest('/all_courses', 'GET');
              if (response.status === 200) {
                const courseData = await response.data;
                allCourses.current = courseData; // save all courses as a ref for searches
                setCourses(allCourses.current);
              } else {
                console.log("Error when getting course data");
              }
       } catch (error) {
           console.error('Error fetching data:', error);
       }
    }

    const callCourseFetchTradeData = async () => {
        fetchCourseTradeData();
    }

    const [courseTradeData, setCourseTradeData] = useState<any>(null);
    const fetchCourseTradeData = async () => {
        const courseTradeDataURL = '/get_course_data?course='+selectedCourseCode // file in public directory
        try {
            const response = await sendRequest(courseTradeDataURL, 'GET');

            if (!(response.status === 200)) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.data;
            console.log(jsonData);
            
            setCourseTradeData(jsonData);
            console.log(jsonData.price_history)
            setCandleStickData(jsonData.price_history) // Object { course_code: "SNOP20", name: "Hur man diskar en Pensel, med flerfaldigt prisbelönta Göran Östlund", price: 13013, price_history: null }
        } catch (error) {
            console.error('Error fetching course trade data:', error);
        }
        
    };
    
    const fetchAllData = async () => {
        fetchCourses();
        if (activeSection === 'trade') {
            fetchCourseTradeData();
        }
        //const token = localStorage.getItem(ACCESS_TOKEN);
        /*const token = await getToken();
        console.log("Awaited token (fetchAllData): "+token)
        if (token) {
            fetchEconomics(token);
            fetchCourses(token);
            if (activeSection === 'trade') {
                fetchCourseTradeData(token);
            }

        }*/
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

    const predefinedValues = [1, 5, 10, 100];

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

        if (isFromPortfolioParam){
            navigate('/portfolio');
        } else {
            navigate('/trading');
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        console.log(selectedCourseCode);
        if (selectedCourseCode) {
            setActiveSection('trade');
            setIsBuying(true);
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

    

    const calculateEstimatedPrice = (trade_amount: number, isBuying: boolean) => {
        const priceUpdateAlgorithm = (basePrice: number): number => {
            const K = constants.K;
            const ALPHA = constants.ALPHA;
            const SCALE = constants.SCALE;

            return 1 + ((Math.pow(basePrice, ALPHA)) * (K - (K / basePrice))) * SCALE * (1 / basePrice);
        }
        
        // Function to calculate the course price update
        const calculateCoursePriceUpdate = (
            basePrice: number, 
            amount: number, 
            isBuying: boolean = true
        ): number => {
            // Generate array of prices based on isBuying flag
            const basePrices: number[] = [];
            
            if (isBuying) {
                for (let i = basePrice; i < basePrice + amount; i++) {
                    basePrices.push(i);
                }
            } else {
                for (let i = basePrice; i > basePrice - amount; i--) {
                    basePrices.push(i);
                }
            }
            
            
            // Compute all iteration prices at once using array mapping
            const iterationPrices = basePrices.map(price => priceUpdateAlgorithm(price));
            
            // Compute the original price once
            //const originalPrice = priceUpdateAlgorithm(basePrice);
            // Calculate the difference and average difference value
            // const diffValue = iterationPrices.reduce((acc, price) => acc + (originalPrice - price), 0);
            
            const totalTradeValue = iterationPrices.reduce((sum, price) => sum + price, 0);
        
            return Math.abs(totalTradeValue);
        }
        const base_price = courseTradeData.base_price;
        return calculateCoursePriceUpdate(base_price, trade_amount, isBuying);
    }

    const getMaxBuyAmount = () => {
        if (courseTradeData) {
            let k = Math.floor(parseFloat(balance) / courseTradeData.price);
            return k;
        }
        return 0;
    }

    useEffect(() => {
        if (courseTradeData) {
            const TRADE_VALUE : number = 250.0;
            if (isBuying) { 
                let newPrice = 0
                if (TRADE_VALUE*amount <= parseFloat(balance)) {
                    newPrice = TRADE_VALUE*amount;
                    newPrice = parseFloat(newPrice.toFixed(2));
                }
                setEstimatedPrice(newPrice);
                
            }
            else{
                let newPrice = 0;

                if (courseTradeData.stock_amount >= amount && amount > 0) {
            
                    newPrice = TRADE_VALUE*amount;
                }
                setEstimatedPrice(newPrice);
            }
        }
    }, [amount, courseTradeData, isBuying]);

    const buyStock = async () => {   
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
            if (isBuying) {
                const response = await sendRequest('/buy_stock/', 'POST', requestBody);
                if (response.status == 200) {
                    console.log('Stock buy order placed successfully');
                    setPopupMessageColor('text-yellow-200');
                    if (amount === 1) {
                        setPopupMessage(`Bought ${amount} stock of ${courseCode}!`);
                    }
                    else{
                        setPopupMessage(`Bought ${amount} stocks of ${courseCode}!`);
                    }
                    setShowPopup(true);
                    setAmount(0);
                    updateUserInfo();
                    fetchAllData();
                    

                } else {
                    console.error('Error buying stock');
                }   
            }
            else {
                const response = await sendRequest('/sell_stock/', 'POST', requestBody);
                if (response.status == 200) {
                    console.log('Stock sell order placed successfully');
                    setPopupMessageColor('text-yellow-200');
                    setPopupMessage(`Sold ${amount} stock of ${courseCode}!`);

                    setShowPopup(true);
                    setAmount(0);
                    updateUserInfo();
                    fetchAllData();
                } else {
                    console.error('Error selling stock: ' + response.status);
                }
            }
    };

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupMessageColor, setPopupMessageColor] = useState('');
  

    if (activeSection === "browse"){
        return (
            //<PageWrapper>
                <div className="vscreen:text-small">
                    <div className="overflow-auto bg-sky-50 rounded flex flex-col p-4 ">
                        <div className="flex flex-row">
                            <div className="flex flex-col">
                                <p className="vscreen:text-small ">Available funds</p>
                                <div className="flex flex-row py-1.5">  
                                    <p className="text-4xl vscreen:text-large font-extralight decoration-0">APE</p>
                                    <p className="text-4xl vscreen:text-large font-medium ml-2">{balance}</p>
                                </div>

                            </div>
                            <div className="flex flex-col self-end mx-8">  
                                <SearchBar input={searchText} setInput={updateSearchText} onButtonClick={handleSearch} placeholder="Search course code..." onChange={onSearchTextChange}></SearchBar>
                            </div>
                        </div>
                        <ModularList content={courses} itemsColumnClassFunc={checkColumnContent} headerColumnClassName={columnHeaderClasses} itemsColumnContentAddon={itemsContentAddon} onItemClick={handleRowClick} ></ModularList>
                    </div>
                </div>
            //</PageWrapper>
        )
    } else {
        // <div className="flex flex-col h-full">

        return (
            //<PageWrapper>
                <div className="size-full flex flex-row rounded-3xl">
                <div id="graph_window" className="bg-light-gray rounded-3xl mr-5 flex-1 flex flex-col">
                        <div className="self-start pt-4">
                            <Button className="size-10 pl-2" onClick={() => returnToList()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                            </svg>
                            </Button>

                            
                        </div>
                        <div className="pb-5 pl-5 self-start gap-5">
                                <p className="font-medium text-secondary-color">{courseTradeData ? courseTradeData.course_code : "Loading..."}</p>
                                <p className="font-light text-small italic text-secondary-color mb-1">{courseTradeData ? courseTradeData.name : "Loading..."}</p>
                                <p className="font-medium text-large text-sky-400">{courseTradeData ? courseTradeData.price + " APE" : "Loading..."}</p>     
    
                        </div>
                        <div className="flex-1">
                        <ChartComponent data={candlestickData}/>
                        </div>
                        </div>

                    <div id="trade_window" className={isBuying ? 'flex flex-col h-full w-full justify-center py-12 flex-1 bg-primary-color p-5 max-w-fit rounded-3xl' : 'flex flex-col h-full w-full justify-center py-12 flex-1 bg-rose-500 p-5 max-w-fit rounded-3xl'}>
                            <h1 className="text-white mb-8 font-bold select-none">Make a trade</h1>
                            <div className="flex flex-col">
                                <Switch onToggle={setIsBuying} bgColor={isBuying ? 'bg-primary-color' : 'bg-rose-500'}></Switch>
                                <div className="mt-8">
                                    <div className="flex flex-row justify-between">
                                        <p className="text-light-gray font-medium select-none">Amount</p>
                                        <p className="text-light-gray font-medium select-none">Owned: {courseTradeData ? courseTradeData.stock_amount : "..."}</p>
                                    </div>
                                    <TextField 
                                        inputClassName={ isBuying 
                                            ? amount === 0 
                                                ? "w-full p-3 rounded-md border-2 bg-transparent text-emerald-200 select-none" 
                                                : (courseTradeData && ((amount * courseTradeData.price) <= (parseFloat(balance))))
                                                    ? "w-full p-3 rounded-md border-2 bg-transparent text-white"
                                                    : "w-full p-3 rounded-md border-2 bg-transparent text-emerald-200"

                                            : amount === 0
                                                ? "w-full p-3 rounded-md border-2 bg-transparent text-rose-300 select-none" 
                                                : (courseTradeData && (amount <= courseTradeData.stock_amount))
                                                    ? "w-full p-3 rounded-md border-2 bg-transparent text-white"
                                                    : "w-full p-3 rounded-md border-2 bg-transparent text-rose-300"
                                                } 
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
                                    <div 
                                        key={courseTradeData ? courseTradeData.stock_amount : '...'} 
                                        className='flex px-3 rounded-full border-2 border-light-gray text-xs text-light-gray cursor-pointer hover:bg-white hover:text-[#4ADE80] transition duration-300 ease-in-out'
                                        onClick={() => handleButtonClick(courseTradeData 
                                                                            ? isBuying 
                                                                                ? getMaxBuyAmount() : courseTradeData.stock_amount
                                                                            : 0)}
                                    >
                                        Max
                                    </div>

                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className={isBuying? "":"hidden"}>
                                    <div className={(estimatedPrice > 0) ? "py-2" : "invisible py-2"}> 
                                        <div className={"flex flex-row items-end"}>
                                            <div className={"text-emerald-100 text-large italic"}>{estimatedPrice}</div>
                                            <div className={"text-emerald-100 text-small italic pl-1 pb-1 "}> APE</div>
                                        </div>
                                        <div className={"text-emerald-100 italic text-small"}>estimated buy value</div>
                                        <div className={"text-emerald-100 italic text-smaller"}>after fees</div>

                                    </div>
                                </div>
                                <div className={isBuying? "hidden":""}>
                                    <div className={(!isBuying && estimatedPrice > 0) ? "py-2" : "invisible py-2"}> 
                                        <div className={"flex flex-row items-end"}>
                                            <div className={"text-rose-200 text-large italic"}>{estimatedPrice}</div>
                                            <div className={"text-rose-200 text-small italic pl-1 pb-1 "}> APE</div>
                                        </div>
                                        <div className={"text-rose-200 italic text-small"}>estimated sell value</div>
                                        <div className={"text-rose-200 italic text-smaller"}>after fees</div>

                                    </div>
                                </div>
                                <PopupMessage message={popupMessage} show={showPopup} onClose={() => setShowPopup(false)} classColor={popupMessageColor} tailwindPadding="p-2 pt-6"></PopupMessage>

                                <Button className="mt-2 font-semibold text-secondary-color bg-white rounded-full pb-6 pt-6 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={buyStock}>{isBuying ? "BUY" : "SELL"}</Button>

                            </div>


                        </div>


            </div>
        //</PageWrapper>
    );
    }
    
};

export default Trading;