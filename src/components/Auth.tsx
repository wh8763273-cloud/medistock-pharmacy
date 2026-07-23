import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, PlusCircle, Building2, ShieldCheck, ArrowRight } from 'lucide-react';
import { loginUser, registerUser, guestLogin } from '../firebase';

interface AuthProps {
  onAuthSuccess: () => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser(email, password);
        onAuthSuccess();
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        await registerUser(email, password, fullName, pharmacyName);
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
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#dce9ff] rounded-full blur-[130px] opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-[#d3e4fe] rounded-full blur-[130px] opacity-60 pointer-events-none"></div>

      <main className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-[#c3c6d7]/40 overflow-hidden grid md:grid-cols-2 animate-in fade-in zoom-in-95 duration-500 relative z-10">
        
        {/* Left Side: Brand Highlight (Visible on MD and larger) */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-[#e5eeff] text-[#004ac6] relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-[#004ac6] text-white rounded-lg">
                <ShieldCheck size={28} className="fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#004ac6]">MediStock</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#0b1c30] mb-4 leading-tight">
              Advanced Inventory Control for Modern Pharmacies
            </h2>
            <p className="text-[#434655] text-sm leading-relaxed max-w-[340px]">
              Join healthcare professionals managing medical inventories, tracking sales, and leveraging AI assistants for clinical accuracy.
            </p>
          </div>

          {/* Bento Features highlights */}
          <div className="grid grid-cols-2 gap-4 z-10 mt-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#c3c6d7]/30">
              <span className="text-[#006c49] font-bold text-xs flex items-center gap-1 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
                ACTIVE
              </span>
              <p className="font-semibold text-xs text-[#0b1c30]">Real-time Tracking</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#c3c6d7]/30">
              <span className="text-[#784b00] font-bold text-xs flex items-center gap-1 mb-1">
                ⭐ SMART
              </span>
              <p className="font-semibold text-xs text-[#0b1c30]">AI Assist Core</p>
            </div>
          </div>

          {/* Abstract background graphics */}
          <div className="absolute right-[-10%] bottom-[-10%] w-[240px] h-[240px] border-[16px] border-[#004ac6]/10 rounded-full pointer-events-none"></div>
          <div className="absolute left-[10%] top-[40%] w-[120px] h-[120px] border-[8px] border-[#006c49]/5 rounded-xl rotate-45 pointer-events-none"></div>
        </div>

        {/* Right Side: Interactive Forms */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto">
            
            {/* Header section with Dynamic Titles */}
            <header className="mb-8 text-center md:text-left">
              <div className="flex justify-center md:justify-start items-center gap-2 mb-4 md:hidden">
                <div className="p-1.5 bg-[#004ac6] text-white rounded-lg">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-lg font-bold text-[#004ac6]">MediStock</span>
              </div>
              <h2 className="text-2xl font-bold text-[#0b1c30]">
                {isLogin ? "Sign In" : "Create Account"}
              </h2>
              <p className="text-[#434655] text-sm mt-1">
                {isLogin ? "Welcome back! Enter your pharmacy credentials." : "Get started with your secure pharmacy database."}
              </p>
            </header>

            {error && (
              <div className="mb-6 p-4 bg-[#ffdad6] border-l-4 border-[#ba1a1a] text-[#93000a] text-xs rounded-r-lg font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {!isLogin && (
                <>
                  {/* Full Name field for Sign Up */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#434655] uppercase tracking-wider block" htmlFor="fullName">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]">
                        <User size={18} />
                      </span>
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. John Doe"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9ff] border border-[#c3c6d7] rounded-lg text-sm focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Pharmacy Name field for Sign Up */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#434655] uppercase tracking-wider block" htmlFor="pharmacyName">
                      Pharmacy Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]">
                        <Building2 size={18} />
                      </span>
                      <input
                        id="pharmacyName"
                        type="text"
                        required
                        value={pharmacyName}
                        onChange={(e) => setPharmacyName(e.target.value)}
                        placeholder="Apex Health Rx"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9ff] border border-[#c3c6d7] rounded-lg text-sm focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15 transition-all outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#434655] uppercase tracking-wider block" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]">
                    <Mail size={18} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pharmacist@medistock.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9ff] border border-[#c3c6d7] rounded-lg text-sm focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-[#434655] uppercase tracking-wider block" htmlFor="password">
                    Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => alert("Check your local storage demo, or reset via real Firebase Auth connection if configured.")}
                      className="text-xs text-[#004ac6] font-medium hover:underline outline-none"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]">
                    <Lock size={18} />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-2.5 bg-[#f8f9ff] border border-[#c3c6d7] rounded-lg text-sm focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#434655] outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                /* Confirm Password for sign up */
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#434655] uppercase tracking-wider block" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]">
                      <Lock size={18} />
                    </span>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9ff] border border-[#c3c6d7] rounded-lg text-sm focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15 transition-all outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Remember Me or HIPAA Checkbox */}
              {isLogin ? (
                <div className="flex items-center space-x-2 py-1">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6]/20 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs text-[#434655] cursor-pointer select-none">
                    Remember this device for 30 days
                  </label>
                </div>
              ) : (
                <div className="flex items-start space-x-2 py-1">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="w-4 h-4 mt-0.5 rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6]/20 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-[#434655] leading-relaxed cursor-pointer select-none">
                    I agree to the <span className="text-[#004ac6] underline hover:text-[#2563eb]">Terms of Service</span> and <span className="text-[#004ac6] underline hover:text-[#2563eb]">Privacy Policy</span> regarding clinical data HIPAA compliance.
                  </label>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#004ac6] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#2563eb] shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-150 mt-4 flex items-center justify-center gap-2 group cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isLogin ? "Login" : "Register"}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-3">
              <div className="h-[1px] flex-1 bg-[#c3c6d7]/50"></div>
              <span className="text-[10px] font-bold text-[#737686] uppercase tracking-wider">SECURE END-TO-END DATA</span>
              <div className="h-[1px] flex-1 bg-[#c3c6d7]/50"></div>
            </div>

            {/* Switch Mode Footer */}
            <footer className="mt-8 text-center border-t border-[#c3c6d7]/30 pt-6">
              <p className="text-sm text-[#434655]">
                {isLogin ? "New to MediStock?" : "Already have a MediStock account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-[#004ac6] font-bold hover:underline ml-1.5 focus:outline-none"
                >
                  {isLogin ? "Sign Up" : "Login Here"}
                </button>
              </p>
            </footer>

          </div>
        </div>
      </main>
    </div>
  );
}
