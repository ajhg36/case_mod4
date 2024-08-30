'use client'

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newClient, setNewClient] = useState({ name: '', cif: '' });
    const [showAddress, setShowAddress] = useState(false);
    const [address, setAddress] = useState({
        street: '',
        number: '',
        postal: '',
        city: '',
        province: ''
    });
    const [formError, setFormError] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();

    useEffect(() => {
        const token = localStorage.getItem('jwtAlex');
        if (!token) {
            console.log('Usuario no autenticado');
            return;
        }

        const fetchClients = async () => {
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

        fetchClients();
    }, []);

    const handleCreateClient = async () => {
        if (newClient.name.trim() === '' || newClient.cif.trim() === '') {
            setFormError('El nombre y CIF son requeridos.');
            return;
        }

        const token = localStorage.getItem('jwtAlex');
        const clientData = showAddress ? { ...newClient, address } : newClient;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_CLIENTS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(clientData),
            });

            if (!res.ok) {
                throw new Error(`Error al crear cliente: ${res.status}`);
            }

            setShowCreateModal(false);
            const newClient = await res.json();
            setClients([...clients, newClient]);
            resetForm(); // Resetear el formulario
            triggerConfetti(); // Disparar confeti
        } catch (err) {
            alert(`Error al crear cliente: ${err.message}`);
        }
    };

    const resetForm = () => {
        setNewClient({ name: '', cif: '' });
        setAddress({
            street: '',
            number: '',
            postal: '',
            city: '',
            province: ''
        });
        setShowAddress(false);
    };

    const triggerConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => {
            setShowConfetti(false);
        }, 3000); // Duración del confeti en pantalla (3 segundos)
    };

    const toggleCreateModal = () => {
        setFormError(''); // Limpiar cualquier error al abrir el modal
        setShowCreateModal(!showCreateModal);
        if (!showCreateModal) resetForm(); // Resetear el formulario al cerrar el modal
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
            <div className="create-client">
                <button className="create-client-btn" onClick={toggleCreateModal}>
                    Crear Cliente
                </button>
            </div>
            {clients.length > 0 ? (
                <ul className="client-list">
                    {clients.map((client) => (
                        <li key={client.userId} className="client-item">
                            <div>
                                <strong>Nombre:</strong> {client.name}
                            </div>
                            <div>
                                <strong>CIF:</strong> {client.cif}
                            </div>
                            <div className="client-address">
                                <strong>Dirección:</strong> 
                                {client.address && client.address.street ? (
                                    `${client.address.street}, Nº ${client.address.number}, ${client.address.city}, ${client.address.province}, CP: ${client.address.postal}`
                                ) : (
                                    'Sin dirección'
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="no-clients">
                    <img src="/images/sin_data.jpeg" alt="Crea tu primer cliente" className="empty-state-img" />
                    <h2>¿Aún no hay Clientes? Vamos a crear uno</h2>
                </div>
            )}
            {showCreateModal && (
                <div className="popup-overlay" onClick={toggleCreateModal}>
                    <div className="popup" onClick={e => e.stopPropagation()}>
                        <h2>Crear Cliente</h2>
                        {formError && <p className="form-error">{formError}</p>}
                        <label>Nombre:
                            <input 
                                type="text" 
                                value={newClient.name} 
                                onChange={e => setNewClient({ ...newClient, name: e.target.value })} 
                                required
                            />
                        </label>
                        <label>CIF:
                            <input 
                                type="text" 
                                value={newClient.cif} 
                                onChange={e => setNewClient({ ...newClient, cif: e.target.value })} 
                                required
                            />
                        </label>
                        <label>
                            <p>Agregar dirección</p>
                            <input 
                                type="checkbox" 
                                checked={showAddress} 
                                onChange={() => setShowAddress(!showAddress)} 
                            /> 
                        </label>
                        {showAddress && (
                            <div className="address-fields">
                                <label>Calle:
                                    <input 
                                        type="text" 
                                        value={address.street} 
                                        onChange={e => setAddress({ ...address, street: e.target.value })} 
                                    />
                                </label>
                                <label>Número:
                                    <input 
                                        type="text" 
                                        value={address.number} 
                                        onChange={e => setAddress({ ...address, number: e.target.value })} 
                                    />
                                </label>
                                <label>Postal:
                                    <input 
                                        type="text" 
                                        value={address.postal} 
                                        onChange={e => setAddress({ ...address, postal: e.target.value })} 
                                    />
                                </label>
                                <label>Ciudad:
                                    <input 
                                        type="text" 
                                        value={address.city} 
                                        onChange={e => setAddress({ ...address, city: e.target.value })} 
                                    />
                                </label>
                                <label>Provincia:
                                    <input 
                                        type="text" 
                                        value={address.province} 
                                        onChange={e => setAddress({ ...address, province: e.target.value })} 
                                    />
                                </label>
                            </div>
                        )}
                        <button className="save-btn" onClick={handleCreateClient}>Guardar</button>
                        <button className="close-btn" onClick={toggleCreateModal}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
