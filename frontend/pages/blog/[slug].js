import Layout from '@/layout/Layout';
import CyberCard from '@/components/CyberCard';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import Head from 'next/head';
import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';

export default function BlogPost({ post }) {
    const { data: session } = useSession();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(post?.comments || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!post) return <Layout>LOG_ENTRY_NOT_FOUND</Layout>;

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setIsSubmitting(true);
        try {
            await api.post(`/blog/posts/${post.slug}/comments/`, { content: comment });
            // Refresh comments
            const response = await api.get(`/blog/posts/${post.slug}/`);
            setComments(response.data.comments);
            setComment('');
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout title={`Neo-Terminal // ${post.title}`}>
            <Head>
                {post.schema_org_json && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(post.schema_org_json) }}
                    />
                )}
            </Head>

            <div className="max-w-4xl mx-auto space-y-12">
                <article className="space-y-8">
                    <header className="space-y-4">
                        <div className="flex gap-4 text-[10px] font-bold text-cyber-green/60 uppercase">
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            <span>//</span>
                            <span>DATA_KEY: {post.slug.toUpperCase()}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black glitch-text leading-tight">{post.title.toUpperCase()}</h1>
                        {post.featured_image && (
                            <div className="w-full h-96 border border-cyber-green/20 relative">
                                <img src={post.featured_image} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-cyber-green/5"></div>
                            </div>
                        )}
                    </header>

                    <div className="prose prose-invert prose-emerald max-w-none">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    <footer className="pt-8 border-t border-cyber-green/20 flex flex-wrap gap-4">
                        {post.tags.map(tag => (
                            <span key={tag.id} className="text-xs text-cyber-purple bg-cyber-purple/10 px-3 py-1 border border-cyber-purple/20">
                                #{tag.name.toUpperCase()}
                            </span>
                        ))}
                    </footer>
                </article>

                {/* Comments Section */}
                <section className="space-y-8 pt-12 border-t border-cyber-green/20">
                    <h3 className="text-2xl flex items-center gap-4">
                        <span className="text-cyber-green">[03]</span> LOG_ANNOTATIONS ({comments.length})
                    </h3>

                    <div className="space-y-6">
                        {comments.map(c => (
                            <div key={c.id} className="p-6 bg-black/40 border-l-2 border-cyber-green/20 space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold">
                                    <span className="text-cyber-cyan uppercase">{c.author.username}</span>
                                    <span className="text-gray-600">{new Date(c.created_at).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-300 italic">"{c.content}"</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12">
                        {session ? (
                            <form onSubmit={handleCommentSubmit} className="space-y-4">
                                <h4 className="text-sm text-cyber-green uppercase font-bold tracking-widest">SUBMIT_ANNOTATION</h4>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                    placeholder="ENTER_DATA..."
                                    className="w-full bg-black/60 border border-cyber-green/20 focus:border-cyber-green p-4 text-sm text-cyber-green outline-none resize-none"
                                    rows="4"
                                ></textarea>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="cyber-button text-xs py-2"
                                >
                                    {isSubmitting ? 'UPLOADING...' : 'TRANSMIT_LOG'}
                                </button>
                            </form>
                        ) : (
                            <div className="p-8 border border-dashed border-cyber-pink/20 bg-cyber-pink/5 text-center space-y-4">
                                <p className="text-xs text-cyber-pink uppercase font-bold tracking-widest">AUTHENTICATION_REQUIRED_FOR_LOG_ENTRY</p>
                                <button onClick={() => signIn()} className="cyber-button-pink text-xs">IDENTIFY_USER (SIGN_IN)</button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const { slug } = context.params;
    try {
        const response = await api.get(`/blog/posts/${slug}/`);
        return { props: { post: response.data } };
    } catch (error) {
        console.error("Blog post error:", error.message);
        return { props: { post: null } };
    }
}
