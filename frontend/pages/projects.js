import Layout from '@/layout/Layout';
import CyberCard from '@/components/CyberCard';
import api from '@/lib/api';

export default function Projects({ projects }) {
    const featured = projects.filter(p => p.is_featured);
    const others = projects.filter(p => !p.is_featured);

    return (
        <Layout title="Neo-Terminal // Mission_Archive">
            <div className="space-y-16">
                <header>
                    <h2 className="text-4xl font-black mb-4 flex items-center gap-4">
                        <span className="text-cyber-green">[01]</span> ACTIVE_MISSIONS
                    </h2>
                    <p className="text-cyber-green/50 text-xs tracking-[0.4em] uppercase font-bold">Priority targets and high-value deployments.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {featured.map(project => (
                        <article key={project.id} className="relative group">
                            <div className="absolute -inset-1 bg-cyber-green/50 opacity-0 group-hover:opacity-10 transition duration-1000 blur-xl"></div>
                            <div className="relative border border-cyber-green/30 bg-black/60 overflow-hidden">
                                {project.featured_image && (
                                    <div className="w-full h-80 overflow-hidden border-b border-cyber-green/20">
                                        <img src={project.featured_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                )}
                                <div className="p-8 space-y-4">
                                    <h3 className="text-3xl font-black text-white group-hover:text-cyber-green transition-colors uppercase">{project.title}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech_stack_list.map(tech => (
                                            <span key={tech} className="text-[10px] border border-cyber-cyan/30 text-cyber-cyan px-2 py-0.5 uppercase tracking-tighter">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                                        {project.description}
                                    </p>
                                    <div className="flex gap-6 pt-4">
                                        {project.live_url && (
                                            <a href={project.live_url} target="_blank" className="text-xs font-bold text-cyber-green hover:underline uppercase tracking-widest">&gt; LIVE_LINK</a>
                                        )}
                                        {project.repo_url && (
                                            <a href={project.repo_url} target="_blank" className="text-xs font-bold text-cyber-cyan hover:underline uppercase tracking-widest">&gt; REPO_ACCESS</a>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-cyber-green text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-[0_0_10px_rgba(0,255,65,0.5)]">
                                    FEATURED_ENTRY
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {others.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-cyber-green/60">
                            <span className="text-cyber-green/30">[02]</span> LEGACY_ARCHIVE
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {others.map(project => (
                                <div key={project.id} className="p-6 border border-cyber-green/10 bg-black/40 hover:border-cyber-green/40 transition-all group">
                                    <h4 className="text-cyber-green text-lg mb-2 uppercase group-hover:neon-glow-green transition-all">{project.title}</h4>
                                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                                    <div className="flex flex-wrap gap-1 mb-4 opacity-50">
                                        {project.tech_stack_list.slice(0, 3).map(tech => (
                                            <span key={tech} className="text-[9px] border border-white/10 px-1 py-0.5">{tech}</span>
                                        ))}
                                    </div>
                                    {project.repo_url && (
                                        <a href={project.repo_url} target="_blank" className="text-[10px] font-bold text-cyber-cyan uppercase hover:underline">ACCESS_REPO</a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </Layout>
    );
}

export async function getServerSideProps() {
    try {
        const response = await api.get('/projects/');
        const projects = Array.isArray(response.data.results) ? response.data.results : (Array.isArray(response.data) ? response.data : []);
        const sanitizedProjects = projects.map(p => ({
            ...p,
            tech_stack_list: Array.isArray(p.tech_stack_list) ? p.tech_stack_list : []
        }));
        return {
            props: {
                projects: sanitizedProjects
            }
        };
    } catch (error) {
        return { props: { projects: [] } };
    }
}
