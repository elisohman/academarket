import { createChart, ColorType, ISeriesApi } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import './chart-component.scss';

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

const ChartComponent: React.FC<ChartProps> = ({ data, colors, width = 800, height = 400 }) => {
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

export default ChartComponent;