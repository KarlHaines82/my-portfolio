import Navbar from './Navbar';
import Footer from './Footer';
import Head from 'next/head';

export default function Layout({ children, title = "Neo-Terminal // Developer Portfolio" }) {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <Head>
                <title>{title}</title>
                <meta name="description" content="Senior Systems Architect & Full-Stack Engineer" />
            </Head>

            {/* Retro Scanline effect */}
            <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]"></div>

            {/* Moving scanline */}
            <div className="fixed inset-x-0 h-10 bg-cyber-green/5 blur-xl pointer-events-none z-50 animate-scanline"></div>

            <Navbar />

            <main className="flex-grow pt-28 px-4 max-w-7xl mx-auto w-full relative z-10">
                {children}
            </main>

            <Footer />
        </div>
    );
}
