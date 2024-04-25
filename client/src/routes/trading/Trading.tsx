import PageWrapper from "../../components/pagewrapper/PageWrapper";
import Button from '../../components/button/Button';
import ChartComponent from "../../components/chart/ChartComponent";

const Trading: React.FC = () => {
    const initialData = [
        { time: '2018-12-22', value: 32.51 },
        { time: '2018-12-23', value: 31.11 },
        { time: '2018-12-24', value: 27.02 },
        { time: '2018-12-25', value: 27.32 },
        { time: '2018-12-26', value: 25.17 },
        { time: '2018-12-27', value: 28.89 },
        { time: '2018-12-28', value: 25.46 },
        { time: '2018-12-29', value: 23.92 },
        { time: '2018-12-30', value: 22.68 },
        { time: '2018-12-31', value: 22.67 },
    ];
    return (
        <PageWrapper>
            <div className="size-full bg-coral flex flex-row gap-0.5 justify-center items-center gap-y-2 rounded-3xl">
                <div id="flex_parent" className="flex flex-row gap-10 p-10 size-full">
                    {/* childrens own background colours are mainly for dev purposes */}
                    <div id="graph_window" className="bg-slate-400 grow rounded-3xl flex flex-col justify-center items-center">
                        <p className="p-5 self-start">Course</p>
                        <div className="">
                            <ChartComponent data={initialData} width={1280} height={768}/>
                        </div>
                        
                    </div>
                    <div id="trade_window" className="bg-white grow max-w-fit rounded-3xl">
                        <div className="p-5">Make a trade</div>
                        <div className="flex flex-row gap-5 p-10">
                            <Button className='w-full mt-2 self-center text-slate-50 uppercase py-4 px-8 bg-primary-color'>Buy</Button>
                            <Button className='w-full mt-2 self-center text-slate-50 uppercase py-4 px-8 bg-red-400'>Sell</Button>
                        </div>
                        
                    </div>

                </div>

                
            </div>
        </PageWrapper>
    );
};

export default Trading;