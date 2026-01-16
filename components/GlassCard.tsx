
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-[40px] border border-white/[0.12] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] p-8 ${className}`}>
      {/* Subtle light streak across the glass */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none rounded-2xl"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
