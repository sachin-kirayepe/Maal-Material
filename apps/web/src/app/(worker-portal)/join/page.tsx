"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Phone, ShieldCheck, UserCircle, Briefcase, CreditCard, CheckCircle2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export default function WorkerJoinPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  
  // Profile State
  const [name, setName] = useState("");
  const [skillType, setSkillType] = useState("HELPER");
  const [aadharNumber, setAadharNumber] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mobile.length < 10) return setError("Please enter a valid 10-digit mobile number");
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/workers/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) return setError("OTP must be 6 digits");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/workers/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");
      setToken(data.token);
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Name is required");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/workers/auth/self-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, token, name, skillType, aadharNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setStep(4);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="w-full">
      {/* Progress Indicator */}
      {step < 4 && (
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-neutral-200 text-neutral-400'}`}>1</div>
            <span className="text-xs font-medium text-neutral-500">Phone</span>
          </div>
          <div className={`flex-1 h-1 mx-2 rounded ${step >= 2 ? 'bg-orange-600' : 'bg-neutral-200'}`} />
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-neutral-200 text-neutral-400'}`}>2</div>
            <span className="text-xs font-medium text-neutral-500">OTP</span>
          </div>
          <div className={`flex-1 h-1 mx-2 rounded ${step >= 3 ? 'bg-orange-600' : 'bg-neutral-200'}`} />
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-orange-600 text-white' : 'bg-neutral-200 text-neutral-400'}`}>3</div>
            <span className="text-xs font-medium text-neutral-500">Profile</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-start gap-3 shadow-sm">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden relative p-6 sm:p-8">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: MOBILE */}
          {step === 1 && (
            <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <Phone className="w-6 h-6 text-orange-600" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">Welcome! Join the network</h1>
              <p className="text-neutral-500 mb-8 leading-relaxed">Enter your mobile number to get started. We will send you a 6-digit verification code.</p>
              
              <form onSubmit={handleSendOtp}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-neutral-500">+91</span>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-neutral-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 text-lg font-bold outline-none transition-all"
                      placeholder="9999999999"
                      autoFocus
                    />
                  </div>
                </div>
                <button 
                  disabled={loading || mobile.length < 10}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-600/30"
                >
                  {loading ? "Sending..." : "Send Verification Code"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-orange-600" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">Verify Mobile</h1>
              <p className="text-neutral-500 mb-8 leading-relaxed">We sent a 6-digit code to <span className="font-bold text-neutral-800">+91 {mobile}</span>. (Hint: use 123456)</p>
              
              <form onSubmit={handleVerifyOtp}>
                <div className="mb-8">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full text-center tracking-[1em] px-4 py-4 rounded-xl border-2 border-neutral-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 text-2xl font-bold outline-none transition-all"
                    placeholder="------"
                    autoFocus
                  />
                </div>
                <button 
                  disabled={loading || otp.length < 6}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-600/30"
                >
                  {loading ? "Verifying..." : "Verify & Continue"}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="w-full mt-4 py-3 text-neutral-500 font-semibold hover:text-neutral-800 transition-colors"
                >
                  Change Mobile Number
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 3: PROFILE SETUP */}
          {step === 3 && (
            <motion.div key="step3" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">Complete Your Profile</h1>
              <p className="text-neutral-500 mb-6 leading-relaxed">Tell contractors who you are and what you do.</p>
              
              <form onSubmit={handleRegister}>
                <div className="space-y-5 mb-8">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
                      <UserCircle className="w-4 h-4" /> Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-neutral-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 font-medium outline-none transition-all"
                      placeholder="e.g. Ramesh Kumar"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
                      <Briefcase className="w-4 h-4" /> Primary Skill
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["MASON", "ELECTRICIAN", "PLUMBER", "WELDER", "PAINTER", "HELPER"].map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => setSkillType(skill)}
                          className={`py-3 px-2 text-sm font-bold rounded-xl border-2 transition-all ${skillType === skill ? 'border-orange-600 bg-orange-50 text-orange-700' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
                      <CreditCard className="w-4 h-4" /> Aadhar Number <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={aadharNumber}
                      onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-neutral-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 font-medium outline-none transition-all"
                      placeholder="12 digit ID number"
                    />
                  </div>
                </div>

                <button 
                  disabled={loading || !name}
                  className="w-full bg-neutral-900 hover:bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/20"
                >
                  {loading ? "Creating Profile..." : "Create Profile & Join"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <motion.div key="step4" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-extrabold text-neutral-900 mb-3">Registration Successful!</h1>
              <p className="text-neutral-600 mb-8 text-lg">
                Your profile as a <strong>{skillType}</strong> has been verified and listed on Maal-Material. Contractors will now be able to assign you to projects.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold py-4 rounded-xl flex items-center justify-center transition-colors"
              >
                Register Another Worker
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
