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

    const startScheduler = () => {
        const url = '/start_scheduler/' // file in public directory
        datapipelineRequest(url);
    }
    const generatePriceHistories = () => {
        const url = '/generate_price_histories/' // file in public directory
        datapipelineRequest(url);
    }
    const fixPrices = () => {
        const url = '/fix_course_prices/' // file in public directory
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
    const datapipelineRequest = async (url : string) => {
        try {
            const response = await sendRequest(url, 'GET', undefined, "null", true);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            else{
                alert(url+" command executed successfully");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
  

  return (
      <div className="flex flex-col bg-blue-200 gap-2 m-12 p-8 rounded justify-center items-center">
      <Button className="mt-2 font-semibold text-large text-secondary-color bg-white rounded-full p-4 px-8 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={startScheduler}>Start scheduler</Button>
      <Button className="mt-2 font-medium text-secondary-color bg-white rounded-full p-2 px-4 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={fixPrices}>Fix prices</Button>
      <Button className="mt-2 font-medium text-secondary-color bg-white rounded-full p-2 px-4 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={createBotsFromList}>Create bots (from list)</Button>
      <Button className="mt-2 font-medium text-secondary-color bg-white rounded-full p-2 px-4 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={setupBotEconomy}>Setup bot economy</Button>
      <Button className="mt-2 font-medium text-secondary-color bg-white rounded-full p-2 px-4 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={deleteAllUsers}>Delete all users</Button>
      <Button className="mt-2 font-medium text-secondary-color bg-white rounded-full p-2 px-4 hover:bg-black hover:text-white transition duration-300 ease-in-out" onClick={initializeAllData}>Initialize all course data</Button>

      </div>
  );
}



export default AdminPanel;
