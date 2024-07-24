'use client'
import {useRouter} from 'next/navigation'

import { useForm } from 'react-hook-form';  // npm install react-hook-form
import { loginUser } from '@/app/utils/user'
import Link from 'next/link';

export default function LoginForm() {
    const { register, formState: { errors }, handleSubmit } = useForm()

    const router = useRouter()

    const onSubmit = async (data) => {
        const res = await loginUser(data)
        if(res.token) {
            localStorage.setItem('jwt', res.token)
            router.push('/about')
        } else {
            throw new Error('Failed to login user.')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={"mb-3 text-2xl text-black"}>
                    Accede a tu cuenta
                </h1>
                
                <div className="w-full">
                    <div>
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
                            {errors.email?.type === 'required' && "Email es requerido"}
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
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2text-gray-500"
                                type="password"
                                id="password"
                                {...register('password', { required: true, minLength: 8 })}
                            />
                            {errors.password?.type === 'required' && "Contraseña es requerida"}
                        </div>
                    </div>
                </div>
                <input className="mt-4 w-full" type="submit" />
            </div>
            <div className='mt-6 text-white'>
                <Link href="/login">¿Ya tienes cuenta? <span className='text-blue-500'>Accede</span></Link>
            </div>
        </form>
    )
}