import Navbar from '@/app/components/Navbar'
import './globals.css'

export const metadata = {
  title: 'Mod 4 Alex',
  description: 'Tarea Final del modulo 4',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        <main className="container mx-auto h-[calc(100vh-7rem)] flex justify-center items-center">
          {children}
        </main>
      </body>
    </html>
  )
}
