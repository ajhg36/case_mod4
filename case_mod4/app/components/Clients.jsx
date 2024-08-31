'use client'

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { getClient, updateClient, deleteClient, createClient } from '@/app/utils/clients';

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_CLIENTS}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.status}`);
            }

            const data = await res.json();
            setClients(data);
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

            // Verificar que el campo address existe y contiene valores válidos
            if (!clientData.address) {
                clientData.address = {
                    street: '',
                    number: '',
                    postal: '',
                    city: '',
                    province: '',
                }; // Crear un objeto address vacío si no existe
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
        return <p>Cargando clientes...</p>;
    }

    if (error) {
        return <p>Error al cargar clientes: {error}</p>;
    }

    return (
        <div className="clients-container">
            {showConfetti && <Confetti width={width} height={height} />}
            {showSuccessAlert && <div className="success-alert">Cliente actualizado exitosamente</div>}
            <div className="create-client">
                <button className="create-client-btn" onClick={() => setShowEditModal(true)}>
                    Crear Cliente
                </button>
            </div>
            {clients.length > 0 ? (
                <ul className="client-list">
                    {clients.map((client) => (
                        <li key={client._id} className="client-item" onClick={() => handleEditClient(client._id)}>
                            <div>
                                <strong>Nombre:</strong> {client.name}
                            </div>
                            <div>
                                <strong>CIF:</strong> {client.cif}
                            </div>
                            <div className="client-address">
                                {client.address && client.address.street && (
                                    <strong>Dirección:</strong>
                                )}
                                {client.address && client.address.street ? (
                                    `${client.address.street}${client.address.number ? `, Nº ${client.address.number}` : ''}${client.address.city ? `, ${client.address.city}` : ''}${client.address.province ? `, ${client.address.province}` : ''}${client.address.postal ? `, CP: ${client.address.postal}` : ''}`
                                ) : (
                                    'Sin dirección'
                                )}
                            </div>
                            <button className="delete-btn" onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClient(client._id);
                            }}>Eliminar Cliente</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="no-clients">
                    <img src="/images/sin_data.jpeg" alt="Crea tu primer cliente" className="empty-state-img" />
                    <h2>¿Aún no hay Clientes? Vamos a crear uno</h2>
                </div>
            )}
            {showEditModal && (
                <div className="popup-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <h2>{currentClient ? 'Editar Cliente' : 'Crear Cliente'}</h2>
                        <label>Nombre:
                            <input 
                                type="text" 
                                value={currentClient?.name || ''} 
                                onChange={e => setCurrentClient({ ...currentClient, name: e.target.value })} 
                                required
                            />
                        </label>
                        <label>CIF:
                            <input 
                                type="text" 
                                value={currentClient?.cif || ''} 
                                onChange={e => setCurrentClient({ ...currentClient, cif: e.target.value })} 
                                required
                            />
                        </label>
                        <label>
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
                            /> 
                        </label>
                        {currentClient?.address && (
                            <div className="address-fields">
                                <label>Calle:
                                    <input 
                                        type="text" 
                                        value={currentClient.address.street || ''} 
                                        onChange={e => setCurrentClient({ ...currentClient, address: { ...currentClient.address, street: e.target.value } })} 
                                    />
                                </label>
                                <label>Número:
                                    <input 
                                        type="text" 
                                        value={currentClient.address.number || ''} 
                                        onChange={e => setCurrentClient({ ...currentClient, address: { ...currentClient.address, number: e.target.value } })} 
                                    />
                                </label>
                                <label>Postal:
                                    <input 
                                        type="text" 
                                        value={currentClient.address.postal || ''} 
                                        onChange={e => setCurrentClient({ ...currentClient, address: { ...currentClient.address, postal: e.target.value } })} 
                                    />
                                </label>
                                <label>Ciudad:
                                    <input 
                                        type="text" 
                                        value={currentClient.address.city || ''} 
                                        onChange={e => setCurrentClient({ ...currentClient, address: { ...currentClient.address, city: e.target.value } })} 
                                    />
                                </label>
                                <label>Provincia:
                                    <input 
                                        type="text" 
                                        value={currentClient.address.province || ''} 
                                        onChange={e => setCurrentClient({ ...currentClient, address: { ...currentClient.address, province: e.target.value } })} 
                                    />
                                </label>
                            </div>
                        )}
                        <button className="save-btn" onClick={handleUpdateClient}>
                            {currentClient ? 'Guardar Cambios' : 'Crear Cliente'}
                        </button>
                        <button className="close-btn" onClick={() => setShowEditModal(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
