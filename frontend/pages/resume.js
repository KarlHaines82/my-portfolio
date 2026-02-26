import Layout from '@/layout/Layout';
import CyberCard from '@/components/CyberCard';
import api from '@/lib/api';

export default function Resume({ resumeData }) {
    if (!resumeData) return <Layout>DATA_LINK_FAILURE</Layout>;

    return (
        <Layout title="Neo-Terminal // Professional_Resume">
            <div className="space-y-12">
                <section className="flex justify-between items-center bg-cyber-green/5 p-8 border border-cyber-green/20">
                    <div>
                        <h2 className="text-4xl font-black mb-2">CURRICULUM_VITAE</h2>
                        <p className="text-cyber-green/50 text-xs tracking-widest uppercase">Validated // Verified // Professional_History</p>
                    </div>
                    {resumeData.resume_file && (
                        <a
                            href={resumeData.resume_file.file}
                            target="_blank"
                            className="cyber-button-pink text-sm"
                        >
                            DOWNLOAD_PDF
                        </a>
                    )}
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Experience */}
                    <div className="lg:col-span-8 space-y-8">
                        <h3 className="text-2xl flex items-center gap-4">
                            <span className="text-cyber-green">[01]</span> WORK_EXPERIENCE
                        </h3>
                        <div className="space-y-8 border-l border-cyber-green/20 ml-3 pl-8">
                            {resumeData.experience.map(exp => (
                                <div key={exp.id} className="relative">
                                    {/* Timeline dot */}
                                    <div className="absolute -left-[37px] top-1.5 w-4 h-4 bg-black border-2 border-cyber-green shadow-[0_0_8px_rgba(0,255,65,0.5)]"></div>

                                    <div className="space-y-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-cyber-cyan text-xl">{exp.position.toUpperCase()}</h4>
                                            <span className="text-[10px] bg-cyber-green/10 text-cyber-green px-2 py-0.5 border border-cyber-green/20">
                                                {exp.start_date} // {exp.end_date || 'PRESENT'}
                                            </span>
                                        </div>
                                        <p className="text-cyber-yellow text-sm font-bold tracking-widest">{exp.company.toUpperCase()} // {exp.location}</p>
                                        <div className="text-gray-400 text-sm mt-4 leading-relaxed whitespace-pre-line">
                                            {exp.description}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education & Sidebar */}
                    <div className="lg:col-span-4 space-y-12">
                        <div className="space-y-8">
                            <h3 className="text-2xl flex items-center gap-4">
                                <span className="text-cyber-green">[02]</span> EDUCATION
                            </h3>
                            <div className="space-y-6">
                                {resumeData.education.map(edu => (
                                    <div key={edu.id} className="p-4 border border-cyber-purple/20 bg-cyber-purple/5 relative">
                                        <div className="absolute top-0 right-0 w-2 h-2 bg-cyber-purple"></div>
                                        <h5 className="text-cyber-purple font-bold text-sm mb-1">{edu.degree} IN {edu.field_of_study.toUpperCase()}</h5>
                                        <p className="text-xs text-secondary mb-2">{edu.school}</p>
                                        <p className="text-[10px] text-gray-500">{edu.start_date} — {edu.end_date || 'N/A'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <CyberCard variant="yellow" title="CERTIFICATIONS">
                            <ul className="text-xs space-y-2 text-gray-400">
                                <li>- AWS_CERTIFIED_SOLUTIONS_ARCHITECT</li>
                                <li>- GOOGLE_CLOUD_PROFESSIONAL_ENGINEER</li>
                                <li>- SECURITY+_CERTIFICATION</li>
                            </ul>
                        </CyberCard>
                    </div>
                </section>
            </div>
        </Layout>
    );
}

export async function getServerSideProps() {
    try {
        const response = await api.get('/resume/');
        return { props: { resumeData: response.data } };
    } catch (error) {
        return { props: { resumeData: null } };
    }
}
