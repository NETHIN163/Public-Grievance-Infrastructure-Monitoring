import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { clearError, resendOTP } from '../../store/slices/authSlice';
import { addSecurityAlert, addAuditLog } from '../../store/slices/securitySlice';
import Alert from '../../components/Shared/Alert';
import Card from '../../components/Shared/Card';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, error, users, loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // Clear any leftover auth errors when entering page
    dispatch(clearError());
    // Block browser back button from leaving login page unexpectedly
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      // Create audit log for login
      dispatch(addAuditLog({
        userName: currentUser.name,
        role: currentUser.role,
        action: 'Authentication Successful',
        oldValue: 'Session: Offline',
        newValue: `Session: Online (IP logged)`
      }));

      // Route accordingly
      if (currentUser.role === 'citizen') navigate('/citizen/dashboard');
      if (currentUser.role === 'officer') navigate('/officer/dashboard');
      if (currentUser.role === 'admin') navigate('/admin/dashboard');
    }
  }, [currentUser, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    dispatch(clearError());
    
    const userEmail = email.toLowerCase().trim();
    const foundUser = users.find(u => u.email.toLowerCase() === userEmail);
    
    let isValidUser = false;
    
    if (foundUser) {
      if (foundUser.role === 'admin' || foundUser.role === 'officer') {
        if (userEmail === 'nethin163@gmail.com' && password === '9894506871') {
          isValidUser = true;
        } else if (userEmail === 'nethraswathi17@gmail.com' && password === 'nethrasara') {
          isValidUser = true;
        }
      } else {
        // Citizen login checks
        if (foundUser.password) {
          isValidUser = foundUser.password === password;
        } else {
          isValidUser = true; // default demo citizen allows any password
        }
      }
    }
    
    if (isValidUser) {
      // Send real OTP on login using Flask API, then navigate to OTP verification
      dispatch(resendOTP(email))
        .unwrap()
        .then(() => {
          navigate('/otp-verify', { state: { resetEmail: email, password } });
        })
        .catch((err) => {
          setLoginError(err || 'Failed to dispatch verification code.');
        });
    } else {
      // Failure handling with security alerts
      const currentAttempts = failedAttempts + 1;
      setFailedAttempts(currentAttempts);
      if (currentAttempts >= 3) {
        dispatch(addSecurityAlert({
          user: email || 'anonymous',
          activity: `Brute Force Suspected (${currentAttempts} failed logins)`,
          riskLevel: 'High',
          details: `Repetitive wrong passwords submitted. Security protocol triggered.`
        }));
      } else {
        dispatch(addSecurityAlert({
          user: email || 'anonymous',
          activity: 'Failed Login Attempt (Password mismatch)',
          riskLevel: 'Low',
          details: `Invalid login parameters recorded.`
        }));
      }
      setLoginError("Invalid credentials. Please verify and try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 animate-fade-in">
      <Card className="shadow-lg">
        
        {/* Crest & Title */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-govBlue text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-govBlue">Portal Authentication</h2>
          <p className="text-[10px] text-govMatte-muted uppercase tracking-wider font-semibold">Government of India Secure Access</p>
        </div>

        {(loginError || error) && (
          <div className="mb-4">
            <Alert type="error" message={loginError || error} onClose={() => { setLoginError(''); dispatch(clearError()); }} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-govMatte-text">
          
          <div className="space-y-1">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
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
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium text-xs"
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
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-govBlue border-govMatte-border rounded focus:ring-0"
            />
            <label htmlFor="remember-me" className="ml-2 block text-[11px] text-govMatte-muted font-bold select-none cursor-pointer">
              Remember my credentials on this device
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-govBlue text-white font-bold rounded-xl hover:bg-govBlue-light shadow-md shadow-govBlue/15 flex items-center justify-center space-x-2 matte-transition disabled:opacity-50 disabled:cursor-not-allowed"
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
