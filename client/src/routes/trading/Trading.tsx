import PageWrapper from "../../components/pagewrapper/PageWrapper";
import Button from '../../components/button/Button';
import ChartComponent from "../../components/chart/ChartComponent";
import { useState, useEffect } from "react";
import { generateCandlestickData } from "./DataGenerator";


const Trading: React.FC = () => {

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
            <div className="size-full bg-coral flex flex-row gap-0.5 justify-center items-center gap-y-2 rounded-3xl">
                <div id="flex_parent" className="flex flex-row gap-10 p-10 size-full">
                    <div id="graph_window" className="bg-coral grow shrink rounded-3xl flex flex-col justify-center items-center">
                        <div className="p-5 self-start flex flex-row gap-5">
                            <p className="font-medium text-light-gray">{data}</p>
                        </div>
                        <div className="flex grow w-full">
                            <ChartComponent data={candlestickData}/>
                        </div>
                        
                    </div>
                    <div id="trade_window" className="bg-primary-color max-w-fit rounded-3xl">
                        <div className="p-5 text-light-gray font-medium">Make a trade</div>
                        <div className="flex flex-row gap-5 p-10">
                            <Button className='w-full mt-2 self-center text-slate-50 uppercase py-4 px-8 bg-primary-color border-2'>Buy</Button>
                            <Button className='w-full mt-2 self-center text-slate-50 uppercase py-4 px-8 bg-red-400 border-2'>Sell</Button>
                        </div>
                        
                    </div>

                </div>

                
            </div>
        </PageWrapper>
    );
};

export default Trading;