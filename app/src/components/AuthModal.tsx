import React, { useState } from 'react';
import { 
  User as UserIcon, Lock, Mail, Building, MapPin, 
  ShieldCheck, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, 
  KeyRound, HelpCircle, X, ShieldAlert, GraduationCap,
  BookOpen, Phone, Hash, School
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, onClose, defaultTab = 'login' 
}) => {
  const { users, switchUser, createUser, addToast, sendEmailOtp, verifyEmail } = useApp();
  
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Comprehensive Student Registration Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regUniversity, setRegUniversity] = useState('AKTU');
  const [regCollege, setRegCollege] = useState('Institute of Engineering and Technology (IET Lucknow)');
  const [regDegree, setRegDegree] = useState('B.Tech / B.E');
  const [regBranch, setRegBranch] = useState('Computer Science & Engineering (CSE)');
  const [regAcademicYear, setRegAcademicYear] = useState('3rd Year (Junior)');
  const [regSemester, setRegSemester] = useState('Semester 5');
  const [regCampus, setRegCampus] = useState('Lucknow, Uttar Pradesh');
  const [regRollNumber, setRegRollNumber] = useState('');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());

    if (!user) {
      addToast('error', 'Login Failed', 'No account found with this email address.');
      return;
    }

    if (user.isBanned) {
      addToast('error', 'Account Banned', 'This user account is suspended by campus moderation.');
      return;
    }

    switchUser(user.id);
    addToast('success', `Welcome back, ${user.name}!`, `Logged in as ${user.role.toUpperCase()} (${user.university || 'AKTU'})`);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;

    const existing = users.find(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (existing) {
      addToast('error', 'Registration Error', 'An account with this email already exists.');
      return;
    }

    createUser({
      name: regName,
      email: regEmail.trim(),
      role: regRole,
      university: regUniversity,
      collegeName: regCollege,
      campusLocation: regCampus,
      degree: regDegree,
      branch: regBranch,
      academicYear: regAcademicYear,
      semester: regSemester,
      rollNumber: regRollNumber || `STU-${Math.floor(100000 + Math.random() * 900000)}`,
      phone: regPhone || '+91 98765 43210'
    });

    addToast(
      'success', 
      `Account Created! Welcome, ${regName}`, 
      `System personalized for ${regUniversity} (${regBranch} - ${regSemester})`
    );

    onClose();
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 1) {
      if (!forgotEmail) return;
      setIsSendingOtp(true);
      try {
        await sendEmailOtp(forgotEmail);
        setForgotStep(2);
      } finally {
        setIsSendingOtp(false);
      }
    } else if (forgotStep === 2) {
      const res = await verifyEmail(otpCode);
      if (!res.success && otpCode !== '123456') {
        return;
      }
      setForgotStep(3);
    } else if (forgotStep === 3) {
      if (!newPassword || newPassword.length < 6) {
        addToast('error', 'Password Too Short', 'Password must be at least 6 characters.');
        return;
      }
      addToast('success', 'Password Reset Complete', 'You can now sign in with your new password.');
      setTab('login');
      setForgotStep(1);
    }
  };

  const setDemoLogin = (email: string) => {
    setLoginEmail(email);
    setLoginPassword('student2026');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className={`theme-card border theme-border rounded-3xl w-full p-6 sm:p-8 relative shadow-2xl overflow-hidden theme-text-heading transition-all my-auto ${
        tab === 'register' ? 'max-w-2xl max-h-[92vh] overflow-y-auto' : 'max-w-md'
      }`}>
        
        {/* Background ambient glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 theme-text-muted hover:theme-text-heading p-2 rounded-full theme-card-sub border theme-border transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 mx-auto mb-3 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full theme-card rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <h2 className="text-xl font-bold theme-text-heading tracking-tight">
            {tab === 'login' ? 'Sign in to Study Student Shop' :
             tab === 'register' ? 'Student Registration & Academic Profile' :
             'Recover Your Account'}
          </h2>
          <p className="text-xs theme-text-muted mt-1">
            {tab === 'login' ? 'Universal portal for Students, Sellers & System Admins' :
             tab === 'register' ? 'Set up your University, Degree, Branch & Semester for tailored books & tools' :
             'Reset your student access credentials'}
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex theme-card-sub p-1 rounded-xl border theme-border mb-6 text-xs">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              tab === 'login' ? 'bg-blue-600 text-white shadow-md font-bold' : 'theme-text-muted hover:theme-text-heading'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              tab === 'register' ? 'bg-blue-600 text-white shadow-md font-bold' : 'theme-text-muted hover:theme-text-heading'
            }`}
          >
            Register Student
          </button>
          <button
            onClick={() => setTab('forgot')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              tab === 'forgot' ? 'bg-blue-600 text-white shadow-md font-bold' : 'theme-text-muted hover:theme-text-heading'
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* TAB 1: LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold theme-text-heading mb-1">
                Student / Admin Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 theme-text-muted absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@sss.edu or student@vtu.ac.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full theme-input theme-text-heading border theme-border rounded-xl pl-9 pr-3 py-2.5 text-xs placeholder:opacity-60 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold theme-text-heading">Password *</label>
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="text-[11px] text-blue-500 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 theme-text-muted absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full theme-input theme-text-heading border theme-border rounded-xl pl-9 pr-10 py-2.5 text-xs placeholder:opacity-60 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 theme-text-muted hover:theme-text-heading cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Accounts Chips */}
            <div className="pt-4 border-t theme-border">
              <div className="text-[10px] uppercase font-bold theme-text-muted mb-2 text-center">
                Instant One-Click Demo Logins
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setDemoLogin('admin@sss.edu')}
                  className="p-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 hover:bg-rose-500/25 transition-colors font-semibold truncate cursor-pointer"
                >
                  👑 Admin (AKTU)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoLogin('aarav.sharma@vtu.ac.in')}
                  className="p-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-300 hover:bg-blue-500/25 transition-colors font-semibold truncate cursor-pointer"
                >
                  🎓 Student (VTU)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoLogin('ananya.v@du.ac.in')}
                  className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/25 transition-colors font-semibold truncate cursor-pointer"
                >
                  🛍️ Seller (DU)
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: COMPREHENSIVE STUDENT REGISTRATION */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
            
            {/* Section 1: Personal Credentials */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5" />
                <span>1. Personal & Contact Details</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">Student / Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@ietlucknow.ac.in"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">Create Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: University & College Information */}
            <div className="pt-2 border-t theme-border">
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5" />
                <span>2. University & Campus Location</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">University Board / System *</label>
                  <select
                    value={regUniversity}
                    onChange={(e) => setRegUniversity(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none cursor-pointer font-medium"
                  >
                    <option value="AKTU">AKTU (Dr. APJ Abdul Kalam Tech Univ, UP)</option>
                    <option value="VTU">VTU (Visvesvaraya Tech Univ, Karnataka)</option>
                    <option value="DU">DU (University of Delhi)</option>
                    <option value="SPPU">SPPU (Savitribai Phule Pune University)</option>
                    <option value="MU">MU (Mumbai University)</option>
                    <option value="ANNA">Anna University (Tamil Nadu)</option>
                    <option value="MAKAUT">MAKAUT (West Bengal)</option>
                    <option value="JNTU">JNTU (Hyderabad / AP)</option>
                    <option value="GTU">GTU (Gujarat Technological University)</option>
                    <option value="OTHER">Other State / Central University</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">Campus City & State</label>
                  <input
                    type="text"
                    placeholder="e.g. Lucknow, UP or Bangalore, Karnataka"
                    value={regCampus}
                    onChange={(e) => setRegCampus(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold theme-text-heading mb-1">College / Institute Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Institute of Engineering and Technology (IET Lucknow) / BMS College"
                    value={regCollege}
                    onChange={(e) => setRegCollege(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Degree, Branch, Class & Semester (For System Personalization) */}
            <div className="pt-2 border-t theme-border">
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>3. Academic Program & Class / Semester</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">Degree Program</label>
                  <select
                    value={regDegree}
                    onChange={(e) => setRegDegree(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                  >
                    <option value="B.Tech / B.E">B.Tech / B.E (Engineering)</option>
                    <option value="B.Com / M.Com">B.Com / M.Com (Commerce)</option>
                    <option value="BCA / MCA">BCA / MCA (Computer Applications)</option>
                    <option value="B.Sc / M.Sc">B.Sc / M.Sc (Basic Sciences)</option>
                    <option value="MBA">MBA (Business Administration)</option>
                    <option value="MBBS / BDS">MBBS / BDS (Medical)</option>
                    <option value="BA / LLB">BA / LLB (Humanities & Law)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">Branch / Major Specialization</label>
                  <select
                    value={regBranch}
                    onChange={(e) => setRegBranch(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                  >
                    <option value="Computer Science & Engineering (CSE)">Computer Science & Engineering (CSE)</option>
                    <option value="Information Technology (IT)">Information Technology (IT)</option>
                    <option value="Electronics & Communication (ECE)">Electronics & Communication (ECE)</option>
                    <option value="Mechanical Engineering (ME)">Mechanical Engineering (ME)</option>
                    <option value="Civil Engineering (CE)">Civil Engineering (CE)</option>
                    <option value="Electrical & Electronics (EEE)">Electrical & Electronics (EEE)</option>
                    <option value="Commerce & Accounting">Commerce & Accounting</option>
                    <option value="Management & Finance">Management & Finance</option>
                    <option value="General Sciences">General Sciences</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">Class / Academic Year</label>
                  <select
                    value={regAcademicYear}
                    onChange={(e) => setRegAcademicYear(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                  >
                    <option value="1st Year (Fresher)">1st Year (Fresher)</option>
                    <option value="2nd Year (Sophomore)">2nd Year (Sophomore)</option>
                    <option value="3rd Year (Junior)">3rd Year (Junior)</option>
                    <option value="4th Year (Senior)">4th Year (Senior)</option>
                    <option value="5th Year / PG">5th Year / PG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">Current Semester</label>
                  <select
                    value={regSemester}
                    onChange={(e) => setRegSemester(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">University Roll Number / ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 2200520100045"
                    value={regRollNumber}
                    onChange={(e) => setRegRollNumber(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">Account Role</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none cursor-pointer font-medium"
                  >
                    <option value="student">🎓 Student (Buyer & Learner)</option>
                    <option value="verified_seller">🛍️ Verified Campus Seller (List Books)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Personalized Setup Banner */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/25 rounded-xl text-xs text-blue-600 dark:text-blue-300">
              💡 <b>Automatic Personalization:</b> Your syllabus textbooks, CGPA calculation formulas ({regUniversity}), and local campus peer barter will automatically calibrate to <b>{regUniversity} • {regBranch} • {regSemester}</b> upon registration!
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Complete Student Registration</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 3: FORGOT PASSWORD */}
        {tab === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-left">
            {forgotStep === 1 && (
              <div>
                <label className="block text-xs font-semibold theme-text-heading mb-1">
                  Enter your registered student email:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 theme-text-muted absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@university.ac.in"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none"
                  />
                </div>
                <div className="text-[11px] theme-text-muted mt-2">
                  We will send a 6-digit verification OTP to reset your password.
                </div>
              </div>
            )}

            {forgotStep === 2 && (
              <div>
                <label className="block text-xs font-semibold theme-text-heading mb-1">
                  Enter 6-Digit Verification Code:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Enter 123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full theme-input theme-text-heading border theme-border rounded-xl px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-blue-500 dark:text-cyan-300 outline-none"
                />
                <div className="text-[11px] theme-text-muted mt-2 text-center">
                  Demo default code: <code className="text-blue-500 dark:text-cyan-400 font-bold">123456</code>
                </div>
              </div>
            )}

            {forgotStep === 3 && (
              <div>
                <label className="block text-xs font-semibold theme-text-heading mb-1">
                  Set New Secure Password:
                </label>
                <input
                  type="password"
                  required
                  placeholder="New password (min 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2.5 text-xs outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSendingOtp}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>
                {isSendingOtp ? 'Sending OTP via EmailJS...' :
                 forgotStep === 1 ? 'Send Reset OTP' : 
                 forgotStep === 2 ? 'Verify OTP Code' : 
                 'Save New Password'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
