import Layout from '@/layout/Layout';
import CyberCard from '@/components/CyberCard';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';

export default function About({ pageData }) {
    if (!pageData) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-[50vh]">
                    <p className="text-cyber-green animate-pulse tracking-widest text-2xl font-bold uppercase">
                        [DATA_LINK_FAILURE] // RESOURCE_NOT_FOUND
                    </p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title={`Neo-Terminal // ${pageData.title}`}>
            <div className="max-w-4xl mx-auto space-y-12">
                <section className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-cyber-green opacity-30 group-hover:opacity-100 transition duration-500 blur"></div>
                        <div className="relative w-64 h-64 bg-black border border-cyber-green overflow-hidden">
                            {pageData.headshot ? (
                                <img src={pageData.headshot} alt="Headshot" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-cyber-green/50 text-xs">NO_IMAGE</div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-cyber-green/80 text-black text-[10px] font-bold text-center py-0.5">
                                USER_ID: KH-82 // SECTOR_7
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow space-y-4">
                        <h2 className="text-4xl font-black glitch-text">
                            {pageData.title.toUpperCase()}
                        </h2>
                        <h4 className="text-cyber-cyan tracking-widest uppercase mb-4">
                            {pageData.subtitle}
                        </h4>
                        <CyberCard variant="green" className="border-none bg-transparent p-0">
                            <div className="prose prose-invert prose-emerald max-w-none">
                                <ReactMarkdown>{pageData.content}</ReactMarkdown>
                            </div>
                        </CyberCard>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <CyberCard title="CURRENT_LOCATION" variant="cyan">
                        Neo-Tokyo, Sector 7 (Remote_Enabled)
                    </CyberCard>
                    <CyberCard title="CORE_DIRECTIVES" variant="purple">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Performance_Optimization</li>
                            <li>Scalable_Architecture</li>
                            <li>Security_Hardening</li>
                            <li>UX_Immersion</li>
                        </ul>
                    </CyberCard>
                </section>
            </div>
        </Layout>
    );
}

export async function getServerSideProps() {
    try {
        const response = await api.get('/pages/about/');
        return {
            props: {
                pageData: response.data
            }
        };
    } catch (error) {
        console.error("About page error:", error.message);
        return { props: { pageData: null } };
    }
}
