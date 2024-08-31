'use client'
import { useEffect, useState } from 'react';
import { getAllProjects, getProjectOneById } from '@/app/utils/projects'; // Importa la función para obtener un proyecto por ID
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function AllProjects() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false); // Estado para controlar el pop-up
    const { width, height } = useWindowSize();

    // Cargar lista de todos los proyectos
    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('jwtAlex');
            if (!token) {
                console.log('Usuario no autenticado');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const allProjects = await getAllProjects(token);
                setProjects(allProjects);
            } catch (err) {
                console.error('Error al obtener proyectos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Manejar la selección de un proyecto para mostrar detalles
    const handleProjectClick = async (projectId) => {
        const token = localStorage.getItem('jwtAlex');

        try {
            const projectData = await getProjectOneById(token, projectId);
            setSelectedProject(projectData);
            setShowDetailModal(true); // Mostrar el pop-up con detalles del proyecto
        } catch (err) {
            alert(`Error al obtener detalles del proyecto: ${err.message}`);
        }
    };

    return (
        <div className="projects-container">
            {showConfetti && <Confetti width={width} height={height} />}
            {showSuccessAlert && <div className="success-alert">Acción exitosa</div>}

            <div className="projects-list">
                {loading ? (
                    <p>Cargando proyectos...</p>
                ) : error ? (
                    <p>Error al cargar proyectos: {error}</p>
                ) : projects.length > 0 ? (
                    <ul>
                        {projects.map(project => (
                            <li key={project._id} className="project-item" onClick={() => handleProjectClick(project._id)}>
                                <div>
                                    <strong>{project.name}</strong> - {project.projectCode}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="no-projects">
                        <img src="/images/sin_data.jpeg" alt="No hay proyectos" className="empty-state-img" />
                        <h2>No hay proyectos disponibles en este momento</h2>
                    </div>
                )}
            </div>

            {showDetailModal && selectedProject && (
                <div className="popup-overlay" onClick={() => setShowDetailModal(false)}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <h2>Detalles del Proyecto</h2>
                        <p><strong>Nombre:</strong> {selectedProject.name}</p>
                        <p><strong>Código del Proyecto:</strong> {selectedProject.projectCode}</p>
                        <p><strong>Email:</strong> {selectedProject.email}</p>
                        <p><strong>Código Interno:</strong> {selectedProject.code}</p>
                        {selectedProject.address && (
                            <div>
                                <p><strong>Dirección:</strong></p>
                                <p>{selectedProject.address.street}, Nº {selectedProject.address.number}</p>
                                <p>{selectedProject.address.city}, {selectedProject.address.province}, CP: {selectedProject.address.postal}</p>
                            </div>
                        )}
                        <button className="close-btn" onClick={() => setShowDetailModal(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
