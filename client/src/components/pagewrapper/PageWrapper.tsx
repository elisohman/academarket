import TopBar from '../topbar/TopBar';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../../utils/constants';
import { jwtDecode } from 'jwt-decode';
import { Mutex } from 'async-mutex';
import { useAuthContext } from '../../contexts/AuthContext';
import { useUserContext } from '../../contexts/UserContext';
//import { getToken } from '../../utils/network'
interface PageWrapperProps {
    children: React.ReactNode;
}


const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
    const {authTokens} = useAuthContext();
    const {updateUserInfo} = useUserContext();
    useEffect(() => { 
         if (authTokens){
            updateUserInfo();
            console.log("We're in!");
         }
    }, [authTokens]);

    const location = useLocation();

    const isProfileRoute = location.pathname === '/profile'; // Should maybe update this solution? Works for now
    /*const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        auth().catch(() => setIsAuthenticated(false));
    }, []);

    const refreshToken = async () => {
        try {
            // token refresh uses mutex to avoid race condition
            await mutex.runExclusive(async () => {
                const response = await sendRequest('/token/refresh/', 'POST', {
                    refresh: localStorage.getItem(REFRESH_TOKEN),
                });
                if (response.ok) {
                    const responseData = await response.json();
                    localStorage.setItem(ACCESS_TOKEN, responseData.access);
                    localStorage.setItem(REFRESH_TOKEN, responseData.refresh);

                    setIsAuthenticated(true);
                    setLoading(false);
                    console.log("WE'RE IN!");
                } else {
                    console.log('Token refresh failed:', response);
                    setIsAuthenticated(false);
                    setLoading(false);
                }
            });
        } catch (error) {
            console.log('Error during token refresh:', error);
            setIsAuthenticated(false);
            setLoading(false);
        }
    };

    

    const auth = async () => {
        const localToken = localStorage.getItem(ACCESS_TOKEN);
        if (localToken){
            const decoded_token = jwtDecode(localToken);
            const expiration = decoded_token.exp;
            const now = Date.now() / 1000;

            if (expiration && expiration >= now) {
                console.log("We are not expired, I believe")
            }
        }
        
        const token = await getToken();
        if (token){
            setIsAuthenticated(true);
            setLoading(false);
        }
        else{
            setIsAuthenticated(false);
            setLoading(false);
        }
    };

    if (loading) {
        return (

            <div className='h-screen flex justify-center items-center'>
                <div className='text-2xl italic text-gray-100 font-light'>Loading...</div>
            </div>

        );
    }*/
    if (authTokens){
        if (!isProfileRoute) {
            return (
                <div className={'h-screen flex flex-col '}>
                    {!isProfileRoute && <><TopBar /></>}
                    <div className='grow'>{children}</div>
                </div>
            );
        } else {
            return (
                <>{children}</>
            )
        }
    }else {
        return <>{children}</>
    }
};
export default PageWrapper;