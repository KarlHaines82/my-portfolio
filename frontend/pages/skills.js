import Layout from '@/layout/Layout';
import CyberCard from '@/components/CyberCard';
import api from '@/lib/api';
import { useState, useEffect } from 'react';

export default function Skills({ skills, github }) {
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = ['all', ...new Set(skills.map(s => s.category))];
    const filteredSkills = activeCategory === 'all'
        ? skills
        : skills.filter(s => s.category === activeCategory);

    return (
        <Layout title="Neo-Terminal // Technical_Skills">
            <div className="space-y-16">
                <section>
                    <h2 className="text-3xl mb-8 flex items-center gap-4">
                        <span className="text-cyber-green">[01]</span> TECHNICAL_INVENTORY
                    </h2>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1 text-xs font-bold border transition-all uppercase ${activeCategory === cat
                                        ? 'bg-cyber-green text-black border-cyber-green shadow-[0_0_15px_rgba(0,255,65,0.4)]'
                                        : 'bg-transparent text-cyber-green/50 border-cyber-green/20 hover:border-cyber-green'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSkills.map(skill => (
                            <div key={skill.id} className="cyber-border p-4 bg-black/40">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold tracking-widest uppercase">{skill.name}</span>
                                    <span className="text-xs text-cyber-green/50">{skill.level}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-cyber-green/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-cyber-green shadow-[0_0_10px_rgba(0,255,65,0.8)] transition-all duration-1000"
                                        style={{ width: `${skill.level}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {github && !github.error && (
                    <section>
                        <h2 className="text-3xl mb-8 flex items-center gap-4">
                            <span className="text-cyber-green">[02]</span> GITHUB_METRICS
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <div className="lg:col-span-1 space-y-4">
                                <CyberCard variant="cyan">
                                    <div className="text-center">
                                        <img src={github.avatar_url} className="w-24 h-24 border border-cyber-cyan mx-auto mb-4" />
                                        <h4 className="text-cyber-cyan mb-1">{github.name}</h4>
                                        <p className="text-xs text-gray-400 mb-4 tracking-tighter">@{github.username}</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="p-2 border border-cyber-green/20">REPOS: <span className="text-cyber-green">{github.public_repos}</span></div>
                                            <div className="p-2 border border-cyber-green/20">FANS: <span className="text-cyber-green">{github.followers}</span></div>
                                        </div>
                                    </div>
                                </CyberCard>
                            </div>

                            <div className="lg:col-span-3">
                                <CyberCard title="LANGUAGE_DISTRIBUTION" variant="yellow">
                                    <div className="h-6 gap-0.5 flex w-full mb-6">
                                        {Object.entries(github.languages).map(([name, pct], i) => {
                                            const colors = ['bg-cyber-green', 'bg-cyber-pink', 'bg-cyber-cyan', 'bg-cyber-purple', 'bg-cyber-yellow'];
                                            return (
                                                <div
                                                    key={name}
                                                    className={`h-full ${colors[i % colors.length]}`}
                                                    style={{ width: `${pct}%` }}
                                                    title={`${name}: ${pct}%`}
                                                ></div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {Object.entries(github.languages).map(([name, pct], i) => (
                                            <div key={name} className="flex items-center gap-2 text-xs">
                                                <div className={`w-2 h-2 rounded-full ${['bg-cyber-green', 'bg-cyber-pink', 'bg-cyber-cyan', 'bg-cyber-purple', 'bg-cyber-yellow'][i % 5]}`}></div>
                                                <span className="text-gray-400 uppercase">{name}</span>
                                                <span className="text-cyber-green">{pct}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </CyberCard>

                                <div className="mt-8">
                                    <h4 className="text-cyber-green mb-4 text-sm uppercase font-bold tracking-widest underline decoration-cyber-green/20">TOP_DEPOSITS</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {github.top_repos.map(repo => (
                                            <a
                                                key={repo.name}
                                                href={repo.url}
                                                target="_blank"
                                                className="p-4 border border-cyber-green/20 hover:border-cyber-green transition-all bg-black/40 group"
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-sm font-bold text-cyber-green group-hover:neon-glow-green uppercase">{repo.name}</span>
                                                    <span className="text-[10px] text-cyber-yellow flex items-center gap-1">★ {repo.stars}</span>
                                                </div>
                                                <p className="text-[10px] text-gray-500 line-clamp-1">{repo.description || 'No description provided.'}</p>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </Layout>
    );
}

export async function getServerSideProps() {
    try {
        const [skillsRes, githubRes] = await Promise.all([
            api.get('/skills/'),
            api.get('/skills/github/')
        ]);
        return {
            props: {
                skills: skillsRes.data || [],
                github: githubRes.data || null
            }
        };
    } catch (error) {
        console.error("Skills page error:", error.message);
        return { props: { skills: [], github: null } };
    }
}
