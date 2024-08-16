//import React from 'react';
//import logo from './logo.svg';
import { useState, useContext, useEffect } from "react";
import sendRequest from "../../utils/request";
import { getToken } from "../../utils/network";

import './adminpanel.scss';
import Button from '../../components/button/Button';
import PageWrapper from '../../components/pagewrapper/PageWrapper';
const monkey = './assets/images/bg-monkeys.jpg';

const AdminPanel: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const startScheduler = () => {
        const url = '/start_scheduler/' // file in public directory
        datapipelineRequest(url);
    }
    const generatePriceHistories = () => {
        const url = '/generate_price_histories/' // file in public directory
        datapipelineRequest(url);
    }
    const fixCoursePrices = () => {
        const url = '/fix_course_prices/' // file in public directory
        datapipelineRequest(url);
    }
    const fixBalances = () => {
        const url = '/fix_balances/' // file in public directory
        datapipelineRequest(url);
    }

    const deleteAllUsers = () => {
        const url = '/delete_all_users/' // file in public directory
        datapipelineRequest(url);
    }
    const createBotsFromList = () => {
        const url = '/create_bots_from_list/' // file in public directory
        datapipelineRequest(url);
    }
    const setupBotEconomy = () => {
        const url = '/setup_bot_economy/' // file in public directory
        datapipelineRequest(url);
    }
    const initializeAllData = () => {
        const url = '/initialize_all_data/' // file in public directory
        datapipelineRequest(url);
    }
    const updateAllDailyChanges = () => {
        const url = '/update_all_daily_changes/' // file in public directory
        datapipelineRequest(url);
    }
    const stopScheduler = () => {
        const url = '/stop_scheduler/' // file in public directory
        datapipelineRequest(url);
    }

    const datapipelineRequest = async (url : string) => {
        try {
            setIsLoading(true);
            const response = await sendRequest(url, 'GET', undefined, "null", true);
            if (!response.ok) {
                setIsLoading(false);
                throw new Error('Network response was not ok');
            }
            else{
                setIsLoading(false);
                alert(url+" command executed successfully");
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error fetching data:', error);
        }
    }
  

  return (
    <div className="w-screen h-screen flex flex-row bg-white justify-center items-center">
        <div className="size-full flex flex-col gap-2 p-4 bg-blue-200 rounded justify-center items-center">
            <div className={isLoading ? "animate-pulse h-6 text-large text-blue-600" : "hidden"}>
                {isLoading ? "Executing command..." : ""}
            </div>

            <Button className="mt-2 font-semibold text-large text-secondary-color bg-white rounded-full p-4 px-8 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={startScheduler}>Start scheduler</Button>
            <Button className="mt-2 font-medium text-secondary-color bg-white rounded-full p-2 px-4 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={fixCoursePrices}>Fix course prices</Button>
            <Button className="mt-2 font-medium text-secondary-color bg-white rounded-full p-2 px-4 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={fixBalances}>Fix balances</Button>
            <Button className="mt-2 font-medium text-secondary-color bg-white rounded-full p-2 px-4 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={createBotsFromList}>Create bots (from list)</Button>
            <Button className="mt-2 font-medium text-secondary-color bg-white rounded-full p-2 px-4 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={setupBotEconomy}>Setup bot economy</Button>
            <Button className="mt-2 font-medium text-secondary-color bg-white rounded-full p-2 px-4 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={deleteAllUsers}>Delete all users</Button>
            <Button className="mt-2 font-medium text-secondary-color bg-white rounded-full p-2 px-4 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={initializeAllData}>Initialize all course data</Button>
            <Button className="mt-2 font-medium text-secondary-color bg-white rounded-full p-2 px-4 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={generatePriceHistories}>Regenerate price histories (may take a few minutes)</Button>
            <Button className="mt-2 font-medium text-secondary-color bg-white rounded-full p-2 px-4 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={updateAllDailyChanges}>Update all daily changes</Button>
            <Button className="mt-2 font-medium text-secondary-color bg-white rounded-full p-2 px-4 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={stopScheduler}>Stop scheduler</Button>
        </div>
      </div>
  );
}



export default AdminPanel;
