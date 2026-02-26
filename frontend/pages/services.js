import Layout from '@/layout/Layout';
import CyberCard from '@/components/CyberCard';
import api from '@/lib/api';

export default function Services({ services }) {
    return (
        <Layout title="Neo-Terminal // Service_Offerings">
            <div className="space-y-12">
                <header className="text-center max-w-3xl mx-auto space-y-4">
                    <h2 className="text-4xl font-black glitch-text">HIRE_OPERATOR</h2>
                    <p className="text-cyber-green/60 tracking-[0.2em] uppercase font-bold text-sm">
                        Available for high-level technical interventions and immersive architecture development.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                    {services.map(svc => (
                        <div key={svc.id} className="group relative">
                            <div className="absolute -inset-0.5 bg-cyber-green/20 blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                            <div className="relative border border-cyber-green/30 bg-black/60 p-8 flex flex-col md:flex-row gap-6">
                                {svc.featured_photo && (
                                    <div className="w-24 h-24 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                                        <img src={svc.featured_photo} className="w-full h-full object-cover border border-cyber-green/20" />
                                    </div>
                                )}
                                <div className="flex-grow space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl text-cyber-cyan">{svc.name.toUpperCase()}</h3>
                                        <span className="text-[10px] font-bold text-cyber-yellow bg-cyber-yellow/10 px-2 py-1 border border-cyber-yellow/20">
                                            {svc.pricing}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed italic border-l-2 border-cyber-green/20 pl-4">
                                        "{svc.description}"
                                    </p>
                                    <button className="text-[10px] font-bold text-cyber-green uppercase tracking-[0.3em] hover:underline">
                                        &gt; INITIATE_PROTOCOL
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <section className="mt-20 p-8 border border-cyber-pink/20 bg-cyber-pink/5 text-center">
                    <h3 className="text-cyber-pink mb-4 italic">"CUSTOM_SOLUTIONS_AVAILABLE_ON_REQUEST"</h3>
                    <p className="text-sm text-gray-400 mb-8">If your project requires unconventional architecture or deep-stack integration beyond these profiles.</p>
                    <a href="/contact" className="cyber-button-pink">OPEN_ENCRYPTED_CHANNEL</a>
                </section>
            </div>
        </Layout>
    );
}

export async function getServerSideProps() {
    try {
        const response = await api.get('/services/');
        return { props: { services: response.data } };
    } catch (error) {
        return { props: { services: [] } };
    }
}
