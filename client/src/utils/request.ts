const BASE_API_URL = 'http://localhost:8000/api';

async function sendRequest(path: string, method: string, body?: any, token?: string) {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options: RequestInit = { // RequestInit allows for later additions of new options
            method: method,
            headers: headers,
        };

        // if not GET request, then body can be part of response
        if (method !== 'GET' && method !== 'HEAD' && body !== undefined) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(BASE_API_URL + path, options);

        //console.log('Response:', response);

        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export default sendRequest;