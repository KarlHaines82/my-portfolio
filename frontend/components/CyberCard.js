export default function CyberCard({ title, children, variant = 'green', className = '' }) {
    const borderClass = variant === 'pink' ? 'cyber-border-pink' : variant === 'yellow' ? 'cyber-border-yellow' : 'cyber-border';
    const titleColor = variant === 'pink' ? 'text-cyber-pink' : variant === 'yellow' ? 'text-cyber-yellow' : 'text-cyber-green';

    return (
        <div className={`${borderClass} p-6 bg-black/40 backdrop-blur-md ${className}`}>
            {title && <h3 className={`${titleColor} mb-4 uppercase tracking-widest font-bold`}>{title}</h3>}
            <div className="text-gray-300">
                {children}
            </div>
        </div>
    );
}
