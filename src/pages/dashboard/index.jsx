// src/pages/dashboard/index.jsx
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const email = user?.email || 'user@example.com';
  const displayName =
    userProfile?.full_name || (email ? email.split('@')[0] : 'there');

  const handleAskQuestion = () => {
    navigate('/ai-chat-interface');
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | BreakinLaw</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-sky-50">
        <Header />

        {/* Whole page under header = hero */}
        <main className="flex-1">
          <section className="relative h-full min-h-[calc(100vh-64px)] w-full bg-gradient-to-b from-sky-50 via-white to-white flex items-center">
            {/* background glow */}
            <div className="pointer-events-none absolute -top-24 -right-10 h-72 w-72 rounded-full bg-sky-400/40 blur-3xl opacity-70" />
            <div className="pointer-events-none absolute -bottom-28 -left-10 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl opacity-70" />

            {/* content container */}
            <div className="relative w-full max-w-6xl mx-auto px-4 lg:px-6">
              {/* tiny signed-in line at very top of hero area */}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
                {/* Left: logo + copy */}
                <div className="flex-1 max-w-xl">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm border border-slate-100">
                      <img
                        src="/logo bl.png"
                        alt="BreakinLaw logo"
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/80 border border-slate-100 text-slate-600 shadow-sm">
                      <Icon name="Globe2" size={14} />
                      <span>UK jurisdiction</span>
                      <span className="opacity-50">•</span>
                      <span>Guidance based on UK law</span>
                    </div>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">
                    Welcome to 
                    <span className="block text-sky-500">
                      BreakinLaw
                    </span>
                  </h1>

                  <p className="text-base md:text-lg text-slate-600 max-w-xl mb-6">
                    BreakinLaw helps you understand your rights, prepare your
                    case, and talk to an AI legal assistant anytime. No jargon,
                    no judgment, just clear next steps.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-4">
                    

                    <Button
                      variant="outline"
                      size="lg"
                      iconName="BookOpen"
                      iconPosition="left"
                      onClick={() => navigate('/rights-guides')}
                      className="w-full sm:w-auto border-sky-200 text-sky-700 bg-white/80 hover:bg-white"
                    >
                      Browse rights guides
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="Sparkles" size={14} />
                      24/7 AI legal companion
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="ShieldCheck" size={14} />
                      Private &amp; secure by design
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="Info" size={14} />
                      Not a law firm. Educational guidance only.
                    </span>
                  </div>
                </div>

                {/* Right: highlight card */}
                <div className="flex-1 flex justify-center md:justify-end">
                  <div className="w-full max-w-sm bg-white/90 border border-sky-100 rounded-3xl shadow-md shadow-slate-200/80 p-6 space-y-4">
                    <div className="inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                      <Icon name="Clock" size={14} />
                      <span>Get started in under 2 minutes</span>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        Ready when you are
                      </p>
                      <p className="text-lg font-semibold text-slate-900">
                        Ask your first legal question today.
                      </p>
                    </div>

                    <ul className="text-xs text-slate-600 space-y-1.5">
                      <li className="flex items-center gap-2">
                        <Icon
                          name="CheckCircle2"
                          size={14}
                          className="text-sky-500"
                        />
                        <span>No legal knowledge required</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Icon
                          name="CheckCircle2"
                          size={14}
                          className="text-sky-500"
                        />
                        <span>Step-by-step explanations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Icon
                          name="CheckCircle2"
                          size={14}
                          className="text-sky-500"
                        />
                        <span>Save your rights journey as you go</span>
                      </li>
                    </ul>


                    
                    <Button
                      variant="default"
                      size="lg"
                      iconName="MessageCircle"
                      iconPosition="left"
                      onClick={handleAskQuestion}
                      className="bg-sky-500 hover:bg-sky-600 w-full sm:w-auto shadow-md shadow-sky-300/60"
                    >
                      Interact freely with AI assistant
                    </Button>

                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
