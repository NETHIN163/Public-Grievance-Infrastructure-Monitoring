import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { clearError, resendOTP } from '../../store/slices/authSlice';
import { addSecurityAlert, addAuditLog } from '../../store/slices/securitySlice';
import Alert from '../../components/Shared/Alert';
import Card from '../../components/Shared/Card';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, error, loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // Clear leftover auth errors
    dispatch(clearError());

    // Block browser back button
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      dispatch(addAuditLog({
        userName: currentUser.name,
        role: currentUser.role,
        action: 'Authentication Successful',
        oldValue: 'Session: Offline',
        newValue: `Session: Online (IP logged)`
      }));

      if (currentUser.role === 'citizen') navigate('/citizen/dashboard');
      if (currentUser.role === 'officer') navigate('/officer/dashboard');
      if (currentUser.role === 'admin') navigate('/admin/dashboard');
    }
  }, [currentUser, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    dispatch(clearError());
    
    const userEmail = email.toLowerCase().trim();

    // Step 1: Validate credentials with backend first
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        // Backend rejected credentials
        const currentAttempts = failedAttempts + 1;
        setFailedAttempts(currentAttempts);
        if (currentAttempts >= 3) {
          dispatch(addSecurityAlert({
            user: userEmail || 'anonymous',
            activity: `Brute Force Suspected (${currentAttempts} failed logins)`,
            riskLevel: 'High',
            details: `Repetitive wrong passwords submitted. Security protocol triggered.`
          }));
        } else {
          dispatch(addSecurityAlert({
            user: userEmail || 'anonymous',
            activity: 'Failed Login Attempt (Password mismatch)',
            riskLevel: 'Low',
            details: `Invalid login parameters recorded.`
          }));
        }
        setLoginError(data.error || 'Invalid credentials. Please verify and try again.');
        return;
      }

      // Step 2: Credentials valid — send OTP to user's email for 2FA
      dispatch(resendOTP(userEmail))
        .unwrap()
        .then(() => {
          navigate('/otp-verify', { state: { resetEmail: userEmail, password } });
        })
        .catch((err) => {
          setLoginError(err || 'Failed to dispatch verification code.');
        });

    } catch (err) {
      setLoginError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 animate-fade-in">
      <Card className="shadow-lg">
        
        {/* Crest & Title */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-govBlue text-white flex items-center justify-center mx-auto shadow-md transform hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-sm font-extrabold text-govGreen uppercase tracking-wider">
              NGP
            </h1>
            <h2 className="text-[13px] font-extrabold text-govBlue font-sans uppercase leading-tight tracking-wide">
              National Grievance Portal
            </h2>
            <p className="text-[10px] text-govMatte-muted uppercase tracking-widest font-bold">
              Secure Access Portal
            </p>
          </div>
        </div>

        {(loginError || error) && (
          <div className="mb-4">
            <Alert type="error" message={loginError || error} onClose={() => { setLoginError(''); dispatch(clearError()); }} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-govMatte-text">
          
          {/* Registered Email field */}
          <div className="space-y-1 text-left">
            <label htmlFor="email" className="block text-govMatte-muted">Registered Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@gov.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1 text-left">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-govMatte-muted">Account Password</label>
              <Link to="/forgot-password" className="text-[10px] text-govGreen font-bold hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium text-xs text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-govMatte-muted hover:text-govMatte-text"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center text-left">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-govBlue border-govMatte-border rounded focus:ring-0 cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 block text-[11px] text-govMatte-muted font-bold select-none cursor-pointer">
              Remember my credentials on this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-govBlue hover:bg-govBlue-light text-white font-bold rounded-xl shadow-md shadow-govBlue/15 flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
          >
            <span>{loading ? "Verifying..." : "Secure Login"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-govMatte-border/60 mt-6 pt-4 text-center">
          <p className="text-[11px] text-govMatte-muted">
            New portal user?{' '}
            <Link to="/register" className="text-govGreen font-bold hover:underline">
              Create Citizen Account
            </Link>
          </p>
        </div>

      </Card>
    </div>
  );
}
