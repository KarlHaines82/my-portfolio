import Layout from '@/layout/Layout';
import CyberCard from '@/components/CyberCard';
import api from '@/lib/api';
import Link from 'next/link';
import { useState } from 'react';

export default function Blog({ initialPosts, categories, tags }) {
    const [posts, setPosts] = useState(initialPosts);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get(`/blog/posts/?search=${search}${activeCategory ? `&category=${activeCategory}` : ''}`);
            setPosts(response.data.results || response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCategoryFilter = async (slug) => {
        const newCat = activeCategory === slug ? null : slug;
        setActiveCategory(newCat);
        try {
            const response = await api.get(`/blog/posts/?${newCat ? `category=${newCat}` : ''}${search ? `&search=${search}` : ''}`);
            setPosts(response.data.results || response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Layout title="Neo-Terminal // Data_Logs">
            <div className="space-y-12">
                <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-cyber-green/20 pb-8">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black glitch-text">DATA_LOGS</h2>
                        <p className="text-cyber-green/50 text-xs tracking-widest uppercase">Chronicles from the digital frontier</p>
                    </div>
                    <form onSubmit={handleSearch} className="flex w-full md:w-auto">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-black/60 border border-cyber-green/20 focus:border-cyber-green p-2 text-xs text-cyber-green outline-none w-full md:w-64"
                            placeholder="SEARCH_INDEX..."
                        />
                        <button type="submit" className="bg-cyber-green text-black px-4 py-2 text-xs font-bold hover:bg-white transition-colors">QUERY</button>
                    </form>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-12">
                        {posts.length === 0 ? (
                            <div className="py-20 text-center border border-dashed border-cyber-green/20">
                                <p className="text-cyber-green/40 uppercase tracking-[0.3em]">No records found matching criteria.</p>
                            </div>
                        ) : (
                            posts.map(post => (
                                <article key={post.id} className="group">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {post.featured_image && (
                                            <div className="w-full md:w-64 h-48 flex-shrink-0 border border-cyber-green/20 overflow-hidden relative">
                                                <img src={post.featured_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-cyber-green/10 group-hover:bg-transparent transition-colors"></div>
                                            </div>
                                        )}
                                        <div className="space-y-4">
                                            <div className="flex gap-4 text-[10px] font-bold text-cyber-green/60 uppercase">
                                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                                <span>//</span>
                                                <span>BY_{post.author.username}</span>
                                            </div>
                                            <Link href={`/blog/${post.slug}`}>
                                                <h3 className="text-2xl text-white group-hover:text-cyber-green transition-colors cursor-pointer">{post.title.toUpperCase()}</h3>
                                            </Link>
                                            <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                            <Link href={`/blog/${post.slug}`} className="inline-block text-[10px] font-bold text-cyber-green hover:underline tracking-widest uppercase">
                                                &gt; ACCESS_FULL_LOG
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-12">
                        <section className="space-y-4">
                            <h4 className="text-cyber-cyan text-sm font-bold uppercase tracking-widest border-l-4 border-cyber-cyan pl-3">CATEGORIES</h4>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryFilter(cat.slug)}
                                        className={`text-[10px] px-3 py-1 border transition-all ${activeCategory === cat.slug
                                                ? 'bg-cyber-cyan border-cyber-cyan text-black'
                                                : 'border-cyber-cyan/20 text-cyber-cyan/60 hover:border-cyber-cyan'
                                            }`}
                                    >
                                        {cat.name.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h4 className="text-cyber-purple text-sm font-bold uppercase tracking-widest border-l-4 border-cyber-purple pl-3">TAG_CLOUD</h4>
                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <span key={tag.id} className="text-[10px] text-gray-500 hover:text-cyber-purple cursor-pointer transition-colors">
                                        #{tag.name.toUpperCase()}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <CyberCard variant="yellow" title="RSS_TRANSCEIVER">
                            <p className="text-[10px] text-gray-400 mb-4">Subscribe to raw data updates via our secure RSS broadcast protocol.</p>
                            <Link href="/api/rss" className="text-[10px] font-bold text-cyber-yellow hover:underline uppercase">
                                DOWNLOAD_XML_KEY
                            </Link>
                        </CyberCard>
                    </aside>
                </div>
            </div>
        </Layout>
    );
}

export async function getServerSideProps() {
    try {
        const [postsRes, catsRes, tagsRes] = await Promise.all([
            api.get('/blog/posts/'),
            api.get('/blog/categories/'),
            api.get('/blog/tags/')
        ]);
        return {
            props: {
                initialPosts: Array.isArray(postsRes.data.results) ? postsRes.data.results : (Array.isArray(postsRes.data) ? postsRes.data : []),
                categories: Array.isArray(catsRes.data.results) ? catsRes.data.results : (Array.isArray(catsRes.data) ? catsRes.data : []),
                tags: Array.isArray(tagsRes.data.results) ? tagsRes.data.results : (Array.isArray(tagsRes.data) ? tagsRes.data : [])
            }
        };
    } catch (error) {
        console.error("Blog index error:", error.message);
        return { props: { initialPosts: [], categories: [], tags: [] } };
    }
}
