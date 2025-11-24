import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WelcomeScreen = ({ onStartChat }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onStartChat(trimmed);
    setValue('');
  };

  return (
    <div className="flex-1 flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-4xl space-y-8 text-white">

        {/* Hero Text */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Tell us what is happening.
            <span className="block text-teal-300 mt-1">
              We turn it into clear legal steps.
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-200 max-w-2xl mx-auto">
            Describe your situation in plain English. BreakinLaw explains your rights,
            deadlines and what to do before you speak to a lawyer.
          </p>
        </div>

        {/* ONLY the input block (no outer card) */}
        <div className="max-w-3xl mx-auto w-full space-y-6">

          <form onSubmit={handleSubmit}>
            <div className="rounded-2xl bg-black/30 border border-white/10 px-4 py-4 flex flex-col gap-3">
              <textarea
                rows={3}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder='For example: “My landlord increased my rent by 30% and I am not sure if this is legal or what I can do.”'
                className="w-full bg-transparent text-sm md:text-base text-white placeholder:text-slate-400 resize-none focus:outline-none"
              />

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-slate-300">
                  Be as specific as you can. You do not need legal words.
                </p>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  disabled={!value.trim()}
                >
                  Get guidance
                </Button>
              </div>
            </div>
          </form>

          {/* Disclaimer */}
          <div className="pt-3 text-xs text-slate-300 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-start gap-2">
              <Icon name="AlertTriangle" size={14} className="mt-0.5" />
              <span>
                Information only. This is not legal advice. For complex matters, we help you connect with a UK solicitor.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={14} />
              <span>Most people receive a structured answer in under 10 seconds.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
