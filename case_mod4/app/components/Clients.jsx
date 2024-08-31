'use client'

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { getClients, getClient, updateClient, deleteClient, createClient } from '@/app/utils/clients';

export default function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const { width, height } = useWindowSize();

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        const token = localStorage.getItem('jwtAlex');
        if (!token) {
            console.log('Usuario no autenticado');
            return;
        }

        try {
            const clientsList = await getClients(token);
            setClients(clientsList);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleEditClient = async (clientId) => {
        const token = localStorage.getItem('jwtAlex');

        try {
            const clientData = await getClient(token, clientId);

            if (!clientData.address) {
                clientData.address = {
                    street: '',
                    number: '',
                    postal: '',
                    city: '',
                    province: '',
                };
            }

            setCurrentClient(clientData); 
            setShowEditModal(true); 
        } catch (err) {
            alert(`Error al obtener cliente: ${err.message}`);
        }
    };

    const handleUpdateClient = async () => {
        const token = localStorage.getItem('jwtAlex');
    
        try {
            const updatedClient = await updateClient(token, currentClient._id, currentClient);
    
            if (!updatedClient || !updatedClient._id) {
                throw new Error('La respuesta de la API es nula o el cliente no se actualizó correctamente.');
            }
    
            setClients(clients.map(client => client._id === updatedClient._id ? updatedClient : client));
            setShowEditModal(false);
            resetForm();
            triggerConfetti();
            triggerSuccessAlert('Cliente actualizado exitosamente');
        } catch (err) {
            alert(`Error al actualizar cliente: ${err.message}`);
        }
    };

    const handleDeleteClient = async (clientId) => {
        const token = localStorage.getItem('jwtAlex');

        if (!window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            return;
        }

        try {
            await deleteClient(token, clientId);
            setClients(clients.filter(client => client._id !== clientId));
            triggerConfetti();
            triggerSuccessAlert('Cliente eliminado exitosamente');
        } catch (err) {
            alert(`Error al eliminar cliente: ${err.message}`);
        }
    };

    const resetForm = () => {
        setCurrentClient(null);
    };

    const triggerConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => {
            setShowConfetti(false);
        }, 3000);
    };

    const triggerSuccessAlert = (message) => {
        setShowSuccessAlert(true);
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 3000);
    };

    if (loading) {
        return <p className="text-white">Cargando clientes...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error al cargar clientes: {error}</p>;
    }

    return (
        <div className="clients-container p-4">
            {showConfetti && <Confetti width={width} height={height} />}
            {showSuccessAlert && <div className="success-alert bg-green-500 text-white p-2 rounded">Cliente actualizado exitosamente</div>}
            <div className="create-client mb-4">
                <button className="create-client-btn bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={() => setShowEditModal(true)}>
                    Crear Cliente
                </button>
            </div>
            {clients.length > 0 ? (
                <ul className="client-list space-y-4">
                    {clients.map((client) => (
                        <li key={client._id} className="client-item bg-white p-4 rounded shadow-lg" onClick={() => handleEditClient(client._id)}>
                            <div>
                                <strong className="text-lg">Nombre:</strong> {client.name}
                            </div>
                            <div>
                                <strong className="text-sm">CIF:</strong> {client.cif}
                            </div>
                            <div className="client-address mt-2">
                                {client.address && client.address.street && (
                                    <strong className="text-sm">Dirección:</strong>
                                )}
                                {client.address && client.address.street ? (
                                    <p className="text-sm">{`${client.address.street}${client.address.number ? `, Nº ${client.address.number}` : ''}${client.address.city ? `, ${client.address.city}` : ''}${client.address.province ? `, ${client.address.province}` : ''}${client.address.postal ? `, CP: ${client.address.postal}` : ''}`}</p>
                                ) : (
                                    <p className="text-sm text-gray-500">Sin dirección</p>
                                )}
                            </div>
                            <button className="delete-btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2" onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClient(client._id);
                            }}>Eliminar Cliente</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="no-clients bg-white p-4 rounded shadow-lg text-center">
                    <img src="/images/sin_data.jpeg" alt="Crea tu primer cliente" className="empty-state-img mx-auto mb-4" />
                    <h2 className="text-xl">¿Aún no hay Clientes? Vamos a crear uno</h2>
                </div>
            )}
            {showEditModal && (
                <div className="popup-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl mb-4">{currentClient ? 'Editar Cliente' : 'Crear Cliente'}</h2>
                        <label className="block mb-2">Nombre:
                            <input 
                                type="text" 
                                value={currentClient?.name || ''} 
                                onChange={e => setCurrentClient({ ...currentClient, name: e.target.value })} 
                                required
                                className="block w-full mt-1 p-2 border border-gray-300 rounded"
                            />
                        </label>
                        <label className="block mb-2">CIF:
                            <input 
                                type="text" 
                                value={currentClient?.cif || ''} 
                                onChange={e => setCurrentClient({ ...currentClient, cif: e.target.value })} 
                                required
                                className="block w-full mt-1 p-2 border border-gray-300 rounded"
                            />
                        </label>
                        <label className="block mb-2">
                            <p>Agregar/Editar dirección</p>
                            <input 
                                type="checkbox" 
                                checked={!!currentClient?.address} 
                                onChange={() => {
                                    setCurrentClient(currentClient => ({
                                        ...currentClient,
                                        address: currentClient?.address ? null : { street: '', number: '', postal: '', city: '', province: '' }
                                    }));
                                }}
                                className="mr-2"
                            /> 
                        </label>
                        {currentClient?.address && (
                            <div className="address-fields space-y-2">
                                <label>Calle:
                                    <input 
                                        type="text" 
                                        value={currentClient.address.street || ''} 
                                        onChange={e => setCurrentClient({ ...currentClient, address: { ...currentClient.address, street: e.target.value } })} 
                                        className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                    />
                                </label>
                                <label>Número:
                                    <input 
                                        type="text" 
                                        value={currentClient.address.number || ''} 
                                        onChange={e => setCurrentClient({ ...currentClient, address: { ...currentClient.address, number: e.target.value } })} 
                                        className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                    />
                                </label>
                                <label>Postal:
                                    <input 
                                        type="text" 
                                        value={currentClient.address.postal || ''} 
                                        onChange={e => setCurrentClient({ ...currentClient, address: { ...currentClient.address, postal: e.target.value } })} 
                                        className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                    />
                                </label>
                                <label>Ciudad:
                                    <input 
                                        type="text" 
                                        value={currentClient.address.city || ''} 
                                        onChange={e => setCurrentClient({ ...currentClient, address: { ...currentClient.address, city: e.target.value } })} 
                                        className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                    />
                                </label>
                                <label>Provincia:
                                    <input 
                                        type="text" 
                                        value={currentClient.address.province || ''} 
                                        onChange={e => setCurrentClient({ ...currentClient, address: { ...currentClient.address, province: e.target.value } })} 
                                        className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                    />
                                </label>
                            </div>
                        )}
                        <div className="flex justify-end space-x-4 mt-4">
                            <button className="save-btn bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleUpdateClient}>
                                {currentClient ? 'Guardar Cambios' : 'Crear Cliente'}
                            </button>
                            <button className="close-btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => setShowEditModal(false)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
