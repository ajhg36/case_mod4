'use server'

const makeRequest = async (url, method, data = null, token = null) => {
    try {
        console.log(`Realizando solicitud a: ${url} con método: ${method}`);
        if (data) {
            console.log('Datos enviados:', data);
        }

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

        // Insertar aquí la prueba adicional
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers.get('content-type'));
        const text = await response.text();
        console.log('Raw response body:', text);

        try {
            const dataRes = JSON.parse(text);
            console.log('Parsed JSON:', dataRes);
            return dataRes;
        } catch (err) {
            console.error('Failed to parse JSON:', err);
            throw new Error('Error parsing JSON response.');
        }
        
    } catch (error) {
        console.error(`Failed to ${method} request at ${url}:`, error.message || error);
        throw new Error(`Failed to ${method} request.`);
    }
};

// Obtener todos los proyectos de un cliente
async function getProjects(token, clientId) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_PROJECTS}/${clientId}`;
    console.log(`Fetching projects for clientId: ${clientId}`);
    console.log(`URL construida: ${url}`);
    return await makeRequest(url, 'GET', null, token);
}

// Obtener un proyecto por su ID
async function getProjectById(token, projectId) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_PROJECTS}/one/${projectId}`;
    return await makeRequest(url, 'GET', null, token);
}

// Crear un nuevo proyecto
async function createProject(token, data) {
    // Validar campos obligatorios antes de enviar la solicitud
    if (!data.name || !data.projectCode || !data.email || !data.code || !data.clientId) {
        throw new Error('Todos los campos obligatorios deben estar presentes.');
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_PROJECTS}`;
    return await makeRequest(url, 'POST', data, token);
}

// Actualizar un proyecto existente
async function updateProject(token, projectId, data) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_PROJECTS}/${projectId}`;
    return await makeRequest(url, 'PUT', data, token);
}

// Eliminar un proyecto
async function deleteProject(token, projectId) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_PROJECTS}/${projectId}`;
    return await makeRequest(url, 'DELETE', null, token);
}

async function getAllProjects(token) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_PROJECTS}`;
    return await makeRequest(url, 'GET', null, token);
}

async function getProjectOneById(token, projectId) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_PROJECTS}/one/${projectId}`;
    return await makeRequest(url, 'GET', null, token);
}

export { getProjects, getProjectById, createProject, updateProject, deleteProject, getAllProjects, getProjectOneById };
