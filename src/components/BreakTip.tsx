import React from 'react';

interface BreakTipProps {
  icon: React.ReactNode;
  title: string;
  text: string;
  className?: string;
}

const BreakTip: React.FC<BreakTipProps> = ({ icon, title, text, className }) => {
  return (
    <div
      className={`mx-auto mb-6 max-w-md rounded-xl border border-white/10 bg-black/20 px-6 py-4 text-white backdrop-blur-sm ${className}`}
    >
      <div className="mb-2 flex items-center justify-center gap-2">
        {icon}
        <span className="text-lg font-bold">{title}</span>
      </div>
      <p className="text-center text-sm text-white/90">{text}</p>
    </div>
  );
};

export default BreakTip;
