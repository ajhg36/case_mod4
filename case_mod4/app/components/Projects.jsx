'use client'
import { useEffect, useState } from 'react';
import { getClients } from '@/app/utils/clients';
import { getProjects, createProject, updateProject, deleteProject, getProjectById } from '@/app/utils/projects';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function Projects() {
    const [clients, setClients] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const { width, height } = useWindowSize();

    // Cargar lista de clientes
    useEffect(() => {
        const fetchClients = async () => {
            const token = localStorage.getItem('jwtAlex');
            if (!token) {
                console.log('Usuario no autenticado');
                return;
            }

            try {
                const clientsList = await getClients(token);
                setClients(clientsList);
            } catch (err) {
                console.error('Error al obtener clientes:', err);
                setError(err.message);
            }
        };

        fetchClients();
    }, []);

    // Manejar cambio de cliente
    const handleClientChange = async (clientId) => {
        setSelectedClientId(clientId);

        if (!clientId) {
            setProjects([]);
            return;
        }

        const token = localStorage.getItem('jwtAlex');
        setLoading(true);
        setError(null);

        try {
            const clientProjects = await getProjects(token, clientId);
            setProjects(clientProjects);
        } catch (err) {
            console.error('Error al obtener proyectos:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Manejar creación de proyecto
    const handleCreateProject = () => {
        setCurrentProject({
            name: '',
            projectCode: '',
            email: '',
            address: {},
            code: '',
            clientId: selectedClientId
        });
        setShowEditModal(true);
    };

    // Validar datos del proyecto antes de guardar
    const validateProjectData = (project) => {
        if (!project.name || !project.projectCode || !project.email || !project.code || !project.clientId) {
            return false;
        }
        return true;
    };

    // Manejar guardar proyecto
    const handleSaveProject = async () => {
        const token = localStorage.getItem('jwtAlex');

        if (!validateProjectData(currentProject)) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        // Eliminar el campo `address` si no está marcado
        if (!currentProject?.address) {
            delete currentProject.address;
        }

        try {
            if (currentProject._id) {
                // Actualizar proyecto existente
                const updatedProject = await updateProject(token, currentProject._id, currentProject);
                setProjects(projects.map(project => project._id === updatedProject._id ? updatedProject : project));
            } else {
                // Crear nuevo proyecto
                const newProject = await createProject(token, currentProject);
                setProjects([...projects, newProject]);
            }
            setShowEditModal(false);
            triggerConfetti();
            triggerSuccessAlert('Proyecto guardado exitosamente');
        } catch (err) {
            alert(`Error al guardar proyecto: ${err.message}`);
        }
    };

    // Manejar edición de proyecto
    const handleEditProject = async (projectId) => {
        const token = localStorage.getItem('jwtAlex');

        try {
            const projectData = await getProjectById(token, projectId);
            setCurrentProject(projectData);
            setShowEditModal(true);
        } catch (err) {
            alert(`Error al obtener proyecto: ${err.message}`);
        }
    };

    // Manejar eliminación de proyecto
    const handleDeleteProject = async (projectId) => {
        const token = localStorage.getItem('jwtAlex');

        if (!window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
            return;
        }

        try {
            await deleteProject(token, projectId);
            setProjects(projects.filter(project => project._id !== projectId));
            triggerConfetti();
            triggerSuccessAlert('Proyecto eliminado exitosamente');
        } catch (err) {
            alert(`Error al eliminar proyecto: ${err.message}`);
        }
    };

    const resetForm = () => {
        setCurrentProject(null);
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
        <div className="projects-container p-4">
            {showConfetti && <Confetti width={width} height={height} />}
            {showSuccessAlert && <div className="success-alert bg-green-500 text-white p-2 rounded">Proyecto guardado exitosamente</div>}
            <div className="client-select mb-4">
                <label htmlFor="client" className="block text-white mb-2">Seleccione un cliente:</label>
                <select 
                    id="client" 
                    value={selectedClientId} 
                    onChange={(e) => handleClientChange(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded"
                >
                    <option value="">Clientes...</option>
                    {clients.map(client => (
                        <option key={client._id} value={client._id}>
                            {client.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedClientId && (
                <div className="create-project mb-4">
                    <button className="create-project-btn bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleCreateProject}>
                        Crear Proyecto
                    </button>
                </div>
            )}

            <div className="projects-list">
                {loading ? (
                    <p className="text-white">Cargando proyectos...</p>
                ) : error ? (
                    <p className="text-red-500">Error al cargar proyectos: {error}</p>
                ) : projects.length > 0 ? (
                    <ul className="space-y-4">
                        {projects.map(project => (
                            <li key={project._id} className="project-item bg-white p-4 rounded shadow-lg flex justify-between items-center">
                                <div>
                                    <strong className="text-lg">{project.name}</strong> - <span className="text-sm">{project.projectCode}</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="edit-btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => handleEditProject(project._id)}>Editar</button>
                                    <button className="delete-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleDeleteProject(project._id)}>Eliminar</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="no-projects bg-white p-4 rounded shadow-lg text-center">
                        <img src="/images/sin_data.jpeg" alt="No hay proyectos" className="empty-state-img mx-auto mb-4" />
                        <h2 className="text-xl">¿Aún no hay Proyectos? Vamos a crear uno, selecciona un cliente si no lo has hecho antes</h2>
                    </div>
                )}
            </div>

            {/* Botón para mostrar anotaciones */}
            <div className="notes-section mt-6">
                <button className="show-notes-btn bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" onClick={() => setShowNotes(!showNotes)}>
                    {showNotes ? 'Ocultar Anotaciones' : 'Mostrar Anotaciones'}
                </button>
                {showNotes && (
                    <div className="notes bg-gray-800 text-white p-4 mt-4 rounded">
                        <p>Por alguna razón, el obtener los proyectos por userId que sería el ID del cliente no funciona o al menos me trae el array vacío. Lo raro es que probé desde el Swagger y desde Insomnia y ahí sí funcionó. La respuesta esperada al menos era algo como:</p>
                        <pre className="bg-gray-900 p-2 mt-2 rounded text-sm">
                            {`
_id: 66d275b8e56239aea4fc8b20,
userId: "66d121171e8e4c1fa89ffe8f",
clientId: "66d240eee56239aea4fc82ea",
name: "skynet",
projectCode: "skynet_code2",
code: "skynet_int",
active: true,
email: "skynet@correo.com",
deleted: false,
createdAt: "2024-08-31T01:45:28.595Z",
updatedAt: "2024-08-31T01:45:42.447Z",
__v: 0

_id: "66d26fede56239aea4fc8b1a",
userId: "66d121171e8e4c1fa89ffe8f",
clientId: "66d240eee56239aea4fc82ea",
name: "Nombre algo",
projectCode: "algoCode",
code: "algo_int",
active: true,
email: "mimail@gmail.com",
deleted: false,
createdAt: "2024-08-31T01:20:45.279Z",
updatedAt: "2024-08-31T01:20:45.279Z",
__v: 0
                            `}
                        </pre>
                    </div>
                )}
            </div>

            {showEditModal && (
                <div className="popup-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl mb-4">{currentProject?._id ? 'Editar Proyecto' : 'Crear Proyecto'}</h2>
                        <label className="block mb-2">Nombre:
                            <input 
                                type="text" 
                                value={currentProject?.name || ''} 
                                onChange={e => setCurrentProject({ ...currentProject, name: e.target.value })} 
                                required
                                className="block w-full mt-1 p-2 border border-gray-300 rounded"
                            />
                        </label>
                        <label className="block mb-2">Código del Proyecto:
                            <input 
                                type="text" 
                                value={currentProject?.projectCode || ''} 
                                onChange={e => setCurrentProject({ ...currentProject, projectCode: e.target.value })} 
                                required
                                className="block w-full mt-1 p-2 border border-gray-300 rounded"
                            />
                        </label>
                        <label className="block mb-2">Email:
                            <input 
                                type="email" 
                                value={currentProject?.email || ''} 
                                onChange={e => setCurrentProject({ ...currentProject, email: e.target.value })} 
                                required
                                placeholder="example@domain.com"
                                className="block w-full mt-1 p-2 border border-gray-300 rounded"
                            />
                        </label>
                        <label className="block mb-2">Código Interno:
                            <input 
                                type="text" 
                                value={currentProject?.code || ''} 
                                onChange={e => setCurrentProject({ ...currentProject, code: e.target.value })} 
                                required
                                className="block w-full mt-1 p-2 border border-gray-300 rounded"
                            />
                        </label>
                        <label className="block mb-2">
                            <p>Agregar/Editar dirección</p>
                            <input 
                                type="checkbox" 
                                checked={!!currentProject?.address} 
                                onChange={() => {
                                    setCurrentProject(currentProject => ({
                                        ...currentProject,
                                        address: currentProject?.address ? null : {}
                                    }));
                                }}
                                className="mr-2"
                            /> 
                        </label>
                        {currentProject?.address && (
                            <div className="address-fields space-y-2">
                                <label>Calle:
                                    <input 
                                        type="text" 
                                        value={currentProject.address.street || ''} 
                                        onChange={e => setCurrentProject({ ...currentProject, address: { ...currentProject.address, street: e.target.value } })} 
                                        className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                    />
                                </label>
                                <label>Número:
                                    <input 
                                        type="text" 
                                        value={currentProject.address.number || ''} 
                                        onChange={e => setCurrentProject({ ...currentProject, address: { ...currentProject.address, number: e.target.value } })} 
                                        className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                    />
                                </label>
                                <label>Postal:
                                    <input 
                                        type="text" 
                                        value={currentProject.address.postal || ''} 
                                        onChange={e => setCurrentProject({ ...currentProject, address: { ...currentProject.address, postal: e.target.value } })} 
                                        className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                    />
                                </label>
                                <label>Ciudad:
                                    <input 
                                        type="text" 
                                        value={currentProject.address.city || ''} 
                                        onChange={e => setCurrentProject({ ...currentProject, address: { ...currentProject.address, city: e.target.value } })} 
                                        className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                    />
                                </label>
                                <label>Provincia:
                                    <input 
                                        type="text" 
                                        value={currentProject.address.province || ''} 
                                        onChange={e => setCurrentProject({ ...currentProject, address: { ...currentProject.address, province: e.target.value } })} 
                                        className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                    />
                                </label>
                            </div>
                        )}
                        <div className="flex justify-end space-x-4 mt-4">
                            <button className="save-btn bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleSaveProject}>
                                {currentProject?._id ? 'Guardar Cambios' : 'Crear Proyecto'}
                            </button>
                            <button className="close-btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => setShowEditModal(false)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
