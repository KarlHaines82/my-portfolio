import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../layout/Layout'; // Assuming there is a Layout component
import Head from 'next/head';
import { useSession, signIn } from 'next-auth/react';

export default function AIBlogWriter() {
    const { data: session } = useSession();
    const [step, setStep] = useState('topics');
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [draft, setDraft] = useState('');
    const [review, setReview] = useState('');
    const [seo, setSeo] = useState(null);
    const [imagePrompt, setImagePrompt] = useState('');
    const [log, setLog] = useState(['Initializing AI interface...', 'Waiting for user input...']);

    const addLog = (msg) => {
        setLog(prev => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const fetchTopics = async () => {
        setLoading(true);
        addLog('TopicsAgent: Scanning portfolio context...');
        try {
            const config = { headers: { Authorization: `Bearer ${session?.accessToken}` } };
            const res = await axios.post('http://localhost:8000/api/ai/generate-topics/', {}, config);
            setTopics(res.data.topics);
            addLog('TopicsAgent: List generated.');
        } catch (err) {
            addLog('Error: Failed to fetch topics.');
        }
        setLoading(false);
    };

    const generateDraft = async () => {
        setLoading(true);
        addLog('BlogAuthor: Synthesizing article...');
        try {
            const config = { headers: { Authorization: `Bearer ${session?.accessToken}` } };
            const res = await axios.post('http://localhost:8000/api/ai/generate-draft/', {
                topic: selectedTopic.title,
                description: selectedTopic.description
            }, config);
            setDraft(res.data.draft);
            addLog('BlogAuthor: Draft completed.');
            setStep('draft');
        } catch (err) {
            addLog('Error: Failed to generate draft.');
        }
        setLoading(false);
    };

    const runReviews = async () => {
        setLoading(true);
        addLog('FactChecker: Reviewing content...');
        try {
            const config = { headers: { Authorization: `Bearer ${session?.accessToken}` } };
            const resFact = await axios.post('http://localhost:8000/api/ai/fact-check/', { content: draft }, config);
            setReview(resFact.data.review);
            addLog('FactChecker: Review complete.');

            addLog('SEOOptimizer: Analyzing keywords...');
            const resSeo = await axios.post('http://localhost:8000/api/ai/seo-optimize/', { title: selectedTopic.title, content: draft }, config);
            setSeo(resSeo.data.seo);
            addLog('SEOOptimizer: Optimization complete.');

            addLog('FeaturedImageCreator: Framing prompt...');
            const resImg = await axios.post('http://localhost:8000/api/ai/image-prompt/', { title: selectedTopic.title, content: draft }, config);
            setImagePrompt(resImg.data.prompt);
            addLog('FeaturedImageCreator: Prompt ready.');

            setStep('review');
        } catch (err) {
            addLog('Error: Review process failed.');
        }
        setLoading(false);
    };

    const handlePublish = async () => {
        setLoading(true);
        addLog('System: Uploading to Crypto-Database...');
        try {
            const config = { headers: { Authorization: `Bearer ${session?.accessToken}` } };
            await axios.post('http://localhost:8000/api/ai/publish-blog/', {
                title: selectedTopic.title,
                content: draft,
                meta_description: seo.meta_description,
                tags: seo.tags,
                image_prompt: imagePrompt
            }, config);
            addLog('SUCCESS: Transmission complete. Post in queue.');
            alert('Blog post saved successfully as draft!');
        } catch (err) {
            addLog('Error: Transmission failed.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black text-cyan-400 font-mono p-8 selection:bg-pink-500 selection:text-white">
            <Head>
                <title>AI BLOG WRITER // NEO-TERMINAL</title>
            </Head>

            <div className="max-w-4xl mx-auto border-2 border-cyan-500 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                {/* Header */}
                <div className="bg-cyan-900/50 p-4 border-b border-cyan-500 flex justify-between items-center">
                    <h1 className="text-xl font-bold tracking-widest uppercase">AI Blog Writer // v1.0.4</h1>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                </div>

                {/* Log Viewer */}
                <div className="bg-black/80 p-4 font-mono text-xs whitespace-pre-wrap h-40 overflow-y-auto border-b border-cyan-900">
                    {!session ? (
                        <div className="text-pink-500 animate-pulse">
                            [ERROR] AUTHENTICATION REQUIRED. PLEASE IDENTIFY USER.
                            <button onClick={() => signIn()} className="mt-2 block cyber-button-pink py-1 px-4">SIGN_IN // AUTHORIZE</button>
                        </div>
                    ) : (
                        <>
                            {log.map((entry, i) => (
                                <div key={i} className={entry.includes('Error') || entry.includes('failed') ? 'text-red-500' : 'text-cyan-600'}>
                                    {entry}
                                </div>
                            ))}
                            {loading && <div className="text-pink-500 animate-pulse mt-1">{`>> PROCESSING...`}</div>}
                        </>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-8 bg-gradient-to-b from-cyan-950/20 to-black h-[500px] overflow-y-auto">

                    {step === 'topics' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold border-l-4 border-pink-500 pl-4 mb-8">Select Generated Topic</h2>
                            {topics.length === 0 ? (
                                <button
                                    onClick={fetchTopics}
                                    disabled={loading || !session}
                                    className="w-full bg-transparent border-2 border-cyan-500 py-4 hover:bg-cyan-500 hover:text-black transition-all font-bold tracking-tighter disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-cyan-400"
                                >
                                    INITIALIZE TOPICS_AGENT
                                </button>
                            ) : (
                                <div className="space-y-4">
                                    {topics.map((t, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setSelectedTopic(t)}
                                            className={`p-4 border-2 cursor-pointer transition-all ${selectedTopic === t ? 'border-pink-500 bg-pink-900/10' : 'border-cyan-900 hover:border-cyan-500'}`}
                                        >
                                            <h3 className="font-bold text-lg">{t.title}</h3>
                                            <p className="text-cyan-700 text-sm mt-1">{t.description}</p>
                                        </div>
                                    ))}
                                    <button
                                        onClick={generateDraft}
                                        disabled={!selectedTopic || loading}
                                        className="w-full mt-4 bg-pink-600 text-white py-3 disabled:opacity-50 hover:bg-pink-500 transition-all font-bold shadow-[0_0_15px_rgba(219,39,119,0.5)]"
                                    >
                                        AUTHORIZE BLOG_AUTHOR
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'draft' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold border-l-4 border-pink-500 pl-4 mb-4">Draft Review</h2>
                            <textarea
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                className="w-full h-80 bg-black/50 border border-cyan-900 p-4 text-cyan-300 focus:border-cyan-500 outline-none resize-none font-sans"
                            />
                            <button
                                onClick={runReviews}
                                disabled={loading}
                                className="w-full bg-cyan-600 text-black py-3 hover:bg-cyan-500 transition-all font-bold"
                            >
                                PROCEED TO REVIEWS (FACT_CHECK/SEO/IMG)
                            </button>
                        </div>
                    )}

                    {step === 'review' && (
                        <div className="space-y-8 pb-8">
                            <h2 className="text-2xl font-bold border-l-4 border-pink-500 pl-4">Multi-Agent Review Results</h2>

                            <section className="space-y-2">
                                <h3 className="text-pink-500 font-bold uppercase tracking-widest text-xs">FactChecker Output:</h3>
                                <div className="bg-cyan-950/20 p-4 border border-cyan-900 text-sm rounded">{review}</div>
                            </section>

                            <section className="space-y-2">
                                <h3 className="text-pink-500 font-bold uppercase tracking-widest text-xs">SEOOptimizer Core:</h3>
                                <div className="bg-cyan-950/20 p-4 border border-cyan-900 text-sm rounded">
                                    <div className="mb-2"><span className="text-cyan-700">Tags:</span> {seo.tags.join(', ')}</div>
                                    <div><span className="text-cyan-700">Meta:</span> {seo.meta_description}</div>
                                </div>
                            </section>

                            <section className="space-y-2">
                                <h3 className="text-pink-500 font-bold uppercase tracking-widest text-xs">Featured Image Prompt:</h3>
                                <div className="bg-cyan-950/20 p-4 border border-cyan-900 text-sm rounded italic">"{imagePrompt}"</div>
                            </section>

                            <button
                                onClick={handlePublish}
                                disabled={loading}
                                className="w-full bg-white text-black py-4 font-black text-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_white] disabled:opacity-50"
                            >
                                PUBLISH TO CRYPTO-BLOG
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
