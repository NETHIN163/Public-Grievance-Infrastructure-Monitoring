import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { KeyRound, RotateCw, ExternalLink, Mail } from 'lucide-react';
import { login, verifyOTP, resendOTP } from '../../store/slices/authSlice';
import { addSecurityAlert, addAuditLog } from '../../store/slices/securitySlice';
import Alert from '../../components/Shared/Alert';
import Card from '../../components/Shared/Card';

export default function OTPVerify() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [emailPreviewUrl, setEmailPreviewUrl] = useState(location.state?.previewUrl || null);

  const { loading } = useSelector((state) => state.auth);

  const regData = location.state?.regData || null;
  const resetEmail = location.state?.resetEmail || null;

  // Guard: If no valid state (not coming from register/login), redirect to home
  useEffect(() => {
    if (!regData && !resetEmail) {
      navigate('/', { replace: true });
      return;
    }
    // Block browser back button — push a dummy history entry so back goes nowhere harmful
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [regData, resetEmail, navigate]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6 || isNaN(otp)) {
      setError("Please enter a valid 6-digit numeric OTP.");
      return;
    }

    const emailToVerify = regData ? regData.email : resetEmail;

    // Dispatch Flask Verify OTP Thunk
    dispatch(verifyOTP({ email: emailToVerify, otp }))
      .unwrap()
      .then(() => {
        // Verification success!
        if (regData) {
          // New Citizen Registration flow
          dispatch(addAuditLog({
            userName: regData.name,
            role: 'citizen',
            action: 'OTP Validation Approved',
            oldValue: 'Status: Awaiting OTP',
            newValue: 'Status: Account Activated'
          }));
          navigate('/citizen/dashboard');
        } else {
          // Login or Password Reset flow
          const password = location.state?.password;
          if (password) {
            // This is a Login flow - dispatch local login action to update Redux session
            dispatch(login({ email: resetEmail, password }));
            
            const lowerEmail = resetEmail.toLowerCase();
            dispatch(addAuditLog({
              userName: resetEmail,
              role: (lowerEmail === 'nethin163@gmail.com' || lowerEmail === 'admin@gov.in') ? 'admin' : 
                    ((lowerEmail === 'nethraswathi17@gmail.com' || lowerEmail.includes('officer')) ? 'officer' : 'citizen'),
              action: 'Authentication Successful',
              oldValue: 'Session: Offline',
              newValue: 'Session: Online (IP logged)'
            }));

            if (lowerEmail === 'nethin163@gmail.com' || lowerEmail === 'admin@gov.in') {
              navigate('/admin/dashboard');
            } else if (lowerEmail === 'nethraswathi17@gmail.com' || lowerEmail.includes('officer')) {
              navigate('/officer/dashboard');
            } else {
              navigate('/citizen/dashboard');
            }
          } else {
            // Forgot Password Verification Success
            dispatch(addAuditLog({
              userName: resetEmail,
              role: 'citizen',
              action: 'Password Recovery OTP Approved',
              oldValue: 'Password: Forgotten',
              newValue: 'Password: OTP Verified'
            }));
            
            setSuccess("Verification successful. Redirecting to reset password page...");
            setTimeout(() => navigate('/reset-password', { state: { email: resetEmail, otp } }), 1500);
          }
        }
      })
      .catch((err) => {
        setError(err || "Invalid verification code. Please check and try again.");
        // Log security threat
        dispatch(addSecurityAlert({
          user: emailToVerify || 'anonymous',
          activity: 'Failed OTP Verification',
          riskLevel: 'Medium',
          details: `Submitted wrong OTP: ${otp}`
        }));
      });
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      const emailToVerify = regData ? regData.email : resetEmail;
      dispatch(resendOTP(emailToVerify))
        .unwrap()
        .then((data) => {
          setResendTimer(30);
          setSuccess(data.message || "A fresh 6-digit security code has been transmitted to your email inbox.");
          setTimeout(() => setSuccess(''), 5000);

          // Update the preview URL if a new one is provided
          if (data.previewUrl) {
            setEmailPreviewUrl(data.previewUrl);
          }
          
          dispatch(addAuditLog({
            userName: emailToVerify || 'anonymous',
            role: 'public',
            action: 'OTP Resend Requested',
            oldValue: 'OTP State: Expired',
            newValue: 'OTP State: Renewed'
          }));
        })
        .catch((err) => {
          setError(err || "Failed to resend verification code.");
        });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 animate-fade-in">
      <Card>
        
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-govBlue">OTP Security Verification</h2>
          <p className="text-[10px] text-govMatte-muted uppercase tracking-wider font-semibold">
            {regData ? `Code transmitted to ${regData.email}` : `Code transmitted to ${resetEmail}`}
          </p>
        </div>

        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        {success && (
          <div className="mb-4">
            <Alert type="success" message={success} />
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4 text-xs font-semibold text-govMatte-text">
          
          <div className="space-y-1 text-center">
            <label htmlFor="otp" className="block text-govMatte-muted text-xs mb-2">Enter 6-Digit Verification Code</label>
            <input
              id="otp"
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="0 0 0 0 0 0"
              className="w-48 text-center px-4 py-3 text-lg tracking-[0.75em] rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-bold mx-auto block"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-govBlue text-white font-bold rounded-xl hover:bg-govBlue-light shadow-md shadow-govBlue/15 flex items-center justify-center space-x-2 mt-4 matte-transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? "Confirming..." : "Confirm Verification"}</span>
          </button>
        </form>

        <div className="border-t border-govMatte-border/60 mt-6 pt-4 flex items-center justify-between text-[11px]">
          <span className="text-govMatte-muted font-bold">Didn't receive email?</span>
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className={`font-bold flex items-center space-x-1 ${
              resendTimer > 0 ? 'text-govMatte-muted cursor-not-allowed' : 'text-govGreen hover:underline'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${resendTimer > 0 ? '' : 'animate-spin'}`} />
            <span>{resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Now'}</span>
          </button>
        </div>

        {/* Email Preview Link — shows when using Ethereal test email */}
        {emailPreviewUrl && (
          <div className="mt-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-900">📧 Your OTP Email is Ready</span>
            </div>
            <p className="text-[11px] text-blue-800 mb-3 leading-relaxed">
              Click the button below to open your verification email and find your 6-digit OTP code:
            </p>
            <a
              href={emailPreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-xs shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open OTP Email</span>
            </a>
            <p className="text-[10px] text-blue-600/70 mt-2 text-center">
              Opens in a new tab — copy the 6-digit code and paste it above
            </p>
          </div>
        )}

        {/* Fallback hint when no preview URL (real SMTP was used) */}
        {!emailPreviewUrl && (
          <div className="mt-5 p-3 bg-green-50/70 border border-green-100/50 rounded-xl text-[10px] text-green-900 text-center">
            <Mail className="w-4 h-4 mx-auto mb-1 text-green-600" />
            Check your email inbox (and spam folder) for the 6-digit verification code.
          </div>
        )}

      </Card>
    </div>
  );
}
