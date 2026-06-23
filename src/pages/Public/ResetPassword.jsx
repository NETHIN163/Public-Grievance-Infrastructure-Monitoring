import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { resetPassword, clearError } from '../../store/slices/authSlice';
import { addAuditLog } from '../../store/slices/securitySlice';
import Alert from '../../components/Shared/Alert';
import Card from '../../components/Shared/Card';

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState('');

  const { error, loading } = useSelector((state) => state.auth);

  const email = location.state?.email || null;
  const otp = location.state?.otp || null;

  useEffect(() => {
    // Clear any previous errors on mount
    dispatch(clearError());

    // Redirect to login if access credentials are not found
    if (!email || !otp) {
      setValidationError("Session expired or invalid reset context. Redirecting to forgot password...");
      const timer = setTimeout(() => navigate('/forgot-password'), 3000);
      return () => clearTimeout(timer);
    }
  }, [email, otp, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccess('');
    dispatch(clearError());

    if (newPassword.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match. Please verify.");
      return;
    }

    dispatch(resetPassword({ email, otp, newPassword, confirmPassword }))
      .unwrap()
      .then((data) => {
        setSuccess(data.message || "Password reset successful! Redirecting to login...");

        // Log audit trail
        dispatch(addAuditLog({
          userName: email,
          role: 'citizen',
          action: 'Password Recovery Completed',
          oldValue: 'Password: Reset Pending',
          newValue: 'Password: Reset Successful'
        }));

        setTimeout(() => navigate('/login'), 3000);
      })
      .catch((err) => {
        setValidationError(err || "Failed to reset password. Please try again.");
      });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 animate-fade-in">
      <Card className="shadow-lg">
        
        {/* Crest & Title */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-govBlue text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-govBlue">Set New Password</h2>
          <p className="text-[10px] text-govMatte-muted uppercase tracking-wider font-semibold">Security Update Protocol</p>
        </div>

        {(validationError || error) && (
          <div className="mb-4">
            <Alert type="error" message={validationError || error} onClose={() => { setValidationError(''); dispatch(clearError()); }} />
          </div>
        )}

        {success && (
          <div className="mb-4">
            <Alert type="success" message={success} />
          </div>
        )}

        {email && otp && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-govMatte-text">
            
            <div className="space-y-1">
              <label htmlFor="newPass" className="block text-govMatte-muted">New Secure Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="newPass"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
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

            <div className="space-y-1">
              <label htmlFor="confirmPass" className="block text-govMatte-muted">Confirm New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="confirmPass"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-govBlue text-white font-bold rounded-xl hover:bg-govBlue-light shadow-md shadow-govBlue/15 flex items-center justify-center space-x-2 mt-4 matte-transition disabled:opacity-50"
            >
              <span>{loading ? "Updating Security Credentials..." : "Update Security Credentials"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="border-t border-govMatte-border/60 mt-6 pt-4 text-center">
          <p className="text-[11px] text-govMatte-muted">
            Go back to{' '}
            <Link to="/login" className="text-govGreen font-bold hover:underline">
              Secure Sign In
            </Link>
          </p>
        </div>

      </Card>
    </div>
  );
}
