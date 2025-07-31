import React, { useState } from 'react';
import companyService from '../services/companyService';
import { useNavigate } from 'react-router-dom';

const CompanyOnboard: React.FC = () => {
  const [form, setForm] = useState({
    companyName: '',
    adminEmail: '',
    adminPassword: '',
    adminName: '',
    plan: 'BASIC',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Use the correct method from companyService
      await companyService.onboardCompany(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Onboarding failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Company Onboarding</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Company Name</label>
          <input name="companyName" value={form.companyName} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">Admin Name</label>
          <input name="adminName" value={form.adminName} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">Admin Email</label>
          <input name="adminEmail" type="email" value={form.adminEmail} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">Admin Password</label>
          <input name="adminPassword" type="password" value={form.adminPassword} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">Plan</label>
          <select name="plan" value={form.plan} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="BASIC">Basic</option>
            <option value="STANDARD">Standard</option>
            <option value="PREMIUM">Premium</option>
          </select>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">Onboarding successful! Redirecting to login...</div>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={loading}>{loading ? 'Submitting...' : 'Onboard Company'}</button>
      </form>
    </div>
  );
};

export default CompanyOnboard; 