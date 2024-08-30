'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const [isLogged, setIsLogged] = useState(false);

    // Comprobar si el usuario está logueado
    useEffect(() => {
        const token = localStorage.getItem('jwtAlex');
        if (token) {
            setIsLogged(true);
        } else {
            router.push('/login'); // Si no está logueado, redirigir a la página de login
        }
    }, [router]);

    return (
        <>
            <div className="home-container">
                <h1>Bienvenido a la aplicación My Birds</h1>
                <p>Accede a las funcionalidades del sistema desde el menú.</p>
            </div>
        </>
    );
}
