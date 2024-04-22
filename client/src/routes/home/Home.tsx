import { createChart, ColorType, ISeriesApi } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

interface ChartProps {
    data: { time: string; value: number }[];
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
    width?: number;
    height?: number;
}

export const ChartComponent: React.FC<ChartProps> = ({ data, colors, width = 800, height = 400 }) => {
    const {
        backgroundColor = 'white',
        lineColor = '#2962FF',
        textColor = 'black',
        areaTopColor = '#2962FF',
        areaBottomColor = 'rgba(41, 98, 255, 0.28)',
    } = colors || {};

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<ReturnType<typeof createChart>>();

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width,
            height,
        });

        chart.timeScale().fitContent();

        const newSeries: ISeriesApi<'Area'> = chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
        newSeries.setData(data);

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
        };

        window.addEventListener('resize', handleResize);

        chartInstanceRef.current = chart;

        return () => {
            window.removeEventListener('resize', handleResize);
            chartInstanceRef.current?.remove();
        };
    }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor, width, height]);

    return <div ref={chartContainerRef} />;
};

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

export const Home: React.FC = () => {
    return (
        <div className="sign-in-container size-full bg-green-400 flex flex-row gap-0.5 justify-center items-center gap-y-2">
            <h1>Course</h1>
            <ChartComponent data={initialData} width={600} height={300} />
            {/* Adjust width and height props as needed */}
        </div>
    );
};

export default Home;
