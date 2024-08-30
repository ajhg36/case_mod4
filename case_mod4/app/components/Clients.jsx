'use client';
import { useEffect, useState } from 'react';

export default function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            const token = localStorage.getItem('jwtAlex');
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}api/client`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch clients');
                }

                const data = await response.json();
                setClients(data.clients); // Ajusta según la estructura de la API
            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    if (loading) {
        return <div>Loading clients...</div>;
    }

    return (
        <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold mb-4">Client List</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(client => (
                        <tr key={client.id}>
                            <td className="py-2 px-4 border-b">{client.id}</td>
                            <td className="py-2 px-4 border-b">{client.name}</td>
                            <td className="py-2 px-4 border-b">{client.email}</td>
                            <td className="py-2 px-4 border-b">{client.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
