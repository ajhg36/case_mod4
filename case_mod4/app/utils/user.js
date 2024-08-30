'use server'

const makeRequest = async (url, method, data, token = null) => {
    /*console.log('URL:', url);  // Debugging para ver la URL completa
    console.log('method:', method);
    console.log('data:');
    console.log(data);*/

    try {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method,
            headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Network response was not ok: ${errorBody.message || response.statusText}`);
        }

        const dataRes = await response.json();
        return dataRes;

    } catch (error) {
        console.error(`Failed to ${method} request at ${url}:`, error.message || error);
        throw new Error(`Failed to ${method} request.`);
    }
};

// Función para registrar usuario
async function createUser(data) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}${process.env.USERS}register`;
    return await makeRequest(url, 'POST', data);
}

// Función para validar usuario
async function validateUser(token, data) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}${process.env.USERS}validation`;
    return await makeRequest(url, 'PUT', data, token);
}

// Función para login de usuario
async function loginUser(data) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}${process.env.USERS}login`;
    return await makeRequest(url, 'POST', data);
}

export { createUser, validateUser, loginUser };
