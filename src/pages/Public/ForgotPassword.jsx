import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Key, ArrowRight } from 'lucide-react';
import { forgotPassword, clearError } from '../../store/slices/authSlice';
import Card from '../../components/Shared/Card';
import Alert from '../../components/Shared/Alert';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError("Please input a registered email address.");
      return;
    }

    dispatch(forgotPassword(email))
      .unwrap()
      .then((data) => {
        // Go to OTP verify carrying email context and preview URL
        navigate('/otp-verify', { state: { resetEmail: email, previewUrl: data.previewUrl } });
      })
      .catch((err) => {
        setError(err || "Failed to initialize password recovery.");
      });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 animate-fade-in">
      <Card>
        
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-govBlue text-white flex items-center justify-center mx-auto shadow-md">
            <Key className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-govBlue">Recover Account Password</h2>
          <p className="text-[10px] text-govMatte-muted uppercase tracking-wider font-semibold">Security Verification Loop</p>
        </div>

        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} onClose={() => setError('')} />
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
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-govBlue text-white font-bold rounded-xl hover:bg-govBlue-light shadow-md shadow-govBlue/15 flex items-center justify-center space-x-2 mt-4 matte-transition disabled:opacity-50"
          >
            <span>{loading ? "Transmitting..." : "Transmit Recovery Code"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-govMatte-border/60 mt-6 pt-4 text-center">
          <p className="text-[11px] text-govMatte-muted">
            Remembered credentials?{' '}
            <Link to="/login" className="text-govGreen font-bold hover:underline">
              Back to Login
            </Link>
          </p>
        </div>

      </Card>
    </div>
  );
}

