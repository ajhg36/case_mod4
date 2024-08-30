'use client'
import {useRouter} from 'next/navigation'

import { useForm } from 'react-hook-form';  // npm install react-hook-form
import { validateUser } from '@/app/utils/user'

export default function RegisterForm() {
    const { register, formState: { errors }, handleSubmit } = useForm()

    const router = useRouter()

    const onSubmit = async (data) => {
        const token = localStorage.getItem('jwt')
        const res = await validateUser(token, data)
        //console.log(res)
        if(res.acknowledged) {
            router.push('/about')
        } else {
            throw new Error('Failed to match code.')
        }
    
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={"mb-3 text-xl text-black"}>
                    Introduce tu código recibido
                </h1>
               
                <div className="w-full">
                    
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="code"
                        >
                            Código
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2text-gray-500"
                                type="text"
                                id="code"
                                {...register('code', { required: true, minLength: 6, maxLength: 6 })}
                            />
                            {errors.code?.type === 'required' && "Códido es requerido"}
                        </div>
                    </div>
                </div>
                <input className="mt-4 w-full" type="submit" />
            </div>
        </form>
    )
}