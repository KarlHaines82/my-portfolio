import { signIn } from "next-auth/react";
import Layout from "@/layout/Layout";
import CyberCard from "@/components/CyberCard";
import { useState } from "react";
import { useRouter } from "next/router";

export default function SignIn() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const result = await signIn("credentials", {
            redirect: false,
            username: credentials.username,
            password: credentials.password,
        });

        if (result.error) {
            setError("AUTHENTICATION_FAILED: INVALID_CREDENTIALS");
            setLoading(false);
        } else {
            router.push("/");
        }
    };

    return (
        <Layout title="Neo-Terminal // Identity_Verification">
            <div className="max-w-md mx-auto py-20">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-black mb-4 glitch-text">ID_VERIFY</h1>
                    <p className="text-cyber-green/50 text-[10px] tracking-[0.5em] uppercase font-bold">Secure Access Terminal // Alpha-1</p>
                </header>

                <CyberCard variant="green">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-cyber-green/50 uppercase mb-2 tracking-widest">USER_LOGIN</label>
                                <input
                                    type="text"
                                    required
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    className="w-full bg-black/60 border border-cyber-green/20 focus:border-cyber-green p-3 text-cyber-green text-sm outline-none transition-all"
                                    placeholder="USERNAME"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-cyber-green/50 uppercase mb-2 tracking-widest">PASS_KEY</label>
                                <input
                                    type="password"
                                    required
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    className="w-full bg-black/60 border border-cyber-green/20 focus:border-cyber-green p-3 text-cyber-green text-sm outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 border border-cyber-pink/30 bg-cyber-pink/5 text-cyber-pink text-[10px] font-bold text-center animate-pulse">
                                [!] {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full cyber-button py-3 text-sm font-black"
                        >
                            {loading ? "PROCESSING..." : "ESTABLISH_SESSION"}
                        </button>

                        <div className="relative py-4 flex items-center gap-4">
                            <div className="flex-grow h-px bg-cyber-green/20"></div>
                            <span className="text-[10px] text-cyber-green/30 uppercase font-black">OR_EXTERNAL_ID</span>
                            <div className="flex-grow h-px bg-cyber-green/20"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => signIn("github")}
                                className="p-3 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 transition-all font-bold text-[10px] uppercase tracking-widest"
                            >
                                [GITHUB]
                            </button>
                            <button
                                type="button"
                                onClick={() => signIn("google")}
                                className="p-3 border border-cyber-pink/30 text-cyber-pink hover:bg-cyber-pink/10 transition-all font-bold text-[10px] uppercase tracking-widest"
                            >
                                [GOOGLE]
                            </button>
                        </div>
                    </form>
                </CyberCard>

                <p className="mt-12 text-[10px] text-gray-500 text-center uppercase tracking-widest leading-relaxed">
                    Notice: Unauthorized access to this terminal is strictly prohibited. Identity verified via encrypted token exchange system.
                </p>
            </div>
        </Layout>
    );
}
