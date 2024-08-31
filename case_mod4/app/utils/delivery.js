'use server';

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
            console.log("Datos: ", dataRes);
            return dataRes;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Failed to ${method} request at ${url}:`, error.message || error);
        throw new Error(`Failed to ${method} request.`);
    }
};

// Obtener todos los albaranes
async function getDeliveries(token) {
    const url = process.env.NEXT_PUBLIC_BACKEND_DOMAIN_DELIVERY;
    return await makeRequest(url, 'GET', null, token);
}

// Crear un nuevo albarán
async function createDelivery(token, data) {
    const url = process.env.NEXT_PUBLIC_BACKEND_DOMAIN_DELIVERY;
    // Verifica si los campos obligatorios están presentes
    if (!data.clientId || !data.projectId || !data.format || !data.description || !data.workdate) {
        //console.log("Datos enviados:", data);
        throw new Error(`Todos los campos obligatorios deben estar presentes. ${data}` );
    }

    return await makeRequest(url, 'POST', data, token);
}


// Actualizar un albarán existente
async function updateDelivery(token, deliveryId, data) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_DELIVERY}/${deliveryId}`;
    return await makeRequest(url, 'PUT', data, token);
}

// Eliminar un albarán
async function deleteDelivery(token, deliveryId) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_DELIVERY}/${deliveryId}`;
    return await makeRequest(url, 'DELETE', null, token);
}

// Descargar PDF de un albarán
async function downloadDeliveryPDF(token, deliveryId) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_DELIVERY}/pdf/${deliveryId}`;
    try {
        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = `delivery_${deliveryId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (error) {
        console.error(`Failed to GET PDF at ${url}:`, error.message || error);
        throw new Error(`Failed to GET PDF.`);
    }
}

export { getDeliveries, createDelivery, updateDelivery, deleteDelivery, downloadDeliveryPDF };
