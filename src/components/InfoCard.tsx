import React from 'react';

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  text: string;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, text, className }) => {
  return (
    <div className={`mb-6 rounded-2xl border px-6 py-4 shadow-lg backdrop-blur-sm ${className}`}>
      <div className="mb-1 flex items-center justify-center gap-2">
        {icon}
        <p className="text-lg font-semibold">{title}</p>
      </div>
      <p className="mt-1 text-center text-sm opacity-90">{text}</p>
    </div>
  );
};

export default InfoCard;
