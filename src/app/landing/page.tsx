import Link from 'next/link';
import './../globals.css';


export const metadata = {
  title: 'Somamap — Log where it hurts. See the pattern.',
  description: 'Track symptoms on your digital twin and discover patterns over time.',
};

const steps = [
  {
    num: '1',
    title: 'Tap where it hurts',
    desc: 'Select a body region on the Somamap to log a symptom instantly.',
  },
  {
    num: '2',
    title: 'Log severity & details',
    desc: 'Rate severity, add notes, and note what happened before the symptom started.',
  },
  {
    num: '3',
    title: 'See your patterns',
    desc: 'Review timelines, charts, and correlations to share with your doctor.',
  },
];

const screenshots = [
  {
    title: 'Body Map',
    desc: 'Tap any region to log a symptom',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    title: 'Patterns & Timeline',
    desc: 'Review your symptom history',
    gradient: 'from-slate-600 to-slate-800',
  },
  {
    title: 'Charts',
    desc: 'Severity trends and occurrence counts',
    gradient: 'from-indigo-400 to-cyan-500',
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                <line x1="16" y1="8" x2="2" y2="22" />
                <line x1="17.5" y1="15" x2="9" y2="6.5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-indigo-700">Somamap</span>
          </div>
          <Link
            href="/"
            className="text-sm font-semibold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
          >
            Open Somamap
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-6 py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Log where it hurts. See the pattern.
            </h1>
            <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto">
              Tap a body region, log severity and details, and discover patterns in your symptoms over time.
            </p>
            <Link
              href="/"
              className="inline-block text-base font-semibold px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Start Tracking
            </Link>
          </div>
        </section>

        {/* What it does */}
        <section className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-6 py-16 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What it does</h2>
            <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Somamap lets you log symptoms directly onto a body map. Each entry is stored on your Ontomorph digital twin, 
              so you have a private, structured record of how you feel. Over time, patterns emerge — giving you something 
              concrete to bring to a doctor instead of guessing.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map(step => (
                <div key={step.num} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-md shadow-indigo-200">
                    {step.num}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screenshots */}
        <section className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">See it in action</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {screenshots.map(shot => (
                <div key={shot.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${shot.gradient} flex items-center justify-center mb-4`}>
                    <span className="text-white font-semibold text-lg drop-shadow-sm">{shot.title}</span>
                  </div>
                  <p className="text-sm text-slate-600 text-center">{shot.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-6 py-16 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to start tracking?</h2>
            <p className="text-slate-500 mb-8">
              Open Somamap and log your first symptom in under a minute.
            </p>
            <Link
              href="/"
              className="inline-block text-base font-semibold px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Open Somamap
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-slate-400">
            Built on{' '}
            <a
              href="https://ontomorph.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 underline"
            >
              Ontomorph
            </a>
            {' '}for the Ontomorph Hackathon (OAU), July 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
