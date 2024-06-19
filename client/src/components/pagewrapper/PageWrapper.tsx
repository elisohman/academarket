import TopBar from '../topbar/TopBar';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {REFRESH_TOKEN, ACCESS_TOKEN} from '../../utils/constants';
import {jwtDecode} from 'jwt-decode'
import sendRequest from '../../utils/request';
import {Mutex, MutexInterface} from 'async-mutex';

interface PageWrapperProps {
    children: React.ReactNode;
    className?: string;
}

const mutex = new Mutex();

const PageWrapper: React.FC<PageWrapperProps> = ({children, className}) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        auth().catch(() => setIsAuthenticated(false))
    })
    
    const refreshToken = async () => {
        try {
            await mutex.runExclusive(async () => {
                const response = await sendRequest('/token/refresh/', 'POST', {refresh: localStorage.getItem(REFRESH_TOKEN)});
                if (response.ok) {
                    const responseData = await response.json();
                    localStorage.setItem(ACCESS_TOKEN, responseData.access);
                    localStorage.setItem(REFRESH_TOKEN, responseData.refresh);
                    //console.log(responseData);
                    setIsAuthenticated(true);
                    setLoading(false);  
                } else {
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
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }
        
        const decoded_token = jwtDecode(token);
        const expiration = decoded_token.exp;
        const now = Date.now() / 1000;
            
        if (expiration && expiration < now) {
            await refreshToken();
        } else {
            setIsAuthenticated(true);
            setLoading(false);
        }
    };

    if (loading) {
        return(
            <div className='h-screen flex justify-center items-center'>
                <div className='text-2xl font-semibold'>Loading...</div>
            </div>
        );
    }

    return isAuthenticated ? (
        <div className={'h-screen flex flex-col ' + (className)}>
            <TopBar />
            <div className='grow px-8 pb-8'>{children}</div>
        </div>
    ) : (
        <Navigate to='/signin' />
    );
}

export default PageWrapper;
