import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { FormInput, FormLabel, FormError } from '../components/ui/Form';
import { validateRequired, validateEmail } from '../utils/validationUtils';
import axios from 'axios';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [show2fa, setShow2fa] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [twoFaUsername, setTwoFaUsername] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const emailError = validateRequired(email) || validateEmail(email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validateRequired(password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Try normal login
      await login(email, password);
      addToast({ type: 'success', title: 'Login Successful', message: 'Welcome back!' });
      navigate('/dashboard');
    } catch (error: any) {
      // If 2FA required, show 2FA prompt
      if (error?.response?.data?.message?.includes('2FA code sent')) {
        setShow2fa(true);
        setTwoFaUsername(email);
        addToast({ type: 'info', title: '2FA Required', message: 'Enter the code sent to your email.' });
      } else {
        addToast({ type: 'error', title: 'Login Failed', message: 'Invalid email or password. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handle2faSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFaLoading(true);
    try {
      const res = await axios.post('/api/auth/verify-2fa', null, { params: { username: twoFaUsername, code: twoFaCode } });
      // Assume backend returns JWT and user info as usual
      await login(twoFaUsername, '2fa-bypass', res.data.jwt); // Pass JWT directly if your login supports it
      addToast({ type: 'success', title: '2FA Success', message: 'Welcome back!' });
      navigate('/dashboard');
    } catch (error) {
      addToast({ type: 'error', title: '2FA Failed', message: 'Invalid or expired 2FA code.' });
    } finally {
      setTwoFaLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {show2fa ? (
            <form className="space-y-6" onSubmit={handle2faSubmit}>
              <div>
                <FormLabel htmlFor="twoFaCode">2FA Code</FormLabel>
                <div className="mt-1">
                  <FormInput
                    id="twoFaCode"
                    name="twoFaCode"
                    type="text"
                    required
                    value={twoFaCode}
                    onChange={(e) => setTwoFaCode(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Button
                  type="submit"
                  isLoading={twoFaLoading}
                  disabled={twoFaLoading}
                >
                  Verify 2FA
                </Button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <FormLabel htmlFor="email">Email address</FormLabel>
                <div className="mt-1">
                  <FormInput
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                  />
                  {errors.email && <FormError>{errors.email}</FormError>}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <div className="mt-1">
                  <FormInput
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                  />
                  {errors.password && <FormError>{errors.password}</FormError>}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  isLoading={loading}
                  disabled={loading}
                >
                  Sign in
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <Button
                  variant="outline"
                  onClick={() => alert('Google login not implemented')}
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </Button>
              </div>

              <div>
                <Button
                  variant="outline"
                  onClick={() => alert('Microsoft login not implemented')}
                >
                  <span className="sr-only">Sign in with Microsoft</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;