import { REFRESH_TOKEN, ACCESS_TOKEN } from './constants';
import sendRequest from './request';
import { Mutex, Semaphore } from 'async-mutex';
import { jwtDecode } from 'jwt-decode';

const mutex = new Mutex();

async function getToken() {
    const initialLocalToken = localStorage.getItem(ACCESS_TOKEN);
    if (initialLocalToken){
        const decoded_token = jwtDecode(initialLocalToken);
        const expiration = decoded_token.exp;
        const now = Date.now() / 1000;

        if (expiration && expiration >= now) {
            console.log("We are not expired, I believe")
            return initialLocalToken;
        }
    }

    let accessToken = null;
    const release = await mutex.acquire();
    try {
        // token refresh uses mutex to avoid race condition
        //await mutex.runExclusive(async () => {

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