import React from 'react';

interface InlineTipProps {
  icon: React.ReactNode;
  title: string;
  text: string;
  className?: string;
}

const InlineTip: React.FC<InlineTipProps> = ({ icon, title, text, className }) => {
  return (
    <div
      className={`mb-6 rounded-2xl border px-6 py-4 text-center shadow-lg backdrop-blur-sm ${className}`}
    >
      <div className="mb-1 flex items-center justify-center gap-2">
        {icon}
        <p className="text-lg font-semibold">{title}</p>
      </div>
      <p className="mt-1 text-sm">{text}</p>
    </div>
  );
};

export default InlineTip;
