
import PageWrapper from "../../components/pagewrapper/PageWrapper";
import { useNavigate  } from 'react-router-dom';
const courses = [
    {
        id: 1,
        code: 'LNCH01',
        name: 'Lunchföreläsning med Dr. Göran Östlund',
        amount: 12,
        totalValue: 1000,
        valueChange: '+5%',
    },
    {
        id: 2,
        code: 'TÄTÄ24',
        name: "Urbans linjär algebra crash course",
        amount: 5,
        totalValue: 750,
        valueChange: '-2%',
    },
    
    // Example courses, backend should return in a similar format
];

const Portfolio: React.FC = () => {

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
        navigate(`/trading?course=${course.code}`, { state: { course } });
    };

    const priceChangeColor = (course: any) => {
        if (course.valueChange.charAt(0) == "-" ) {
            return "text-red-500";
        } else {
            return "text-green-500";
        }
    };
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
                    </div>
                </div>
                <div className="py-4">
                    <div className="">
                        <div className="bg-transparent">
                            <div className="grid grid-cols-5 vscreen:grid-cols-5 font-bold mb-2 px-2 font-medium vscreen:text-smaller items-center content-center">
                                <div className="col-span-1 justify-self-start mx-2 text-center">Course Code</div>
                                <div className="col-span-1 justify-self-start mx-2 text-center">Course Name</div>
                                <div className="col-span-1 justify-self-end ml-2 text-center">Amount</div>
                                <div className="col-span-1 justify-self-end ml-2 text-center">Total Value</div>
                                <div className="col-span-1 justify-self-end ml-2 justify-end text-center">Price Change (24h)</div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                                {courses.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-5 grid-flow-row py-2 px-2 border-b last:border-none cursor-pointer hover:bg-gray-100 vscreen:text-smaller "
                                    onClick={() => handleRowClick(item)}
                                >
                                    <div className="col-span-1 pl-2.5  vscreen:pl-0.5 justify-self-start mr-8">{item.code}</div>
                                    <div className="col-span-1 pl-0.5 justify-self-start italic font-light line-clamp-2 text-ellipsis overflow-hidden mr-8 ">{item.name}</div>
                                    <div className="col-span-1 pl-1 justify-self-end font-light text-slate-400">{item.amount}</div>
                                    <div className="col-span-1 justify-self-end font-light text-sky-400">{item.totalValue} APE</div>
                                    <div className={`col-span-1 justify-self-end ml-4 pr-10 vscreen:pr-2 font-light ${priceChangeColor(item)}`}>{item.valueChange}</div>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </PageWrapper>
    );
};

export default Portfolio;