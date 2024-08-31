'use client'
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';  // npm install react-hook-form
import { projects } from '@/app/utils/projects';
import Link from 'next/link';

export default function Project() {

    return (
        <div className="home-container">
            <h1>Projectos</h1>
        </div>
    );
}
