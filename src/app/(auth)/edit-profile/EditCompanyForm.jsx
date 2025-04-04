'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function EditCompanyForm({ user, profile }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    company_name: profile?.company_name || '',
    industry: profile?.industry || '',
    website: profile?.website || '',
    location: profile?.location || '',
    company_size: profile?.company_size || '',
    description: profile?.description || ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageUpload = (url) => {
    setFormData(prev => ({
      ...prev,
      logo_url: url
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Check if profile exists
      const isNewProfile = !profile?.id;
      
      // Prepare the data to update/insert
      const profileData = {
        user_id: user.id,
        company_name: formData.company_name,
        industry: formData.industry,
        website: formData.website,
        location: formData.location,
        company_size: formData.company_size,
        description: formData.description,
        logo_url: formData.logo_url,
        updated_at: new Date().toISOString()
      };
      
      // If it's a new profile, we need to insert; otherwise update
      let result;
      if (isNewProfile) {
        result = await supabase
          .from('company_profiles')
          .insert([{ ...profileData, created_at: new Date().toISOString() }]);
      } else {
        result = await supabase
          .from('company_profiles')
          .update(profileData)
          .eq('user_id', user.id);
      }
      
      if (result.error) throw result.error;
      
      setMessage('Company profile updated successfully!');
      // Refresh the page or navigate to profile view after successful update
      setTimeout(() => router.push('/profile'), 1500);
    } catch (error) {
      console.error('Error updating company profile:', error);
      setMessage(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="">
      {message && (
        <div className={`p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <div className="">

        <div>
          <label htmlFor="company_name" className="">
            Company Name
          </label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className=""
            required
          />
        </div>
        
        <div className="">
          <div>
            <label htmlFor="industry" className="">
              Industry
            </label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className=""
            />
          </div>
          
          <div>
            <label htmlFor="company_size" className="">
              Company Size
            </label>
            <select
              id="company_size"
              name="company_size"
              value={formData.company_size}
              onChange={handleChange}
              className=""
            >
              <option value="">Select size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501+">501+ employees</option>
            </select>
          </div>
        </div>
        
        <div className="">
          <div>
            <label htmlFor="website" className="">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className=""
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className=""
              placeholder="City, Country"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="">
            Company Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className=""
            placeholder="Tell us about your company..."
          />
        </div>
      </div>
      
      <div className="submit">
        <button
          type="button"
          onClick={() => router.back()}
          className=""
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className=""
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}