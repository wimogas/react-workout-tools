const useApi = async (url: string, method: string, body: object | null, credentials: boolean = false ) => {

    let data;
    let error;

    const options: RequestInit = {
        method
    }

    if (method === 'POST'|| method === 'DELETE' || method === 'PUT') {
        options['headers'] = {
            'Content-Type': 'application/json'
        }
    }

    if (method === 'POST' || method === 'PUT') {
        options['body'] = JSON.stringify(body)
    }

    if (credentials) {
        options['credentials'] = "include"
    }

    try {
        const response = await fetch(url, options)
        data = await response.json();

    } catch (err) {
        error = err
    }

    return { data, error }
}

export default useApi;