import { REFRESH_TOKEN, ACCESS_TOKEN } from './constants';
import sendRequest from './request';
import { Mutex } from 'async-mutex';


async function getToken() {
    let accessToken = null;
    const mutex = new Mutex();
    try {
        // token refresh uses mutex to avoid race condition
        await mutex.runExclusive(async () => {
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
        });
    } catch (error) {
        console.log('Error during token refresh:', error);
    }
    return accessToken;
}


export { getToken };