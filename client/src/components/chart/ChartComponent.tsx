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
        //backgroundColor = '#222',
        textColor = '#C3BCDB',
        borderColor = '#71649C',
    } = colors || {};


    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<ReturnType<typeof createChart>>();

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: "transparent" },
                textColor: "#C3BCDB",
            },
            grid: {
                vertLines: { color: "white" },
                horzLines: { color: "white" },
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
        const newCandleSeries = chart.addCandlestickSeries();
        newCandleSeries.setData(data);
        const newLineSeries = chart.addLineSeries()
        const lineData = data.map(item => ({ time: item.time, value: item.close }));
        newLineSeries.setData(lineData);
        newLineSeries.applyOptions({lineWidth: 4})

        const chartDiv = document.getElementById("chart");
        const handleResize = () => {
            console.log("HELLO");
            chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
            chart.applyOptions({ height: chartContainerRef.current!.clientHeight });

            //chart.applyOptions({ width: chartDiv?.offsetWidth,
            //                    height: chartDiv?.offsetHeight
            // });
        };

        window.addEventListener('resize', handleResize);

        chartInstanceRef.current = chart;

        return () => {
            window.removeEventListener('resize', handleResize);
            chartInstanceRef.current?.remove();
        };
    }, [data, textColor, borderColor]);

    return <div className="resize" ref={chartContainerRef} style={{ width: '90%', height: '90%' }} />;
};

export default ChartComponent;