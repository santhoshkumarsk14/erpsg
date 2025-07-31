import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { FormInput, FormLabel, FormError, FormSelect } from '../components/ui/Form';
import { 
  validateRequired, 
  validateEmail, 
  validateMinLength, 
  validateMatch 
} from '../utils/validationUtils';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    industry: '',
    employeeCount: '1-10'
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    const firstNameError = validateRequired(formData.firstName);
    if (firstNameError) newErrors.firstName = firstNameError;
    
    const lastNameError = validateRequired(formData.lastName);
    if (lastNameError) newErrors.lastName = lastNameError;
    
    const emailError = validateRequired(formData.email) || validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validateRequired(formData.password) || 
                          validateMinLength(formData.password, 8);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmPasswordError = validateRequired(formData.confirmPassword) || 
                                validateMatch(formData.confirmPassword, formData.password);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    const companyNameError = validateRequired(formData.companyName);
    if (companyNameError) newErrors.companyName = companyNameError;
    
    const industryError = validateRequired(formData.industry);
    if (industryError) newErrors.industry = industryError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setLoading(true);
    
    try {
      // In a real application, this would call an API
      await register(formData);
      addToast({
        type: 'success',
        title: 'Registration Successful',
        message: 'Your account has been created!'
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      addToast({
        type: 'error',
        title: 'Registration Failed',
        message: 'There was an error creating your account. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const industries = [
    { value: '', label: 'Select an industry' },
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'construction', label: 'Construction' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'other', label: 'Other' }
  ];

  const employeeCounts = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501+', label: '501+ employees' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <div className={`h-2 w-1/2 ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'} rounded-l`}></div>
              <div className={`h-2 w-1/2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'} rounded-r`}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Account Information</span>
              <span>Company Details</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormLabel htmlFor="firstName">First name</FormLabel>
                    <FormInput
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      error={errors.firstName}
                    />
                    {errors.firstName && <FormError>{errors.firstName}</FormError>}
                  </div>

                  <div>
                    <FormLabel htmlFor="lastName">Last name</FormLabel>
                    <FormInput
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      error={errors.lastName}
                    />
                    {errors.lastName && <FormError>{errors.lastName}</FormError>}
                  </div>
                </div>

                <div>
                  <FormLabel htmlFor="email">Email address</FormLabel>
                  <FormInput
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                  {errors.email && <FormError>{errors.email}</FormError>}
                </div>

                <div>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormInput
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                  />
                  {errors.password && <FormError>{errors.password}</FormError>}
                  <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
                </div>

                <div>
                  <FormLabel htmlFor="confirmPassword">Confirm password</FormLabel>
                  <FormInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                  />
                  {errors.confirmPassword && <FormError>{errors.confirmPassword}</FormError>}
                </div>

                <div>
                  <Button
                    type="button"
                    onClick={handleNextStep}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <FormLabel htmlFor="companyName">Company name</FormLabel>
                  <FormInput
                    id="companyName"
                    name="companyName"
                    type="text"
                    autoComplete="organization"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    error={errors.companyName}
                  />
                  {errors.companyName && <FormError>{errors.companyName}</FormError>}
                </div>

                <div>
                  <FormLabel htmlFor="industry">Industry</FormLabel>
                  <FormSelect
                    id="industry"
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleChange}
                    error={errors.industry}
                    options={industries}
                  />
                  {errors.industry && <FormError>{errors.industry}</FormError>}
                </div>

                <div>
                  <FormLabel htmlFor="employeeCount">Number of employees</FormLabel>
                  <FormSelect
                    id="employeeCount"
                    name="employeeCount"
                    required
                    value={formData.employeeCount}
                    onChange={handleChange}
                    error={errors.employeeCount}
                    options={employeeCounts}
                  />
                  {errors.employeeCount && <FormError>{errors.employeeCount}</FormError>}
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    isLoading={loading}
                    disabled={loading}
                    className="flex-1"
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;