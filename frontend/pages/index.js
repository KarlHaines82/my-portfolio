import Layout from '@/layout/Layout';
import Link from 'next/link';

export default function Home({ testimonials }) {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="mb-8 relative">
          <div className="absolute -inset-4 bg-cyber-green/20 blur-2xl rounded-full"></div>
          <h1 className="text-5xl md:text-8xl font-black mb-2 glitch-text tracking-tighter relative">
            I BUILD DIGITAL FRONTIERS
          </h1>
        </div>

        <p className="max-w-2xl text-lg md:text-xl text-cyber-green/80 font-bold uppercase tracking-widest mb-12">
          Senior Systems Architect & Full-Stack Engineer specializing in high-performance distributed systems and immersive web experiences.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/resume" className="cyber-button text-lg group">
            <span className="group-hover:neon-glow-green">DOWNLOAD_RESUME.PDF</span>
          </Link>
          <Link href="/services" className="cyber-button-pink text-lg group">
            <span className="group-hover:neon-glow-pink">VIEW_SERVICES</span>
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="cyber-border p-6 bg-black/40 backdrop-blur-md">
            <h3 className="text-cyber-cyan mb-2 tracking-widest uppercase font-bold text-sm">SYSTEMS_ARCHITECTURE</h3>
            <p className="text-xs text-gray-400">Designing scalable, secure microservices and distributed data pipelines.</p>
          </div>
          <div className="cyber-border-pink p-6 bg-black/40 backdrop-blur-md">
            <h3 className="text-cyber-pink mb-2 tracking-widest uppercase font-bold text-sm">FULL_STACK_MASTERY</h3>
            <p className="text-xs text-gray-400">From high-performance Django backends to immersive React interfaces.</p>
          </div>
          <div className="cyber-border-yellow p-6 bg-black/40 backdrop-blur-md">
            <h3 className="text-cyber-yellow mb-2 tracking-widest uppercase font-bold text-sm">AI_INTEGRATION</h3>
            <p className="text-xs text-gray-400">Bridging the gap between human intuition and machine precision via LLMs.</p>
          </div>
        </div>

        {testimonials && testimonials.length > 0 && (
          <section className="mt-32 w-full">
            <h2 className="text-2xl font-black mb-12 flex items-center justify-center gap-4 text-cyber-green/60">
              <span className="text-cyber-green/30">---</span> FEEDBACK_LOG <span className="text-cyber-green/30">---</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map(t => (
                <div key={t.id} className="p-8 border border-white/5 bg-white/2 relative group hover:bg-white/5 transition-all">
                  <div className="absolute top-0 right-0 p-2 text-cyber-yellow/20 text-4xl font-serif">"</div>
                  <p className="text-sm text-gray-300 italic mb-6 leading-relaxed">
                    "{t.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    {t.avatar && <img src={t.avatar} className="w-10 h-10 border border-cyber-green/20" />}
                    <div>
                      <h4 className="text-xs font-bold text-cyber-green truncate">{t.client_name.toUpperCase()}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{t.client_title} // {t.client_company}</p>
                    </div>
                  </div>
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
    const response = await import('@/lib/api').then(m => m.default.get('/testimonials/'));
    return {
      props: {
        testimonials: Array.isArray(response.data.results) ? response.data.results : (Array.isArray(response.data) ? response.data : [])
      }
    };
  } catch (error) {
    return { props: { testimonials: [] } };
  }
}
