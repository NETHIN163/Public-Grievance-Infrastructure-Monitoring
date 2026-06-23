import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowRight, Phone } from 'lucide-react';
import { clearError, registerUser } from '../../store/slices/authSlice';
import Alert from '../../components/Shared/Alert';
import Card from '../../components/Shared/Card';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    dispatch(clearError());

    if (form.phone.trim().length < 10) {
      setValidationError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (form.password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setValidationError("Passwords do not match. Please verify.");
      return;
    }

    // Call API to send OTP, then route to OTPVerify on success
    dispatch(registerUser(form))
      .unwrap()
      .then((data) => {
        navigate('/otp-verify', { state: { regData: form, previewUrl: data.previewUrl } });
      })
      .catch((err) => {
        setValidationError(err || "Failed to dispatch verification code.");
      });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fade-in">
      <Card>
        
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-govGreen text-white flex items-center justify-center mx-auto shadow-md">
            <UserPlus className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-govBlue font-sans">Citizen Registration</h2>
          <p className="text-[10px] text-govMatte-muted uppercase tracking-wider font-semibold">Join the Citizen Grievance Portal</p>
        </div>

        {(validationError || error) && (
          <div className="mb-4">
            <Alert type="error" message={validationError || error} onClose={() => { setValidationError(''); dispatch(clearError()); }} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold text-govMatte-text">
          
          <div className="space-y-1">
            <label htmlFor="name" className="block text-govMatte-muted">Full Name (As in identity card)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                <User className="w-4 h-4" />
              </span>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Vikram Sharma"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-govMatte-muted">Active Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="vikram@example.com"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="phone" className="block text-govMatte-muted">Phone Number (10 digits)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                <Phone className="w-4 h-4" />
              </span>
              <input
                id="phone"
                type="tel"
                required
                maxLength={15}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
                placeholder="9876543210"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="pass" className="block text-govMatte-muted">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-govMatte-muted">
                  <Lock className="w-3.5 h-3.5" />
                </span>
                <input
                  id="pass"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-4 py-2 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="confirm" className="block text-govMatte-muted">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-govMatte-muted">
                  <Lock className="w-3.5 h-3.5" />
                </span>
                <input
                  id="confirm"
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-4 py-2 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-govBlue text-white font-bold rounded-xl hover:bg-govBlue-light shadow-md shadow-govBlue/15 flex items-center justify-center space-x-2 mt-4 matte-transition"
          >
            <span>Generate Mail OTP</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="border-t border-govMatte-border/60 mt-6 pt-4 text-center">
          <p className="text-[11px] text-govMatte-muted">
            Already registered?{' '}
            <Link to="/login" className="text-govBlue font-bold hover:underline">
              Sign In Instead
            </Link>
          </p>
        </div>

      </Card>
    </div>
  );
}
