'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('jwtAlex');
        if (!token) {
            router.push('/login'); // Si no está logueado, redirigir a la página de login
        }
    }, [router]);

    return (
        <div className="home-container">
            <h1>Bienvenido a la app Mod 4 de Alexander</h1>
            <p>Accede a las funcionalidades del sistema desde el menú.</p>
            <p>Nota: hay un bug con el menú, si no carga solo refresca la página y aparecerá</p>
        </div>
    );
}
