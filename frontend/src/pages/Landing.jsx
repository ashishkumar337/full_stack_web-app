import { Link } from 'react-router-dom';

const Landing = () => (
  <div className="min-h-screen flex flex-col">
    <nav className="max-w-5xl mx-auto w-full px-4 py-5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚡</span>
        <span className="font-display font-bold text-white">MyApp</span>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-white/60 hover:text-white font-display text-sm transition-colors">Sign in</Link>
        <Link to="/signup" className="btn-primary text-sm py-2 px-5">Get started</Link>
      </div>
    </nav>

    <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 animate-fade-in">
      <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 text-brand-400 rounded-full px-4 py-1.5 text-sm font-body mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
        Full-stack · React + Express + MongoDB
      </div>

      <h1 className="font-display font-bold text-5xl sm:text-7xl text-white mb-6 leading-tight max-w-3xl">
        Build faster.<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">Ship smarter.</span>
      </h1>

      <p className="text-white/50 font-body text-lg max-w-xl mb-10 leading-relaxed">
        A complete full-stack boilerplate with authentication, protected routes, and everything you need to launch your next project.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/signup" className="btn-primary text-base px-8 py-3.5">Create free account</Link>
        <Link to="/login" className="btn-secondary text-base px-8 py-3.5">Sign in</Link>
      </div>

      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
        {[
          { icon: '🔐', title: 'Secure Auth', desc: 'JWT tokens, bcrypt hashing, protected routes out of the box.' },
          { icon: '🗄️', title: 'MongoDB Ready', desc: 'Mongoose models, validation, and error handling included.' },
          { icon: '🚀', title: 'Deploy Ready', desc: 'Configured for Vercel (frontend) and Render (backend).' }
        ].map(f => (
          <div key={f.title} className="card p-6 text-left">
            <div className="text-3xl mb-3">{f.icon}</div>
            <div className="font-display font-semibold text-white mb-1">{f.title}</div>
            <div className="text-white/40 text-sm font-body leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </div>
    </main>
  </div>
);

export default Landing;
