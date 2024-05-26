import PageWrapper from "../../components/pagewrapper/PageWrapper";
import Button from '../../components/button/Button';
import ChartComponent from "../../components/chart/ChartComponent";
import { useState, useEffect } from "react";
import { generateCandlestickData } from "./DataGenerator";
import Switch from "../../components/switch/Switch";
import TextField from "../../components/textfield/TextField";


const Trading = () => {

    const [data, setData] = useState<any>(null);
    const dataURL = './assets/data/temp-data.json' // file in public directory
    const candlestickData = generateCandlestickData();

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
    return (
        <PageWrapper>
            <div className="size-full flex flex-row gap-5 rounded-3xl">
                <div id="graph_window" className="bg-light-gray grow shrink rounded-3xl flex flex-col justify-center items-center">
                    <div className="p-5 self-start flex flex-row gap-5">
                        <p className="font-medium text-secondary-color">{data}</p>     
                    </div>
                    <div className="flex grow w-full px-5 pb-5">
                        <ChartComponent data={candlestickData}/>
                    </div>
                </div>

                <div id="trade_window" className="p-5 bg-primary-color max-w-fit rounded-3xl">
                    <div className="flex flex-col h-full">
                        <h1 className="text-white mb-8 font-medium">Make a trade</h1>
                        <Switch/>
                        {/*<div id="button-container" className="flex gap-4">
                            <Button className='w-full mt-8 self-center text-slate-50 uppercase py-2 px-8 bg-primary-color border-2'>Buy</Button>
                            <Button className='w-full mt-8 self-center text-slate-50 uppercase py-2 px-8 bg-red-400 border-2'>Sell</Button>
                        </div>*/}
                        <div className="mt-8">
                            <p className="text-light-gray font-medium">Amount</p>
                            <TextField inputClassName="w-full p-2 rounded-md border-2 bg-transparent text-white" id="amount-field" type="text"/>
                        </div>
                        <div className="mt-8">
                            <p className="text-light-gray font-medium">How often?</p>
                            <TextField inputClassName="w-full p-2 rounded-md border-2 bg-transparent text-white" id="price-field" type="text"/>
                        </div>
                        <Button className="mt-auto font-semibold text-secondary-color mt-8 bg-white rounded-full py-4">CONTINUE</Button>

                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Trading;