'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function EditStudentForm({ user, profile }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    education_program: profile?.education_program || '',
    linkedin_url: profile?.linkedin_url || '',
    portfolio_url: profile?.portfolio_url || '',
    bio: profile?.bio || '',
    profile_picture: profile?.profile_picture || ''
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // For checkboxes handling the education_program field
    if (type === 'checkbox' && name === 'education_program') {
      setFormData(prev => ({
        ...prev,
        education_program: checked ? value : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleImageUpload = (url) => {
    setFormData(prev => ({
      ...prev,
      profile_picture: url
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Check if profile exists by looking for existing data
      const isNewProfile = !profile?.id;
      
      // Prepare the data to update/insert
      const profileData = {
        id: user.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        education_program: formData.education_program,
        linkedin_url: formData.linkedin_url,
        portfolio_url: formData.portfolio_url,
        bio: formData.bio,
        profile_picture: formData.profile_picture,
        updated_at: new Date().toISOString()
      };
      
      // If it's a new profile, we need to insert; otherwise update
      let result;
      if (isNewProfile) {
        result = await supabase
          .from('student_profiles')
          .insert([{ ...profileData, created_at: new Date().toISOString() }]);
      } else {
        result = await supabase
          .from('student_profiles')
          .update(profileData)
          .eq('id', user.id);
      }
      
      if (result.error) throw result.error;
      
      setMessage('Profile updated successfully!');
    
    } catch (error) {
      console.error('Error updating profile:', error);
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
        <div className="">
          <div>
            <label htmlFor="first_name" className="">
              * FÖRNAMN
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className=""
              required
            />
          </div>
          
          <div>
            <label htmlFor="last_name" className="">
              *EFTERNAMN
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className=""
              required
            />
          </div>
        </div>
        
        <div>
        <fieldset required>
            <legend className="">
                *JAG STUDERAR TILL
            </legend>
            <div className="">
                <input
                id="webbutveckling"
                name="education_program"
                type="radio"
                value="Webbutveckling"
                checked={formData.education_program === "Webbutveckling"}
                onChange={handleChange}
                className=""
                required
                />
                <label htmlFor="webbutveckling" className="">
                WEBBUTVECKLARE
                </label>
            </div>
            <div className="">
                <div className="">
                <input
                    id="digital-design"
                    name="education_program"
                    type="radio"
                    value="Digital Design"
                    checked={formData.education_program === "Digital Design"}
                    onChange={handleChange}
                    className=""
                />
                <label htmlFor="digital-design" className="">
                    DIGITAL DESIGNER
                </label>
                </div>
            </div>
        </fieldset>
        </div>

        <div>
            <label htmlFor="linkedin_url" className="">
              LINKEDIN
            </label>
            <input
              type="text"
              id="linkedin_url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              className=""
            />
        </div>

        <div>
            <label htmlFor="portfolio_url" className="">
              PORTFOLIO
            </label>
            <input
              type="text"
              id="portfolio_url"
              name="portfolio_url"
              value={formData.portfolio_url}
              onChange={handleChange}
              className=""
            />
        </div>

        <div>
          <label htmlFor="bio" className="">
            *BIO
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            className=""
            placeholder="Skriv en bio om dig själv, max 200 tecken"
            required
          />
        </div>
      </div>
      
      <div className="">
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