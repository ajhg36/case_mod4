'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form';
import { createUser } from '@/app/utils/user';
import Link from 'next/link';

export default function RegisterForm() {
    const { register, formState: { errors }, handleSubmit } = useForm({
        mode: 'onSubmit', // Validación al enviar
    });

    const router = useRouter();

    const onSubmit = async (data) => {
        try {
            const res = await createUser(data);
            if (res.token) {
                localStorage.setItem('jwt', res.token);
                router.push('/validation'); // Redirigir a la página de validación si es exitoso
            } else {
                throw new Error('Failed to register user. No token received.');
            }
        } catch (error) {
            console.error('Error during registration:', error.message || error);
            alert('Error al registrar usuario: ' + error.message); // Muestra un mensaje de error al usuario
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className="mb-3 text-2xl text-black">
                    Crea tu cuenta
                </h1>
                <div className="w-full">
                    <label
                        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                        htmlFor="name"
                    >
                        Nombre
                    </label>
                    <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 text-gray-500"
                            type="text"
                            id="name"
                            {...register('name', { maxLength: 20, required: true })}
                        />
                        {errors.name && <span className="text-red-500">Nombre es requerido</span>}
                    </div>
                    <label
                        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                        htmlFor="surnames"
                    >
                        Apellidos
                    </label>
                    <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 text-gray-500"
                            type="text"
                            id="surnames"
                            {...register('surnames', { maxLength: 40, required: true })}
                        />
                        {errors.surnames && <span className="text-red-500">Apellidos son requeridos</span>}
                    </div>
                </div>
                <div className="w-full">
                    <label
                        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 text-gray-500"
                            type="email"
                            id="email"
                            {...register('email', { required: true, maxLength: 30 })}
                        />
                        {errors.email && <span className="text-red-500">Email es requerido</span>}
                    </div>
                </div>
                <div className="mt-4">
                    <label
                        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                        htmlFor="password"
                    >
                        Contraseña
                    </label>
                    <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 text-gray-500"
                            type="password"
                            id="password"
                            {...register('password', { required: true, minLength: 8 })}
                        />
                        {errors.password && <span className="text-red-500">Contraseña debe tener al menos 8 caracteres</span>}
                    </div>
                </div>

                <input className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md cursor-pointer" type="submit" value="Registrar" />
            </div>

            <div className='mt-6 text-white'>
                <Link href="/login">¿Ya tienes cuenta? <span className="text-blue-500">Accede</span></Link>
            </div>
        </form>
    );
}
