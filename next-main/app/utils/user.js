'use server'

async function createUser(data) {
    try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/user/register`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const dataRes = await response.json();
        return (dataRes);
    } catch (error) {
        console.error('Failed to register user:', error)
        throw new Error('Failed to register user.')
    }
}

async function validateUser(token, data) {
    try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/user/validation`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const dataRes = await response.json();
        return (dataRes);
    } catch (error) {
        console.error('Failed to match code:', error)
        throw new Error('Failed to match code.')
    }
}

async function loginUser(data) {
    try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/user/login`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const dataRes = await response.json();
        return (dataRes);
    } catch (error) {
        console.error('Failed to login user:', error)
        throw new Error('Failed to login user.')
    }
}

export { createUser, validateUser, loginUser }

