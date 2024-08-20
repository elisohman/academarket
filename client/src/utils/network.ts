import { REFRESH_TOKEN, ACCESS_TOKEN } from './constants';
import { Mutex, Semaphore } from 'async-mutex';

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuthContext } from '../contexts/AuthContext';
import { AUTH_TOKENS } from './constants';
import { useRef } from 'react';

const ipAddress = window.location.hostname;
let apiUrl = ipAddress === 'localhost' ? 'http://localhost:8000/api' : `http://${ipAddress}:8000/api`;
let adminApiUrl = ipAddress === 'localhost' ? 'http://localhost:8000/data_pipeline' : `http://${ipAddress}:8000/data_pipeline`;

const mutex = new Mutex();

const createAxiosInstance = (authTokens: any, setAuthTokens: any, setUser: any, refreshPromiseRef: React.MutableRefObject<Promise<any> | null>, signOut: any): AxiosInstance => {
    const instance = axios.create({
        baseURL: apiUrl,
        headers: {
            Authorization: `Bearer ${authTokens?.access}`
        }
    });

    instance.interceptors.request.use(
        async request => {
            if (authTokens) {
                const access_token = jwtDecode(authTokens.access);
                const expiration = access_token.exp;
                const currentTime = Date.now() / 1000;
                const expired = expiration && expiration < currentTime;

                if (!expired) return request;
                

                if (!refreshPromiseRef.current) {
                    refreshPromiseRef.current = mutex.runExclusive(async () => {
                        try {
                            const response = await axios.post(`${apiUrl}/token/refresh/`, {
                                refresh: authTokens.refresh
                            });
                            localStorage.setItem(AUTH_TOKENS, JSON.stringify(response.data));
                            setAuthTokens(response.data);
                            setUser(jwtDecode(response.data.access));
                            request.headers.Authorization = `Bearer ${response.data.access}`;
                            return response.data;
                        } catch (error) {
                            console.error('Error refreshing token:', error);
                            return signOut()
                        } finally {
                            refreshPromiseRef.current = null;
                        }
                        
                    });
                }
                const newTokens = await refreshPromiseRef.current;
                if (newTokens) {
                    request.headers.Authorization = `Bearer ${newTokens.access}`;
                }
            }
            return request;
        }
    );
    return instance;
};

const useAPI = () => {
    const { authTokens, setAuthTokens, setUser, signOut } = useAuthContext();
    const refreshPromiseRef = useRef<Promise<any> | null>(null);
    const instance = createAxiosInstance(authTokens, setAuthTokens, setUser, refreshPromiseRef, signOut);

    const sendRequest = async (path: string, method: string, body?: any, isAdmin = false) => {
        const url = isAdmin ? adminApiUrl + path : apiUrl + path;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens?.access}`
        };

        const options: AxiosRequestConfig = {
            method: method,
            url: url,
            data: body,
            headers: headers
        };
        const response = await instance.request(options);
        return response;
    };

    return sendRequest;
}

export default useAPI;
/*
const mutex = new Mutex();

async function getToken() {

    let accessToken = null;
    const release = await mutex.acquire();
    try {
        // token refresh uses mutex to avoid race condition
        //await mutex.runExclusive(async () => {
        const initialLocalToken = localStorage.getItem(ACCESS_TOKEN);
            const response = await sendRequest('/token/verify/', 'POST', {
                "token": localStorage.getItem(ACCESS_TOKEN),
            });
            if (response.ok) {
                const responseData = await response.json();
                accessToken = localStorage.getItem(ACCESS_TOKEN);
            }
            else {
                console.log("Expired token, refreshing...")

                const response = await sendRequest('/token/refresh/', 'POST', {
                    refresh: localStorage.getItem(REFRESH_TOKEN),
                });
                if (response.ok) {
                    console.log("Succesfully refreshed token!")
                    const responseData = await response.json();
                    accessToken = responseData.access;
                    localStorage.setItem(ACCESS_TOKEN, responseData.access);
                    localStorage.setItem(REFRESH_TOKEN, responseData.refresh);
                }
            }
        
        //});
    } catch (error) {
        console.log('Error during token refresh:', error);
    } finally {
        release();
        return accessToken;
    }
}


export { getToken };
*/