import {Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from 'react';
import Button from "../button/Button";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/constants";
//import sendRequest from "../../utils/request";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Exception } from "sass";
import { useUserContext } from "../../contexts/UserContext";
import useAPI from "../../utils/network";
import { useAuthContext } from "../../contexts/AuthContext";

// Define a custom interface that extends JwtPayload
interface CustomJwtPayload extends JwtPayload {
    user_id: string;
  }


const TopBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;
    const [username, setUsername] = useState<string | null>(null);
    const [ balance, setBalance ] = useState<number | null>(null);
    const { signOut } = useAuthContext();
    const { userInfo } = useUserContext();
    const sendRequest = useAPI();


    const updateUserInfo = async () => {
        //const user_id = user?.user_id;
        //const response = await sendRequest('/user_info', 'GET');

        /*if (response.status === 200) {
            const responseData = response.data;
            setUsername(responseData.username);
            setBalance(responseData.balance);
        } else {
            console.log("Error when getting user info");
        }*/

    }

    // When topbar loads, access token is fetched and userinfo updated
    useEffect(() => {
        if (userInfo ){
            setUsername(userInfo.username);
            setBalance(userInfo.balance);
        } else {
            console.log("No access token");
        }
    },[userInfo]);
    
    
    const handleLogout = async () => {
        signOut();
    }

    const goToProfile = () => {
        navigate('/profile');
    }

    return (
        <div className="text-secondary-color w-full h-20 flex px-8 py-8 text-base items-center">
            <div id="logo-area" className="flex items-center">
                <div className="text-lg font-bold select-none">Academarket</div>
            </div>
            <div id="menu-area" className="flex-grow flex justify-center">
                <ul className="flex gap-x-8 items-center">
                    <Link to="/dashboard">
                        <li className={`px-4 py-1.5 rounded-full select-none ${path === '/dashboard' ? 'bg-primary-color text-white font-medium' : ''}`}>Dashboard</li>
                    </Link>

                    <Link to="/portfolio">
                        <li className={`px-4 py-1.5 rounded-full select-none ${path === '/portfolio' ? 'bg-primary-color text-white font-medium' : ''}`}>Portfolio</li>
                    </Link>

                    <Link to="/trading">
                        <li className={`px-4 py-1.5 rounded-full select-none ${path === '/trading' ? 'bg-primary-color text-white font-medium' : ''}`}>Trading</li>
                    </Link>
                </ul>
            </div>
            <div id="profile-area" className="flex items-center cursor-pointer" onClick={goToProfile}>
                <div id="user-details" className="text-sm text-right">
                    <p className="font-semibold text-secondary-color text-sm max-w-36 overflow-hidden whitespace-nowrap overflow-ellipsis">{username ? username : "Loading..."}</p>
                    <p className="font-semibold text-sky-400 max-w-36 overflow-hidden whitespace-nowrap overflow-ellipsis">APE {balance}</p>
                </div>
                
            </div>
            <Button className="h-10 ml-4 text-white bg-coral px-2 py-1 rounded-md font-medium" onClick={handleLogout}>Log out</Button>
        </div>
    );
}

export default TopBar;