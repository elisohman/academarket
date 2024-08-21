//import React from 'react';
//import logo from './logo.svg';
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import {jwtDecode} from 'jwt-decode';
import { useAuthContext } from '../../contexts/AuthContext';

//import { getToken } from "../../utils/network";
import useAPI from "../../utils/network";

import './dashboard.scss';
import Button from '../../components/button/Button';
import PageWrapper from '../../components/pagewrapper/PageWrapper';
import { getAllJSDocTagsOfKind } from "typescript";
const monkey = './assets/images/bg-monkeys.jpg';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [bestUsers, setBestUsers] = useState<any>([]);
  const [bestUsersBalances, setBestUsersBalances] = useState<any>([]);
  const navigate = useNavigate();

  const sendRequest = useAPI();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendRequest('/get_dashboard_data/', 'GET');
        if (response && response.status === 200) {
          console.log(response);
          const jsonData = response.data;
          console.log(jsonData.best_users_balances);
          setBestUsers(jsonData.best_users);
          setBestUsersBalances(jsonData.best_users_balances);
          setDashboardData(jsonData);
        } else {
          console.log('Error fetching data:', response);
        }
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
 }, []);



  /*const fetchData = async () => {
    const accessToken = await getToken();
    if (accessToken){
      const url = '/get_dashboard_data/' // file in public directory
      try {
          const response = await sendRequest(url, 'GET', undefined, accessToken);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const jsonData = await response.json();
          console.log(jsonData.best_users_balances);
          setBestUsers(jsonData.best_users);
          setBestUsersBalances(jsonData.best_users_balances);
          setDashboardData(jsonData);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
    }
  };*/
  
  const priceChangeColor = (content: string) => {
    if (content.charAt(0) === "-") {
        return "text-red-500";
    } else {
        return "text-green-500";
    }
  };
  const handleRowClick = (course?: string, data?: any, fromPortfolio=false) => {
    const fromPortfolioParam = fromPortfolio ? "&fromPortfolio=true" : "";
    if (course){
      navigate(`/trading?course=${course}${fromPortfolioParam}`, { state: { data } });

    }
  };

  /*useEffect(() => {
    fetchData();
  }, []);*/

  return (
    //<PageWrapper>
      <div className="dashboard-container size-full bg-white flex flex-row gap-0.5 justify-center items-center gap-y-2">
        <div className="flex size-full flex-col justify-center items-center gap-y-4 p-12">
          <div className="flex-1 size-full flex flex-row justify-center items-center gap-x-4">

            <div className={"flex-1 h-full flex flex-col justify-center items-center rounded-lg bg-light-gray p-4"}>
              <div className="font-light text-gray-600 select-none">BEST COURSE ON MARKET (24H)</div>
              <Button className="text-large rounded-full hover:bg-white transition duration-300 ease-in-out py-1 px-3 my-1" onClick={() => handleRowClick(dashboardData.best_course, dashboardData)}> 
                <div>{dashboardData && dashboardData.best_course ? dashboardData.best_course : ""}</div> 
              </Button>
              <div className={dashboardData && dashboardData.best_course_change? `${priceChangeColor(dashboardData.best_course_change.toString())} select-none font-medium` : "font-medium select-none"}>{dashboardData ? dashboardData.best_course_change+ " %" : ""}</div>
            </div>

            <div className={"flex-1 h-full flex flex-col justify-center items-center rounded-lg bg-light-gray p-4"}>
              <div className="font-light text-gray-600 select-none">WORST COURSE ON MARKET (24)</div>
              <Button className="text-large rounded-full hover:bg-white transition duration-300 ease-in-out py-1 px-3 my-1" onClick={() => handleRowClick(dashboardData.worst_course, dashboardData)}> 
                <div>{dashboardData && dashboardData.worst_course ? dashboardData.worst_course : ""}</div>
              </Button>
              <div className={dashboardData && dashboardData.worst_course_change? `${priceChangeColor(dashboardData.worst_course_change.toString())} select-none font-medium` : "select-none font-medium"}>{dashboardData ? dashboardData.worst_course_change+ " %" : ""}</div>
            </div>

          </div>

          <div className="flex-1 size-full flex flex-row grow items-center gap-x-4">
            <div className={"flex-1 h-full flex flex-col justify-center items-center rounded-lg bg-light-gray p-4"}>
              <div className="font-light text-gray-600 select-none">BEST COURSE IN YOUR PORTFOLIO (24H)</div>
                <Button className={dashboardData && dashboardData.best_portfolio_stock ? "text-large rounded-full hover:bg-white transition duration-300 ease-in-out py-1 px-3 my-1" : "text-large rounded-full pointer-events-none transition duration-300 ease-in-out py-1 px-3 my-1"}
                        onClick={() => handleRowClick(dashboardData.best_portfolio_stock, dashboardData, true)}> 
                  <div>{dashboardData && dashboardData.best_portfolio_stock ? dashboardData.best_portfolio_stock : "N/A"}</div>
                </Button>
              <div className={dashboardData && dashboardData.best_portfolio_stock ? `${priceChangeColor(dashboardData.best_portfolio_stock_change.toString())} font-medium` : "font-medium"}>{dashboardData && dashboardData.best_portfolio_stock ? dashboardData.best_portfolio_stock_change+ " %" : ""}</div>
            </div>

            <div className="flex-1 h-full flex flex-col justify-center rounded-lg bg-light-gray p-4 vscreen:text-smaller items-center">
              <div className="mb-4 font-light text-gray-600 select-none">TOP TRADERS</div>
              <div className=""> 
                {bestUsers.map((val : any, index: any) => { return (
                    <div 
                        key={val} 
                        className="flex flex-row group select-none active:motion-safe:animate-spin px-3 rounded-full text-s vscreen:text-small justify-center"
                    >
                      <div className="flex grow flex-col items-center">
                        <div className="flex flex-row">
                          <span className="w-7 mr-2 text-center text-gray-400 group-hover:text-emerald-300 transition duration-300 ease-in-out">{index+1}</span>
                          <span className="w-36 truncate text-left text-gray-600 group-hover:text-emerald-500 transition duration-300 ease-in-out">{val}</span>
                        </div>
                        <div className="flex flex-row mb-0.5 text-mediumsmall ml-1">
                          <span className="truncate text-light-gray group-hover:text-sky-500 transition duration-300 ease-in-out">{bestUsersBalances ? bestUsersBalances[index] : ""}</span>
                          <span className="pl-1 font-light text-light-gray group-hover:text-sky-500 transition duration-300 ease-in-out"> APE</span>
                        </div>
                      </div>
                    </div>
                )})}
              </div>
            </div>

          </div>
        </div>
      </div>
    //</PageWrapper>
  );
}



export default Dashboard;
