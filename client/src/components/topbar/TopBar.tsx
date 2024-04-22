

function TopBar() {
    return (
        <div className="bg-slate-600 w-full h-20 flex px-4">
            <div className="flex items-center">
                <div className="text-white text-2xl font-bold">Logo</div>
            </div>
            <div className="flex-grow flex justify-center">
                <ul className="flex space-x-4 text-white items-center">
                    <li>Dashboard</li>
                    <li>Portfolio</li>
                    <li>Trading</li>
                </ul>
            </div>
            <div className="flex items-center">
                <div className="text-white text-lg">User Profile</div>
            </div>
        </div>
    );
}

export default TopBar;