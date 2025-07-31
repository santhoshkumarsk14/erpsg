import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { FormInput, FormLabel, FormError } from '../components/ui/Form';
import { 
  validateRequired, 
  validateMinLength, 
  validateMatch 
} from '../utils/validationUtils';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [token, setToken] = useState('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [tokenChecking, setTokenChecking] = useState(true);

  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get('token');
    
    if (!resetToken) {
      setTokenValid(false);
      setTokenChecking(false);
      addToast({
        type: 'error',
        title: 'Invalid Link',
        message: 'The password reset link is invalid or has expired.'
      });
      return;
    }
    
    setToken(resetToken);
    
    // In a real application, verify the token with an API call
    const verifyToken = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, we'll consider the token valid
        setTokenValid(true);
      } catch (error) {
        console.error('Token verification error:', error);
        setTokenValid(false);
        addToast({
          type: 'error',
          title: 'Invalid Link',
          message: 'The password reset link is invalid or has expired.'
        });
      } finally {
        setTokenChecking(false);
      }
    };
    
    verifyToken();
  }, [location.search, addToast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const passwordError = validateRequired(password) || 
                          validateMinLength(password, 8);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmPasswordError = validateRequired(confirmPassword) || 
                                validateMatch(confirmPassword, password);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // In a real application, this would call an API
      // await api.post('/auth/reset-password', { token, password });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addToast({
        type: 'success',
        title: 'Password Reset',
        message: 'Your password has been successfully reset.'
      });
      navigate('/login');
    } catch (error) {
      console.error('Password reset error:', error);
      addToast({
        type: 'error',
        title: 'Reset Failed',
        message: 'There was an error resetting your password. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (tokenChecking) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Verifying your reset link...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="rounded-full bg-red-100 p-3 mx-auto w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Invalid or Expired Link</h3>
              <p className="mt-2 text-sm text-gray-500">
                The password reset link is invalid or has expired. Please request a new password reset link.
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => navigate('/forgot-password')}
                >
                  Request New Link
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create new password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <FormLabel htmlFor="password">New password</FormLabel>
              <div className="mt-1">
                <FormInput
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                />
                {errors.password && <FormError>{errors.password}</FormError>}
                <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
              </div>
            </div>

            <div>
              <FormLabel htmlFor="confirmPassword">Confirm new password</FormLabel>
              <div className="mt-1">
                <FormInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                />
                {errors.confirmPassword && <FormError>{errors.confirmPassword}</FormError>}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                isLoading={loading}
                disabled={loading}
              >
                Reset password
              </Button>
            </div>

            <div className="text-center">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 text-sm">
                Return to sign in
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;