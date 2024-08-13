
async function sendRequest(path: string, method: string, body?: any, token?: string, isAdmin=false) {
    const ipAddress = window.location.hostname;
    let apiUrl = ipAddress === 'localhost' ? 'http://localhost:8000/api' : `http://${ipAddress}:8000/api`;
    if(isAdmin){
        apiUrl = ipAddress === 'localhost' ? 'http://localhost:8000/data_pipeline' : `http://${ipAddress}:8000/data_pipeline`;
    }
    console.log('API URL:', apiUrl + path)
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

        const response = await fetch(apiUrl + path, options);

        //console.log('Response:', response);

        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export default sendRequest;