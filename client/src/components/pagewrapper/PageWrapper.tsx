import TopBar from '../topbar/TopBar';
import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import {REFRESH_TOKEN, ACCESS_TOKEN} from '../../utils/constants';
import {jwtDecode} from 'jwt-decode'
import sendRequest from '../../utils/request';

interface PageWrapperProps {
    children: React.ReactNode;
    className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({children, className}) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const refreshToken = useCallback(async () => {
        const refresh_token = localStorage.getItem(REFRESH_TOKEN);
        if (!refresh_token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }
        try {
            const response = await sendRequest('/token/refresh/', 'POST', {refresh: refresh_token});
            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem(ACCESS_TOKEN, responseData.access);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.log('Error during token refresh:', error);
            setIsAuthenticated(false);
        }
        setLoading(false);
    }, []);

    const auth = useCallback(async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        try {
            const decoded_token = jwtDecode(token);
            const expiration = decoded_token.exp;
            const now = Date.now() / 1000;
            
            if (expiration && expiration < now) {
                await refreshToken();
            } else {
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.log('Error during token validation:', error);
            setIsAuthenticated(false);
        }
        setLoading(false);
    }, [refreshToken]);

    useEffect(() => {
        auth();
    }, [auth]);

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
