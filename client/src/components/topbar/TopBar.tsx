import {Link, useLocation} from "react-router-dom";

function TopBar() {
    const location = useLocation();
    const path = location.pathname;

    return (
        <div className="text-secondary-color w-full h-20 flex px-8 text-base">
            <div className="flex items-center">
                <div className="text-lg font-bold">Logo</div>
            </div>
            <div className="flex-grow flex justify-center">
                <ul className="flex gap-x-8 items-center">
                    <Link to="/dashboard">
                        <li className={`px-4 py-1.5 rounded-full ${path === '/dashboard' ? 'bg-primary-color text-white font-medium' : ''}`}>Dashboard</li>
                    </Link>

                    <Link to="/portfolio">
                        <li className={`px-4 py-1.5 rounded-full ${path === '/portfolio' ? 'bg-lavender text-white font-medium' : ''}`}>Portfolio</li>
                    </Link>

                    <Link to="/trading">
                        <li className={`px-4 py-1.5 rounded-full ${path === '/trading' ? 'bg-coral text-white font-medium' : ''}`}>Trading</li>
                    </Link>
                </ul>
            </div>
            <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-light-gray"></div>
            </div>
        </div>
    );
}

export default TopBar;