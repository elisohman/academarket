const BASE_API_URL = 'http://192.168.50.63:8000/api';

async function sendRequest(path: string, method: string, body?: any, token?: string) {
    const ipAddress = window.location.hostname;
    const apiUrl = ipAddress === 'localhost' ? 'http://localhost:8000/api' : `http://${ipAddress}:8000/api`;
    console.log('API URL:', apiUrl + path)
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(apiUrl + path, {
            method: method,
            headers: headers,
            body: JSON.stringify(body),
        });

        console.log('Response:', response);

        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export default sendRequest;