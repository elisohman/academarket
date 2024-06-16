
import PageWrapper from "../../components/pagewrapper/PageWrapper";
import { useNavigate  } from 'react-router-dom';
const courses = [
    {
        id: 1,
        code: 'TATA24',
        name: 'Introduction to Computer Science',
        amount: 10,
        totalValue: 1000,
        valueChange: '+5%',
    },
    {
        id: 2,
        code: 'TSBK07',
        name: 'Advanced Mathematics',
        amount: 5,
        totalValue: 750,
        valueChange: '-2%',
    },
    // Add more courses as needed
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
        navigate(`/course/${course.code}`, { state: { course } });
    };

    const priceChangeColor = (course: any) => {
        if (course.valueChange.charAt(0) == "-" ) {
            return "text-red-500";
        } else {
            return "text-green-500";
        }
    };

    return (
        <PageWrapper>
        <div className="size-full bg-slate-100 rounded flex flex-col p-4 ">
            <div className="flex flex-row">  
                <div className="flex flex-col">
                    
                    <p className="text-sm">Available funds</p>
                    <div className="flex flex-row py-1.5">  
                        <p className="text-4xl font-extralight decoration-0">$</p>
                        <p className="text-4xl font-medium">32,210</p>
                    </div>
                    <div className="flex flex-row">  
                        <p className="font-semibold text-green-400">+$42</p>
                        <p className="px-1.5 "> Since yesterday</p>
                    </div>

                </div>
                <div className="flex flex-col self-end mx-8">  
                    <p className="">THIS IS A SEARCH BAR</p>
                </div>
            </div>
            <div className="py-4">
                <div className="">
                    <div className="size-full bg-transparent">
                        <div className="grid grid-cols-5 font-bold mb-2 px-2 font-medium">
                            <div className="col-span-1">Course Code</div>
                            <div className="col-span-1">Course Name</div>
                            <div className="col-span-1">Amount</div>
                            <div className="col-span-1">Total Value</div>
                            <div className="col-span-1">Price Change (24h)</div>
                        </div>
                        <div className="overflow-x-auto bg-white rounded-lg shadow-md border">
                            {courses.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-5 py-2 px-2 border-b last:border-none cursor-pointer hover:bg-gray-100"
                                onClick={() => handleRowClick(item)}
                            >
                                <div className="col-span-1 pl-2.5">{item.code}</div>
                                <div className="col-span-1 pl-0.5 italic font-light">{item.name}</div>
                                <div className="col-span-1 pl-1 font-light">{item.amount}</div>
                                <div className="col-span-1 pl-1 font-light">APE {item.totalValue}</div>
                                <div className={`col-span-1 pl-1 font-light ${priceChangeColor(item)}`}>{item.valueChange}</div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </PageWrapper>
    );
};

export default Portfolio;