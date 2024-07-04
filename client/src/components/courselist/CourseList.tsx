import React from 'react';

import { useNavigate  } from 'react-router-dom';

interface CourseListProps {
    courses?: any;
    className?: string;
};

const courses_example = [
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

const CourseList: React.FC<CourseListProps> = ({courses=courses_example, className }) => {
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


    return(
        <div className="vscreen:text-smaller">
            <div className="overflow-auto bg-slate-100 rounded flex flex-col p-4 ">

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
                            {courses.map((item: any) => (
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
    );
};

export default CourseList;