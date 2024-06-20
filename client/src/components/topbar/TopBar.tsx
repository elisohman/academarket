import {Link, useNavigate, useLocation} from "react-router-dom";
import DefaultProfilePic from "../../style/icons/DefaultProfilePic";
import Button from "../button/Button";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/constants";
import sendRequest from "../../utils/request";


function TopBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;

    const handleLogout = async () => {
        const refresh_token = localStorage.getItem(REFRESH_TOKEN);
        const response = await sendRequest('/token/blacklist/', 'POST', {refresh: refresh_token});

        if (response.ok) {
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            navigate('/signin');
        }
    }

    return (
        <div className="text-secondary-color w-full h-20 flex px-8 text-base">
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
            <div id="profile-area" className="flex items-center">
                <div id="pfp" className="w-10 h-10 rounded-full bg-light-gray overflow-hidden">  
                    <DefaultProfilePic />
                </div>
                <div id="user-details" className="ml-4 text-sm">
                    <p className="font-semibold text-secondary-color text-sm max-w-36 overflow-hidden whitespace-nowrap overflow-ellipsis">johannespettersson</p>
                    <p className="font-semibold text-primary-color">APE 69,420</p>
                </div>
                <Button className="ml-4 text-white bg-coral px-2 py-1 rounded-md font-medium" onClick={handleLogout}>Log out</Button>
            </div>
        </div>
    );
}

export default TopBar;