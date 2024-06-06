import PageWrapper from "../../components/pagewrapper/PageWrapper";
import Button from '../../components/button/Button';
import ChartComponent from "../../components/chart/ChartComponent";
import { useState, useEffect } from "react";
import { generateCandlestickData } from "./DataGenerator";
import Switch from "../../components/switch/Switch";
import TextField from "../../components/textfield/TextField";
import SearchBar from "../../components/searchBar/SearchBar";


const Trading = () => {
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

        fetchData();
         
    }, []);
    if (activeSection === "browse"){
        return (
            <PageWrapper>
                <div className="flex flex-col">
                    <Button className="w-60 m-4 font-semibold text-primary-color mt-8 bg-gray-200 rounded-full py-4 hover:bg-gray-500 hover:text-white transition duration-300 ease-in-out"
                            onClick={() => setActiveSection('')} // Switch to trading (not browse)
                    >(temp) goto trading
                    </Button>
                    <SearchBar input = "" placeholder="Search course..."></SearchBar>
                </div>
                
            </PageWrapper>
        )
    } else {
        return (
            <PageWrapper>
                
                <div className="size-full flex flex-row gap-5 rounded-3xl">
                    <div id="graph_window" className="bg-light-gray grow shrink rounded-3xl flex flex-col justify-center items-center">
                        <div className="self-start pt-4">
                            <Button className="size-10 pl-2" onClick={() => setActiveSection('browse')}>
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
                    {/*
                    <div id="trade_window" className="p-5 bg-primary-color max-w-fit rounded-3xl">
                        <div className="flex flex-col h-full">
                            <h1 className="text-white mb-8 font-medium">Make a trade</h1>
                            <Switch/>
                            {
                            //<div id="button-container" className="flex gap-4">
                            //    <Button className='w-full mt-8 self-center text-slate-50 uppercase py-2 px-8 bg-primary-color border-2'>Buy</Button>
                            //    <Button className='w-full mt-8 self-center text-slate-50 uppercase py-2 px-8 bg-red-400 border-2'>Sell</Button>
                            //</div>
                            }
                            <div className="mt-8">
                                <p className="text-light-gray font-medium">Amount</p>
                                <TextField 
                                    inputClassName="w-full p-3 rounded-md border-2 bg-transparent text-white" 
                                    id="amount-field" 
                                    type="text" 
                                    onChange={handleInputChange} 
                                    value={amount}
                                />
                            </div>
                            <div className="mt-2 gap-3 flex">
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
                */}
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