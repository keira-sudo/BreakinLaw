import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WelcomeCard = ({ isNewUser = true }) => {
  const navigate = useNavigate();

  const handleAskQuestion = () => {
    navigate('/ai-chat-interface');
  };

  if (isNewUser) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-secondary/10 to-pink-500/10 border border-white/20 shadow-[0_28px_80px_rgba(15,23,42,0.55)] px-6 py-10 md:px-12 md:py-14">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-secondary/40 blur-3xl opacity-60" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-primary/40 blur-3xl opacity-50" />

        <div className="relative flex flex-col items-center text-center gap-6 md:flex-row md:text-left md:items-center md:gap-10">
          {/* Left: logo & text */}
          <div className="flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-background/70 flex items-center justify-center border border-white/20">
                <img
                  src="/logo bl.png"
                  alt="BreakinLaw logo"
                  className="w-9 h-9 object-contain"
                />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-background/60 border border-white/20 text-muted-foreground">
                <Icon name="Globe2" size={14} />
                <span>UK jurisdiction</span>
                <span className="opacity-60">•</span>
                <span>Guidance based on UK law</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              The law by the citizens,
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                for the citizens.
              </span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
              BreakinLaw helps you understand your rights, prepare your case,
              and talk to an AI legal assistant anytime. No jargon, no judgment,
              just clear next steps.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:items-center">
              <Button
                variant="default"
                size="lg"
                iconName="MessageCircle"
                iconPosition="left"
                onClick={handleAskQuestion}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-secondary/30 w-full sm:w-auto"
              >
                Start your legal journey
              </Button>

              <Button
                variant="ghost"
                size="lg"
                iconName="BookOpen"
                iconPosition="left"
                onClick={() => navigate('/rights-guides')}
                className="backdrop-blur-sm border border-white/30 bg-background/40 hover:bg-background/70 w-full sm:w-auto"
              >
                Browse rights guides
              </Button>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3 text-xs sm:text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2">
                <Icon name="Sparkles" size={14} />
                <span>24/7 AI legal companion</span>
              </div>
              <span className="hidden sm:inline opacity-40">•</span>
              <div className="inline-flex items-center gap-2">
                <Icon name="ShieldCheck" size={14} />
                <span>Private & secure by design</span>
              </div>
              <span className="hidden sm:inline opacity-40">•</span>
              <div className="inline-flex items-center gap-2">
                <Icon name="Info" size={14} />
                <span>Not a law firm. Educational guidance only.</span>
              </div>
            </div>
          </div>

          {/* Right: small “status”/stat card */}
          <div className="flex-1 flex justify-center md:justify-end mt-6 md:mt-0">
            <div className="w-full max-w-xs rounded-2xl bg-background/70 border border-white/20 backdrop-blur-md p-5 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                <Icon name="Clock" size={14} />
                <span>Get started in under 2 minutes</span>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Ready when you are
                </p>
                <p className="text-lg font-semibold text-foreground">
                  Ask your first legal question today.
                </p>
              </div>

              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li className="flex items-center gap-2">
                  <Icon name="CheckCircle2" size={14} />
                  <span>No legal knowledge required</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="CheckCircle2" size={14} />
                  <span>Step-by-step explanations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="CheckCircle2" size={14} />
                  <span>Save your rights journey as you go</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in / returning state can stay calmer
  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-7">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Good afternoon
          </h2>
          <p className="text-muted-foreground">
            Pick up where you left off or ask something new.
          </p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
          <Icon name="Sparkles" size={24} color="white" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={handleAskQuestion}
          className="w-full sm:w-auto"
        >
          Ask a new question
        </Button>
        <Button
          variant="outline"
          iconName="BookOpen"
          iconPosition="left"
          onClick={() => navigate('/rights-journal')}
          className="w-full sm:w-auto"
        >
          Open my rights journal
        </Button>
      </div>
    </div>
  );
};

export default WelcomeCard;
