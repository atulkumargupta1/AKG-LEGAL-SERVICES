
import React, { useState, useEffect } from 'react';
import { TabType } from './types';
import BackgroundAnimation from './components/BackgroundAnimation';
import GlassCard from './components/GlassCard';
import LegalAssistant from './components/LegalAssistant';
import Captcha from './components/Captcha';

type LoginMode = 'PASSWORD' | 'OTP_LOGIN' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD' | 'REGISTER';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.CLIENT);
  const [loginMode, setLoginMode] = useState<LoginMode>('PASSWORD');
  const [showAI, setShowAI] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);
  
  // Login Form States
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [actualCaptcha, setActualCaptcha] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timer, setTimer] = useState(0);
  
  // Registration Form States
  const [regName, setRegName] = useState('');
  const [regFather, setRegFather] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regCountryCode, setRegCountryCode] = useState('+91');
  const [regEmail, setRegEmail] = useState('');
  const [regReferral, setRegReferral] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Registration Verification States
  const [regMobileOtp, setRegMobileOtp] = useState('');
  const [isMobileOtpSent, setIsMobileOtpSent] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [mobileTimer, setMobileTimer] = useState(0);

  const [regEmailOtp, setRegEmailOtp] = useState('');
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);
  
  // Validation States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Admin Panel States
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminAttempts, setAdminAttempts] = useState(0);
  const [adminLockoutTimer, setAdminLockoutTimer] = useState(0);
  const [adminCaptchaInput, setAdminCaptchaInput] = useState('');
  const [adminActualCaptcha, setAdminActualCaptcha] = useState('');

  // Password Strength Logic
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: '', color: 'bg-transparent', text: '' };
    if (pwd.length < 6) return { label: 'Too Short', color: 'bg-red-500', text: 'text-red-500' };
    
    let strength = 0;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    
    if (strength === 0) return { label: 'Weak', color: 'bg-orange-500', text: 'text-orange-500' };
    if (strength === 1) return { label: 'Medium', color: 'bg-yellow-500', text: 'text-yellow-500' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    let interval: any;
    if (mobileTimer > 0) {
      interval = setInterval(() => setMobileTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mobileTimer]);

  useEffect(() => {
    let interval: any;
    if (emailTimer > 0) {
      interval = setInterval(() => setEmailTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emailTimer]);

  useEffect(() => {
    let interval: any;
    if (adminLockoutTimer > 0) {
      interval = setInterval(() => setAdminLockoutTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [adminLockoutTimer]);

  // Reset errors when switching modes
  useEffect(() => {
    setError('');
    setSuccess('');
    setOtp('');
    setCaptchaInput('');
    setShowPassword(false);
    // Reset reg verification
    setIsMobileOtpSent(false);
    setIsMobileVerified(false);
    setIsEmailOtpSent(false);
    setIsEmailVerified(false);
    setRegMobileOtp('');
    setRegEmailOtp('');
    if (activeTab === TabType.ADMIN) {
      setAdminUser('');
      setAdminPass('');
      setAdminCaptchaInput('');
    }
  }, [loginMode, activeTab]);

  const handleSendMobileOtp = () => {
    if (!regMobile || regMobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsMobileOtpSent(true);
    setMobileTimer(30);
    setSuccess(`OTP sent to ${regCountryCode} ${regMobile}`);
    setError('');
  };

  const handleVerifyMobileOtp = () => {
    if (regMobileOtp === '1234') {
      setIsMobileVerified(true);
      setSuccess('Mobile number verified successfully.');
      setError('');
    } else {
      setError('Invalid Mobile OTP.');
    }
  };

  const handleSendEmailOtp = () => {
    if (!regEmail || !regEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setIsEmailOtpSent(true);
    setEmailTimer(30);
    setSuccess(`OTP sent to your email: ${regEmail}`);
    setError('');
  };

  const handleVerifyEmailOtp = () => {
    if (regEmailOtp === '1234') {
      setIsEmailVerified(true);
      setSuccess('Email verified successfully.');
      setError('');
    } else {
      setError('Invalid Email OTP.');
    }
  };

  const handleSendOtp = () => {
    if (timer > 0) return;
    if (!identifier) {
      setError('Please enter your Phone or Email.');
      return;
    }
    setTimer(30);
    setSuccess('Success: Security code sent to your device.');
    setError('');
  };

  const handleVerifyOtpLogin = () => {
    if (otp !== '1234') {
      setError('Validation Error: Wrong OTP entered.');
      return;
    }
    setSuccess('Success: Signing you in...');
    setError('');
  };

  const handleVerifyRecovery = () => {
    if (otp !== '1234') {
      setError('Validation Error: Wrong OTP entered.');
      return;
    }
    if (captchaInput.toUpperCase() !== actualCaptcha) {
      setError('Validation Error: Wrong CAPTCHA entered.');
      return;
    }
    setError('');
    setSuccess('');
    setLoginMode('RESET_PASSWORD');
  };

  const handlePasswordSubmit = () => {
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSuccess('Success: Password updated. Redirecting to login...');
    setTimeout(() => {
      setLoginMode('PASSWORD');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIdentifier('');
    }, 2000);
  };

  const handleSignUp = () => {
    if (!regName || !regMobile || !regEmail || !regPassword) {
      setError('Please fill all mandatory fields.');
      return;
    }
    if (!isMobileVerified) {
      setError('Please verify your mobile number.');
      return;
    }
    if (!isEmailVerified) {
      setError('Please verify your email address.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSuccess('Account Created Successfully! Signing in...');
    setTimeout(() => {
      setLoginMode('PASSWORD');
      setError('');
      setSuccess('');
    }, 2000);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLockoutTimer > 0) return;
    if (!adminUser || !adminPass) {
      setError('Please enter Admin Username and Password.');
      return;
    }

    // After 2 failures, require CAPTCHA
    if (adminAttempts >= 2) {
      if (adminCaptchaInput.toUpperCase() !== adminActualCaptcha) {
        const newAttempts = adminAttempts + 1;
        setAdminAttempts(newAttempts);
        if (newAttempts > 5) {
          setAdminLockoutTimer(60);
          setError('CRITICAL: Security Lockout Active (60s).');
        } else {
          setError(`Security Error: Invalid CAPTCHA. Attempt ${newAttempts}`);
        }
        return;
      }
    }

    const VALID_USER = "admin";
    const VALID_PASS = "123456";

    if (adminUser === VALID_USER && adminPass === VALID_PASS) {
      setSuccess('Access Granted. Redirecting to Admin Dashboard...');
      setAdminAttempts(0);
      setError('');
    } else {
      const newAttempts = adminAttempts + 1;
      setAdminAttempts(newAttempts);
      if (newAttempts > 5) {
        setAdminLockoutTimer(60);
        setError('CRITICAL: 5+ Failed attempts. Security Lockout Active (60s).');
      } else {
        setError(`Invalid Details. Attempt ${newAttempts}. ${newAttempts >= 2 ? 'CAPTCHA required.' : ''}`);
      }
      setSuccess('');
    }
  };

  const renderClientForm = () => {
    if (loginMode === 'REGISTER') {
      const strength = getPasswordStrength(regPassword);
      return (
        <div className="space-y-6 animate-fade-in overflow-hidden max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="text-center animate-grow-text mb-4">
            <h2 className="text-xl font-black text-white tracking-widest uppercase">Client Registration Form</h2>
          </div>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold uppercase text-center tracking-wider">{error}</div>}
          {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[10px] font-bold uppercase text-center tracking-wider">{success}</div>}

          <div className="space-y-3">
            <input
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="FULL LEGAL NAME *"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/40 transition-all"
            />
            
            <input
              type="text"
              value={regFather}
              onChange={(e) => setRegFather(e.target.value)}
              placeholder="FATHER'S NAME (OPTIONAL)"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/40 transition-all"
            />

            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  value={regCountryCode}
                  disabled={isMobileVerified}
                  onChange={(e) => setRegCountryCode(e.target.value)}
                  className={`bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/40 transition-all appearance-none cursor-pointer ${isMobileVerified ? 'opacity-50' : ''}`}
                >
                  <option value="+91" className="bg-[#1a1c20]">+91 (IN)</option>
                  <option value="+1" className="bg-[#1a1c20]">+1 (US)</option>
                  <option value="+44" className="bg-[#1a1c20]">+44 (UK)</option>
                  <option value="+971" className="bg-[#1a1c20]">+971 (UAE)</option>
                  <option value="+61" className="bg-[#1a1c20]">+61 (AU)</option>
                  <option value="+81" className="bg-[#1a1c20]">+81 (JP)</option>
                </select>
                <input
                  type="tel"
                  value={regMobile}
                  disabled={isMobileVerified}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setRegMobile(val);
                  }}
                  placeholder="Phone Number"
                  maxLength={10}
                  className={`flex-grow bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/40 transition-all ${isMobileVerified ? 'opacity-50' : ''}`}
                />
                {!isMobileVerified && (
                  <button 
                    onClick={handleSendMobileOtp}
                    disabled={mobileTimer > 0}
                    className="px-4 bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-wider rounded-xl hover:bg-white/20 disabled:opacity-50 transition-all min-w-[90px]"
                  >
                    {mobileTimer > 0 ? `${mobileTimer}s` : 'Send OTP'}
                  </button>
                )}
                {isMobileVerified && (
                  <div className="flex items-center justify-center px-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                    <i className="fas fa-check-circle"></i>
                  </div>
                )}
              </div>
              {isMobileOtpSent && !isMobileVerified && (
                <div className="flex gap-2 animate-fade-in">
                  <input
                    type="text"
                    value={regMobileOtp}
                    onChange={(e) => setRegMobileOtp(e.target.value)}
                    placeholder="Enter Sent OTP"
                    className="flex-grow bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-white text-xs text-center focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/30"
                  />
                  <button 
                    onClick={handleVerifyMobileOtp}
                    className="px-4 bg-white text-black text-[10px] font-bold uppercase rounded-xl hover:bg-slate-200 transition-all"
                  >
                    Verify
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={regEmail}
                  disabled={isEmailVerified}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="EMAIL ID *"
                  className={`flex-grow bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/40 transition-all ${isEmailVerified ? 'opacity-50' : ''}`}
                />
                {!isEmailVerified && (
                  <button 
                    onClick={handleSendEmailOtp}
                    disabled={emailTimer > 0}
                    className="px-4 bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-wider rounded-xl hover:bg-white/20 disabled:opacity-50 transition-all min-w-[100px]"
                  >
                    {emailTimer > 0 ? `${emailTimer}s` : 'Send OTP'}
                  </button>
                )}
                {isEmailVerified && (
                  <div className="flex items-center justify-center px-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                    <i className="fas fa-check-circle"></i>
                  </div>
                )}
              </div>
              {isEmailOtpSent && !isEmailVerified && (
                <div className="flex gap-2 animate-fade-in">
                  <input
                    type="text"
                    value={regEmailOtp}
                    onChange={(e) => setRegEmailOtp(e.target.value)}
                    placeholder="Enter Sent OTP"
                    className="flex-grow bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-white text-xs text-center focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/30"
                  />
                  <button 
                    onClick={handleVerifyEmailOtp}
                    className="px-4 bg-white text-black text-[10px] font-bold uppercase rounded-xl hover:bg-slate-200 transition-all"
                  >
                    Verify
                  </button>
                </div>
              )}
            </div>

            <input
              type="text"
              value={regReferral}
              onChange={(e) => setRegReferral(e.target.value)}
              placeholder="REFERRAL CODE (OPTIONAL)"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/40 transition-all"
            />
            
            <div className="space-y-2">
              <div className="relative flex">
                <input
                  type={showPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="SET YOUR PASSWORD *"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/40 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                </button>
              </div>
              {regPassword && (
                <div className="flex items-center gap-2 px-1">
                  <div className="flex-grow h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${strength.color}`} style={{ width: regPassword.length < 6 ? '33%' : strength.label === 'Weak' ? '33%' : strength.label === 'Medium' ? '66%' : '100%' }}></div>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${strength.text}`}>{strength.label}</span>
                </div>
              )}
              <p className="text-[9px] text-slate-500 px-1 font-bold">MINIMUM 6 CHARACTERS REQUIRED</p>
            </div>
          </div>

          <button 
            onClick={handleSignUp}
            className="w-full bg-white text-black py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.98] hover:bg-slate-200 mt-4"
          >
            Sign up
          </button>

          <div className="text-center pt-2">
            <button 
              onClick={() => setLoginMode('PASSWORD')}
              className="text-[10px] text-slate-400 hover:text-white font-bold tracking-widest uppercase transition-colors"
            >
              Already a client? Log in here
            </button>
          </div>
        </div>
      );
    }

    if (loginMode === 'PASSWORD') {
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="group transition-all">
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Phone or Email address"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-white/40 focus:bg-white/10 transition-all placeholder:text-white/70"
            />
          </div>

          <div className="space-y-2">
            <div className="relative flex">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-l-xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-white/40 focus:bg-white/10 transition-all placeholder:text-white/70 border-r-0"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="bg-white/5 border border-white/10 border-l-0 rounded-r-xl px-5 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setLoginMode('FORGOT_PASSWORD')}
                className="text-[11px] text-sky-300 hover:text-sky-200 font-bold tracking-wide uppercase transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <button className="w-full bg-white text-black hover:bg-slate-200 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-[0.98]">
            Sign In
          </button>

          <div className="space-y-4 pt-2">
            <div className="text-center">
              <button 
                onClick={() => setLoginMode('OTP_LOGIN')}
                className="text-[11px] text-slate-400 hover:text-white font-bold tracking-widest uppercase transition-colors"
              >
                Sign In with OTP
              </button>
            </div>

            <div className="relative flex items-center gap-4">
              <div className="flex-grow h-px bg-white/10"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">OR</span>
              <div className="flex-grow h-px bg-white/10"></div>
            </div>

            <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-white/80 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign In with Google
            </button>
          </div>

          <div className="text-center pt-2 border-t border-white/5 mt-4">
            <p className="text-sm text-slate-400">
              New client? <button onClick={() => setLoginMode('REGISTER')} className="text-white hover:text-slate-300 font-semibold ml-1 underline underline-offset-4 decoration-white/20 transition-colors">Register here</button>
            </p>
          </div>
        </div>
      );
    }

    if (loginMode === 'OTP_LOGIN') {
      return (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-bold text-white text-center tracking-tight">OTP Login</h2>
          
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold uppercase text-center tracking-wider">{error}</div>}
          {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[10px] font-bold uppercase text-center tracking-wider">{success}</div>}

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Phone or Email address"
                className="flex-grow bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/70"
              />
              <button 
                disabled={timer > 0}
                onClick={handleSendOtp}
                className={`px-4 bg-white/10 border border-white/20 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap flex items-center justify-center min-w-[100px] ${timer > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}
              >
                {timer > 0 ? `${timer}s` : 'Send OTP'}
              </button>
            </div>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter One time Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/70"
            />

            <button 
              onClick={handleVerifyOtpLogin}
              className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all"
            >
              Sign In
            </button>
          </div>

          <button 
            onClick={() => setLoginMode('PASSWORD')}
            className="w-full text-slate-500 hover:text-white text-xs text-center font-medium transition-colors"
          >
            Back to Password Login
          </button>
        </div>
      );
    }

    if (loginMode === 'FORGOT_PASSWORD') {
      return (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-bold text-white text-center tracking-tight">Account Recovery</h2>
          
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold uppercase text-center tracking-wider">{error}</div>}
          {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[10px] font-bold uppercase text-center tracking-wider">{success}</div>}

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter Phone Number or Email address"
                className="flex-grow bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/60"
              />
              <button 
                disabled={timer > 0}
                onClick={handleSendOtp}
                className={`px-4 bg-white/10 border border-white/20 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap flex items-center justify-center min-w-[100px] ${timer > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}
              >
                {timer > 0 ? `${timer}s` : 'Send OTP'}
              </button>
            </div>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter One time Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/60"
            />

            <div className="py-2 px-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
               <Captcha onRefresh={(code) => setActualCaptcha(code)} customStyle="text-2xl font-black italic tracking-[0.4em] text-white/90 drop-shadow-glow" />
               <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter CAPTCHA"
                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white text-xs text-center focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/40"
              />
            </div>

            <button 
              onClick={handleVerifyRecovery}
              className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all"
            >
              Verify
            </button>
          </div>

          <button 
            onClick={() => setLoginMode('PASSWORD')}
            className="w-full text-slate-500 hover:text-white text-xs text-center font-medium transition-colors"
          >
            Back to login
          </button>
        </div>
      );
    }

    if (loginMode === 'RESET_PASSWORD') {
      return (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-bold text-white text-center tracking-tight">Set New Password</h2>
          
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold uppercase text-center tracking-wider">{error}</div>}
          {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[10px] font-bold uppercase text-center tracking-wider">{success}</div>}

          <div className="space-y-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Secure Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/70"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/70"
            />
            <button 
              onClick={handlePasswordSubmit} 
              className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg transition-all active:scale-[0.98]"
            >
              Submit Change
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen relative font-sans flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto selection:bg-white/20">
      <BackgroundAnimation />

      <header className="mb-20 md:mb-24 text-center">
        <div className="flex flex-col items-center">
          <div className="relative group cursor-default mb-6">
            <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full scale-150 transition-all duration-1000 group-hover:bg-white/10"></div>
            <div className="relative bg-white/5 p-5 rounded-full border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-all duration-500 group-hover:scale-105 group-hover:border-white/30">
              <svg 
                className="w-14 h-14 text-white/90" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.2em] text-white uppercase drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
              AKG LEGAL SERVICES
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mt-4 relative">
              <div className="absolute inset-0 bg-white blur-sm animate-line-glow"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[460px] z-10">
        <div className="flex w-full mb-0 bg-white/[0.04] backdrop-blur-[40px] rounded-t-2xl border border-white/10 border-b-0 overflow-hidden shadow-[inset_0_1px_rgba(255,255,255,0.1)]">
          <button
            onClick={() => { setActiveTab(TabType.CLIENT); setLoginMode('PASSWORD'); }}
            className={`flex-1 py-5 text-center font-bold text-sm tracking-widest uppercase transition-all duration-500 relative ${
              activeTab === TabType.CLIENT 
              ? 'text-white bg-white/10' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
            }`}
          >
            Client Login
            {activeTab === TabType.CLIENT && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white shadow-[0_-2px_15px_rgba(255,255,255,0.4)]"></div>
            )}
          </button>
          <button
            onClick={() => { setActiveTab(TabType.ADMIN); }}
            className={`flex-1 py-5 text-center font-bold text-sm tracking-widest uppercase transition-all duration-500 relative ${
              activeTab === TabType.ADMIN 
              ? 'text-white bg-white/10' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
            }`}
          >
            Admin Panel
            {activeTab === TabType.ADMIN && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white shadow-[0_-2px_15px_rgba(255,255,255,0.4)]"></div>
            )}
          </button>
        </div>

        <GlassCard className="rounded-t-none pt-12 pb-12 border-t-0 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] min-h-[500px] flex flex-col justify-center transition-all duration-500">
          {error && activeTab === TabType.ADMIN && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold uppercase text-center tracking-wider animate-shake">{error}</div>}
          {success && activeTab === TabType.ADMIN && <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[10px] font-bold uppercase text-center tracking-wider">{success}</div>}
          
          {activeTab === TabType.CLIENT ? renderClientForm() : (
             <form className="space-y-6 animate-fade-in" onSubmit={handleAdminLogin}>
                <div className="text-center mb-2"><h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500">Administrator Credentials</h3></div>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={adminUser}
                    disabled={adminLockoutTimer > 0}
                    onChange={(e) => setAdminUser(e.target.value)}
                    placeholder="Admin Username"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/70 transition-all disabled:opacity-30"
                  />
                  <input
                    type="password"
                    value={adminPass}
                    disabled={adminLockoutTimer > 0}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-white/40 placeholder:text-white/70 transition-all disabled:opacity-30"
                  />
                  {adminAttempts >= 2 && adminLockoutTimer <= 0 && (
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3 animate-fade-in">
                      <Captcha onRefresh={(code) => setAdminActualCaptcha(code)} customStyle="text-2xl font-black italic tracking-[0.4em] text-white/90 drop-shadow-glow" />
                      <input type="text" value={adminCaptchaInput} onChange={(e) => setAdminCaptchaInput(e.target.value)} placeholder="Security Code" className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white text-xs text-center" />
                    </div>
                  )}
                  <button type="submit" disabled={adminLockoutTimer > 0} className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg active:scale-[0.98] ${adminLockoutTimer > 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white text-black hover:bg-slate-200'}`}>
                    {adminLockoutTimer > 0 ? `LOCKED (${adminLockoutTimer}s)` : 'Authenticate'}
                  </button>
                </div>
             </form>
          )}
        </GlassCard>

        <div className="mt-12 flex justify-end">
            <button 
                onClick={() => setShowAI(!showAI)}
                onMouseEnter={() => setIsAssistantExpanded(true)}
                onMouseLeave={() => setIsAssistantExpanded(false)}
                className={`group h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center gap-3 shadow-xl backdrop-blur-md transition-all duration-500 ease-out overflow-hidden ${isAssistantExpanded ? 'px-8 w-[220px]' : 'px-0 w-12 justify-center'}`}
            >
                <i className={`fas ${showAI ? 'fa-times' : 'fa-headset'} transition-transform duration-500 group-hover:rotate-12 text-slate-400 group-hover:text-white`}></i>
                <span className={`text-[11px] font-bold tracking-[0.25em] text-slate-400 group-hover:text-white uppercase whitespace-nowrap transition-all duration-500 ${isAssistantExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
                  {showAI ? 'Close' : 'Assistant'}
                </span>
            </button>
        </div>

        {showAI && <div className="mt-6"><LegalAssistant /></div>}
      </main>

      {/* Footer removed per user request */}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineGlow {
          0%, 100% { opacity: 0.2; transform: scaleX(0.8); }
          50% { opacity: 0.6; transform: scaleX(1.1); }
        }
        @keyframes growText {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-fade-in {
          animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-line-glow {
          animation: lineGlow 4s ease-in-out infinite;
        }
        .animate-grow-text {
          animation: growText 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        .drop-shadow-glow {
          filter: drop-shadow(0 0 8px rgba(255,255,255,0.3));
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        ::placeholder {
          font-weight: 500;
          letter-spacing: 0.03em;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active  {
            -webkit-box-shadow: 0 0 0 30px #1a1c20 inset !important;
            -webkit-text-fill-color: white !important;
        }
        select option {
          background: #1a1c20;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default App;
