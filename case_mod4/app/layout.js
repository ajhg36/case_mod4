import Navbar from '@/app/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Mod 4 Alex',
  description: 'Tarea Final del modulo 4',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="layout-container">
          <Navbar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
