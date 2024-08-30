'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    }, [router]);

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
        <nav className="navbar">
            <h1>
                <img src="/logo.svg" alt="Logo" />
                My Birds
            </h1>
            <ul>
                <li>
                    <a href="/Clients">
                        <span className="icon">🕊️</span> Clientes
                    </a>
                </li>
                <li>
                    <button onClick={handleLogout}>
                        <span className="icon">🚪</span> Cerrar sesión
                    </button>
                </li>
            </ul>
        </nav>
    );
}
