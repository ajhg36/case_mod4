import Link from 'next/link'
import './Navbar.css'

export default function Navbar() {
    // <nav className="navbar py-5">
    //  <nav className='bg-slate-400 mb-4 flex justify-between items-center px-20 p-3 font-bold text-black'>
    return (
        <nav className="navbar py-5">
            <Link href="/">
                Home
            </Link>
            <ul>
                <li>
                    <Link href="/about" >
                        About
                    </Link>
                </li>
                <li>
                    <Link href="/posts" >
                        Posts
                    </Link>
                </li>
                <li>
                    <Link href="/register" >
                        Sign Up
                    </Link>
                </li>
                <li>
                    <Link href="/login" >
                        Sign In
                    </Link>
                </li>
            </ul>
        </nav>
    )
}