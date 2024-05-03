import { createChart, ColorType, ISeriesApi, IPriceScaleApi, ITimeScaleApi } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import './chart-component.scss';

interface ChartProps {
    //data: { time: string; value: number }[];
    data: { time: string; open: number; high: number; low: number; close: number; }[];
    colors?: {
        backgroundColor?: string;
        textColor?: string;
        borderColor?: string;
    };

    width?: number;
    height?: number;
}

const ChartComponent: React.FC<ChartProps> = ({ data, colors, width, height }) => {
    const {
        backgroundColor = '#222',
        textColor = '#C3BCDB',
        borderColor = '#71649C',
    } = colors || {};


    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<ReturnType<typeof createChart>>();

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: "#222" },
                textColor: "#C3BCDB",
            },
            grid: {
                vertLines: { color: "#444" },
                horzLines: { color: "#444" },
            },
            width,
            height,
        });
        /*
        // Setting the border color for the vertical axis
        chart.priceScale().applyOptions({
        borderColor: '#71649C',
        });
        */
        // Setting the border color for the horizontal axis
        chart.timeScale().applyOptions({
            borderColor: '#71649C',
        });

        // Get the current users primary locale
      const currentLocale = window.navigator.languages[0];
      // Create a number format using Intl.NumberFormat
      const myPriceFormatter = Intl.NumberFormat(currentLocale, {
            style: "currency",
            currency: "APE", // Currency for data points
          }).format;

      // Apply the custom priceFormatter to the chart
      chart.applyOptions({
        localization: {
          priceFormatter: myPriceFormatter,
        },
      });

        chart.timeScale().fitContent();

        //const newSeries: ISeriesApi<'Area'> = chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
        //newSeries.setData(data);
        const newCandleSeries: ISeriesApi<'Candlestick'> = chart.addCandlestickSeries();
        newCandleSeries.setData(data);

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
        };

        window.addEventListener('resize', handleResize);

        chartInstanceRef.current = chart;

        return () => {
            window.removeEventListener('resize', handleResize);
            chartInstanceRef.current?.remove();
        };
    }, [data, backgroundColor, textColor, borderColor]);

    return <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default ChartComponent;