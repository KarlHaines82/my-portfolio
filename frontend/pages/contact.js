import Layout from '@/layout/Layout';
import CyberCard from '@/components/CyberCard';
import api from '@/lib/api';
import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, sending, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await api.post('/contact/', formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error("Submission error:", error.response?.data || error.message);
            setStatus('error');
        }
    };

    return (
        <Layout title="Neo-Terminal // Secure_Inquiry">
            <div className="max-w-2xl mx-auto">
                <header className="mb-12 text-center">
                    <h2 className="text-4xl font-black mb-4 glitch-text">ESTABLISH_CONNECTION</h2>
                    <p className="text-cyber-green/60 text-xs tracking-widest uppercase">Encryption: AES-256 // Protocol: HTTPS</p>
                </header>

                <CyberCard variant="green">
                    {status === 'success' ? (
                        <div className="py-20 text-center space-y-6">
                            <div className="text-5xl text-cyber-green animate-bounce">✓</div>
                            <h3 className="text-2xl text-cyber-green">TRANSMISSION_SUCCESSFUL</h3>
                            <p className="text-gray-400 text-sm italic">"Message received. The Operator will review and respond shortly."</p>
                            <button onClick={() => setStatus('idle')} className="cyber-button text-xs mt-8">NEW_ENTRY</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-cyber-green/50 uppercase mb-2 tracking-widest">SENDER_NAME</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/60 border border-cyber-green/20 focus:border-cyber-green p-3 text-cyber-green text-sm outline-none transition-all"
                                        placeholder="REQUIRED"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-cyber-green/50 uppercase mb-2 tracking-widest">SENDER_EMAIL</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-black/60 border border-cyber-green/20 focus:border-cyber-green p-3 text-cyber-green text-sm outline-none transition-all"
                                        placeholder="REQUIRED"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-cyber-green/50 uppercase mb-2 tracking-widest">SUBJECT_PREAMBLE</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full bg-black/60 border border-cyber-green/20 focus:border-cyber-green p-3 text-cyber-green text-sm outline-none transition-all"
                                    placeholder="SUBJECT_LOG"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-cyber-green/50 uppercase mb-2 tracking-widest">TRANSMISSION_BODY</label>
                                <textarea
                                    required
                                    rows="6"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-black/60 border border-cyber-green/20 focus:border-cyber-green p-3 text-cyber-green text-sm outline-none transition-all resize-none"
                                    placeholder="ENTER_DATA..."
                                ></textarea>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <div className="text-[10px] text-cyber-yellow/50 italic animate-pulse">
                                    {status === 'sending' ? 'UPLOADING_ENCRYPTED_PACKETS...' : status === 'error' ? 'TRANSMISSION_FAILED_RETRY?' : 'READY_FOR_ENTRY'}
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="cyber-button group relative overflow-hidden"
                                >
                                    <span className="relative z-10">SEND_MESSAGE</span>
                                    <div className="absolute inset-0 bg-cyber-green translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                                </button>
                            </div>
                        </form>
                    )}
                </CyberCard>
            </div>
        </Layout>
    );
}
