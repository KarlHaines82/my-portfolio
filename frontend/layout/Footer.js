export default function Footer() {
    return (
        <footer className="mt-20 border-t border-cyber-green/20 p-8 bg-black/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-cyber-green/50 text-sm font-bold tracking-widest uppercase">
                    &copy; {new Date().getFullYear()} Neo-Terminal // Sector-7
                </div>
                <div className="flex space-x-6 text-sm">
                    <a href="#" className="hover:text-cyber-green transition-colors">[GITHUB]</a>
                    <a href="#" className="hover:text-cyber-pink transition-colors">[LINKEDIN]</a>
                    <a href="#" className="hover:text-cyber-cyan transition-colors">[TWITTER]</a>
                </div>
                <div className="text-xs text-cyber-green/30">
                    ENCRYPTION_ENABLED // ARCHITECTURE: NEXT_JS + DJANGO
                </div>
            </div>
        </footer>
    );
}
