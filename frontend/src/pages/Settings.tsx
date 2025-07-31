import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import { FormInput, FormLabel, FormSelect, FormTextarea } from '../components/ui/Form';

const Settings: React.FC = () => {
  const { company, updateCompanySettings } = useAuth();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(false);
  
  // Company form state
  const [companyForm, setCompanyForm] = useState({
    name: company?.name || '',
    address: company?.address || '',
    city: company?.city || '',
    state: company?.state || '',
    zipCode: company?.zipCode || '',
    country: company?.country || '',
    phone: company?.phone || '',
    website: company?.website || '',
    taxId: company?.taxId || '',
    logo: company?.logo || ''
  });
  
  // Invoice settings form state
  const [invoiceForm, setInvoiceForm] = useState({
    prefix: 'INV-',
    nextNumber: '0001',
    terms: 'Payment due within 30 days',
    notes: 'Thank you for your business!',
    defaultDueDays: '30',
    defaultTaxRate: '0',
    currency: 'USD'
  });
  
  // Email settings form state
  const [emailForm, setEmailForm] = useState({
    fromName: company?.name || '',
    fromEmail: '',
    smtpHost: '',
    smtpPort: '',
    smtpUsername: '',
    smtpPassword: '',
    enableSsl: true
  });

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvoiceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setEmailForm(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real application, this would call an API
      await updateCompanySettings(companyForm);
      addToast({
        type: 'success',
        title: 'Settings Updated',
        message: 'Company settings have been updated successfully.'
      });
    } catch (error) {
      console.error('Settings update error:', error);
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'There was an error updating company settings. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real application, this would call an API
      // await api.put('/settings/invoice', invoiceForm);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addToast({
        type: 'success',
        title: 'Settings Updated',
        message: 'Invoice settings have been updated successfully.'
      });
    } catch (error) {
      console.error('Settings update error:', error);
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'There was an error updating invoice settings. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real application, this would call an API
      // await api.put('/settings/email', emailForm);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addToast({
        type: 'success',
        title: 'Settings Updated',
        message: 'Email settings have been updated successfully.'
      });
    } catch (error) {
      console.error('Settings update error:', error);
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'There was an error updating email settings. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'company', label: 'Company' },
    { id: 'invoice', label: 'Invoice' },
    { id: 'email', label: 'Email' },
    { id: 'users', label: 'Users & Permissions' },
    { id: 'integrations', label: 'Integrations' },
  ];

  const currencies = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)' },
    { value: 'AUD', label: 'Australian Dollar (AUD)' },
    { value: 'JPY', label: 'Japanese Yen (JPY)' },
    { value: 'CNY', label: 'Chinese Yuan (CNY)' },
    { value: 'INR', label: 'Indian Rupee (INR)' },
  ];

  return (
    <Layout>
      <div className="py-6">
        <div className="mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your application settings
          </p>
        </div>
        
        <div className="mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <Card className="overflow-hidden">
            <Tabs 
              tabs={tabs} 
              activeTab={activeTab} 
              onChange={setActiveTab} 
            />
            
            <div className="p-6">
              {activeTab === 'company' && (
                <form onSubmit={handleCompanySubmit}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        This information will be displayed on your invoices and other documents.
                      </p>
                    </div>
                    
                    <div>
                      <FormLabel htmlFor="name">Company name</FormLabel>
                      <FormInput
                        id="name"
                        name="name"
                        type="text"
                        value={companyForm.name}
                        onChange={handleCompanyChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <FormLabel htmlFor="address">Address</FormLabel>
                      <FormTextarea
                        id="address"
                        name="address"
                        rows={3}
                        value={companyForm.address}
                        onChange={handleCompanyChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                      <div>
                        <FormLabel htmlFor="city">City</FormLabel>
                        <FormInput
                          id="city"
                          name="city"
                          type="text"
                          value={companyForm.city}
                          onChange={handleCompanyChange}
                        />
                      </div>
                      
                      <div>
                        <FormLabel htmlFor="state">State / Province</FormLabel>
                        <FormInput
                          id="state"
                          name="state"
                          type="text"
                          value={companyForm.state}
                          onChange={handleCompanyChange}
                        />
                      </div>
                      
                      <div>
                        <FormLabel htmlFor="zipCode">ZIP / Postal code</FormLabel>
                        <FormInput
                          id="zipCode"
                          name="zipCode"
                          type="text"
                          value={companyForm.zipCode}
                          onChange={handleCompanyChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <FormLabel htmlFor="country">Country</FormLabel>
                      <FormInput
                        id="country"
                        name="country"
                        type="text"
                        value={companyForm.country}
                        onChange={handleCompanyChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <FormLabel htmlFor="phone">Phone</FormLabel>
                        <FormInput
                          id="phone"
                          name="phone"
                          type="tel"
                          value={companyForm.phone}
                          onChange={handleCompanyChange}
                        />
                      </div>
                      
                      <div>
                        <FormLabel htmlFor="website">Website</FormLabel>
                        <FormInput
                          id="website"
                          name="website"
                          type="url"
                          value={companyForm.website}
                          onChange={handleCompanyChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <FormLabel htmlFor="taxId">Tax ID / VAT Number</FormLabel>
                      <FormInput
                        id="taxId"
                        name="taxId"
                        type="text"
                        value={companyForm.taxId}
                        onChange={handleCompanyChange}
                      />
                    </div>
                    
                    <div>
                      <FormLabel htmlFor="logo">Company Logo</FormLabel>
                      <div className="mt-1 flex items-center">
                        {companyForm.logo ? (
                          <div className="relative">
                            <img 
                              src={companyForm.logo} 
                              alt="Company logo" 
                              className="h-16 w-auto" 
                            />
                            <button
                              type="button"
                              className="absolute -top-2 -right-2 bg-white rounded-full p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              onClick={() => setCompanyForm(prev => ({ ...prev, logo: '' }))}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center items-center bg-gray-100 border-2 border-gray-300 border-dashed rounded-md h-16 w-32">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          className="ml-4"
                          onClick={() => alert('File upload not implemented')}
                        >
                          Upload logo
                        </Button>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Recommended size: 200x200 pixels. Max file size: 2MB.
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        isLoading={loading}
                        disabled={loading}
                      >
                        Save company settings
                      </Button>
                    </div>
                  </div>
                </form>
              )}
              
              {activeTab === 'invoice' && (
                <form onSubmit={handleInvoiceSubmit}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Invoice Settings</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Configure how your invoices are generated and displayed.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <FormLabel htmlFor="prefix">Invoice number prefix</FormLabel>
                        <FormInput
                          id="prefix"
                          name="prefix"
                          type="text"
                          value={invoiceForm.prefix}
                          onChange={handleInvoiceChange}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Example: INV-0001
                        </p>
                      </div>
                      
                      <div>
                        <FormLabel htmlFor="nextNumber">Next invoice number</FormLabel>
                        <FormInput
                          id="nextNumber"
                          name="nextNumber"
                          type="text"
                          value={invoiceForm.nextNumber}
                          onChange={handleInvoiceChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <FormLabel htmlFor="defaultDueDays">Default payment terms (days)</FormLabel>
                        <FormInput
                          id="defaultDueDays"
                          name="defaultDueDays"
                          type="number"
                          min="0"
                          value={invoiceForm.defaultDueDays}
                          onChange={handleInvoiceChange}
                        />
                      </div>
                      
                      <div>
                        <FormLabel htmlFor="defaultTaxRate">Default tax rate (%)</FormLabel>
                        <FormInput
                          id="defaultTaxRate"
                          name="defaultTaxRate"
                          type="number"
                          min="0"
                          step="0.01"
                          value={invoiceForm.defaultTaxRate}
                          onChange={handleInvoiceChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <FormLabel htmlFor="currency">Default currency</FormLabel>
                      <FormSelect
                        id="currency"
                        name="currency"
                        value={invoiceForm.currency}
                        onChange={handleInvoiceChange}
                        options={currencies}
                      />
                    </div>
                    
                    <div>
                      <FormLabel htmlFor="terms">Default terms and conditions</FormLabel>
                      <FormTextarea
                        id="terms"
                        name="terms"
                        rows={4}
                        value={invoiceForm.terms}
                        onChange={handleInvoiceChange}
                      />
                    </div>
                    
                    <div>
                      <FormLabel htmlFor="notes">Default invoice notes</FormLabel>
                      <FormTextarea
                        id="notes"
                        name="notes"
                        rows={4}
                        value={invoiceForm.notes}
                        onChange={handleInvoiceChange}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        isLoading={loading}
                        disabled={loading}
                      >
                        Save invoice settings
                      </Button>
                    </div>
                  </div>
                </form>
              )}
              
              {activeTab === 'email' && (
                <form onSubmit={handleEmailSubmit}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Email Settings</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Configure email settings for sending invoices, notifications, and other communications.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <FormLabel htmlFor="fromName">From name</FormLabel>
                        <FormInput
                          id="fromName"
                          name="fromName"
                          type="text"
                          value={emailForm.fromName}
                          onChange={handleEmailChange}
                        />
                      </div>
                      
                      <div>
                        <FormLabel htmlFor="fromEmail">From email</FormLabel>
                        <FormInput
                          id="fromEmail"
                          name="fromEmail"
                          type="email"
                          value={emailForm.fromEmail}
                          onChange={handleEmailChange}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-md font-medium text-gray-900 mb-4">SMTP Settings</h4>
                      
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <FormLabel htmlFor="smtpHost">SMTP host</FormLabel>
                          <FormInput
                            id="smtpHost"
                            name="smtpHost"
                            type="text"
                            value={emailForm.smtpHost}
                            onChange={handleEmailChange}
                          />
                        </div>
                        
                        <div>
                          <FormLabel htmlFor="smtpPort">SMTP port</FormLabel>
                          <FormInput
                            id="smtpPort"
                            name="smtpPort"
                            type="text"
                            value={emailForm.smtpPort}
                            onChange={handleEmailChange}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                        <div>
                          <FormLabel htmlFor="smtpUsername">SMTP username</FormLabel>
                          <FormInput
                            id="smtpUsername"
                            name="smtpUsername"
                            type="text"
                            value={emailForm.smtpUsername}
                            onChange={handleEmailChange}
                          />
                        </div>
                        
                        <div>
                          <FormLabel htmlFor="smtpPassword">SMTP password</FormLabel>
                          <FormInput
                            id="smtpPassword"
                            name="smtpPassword"
                            type="password"
                            value={emailForm.smtpPassword}
                            onChange={handleEmailChange}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="enableSsl"
                              name="enableSsl"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              checked={emailForm.enableSsl}
                              onChange={handleEmailChange}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="enableSsl" className="font-medium text-gray-700">Enable SSL/TLS</label>
                            <p className="text-gray-500">Use a secure connection when connecting to the SMTP server.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => alert('Test email not implemented')}
                        >
                          Test connection
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        isLoading={loading}
                        disabled={loading}
                      >
                        Save email settings
                      </Button>
                    </div>
                  </div>
                </form>
              )}
              
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Users & Permissions</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage users and their access permissions.
                    </p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-blue-600 font-medium">JD</span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">John Doe</div>
                                <div className="text-sm text-gray-500">CEO</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">john@example.com</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Administrator</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Deactivate</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                  <span className="text-purple-600 font-medium">JS</span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">Jane Smith</div>
                                <div className="text-sm text-gray-500">Finance Manager</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">jane@example.com</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Manager</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Deactivate</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={() => alert('Add user not implemented')}
                    >
                      Add new user
                    </Button>
                  </div>
                </div>
              )}
              
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Integrations</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Connect your account with third-party services.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-lg font-medium text-gray-900">QuickBooks</h4>
                            <p className="text-sm text-gray-500">Sync invoices, expenses, and customers with QuickBooks.</p>
                          </div>
                        </div>
                        <Button variant="outline">
                          Connect
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-lg font-medium text-gray-900">Stripe</h4>
                            <p className="text-sm text-gray-500">Accept credit card payments and manage subscriptions.</p>
                          </div>
                        </div>
                        <Button variant="outline">
                          Connect
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-lg font-medium text-gray-900">Google Workspace</h4>
                            <p className="text-sm text-gray-500">Sync calendar events, contacts, and documents.</p>
                          </div>
                        </div>
                        <Button variant="outline">
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;