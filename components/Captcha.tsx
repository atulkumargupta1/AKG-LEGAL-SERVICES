
import React, { useState, useEffect } from 'react';

interface CaptchaProps {
  onRefresh: (code: string) => void;
  customStyle?: string;
}

const Captcha: React.FC<CaptchaProps> = ({ onRefresh, customStyle = "text-xl italic line-through" }) => {
  const [captcha, setCaptcha] = useState('');

  const generateCaptcha = () => {
    // 4 characters Capital Letter Alphabet and Number as requested
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    onRefresh(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className={`font-mono tracking-widest text-white/80 select-none ${customStyle}`}>
        {captcha}
      </div>
      <button 
        type="button"
        onClick={generateCaptcha}
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[9px] uppercase tracking-widest font-bold"
        title="Refresh Captcha"
      >
        <i className="fas fa-sync-alt text-[8px]"></i>
        <span>Regenerate</span>
      </button>
    </div>
  );
};

export default Captcha;
