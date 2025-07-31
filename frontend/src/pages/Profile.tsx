import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FormInput, FormLabel, FormError, FormTextarea } from '../components/ui/Form';
import Avatar from '../components/ui/Avatar';
import Tabs from '../components/ui/Tabs';
import { validateEmail, validateRequired } from '../utils/validationUtils';
import axios from 'axios';

const Profile: React.FC = () => {
  const { user, updateUserProfile, updatePassword } = useAuth();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    bio: ''
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFaEnabled, setTwoFaEnabled] = useState(user?.twoFaEnabled || false);
  const [twoFaLoading, setTwoFaLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        jobTitle: user.jobTitle || '',
        bio: user.bio || ''
      });
      setTwoFaEnabled(user.twoFaEnabled || false);
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {};
    
    const firstNameError = validateRequired(profileForm.firstName);
    if (firstNameError) newErrors.firstName = firstNameError;
    
    const lastNameError = validateRequired(profileForm.lastName);
    if (lastNameError) newErrors.lastName = lastNameError;
    
    const emailError = validateRequired(profileForm.email) || validateEmail(profileForm.email);
    if (emailError) newErrors.email = emailError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setLoading(true);
    
    try {
      // In a real application, this would call an API
      await updateUserProfile(profileForm);
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile information has been updated successfully.'
      });
    } catch (error) {
      console.error('Profile update error:', error);
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'There was an error updating your profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setLoading(true);
    
    try {
      // In a real application, this would call an API
      await updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      addToast({
        type: 'success',
        title: 'Password Updated',
        message: 'Your password has been updated successfully.'
      });
    } catch (error) {
      console.error('Password update error:', error);
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'There was an error updating your password. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2fa = async () => {
    setTwoFaLoading(true);
    try {
      await axios.post('/api/users/me/enable-2fa');
      setTwoFaEnabled(true);
      addToast({ type: 'success', title: '2FA Enabled', message: 'Two-factor authentication is now enabled.' });
    } catch (e) {
      addToast({ type: 'error', title: '2FA Error', message: 'Failed to enable 2FA.' });
    } finally {
      setTwoFaLoading(false);
    }
  };
  const handleDisable2fa = async () => {
    setTwoFaLoading(true);
    try {
      await axios.post('/api/users/me/disable-2fa');
      setTwoFaEnabled(false);
      addToast({ type: 'success', title: '2FA Disabled', message: 'Two-factor authentication is now disabled.' });
    } catch (e) {
      addToast({ type: 'error', title: '2FA Error', message: 'Failed to disable 2FA.' });
    } finally {
      setTwoFaLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'password', label: 'Change Password' },
    { id: 'preferences', label: 'Preferences' },
  ];

  return (
    <Layout>
      <div className="py-6">
        <div className="mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>
        
        <div className="mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar 
                      size="xl" 
                      src={user?.avatarUrl} 
                    />
                    <button 
                      className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 text-white hover:bg-blue-700"
                      title="Change profile picture"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{user?.jobTitle}</p>
                  <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                  
                  <div className="mt-6 w-full">
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Account Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Member since</span>
                          <span className="text-sm text-gray-900">Jan 1, 2023</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Last login</span>
                          <span className="text-sm text-gray-900">Today at 10:30 AM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Role</span>
                          <span className="text-sm text-gray-900">Administrator</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Profile Content */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <Tabs 
                  tabs={tabs} 
                  activeTab={activeTab} 
                  onChange={setActiveTab} 
                />
                
                <div className="p-6">
                  {activeTab === 'profile' && (
                    <form onSubmit={handleProfileSubmit}>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <FormLabel htmlFor="firstName">First name</FormLabel>
                            <FormInput
                              id="firstName"
                              name="firstName"
                              type="text"
                              value={profileForm.firstName}
                              onChange={handleProfileChange}
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
                              value={profileForm.lastName}
                              onChange={handleProfileChange}
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
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            error={errors.email}
                          />
                          {errors.email && <FormError>{errors.email}</FormError>}
                        </div>
                        
                        <div>
                          <FormLabel htmlFor="phone">Phone number</FormLabel>
                          <FormInput
                            id="phone"
                            name="phone"
                            type="tel"
                            value={profileForm.phone}
                            onChange={handleProfileChange}
                          />
                        </div>
                        
                        <div>
                          <FormLabel htmlFor="jobTitle">Job title</FormLabel>
                          <FormInput
                            id="jobTitle"
                            name="jobTitle"
                            type="text"
                            value={profileForm.jobTitle}
                            onChange={handleProfileChange}
                          />
                        </div>
                        
                        <div>
                          <FormLabel htmlFor="bio">Bio</FormLabel>
                          <FormTextarea
                            id="bio"
                            name="bio"
                            rows={4}
                            value={profileForm.bio}
                            onChange={handleProfileChange}
                            placeholder="A brief description about yourself"
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            isLoading={loading}
                            disabled={loading}
                          >
                            Save changes
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                  
                  {activeTab === 'password' && (
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="space-y-6">
                        <div>
                          <FormLabel htmlFor="currentPassword">Current password</FormLabel>
                          <FormInput
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            error={errors.currentPassword}
                          />
                          {errors.currentPassword && <FormError>{errors.currentPassword}</FormError>}
                        </div>
                        
                        <div>
                          <FormLabel htmlFor="newPassword">New password</FormLabel>
                          <FormInput
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            error={errors.newPassword}
                          />
                          {errors.newPassword && <FormError>{errors.newPassword}</FormError>}
                          <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
                        </div>
                        
                        <div>
                          <FormLabel htmlFor="confirmPassword">Confirm new password</FormLabel>
                          <FormInput
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            error={errors.confirmPassword}
                          />
                          {errors.confirmPassword && <FormError>{errors.confirmPassword}</FormError>}
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            isLoading={loading}
                            disabled={loading}
                          >
                            Update password
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                  
                  {activeTab === 'preferences' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="email-notifications"
                                name="email-notifications"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                defaultChecked
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="email-notifications" className="font-medium text-gray-700">Email notifications</label>
                              <p className="text-gray-500">Receive email notifications for important updates and activities.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="marketing-emails"
                                name="marketing-emails"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="marketing-emails" className="font-medium text-gray-700">Marketing emails</label>
                              <p className="text-gray-500">Receive emails about new features, promotions, and updates.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="browser-notifications"
                                name="browser-notifications"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                defaultChecked
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="browser-notifications" className="font-medium text-gray-700">Browser notifications</label>
                              <p className="text-gray-500">Receive browser notifications for real-time updates.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Display Preferences</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Theme</label>
                            <select
                              id="theme"
                              name="theme"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                              defaultValue="system"
                            >
                              <option value="light">Light</option>
                              <option value="dark">Dark</option>
                              <option value="system">System default</option>
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
                            <select
                              id="language"
                              name="language"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                              defaultValue="en"
                            >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Two-Factor Authentication (2FA)</span>
                          {twoFaEnabled ? (
                            <Button onClick={handleDisable2fa} isLoading={twoFaLoading} disabled={twoFaLoading} variant="danger">Disable 2FA</Button>
                          ) : (
                            <Button onClick={handleEnable2fa} isLoading={twoFaLoading} disabled={twoFaLoading}>Enable 2FA</Button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Protect your account with an extra layer of security. When enabled, you will be required to enter a code sent to your email during login.</p>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>
                          Save preferences
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;