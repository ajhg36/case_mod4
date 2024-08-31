'use server'

const makeRequest = async (url, method, data = null, token = null) => {
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
            body: data ? JSON.stringify(data) : null,
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => null); 
            throw new Error(`Network response was not ok: ${errorBody?.message || response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const dataRes = await response.json();
            return dataRes;
        } else {
            return null;
        }

    } catch (error) {
        console.error(`Failed to ${method} request at ${url}:`, error.message || error);
        throw new Error(`Failed to ${method} request.`);
    }
};

// Función para obtener un cliente por ID
async function getClient(token, clientId) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_CLIENTS}/${clientId}`;
    return await makeRequest(url, 'GET', null, token);
}

// Función para actualizar un cliente
async function updateClient(token, clientId, data) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_CLIENTS}/${clientId}`;
    return await makeRequest(url, 'PUT', data, token);
}

// Función para eliminar un cliente
async function deleteClient(token, clientId) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_CLIENTS}/${clientId}`;
    return await makeRequest(url, 'DELETE', null, token);
}

// Función para crear un nuevo cliente
async function createClient(token, data) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_CLIENTS}`;
    return await makeRequest(url, 'POST', data, token);
}

export { getClient, updateClient, deleteClient, createClient };
