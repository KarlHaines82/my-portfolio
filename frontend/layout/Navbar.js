import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Skills', path: '/skills' },
    { name: 'Resume', path: '/resume' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
    const router = useRouter();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/80 backdrop-blur-md border border-cyber-green/20 p-4 rounded-lg">
                <Link href="/" className="text-2xl font-bold text-cyber-green glitch-text tracking-widest">
                    NEO-TERMINAL
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`cyber-nav-link ${router.pathname === item.path ? 'bg-cyber-green/20 border-cyber-green shadow-[0_0_15px_rgba(0,255,65,0.4)]' : ''}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                    {session ? (
                        <button onClick={() => signOut()} className="cyber-button-pink text-xs px-2 py-1">
                            LOGOUT
                        </button>
                    ) : (
                        <Link href="/auth/signin" className="cyber-button text-xs px-2 py-1">
                            SIGNIN
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-cyber-green" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden mt-2 bg-black/95 border border-cyber-green/30 rounded-lg p-4 flex flex-col space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setIsOpen(false)}
                            className="cyber-nav-link text-center"
                        >
                            {item.name}
                        </Link>
                    ))}
                    {session ? (
                        <button onClick={() => signOut()} className="cyber-button-pink text-center">
                            LOGOUT
                        </button>
                    ) : (
                        <Link href="/auth/signin" className="cyber-button text-center">
                            SIGNIN
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
