'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
    const router = useRouter();
    const [isLogged, setIsLogged] = useState(false);

    // Verificar si el usuario está logueado
    useEffect(() => {
        const token = localStorage.getItem('jwtAlex');
        if (token) {
            setIsLogged(true);
        } else {
            setIsLogged(false); // No muestra el navbar si no está logueado
        }
    }, [router.asPath]);  // Dependiendo de la ruta, esto se asegura de que el navbar se actualice correctamente

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('jwtAlex'); // Limpiar token del localStorage
        setIsLogged(false);
        router.push('/login'); // Redirigir a la página de login
    };

    if (!isLogged) {
        return null; // No mostrar navbar si no está logueado
    }

    return (
        <nav className="nav-container">
            <div className="logo-container">
                <a href="/Home">
                    <Image src="/images/sin_data.jpeg" alt="Logo" width={50} height={50} />
                </a>
            </div>
            <ul className="nav-list">
                <li>
                    <a href="/Clients">
                        <span role="img" aria-label="clients">🕊️</span> Clientes
                    </a>
                </li>
                <li>
                    <a href="/project">
                        <span role="img" aria-label="projects">🕊️</span> Project
                    </a>
                </li>
                <li>
                    <a href="/project_all">
                        <span role="img" aria-label="all projects">🕊️</span>All Projects
                    </a>
                </li>
                <li>
                    <a href="/delivery">
                        <span role="img" aria-label="delivery">🕊️</span>Delivery
                    </a>
                </li>
                <li>
                    <button onClick={handleLogout} className="logout-btn">
                        <span role="img" aria-label="logout">🚪</span> Cerrar sesión
                    </button>
                </li>
            </ul>
        </nav>
    );
}
