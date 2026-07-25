import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ShoppingCart, 
  TrendingUp, 
  Bot, 
  Users, 
  LayoutDashboard
} from 'lucide-react';
import { loginUser, registerUser, guestLogin } from '../firebase';

interface AuthProps {
  onAuthSuccess: () => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [activeTab, setActiveTab] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const handleGuestAccess = async () => {
    setError('');
    setGuestLoading(true);
    try {
      await guestLogin();
      onAuthSuccess();
    } catch (err: any) {
      console.error(err);
      setError('Guest access error. Please try again.');
    } finally {
      setGuestLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'signin') {
        await loginUser(email, password);
        onAuthSuccess();
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        await registerUser(email, password, fullName || "Pharmacist", pharmacyName || "MediStock Pharmacy");
        onAuthSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
      
      {/* Background Decorative Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-3xl z-10 space-y-8 my-auto">
        
        {/* Top Header / Branding */}
        <header className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100/80 border border-emerald-300/80 text-emerald-900 rounded-full text-xs font-bold tracking-wide shadow-xs">
            <ShieldCheck size={16} className="text-emerald-700" />
            MediStock AI • Pharmacy Operations Platform
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Next-Gen Pharmacy & Inventory System
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Manage drug stocks, POS billing invoices, audit analytics, and query our Gemini AI Pharmacy Assistant in real time.
          </p>
        </header>

        {/* Master Card Container */}
        <main className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          
          {/* Section 1: Guest Access Banner (Top Portion) */}
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-10 text-center relative overflow-hidden space-y-6">
            
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[11px] font-bold text-emerald-100 uppercase tracking-widest">
                <Sparkles size={14} className="text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                Instant University Final Project Demo
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Explore Full Application Demo
              </h2>
              <p className="text-emerald-100/90 text-xs sm:text-sm max-w-lg mx-auto">
                No sign up required. Instantly inspect pre-loaded medicines, generate sales invoices, view financial reports, and chat with AI.
              </p>
            </div>

            {/* Primary Guest Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleGuestAccess}
                disabled={guestLoading}
                className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-950 hover:bg-emerald-50 font-extrabold text-base sm:text-lg rounded-2xl shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 mx-auto cursor-pointer group border-2 border-emerald-100"
              >
                {guestLoading ? (
                  <div className="w-6 h-6 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>🚀 Continue as Guest (Recommended for Demo)</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-emerald-700" />
                  </>
                )}
              </button>
            </div>

            {/* Feature Checklist */}
            <div className="pt-4 border-t border-emerald-500/40 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-left text-xs font-medium text-emerald-100 max-w-2xl mx-auto">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-300 shrink-0" />
                <span>Dashboard Analytics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-300 shrink-0" />
                <span>Medicine Management</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-300 shrink-0" />
                <span>Inventory Audit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-300 shrink-0" />
                <span>Sales & POS Billing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-300 shrink-0" />
                <span>Profit & Sales Reports</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-300 shrink-0" />
                <span>AI Pharmacy Assistant</span>
              </div>
            </div>

          </div>

          {/* Section 2: Create an Account / Sign In (Directly Below Guest Button) */}
          <div className="p-6 sm:p-10 bg-white space-y-6">
            
            {/* Section Divider & Heading */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                Permanent Database Login
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                Create an Account
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Sign up or sign in to save custom records in your cloud Firebase database
              </p>
            </div>

            {/* Interactive Toggle Tabs: Sign Up | Sign In */}
            <div className="max-w-md mx-auto flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setError('');
                }}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'signup'
                    ? "bg-white text-emerald-700 shadow-md ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <User size={16} />
                <span>Sign Up</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setError('');
                }}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'signin'
                    ? "bg-white text-emerald-700 shadow-md ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Lock size={16} />
                <span>Sign In</span>
              </button>
            </div>

            {error && (
              <div className="max-w-md mx-auto p-3.5 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-xs rounded-r-xl font-medium">
                {error}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              
              {activeTab === 'signup' && (
                <>
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block" htmlFor="fullName">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <User size={18} />
                      </span>
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Sarah Ahmed"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/15 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Pharmacy Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block" htmlFor="pharmacyName">
                      Pharmacy Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Building2 size={18} />
                      </span>
                      <input
                        id="pharmacyName"
                        type="text"
                        required
                        value={pharmacyName}
                        onChange={(e) => setPharmacyName(e.target.value)}
                        placeholder="City Care Pharmacy"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/15 transition-all outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={18} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pharmacist@medistock.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/15 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block" htmlFor="password">
                    Password
                  </label>
                  {activeTab === 'signin' && (
                    <button
                      type="button"
                      onClick={() => alert("Password reset link will be dispatched to your email via Firebase Auth.")}
                      className="text-xs text-emerald-600 font-medium hover:underline outline-none"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/15 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {activeTab === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={18} />
                    </span>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/15 transition-all outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Terms or Remember Me */}
              {activeTab === 'signin' ? (
                <div className="flex items-center space-x-2 py-1">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs text-slate-600 cursor-pointer select-none">
                    Remember this device for 30 days
                  </label>
                </div>
              ) : (
                <div className="flex items-start space-x-2 py-1">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
                    I agree to the Terms of Service and Privacy Policy regarding clinical data HIPAA standards.
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md active:scale-[0.99] transition-all duration-150 mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{activeTab === 'signup' ? "Create Account & Register" : "Sign In to Database"}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

          </div>

        </main>

      </div>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-slate-400 py-4 mt-8 z-10 border-t border-slate-200/60">
        MediStock AI Pharmacy Management System • Designed for Academic & Clinical Operations
      </footer>

    </div>
  );
}

