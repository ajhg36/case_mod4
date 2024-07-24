"use client"
import { useRouter } from "next/navigation"

export default function About() {

    const router = useRouter()

    /* Tailwind */
    return (
        <>
            <div className="container bg-gray-500 flex flex-wrap"> {/**  Layout: Container, Flexbox & Grid */}
                <div className="bg-slate-400 h-80 w-80 m-4 p-8 border-red-500 border-4 rounded-xl"> {/**  Sizing: Height h w, Margin: m, Padding: p, Border */}
                    <h1 className="text-6xl font-serif text-white text-center">About</h1>
                </div>

                <div className="bg-slate-400 h-80 w-80 m-4 p-8 border-red-500 border-4 rounded-xl"> {/**  Sizing: Height h w, Margin: m, Padding: p, Border */}
                    <h1 className="text-6xl font-serif text-white text-center">About</h1>
                </div>

                <div className="bg-slate-400 h-80 w-80 m-4 p-8 border-red-500 border-4 rounded-xl"> {/**  Sizing: Height h w, Margin: m, Padding: p, Border */}
                    <h1 className="text-6xl font-serif text-white text-center">About</h1>
                </div>

                <div className="bg-slate-400 h-80 w-80 m-4 p-8 border-red-500 border-4 rounded-xl"> {/**  Sizing: Height h w, Margin: m, Padding: p, Border */}
                    <h1 className="text-6xl font-serif text-white text-center">About</h1>
                </div>
                
            </div>

            <button className="bg-sky-400 px-3 py-2 rounded-md"
                onClick={() => {
                    alert("Executing...")
                    router.push('/')
                }}
            >
                Click
            </button>
        </>
    )
}