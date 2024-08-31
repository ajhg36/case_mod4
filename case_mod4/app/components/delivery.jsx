'use client';
import { useEffect, useState } from 'react';
import { getClients } from '@/app/utils/clients';
import { getAllProjects } from '@/app/utils/projects';
import { getDeliveries, createDelivery, updateDelivery, deleteDelivery, downloadDeliveryPDF } from '@/app/utils/delivery';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function DeliveryPage() {
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentDelivery, setCurrentDelivery] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const { width, height } = useWindowSize();
    const [showNotes, setShowNotes] = useState(false); // Nuevo estado para controlar las notas

    useEffect(() => {
        const fetchClientsAndDeliveries = async () => {
            const token = localStorage.getItem('jwtAlex');
            if (!token) {
                console.log('Usuario no autenticado');
                return;
            }

            try {
                const clientsList = await getClients(token);
                setClients(clientsList);

                const deliveriesList = await getDeliveries(token);
                setDeliveries(deliveriesList);
            } catch (err) {
                console.error('Error al obtener datos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClientsAndDeliveries();
    }, []);

    const handleClientChange = async (clientId) => {
        setSelectedClientId(clientId);
        setSelectedProjectId(''); // Resetear la selección del proyecto

        if (!clientId) {
            setProjects([]);
            return;
        }

        const token = localStorage.getItem('jwtAlex');
        try {
            const clientProjects = await getAllProjects(token);
            const filteredProjects = clientProjects.filter(project => project.clientId === clientId);
            setProjects(filteredProjects);
        } catch (err) {
            console.error('Error al obtener proyectos:', err);
            setError(err.message);
        }
    };

    const handleCreateDelivery = () => {
        setCurrentDelivery({
            clientId: selectedClientId,
            projectId: selectedProjectId,
            format: '',
            material: '',
            hours: '',
            description: '',
            workdate: '',
        });
        setShowEditModal(true);
    };

    const handleSaveDelivery = async () => {
        const token = localStorage.getItem('jwtAlex');
    
        // Verifica si los campos requeridos están presentes
        if (!currentDelivery.clientId || !currentDelivery.projectId || !currentDelivery.format || !currentDelivery.description || !currentDelivery.workdate) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }
    
        console.log("Datos enviados:", currentDelivery);
    
        try {
            if (currentDelivery._id) {
                await updateDelivery(token, currentDelivery._id, currentDelivery);
                setDeliveries(deliveries.map(delivery => delivery._id === currentDelivery._id ? currentDelivery : delivery));
            } else {
                const newDelivery = await createDelivery(token, currentDelivery);
                setDeliveries([...deliveries, newDelivery]);
            }
    
            setShowEditModal(false);
            triggerConfetti();
            triggerSuccessAlert('Albarán guardado exitosamente');
        } catch (err) {
            alert(`Error al guardar albarán: ${err.message}`);
        }
    };

    const handleEditDelivery = (delivery) => {
        setCurrentDelivery(delivery);
        setShowEditModal(true);
    };

    const handleDeleteDelivery = async (deliveryId) => {
        const token = localStorage.getItem('jwtAlex');

        if (!window.confirm('¿Estás seguro de que deseas eliminar este albarán?')) {
            return;
        }

        try {
            await deleteDelivery(token, deliveryId);
            setDeliveries(deliveries.filter(delivery => delivery._id !== deliveryId));
            triggerConfetti();
            triggerSuccessAlert('Albarán eliminado exitosamente');
        } catch (err) {
            alert(`Error al eliminar albarán: ${err.message}`);
        }
    };

    const handleDownloadPDF = async (deliveryId) => {
        const token = localStorage.getItem('jwtAlex');
        try {
            await downloadDeliveryPDF(token, deliveryId);
        } catch (err) {
            alert(`Error al descargar PDF: ${err.message}`);
        }
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

    return (
        <div className="delivery-container p-4">
            {showConfetti && <Confetti width={width} height={height} />}
            {showSuccessAlert && <div className="success-alert bg-green-500 text-white p-2 rounded">Albarán guardado exitosamente</div>}
                        {/* Botón para mostrar anotaciones */}
                        <div className="notes-section">
                <button className="show-notes-btn" onClick={() => setShowNotes(!showNotes)}>
                    {showNotes ? 'Ocultar Anotaciones' : 'Mostrar Anotaciones'}
                </button>
                {showNotes && (
                    <div className="notes">
                        <p>Por alguna razon me sucedio lo mismo que en proyectos
                        </p>
                    </div>
                )}
            </div>

<div className="create-delivery mb-4">
                <button className="create-delivery-btn bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleCreateDelivery}>
                    Crear Albarán
                </button>
            </div>
            {deliveries.length > 0 ? (
                <ul className="delivery-list space-y-4">
                    {deliveries.map((delivery) => (
                        <li key={delivery._id} className="delivery-item bg-white p-4 rounded shadow-lg" onClick={() => handleEditDelivery(delivery)}>
                            <div>
                                <strong className="font-bold">{delivery.description}</strong>
                            </div>
                            <div>
                                <strong>Fecha de trabajo:</strong> {delivery.workdate}
                            </div>
                            <div className="delivery-actions flex space-x-2 mt-2">
                                <button className="download-btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadPDF(delivery._id);
                                }}>Descargar PDF</button>
                                <button className="delete-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDelivery(delivery._id);
                                }}>Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="no-deliveries bg-white p-4 rounded shadow-lg">
                    <h2>No hay albaranes creados.</h2>
                </div>
            )}

            {showEditModal && (
                <div className="popup-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
                    <div className="popup bg-white p-6 rounded shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">{currentDelivery?._id ? 'Editar Albarán' : 'Crear Albarán'}</h2>
                        <label className="block mb-2">Cliente:
                            <select
                                className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                value={currentDelivery?.clientId || selectedClientId}
                                onChange={(e) => {
                                    setSelectedClientId(e.target.value);
                                    handleClientChange(e.target.value);
                                    setCurrentDelivery({ ...currentDelivery, clientId: e.target.value });
                                }}
                                required
                            >
                                <option value="">Seleccionar Cliente...</option>
                                {clients.map(client => (
                                    <option key={client._id} value={client._id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="block mb-2">Proyecto:
                            <select
                                className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                value={currentDelivery?.projectId || selectedProjectId}
                                onChange={(e) => {
                                    setSelectedProjectId(e.target.value);
                                    setCurrentDelivery({ ...currentDelivery, projectId: e.target.value });
                                }}
                                required
                            >
                                <option value="">Seleccionar Proyecto...</option>
                                {projects.map(project => (
                                    <option key={project._id} value={project._id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="block mb-2">Formato:
                            <select
                                className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                value={currentDelivery.format}
                                onChange={(e) => setCurrentDelivery({ ...currentDelivery, format: e.target.value })}
                                required
                            >
                                <option value="">Seleccionar Formato...</option>
                                <option value="hours">Horas</option>
                                <option value="material">Material</option>
                            </select>
                        </label>
                        {currentDelivery.format === 'material' && (
                            <label className="block mb-2">Material:
                                <input
                                    type="text"
                                    className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                    value={currentDelivery.material}
                                    onChange={(e) => setCurrentDelivery({ ...currentDelivery, material: e.target.value })}
                                />
                            </label>
                        )}
                        {currentDelivery.format === 'hours' && (
                            <label className="block mb-2">Horas:
                                <input
                                    type="number"
                                    className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                    value={currentDelivery.hours}
                                    onChange={(e) => setCurrentDelivery({ ...currentDelivery, hours: e.target.value })}
                                />
                            </label>
                        )}
                        <label className="block mb-2">Descripción:
                            <textarea
                                className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                value={currentDelivery.description}
                                onChange={(e) => setCurrentDelivery({ ...currentDelivery, description: e.target.value })}
                            />
                        </label>
                        <label className="block mb-4">Fecha de trabajo:
                            <input
                                type="date"
                                className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                value={currentDelivery.workdate}
                                onChange={(e) => setCurrentDelivery({ ...currentDelivery, workdate: e.target.value })}
                            />
                        </label>
                        <div className="flex justify-end space-x-4">
                            <button className="save-btn bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleSaveDelivery}>Guardar Albarán</button>
                            <button className="close-btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => setShowEditModal(false)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
