'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import Label, { labelStyles } from '@/components/ui/Label/Label';
import Input, { inputStyles } from '@/components/ui/Input/Input';
import Textarea, { textareaStyles } from '@/components/ui/Textarea/Textarea';
import Image from 'next/image';
import style from './EditCompanyForm.module.css';

export default function EditCompanyForm({ user, profile }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [newCity, setNewCity] = useState('');
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    city: profile?.city || [],
    location_status: profile?.location_status || '',
    accepts_digital_designer: profile?.accepts_digital_designer || false,
    accepts_webb_developer: profile?.accepts_webb_developer || false,
    linkedin_url: profile?.linkedin_url || '',
    website_url: profile?.website_url || '',
    contact: profile?.contact || '',
    bio: profile?.bio || '',
    fun_benefits: profile?.fun_benefits || [],
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCity = () => {
    if (!newCity.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      city: [...prev.city, newCity.trim()]
    }));
    
    setNewCity('');
  };

  const handleRemoveCity = async (cityToRemove) => {
    setUploading(true);
    setMessage('Raderar ort...');
    
    try {
      // Get the current city array from database
      const { data, error: fetchError } = await supabase
        .from('company_profiles')
        .select('city')
        .eq('id', user.id)
        /* .single(); */
        
      if (fetchError) throw fetchError;
      
      // Filter out the city to remove
      const updatedCities = data.city.filter(city => city !== cityToRemove);
      
      // Update the database with the new array
      const { error: updateError } = await supabase
        .from('company_profiles')
        .update({ city: updatedCities })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Update local state
      setFormData(prev => ({
        ...prev,
        city: updatedCities
      }));
      
      setMessage('Ort borttagen');
    } catch (error) {
      console.error('Error removing ort:', error);
      setMessage(`Error removing ort: ${error.message}`);
    } finally {
      setUploading(false);
    }
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
        name: formData.name,
        city: formData.city,
        location_status: formData.location_status,
        accepts_digital_designer: formData.accepts_digital_designer,
        accepts_webb_developer: formData.accepts_webb_developer,
        linkedin_url: formData.linkedin_url,
        website_url: formData.website_url,
        contact: formData.contact,
        bio: formData.bio,
        fun_benefits: formData.fun_benefits,
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
          .eq('id', user.id);
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
          <label htmlFor="name" className="">
          *FÖRETAGSNAMN
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputStyles.inputBlack}
            required
          />
        </div>
        
        <div className="">
        <div>
    <label htmlFor="newCity" className="">
      *ORT
    </label>
      <Input
        type="text"
        id="newCity"
        name="newCity"
        value={newCity}
        onChange={(e) => setNewCity(e.target.value)}
        className={inputStyles.inputBlack}
      />
      <Button 
        type="button"
        onClick={handleAddCity}
        className={buttonStyles.labelButton}
      >
        Lägg till
      </Button>
    
      {formData.city && formData.city.length > 0 && (
        formData.city.map((city, index) => (
          <Button
            key={index}
            type="button"
            className={buttonStyles.labelButton}
            onClick={() => handleRemoveCity(city)}
            style={{ margin: '0.5rem 0.5rem 0.5rem 0rem' }}
          >
            {city}
            <Image
              src="/icons/exit-white.svg"
              alt="icon for removing"
              width={10}
              height={10}
              style={{ marginLeft: '0.5rem' }}
            />
          </Button>
        ))
      )}
  </div>
          
  <fieldset required className={style.locationStatusField}>
            <legend className={style.label}>
                *DISTANS
            </legend>
                <Label htmlFor="webbutveckling" className={style.locationStatusChoice}>
                ON SITE
                <Input
                id="on_site"
                name="location_status"
                type="radio"
                value="on site"
                checked={formData.location_status === "On site"}
                onChange={handleChange}
                className={style.locationStatusCheckbox}
                required
                />
                </Label>
                <Label htmlFor="digital-design" className={style.locationStatusChoice}>
                    HYBRID
                    <Input
                    id="Hybrid"
                    name="location_status"
                    type="radio"
                    value="Hybrid"
                    checked={formData.location_status === "Hybrid"}
                    onChange={handleChange}
                    className={style.locationStatusCheckbox}
                    />
                </Label>
                <Label htmlFor="digital-design" className={style.locationStatusChoice}>
                    REMOTE
                    <Input
                    id="Remote"
                    name="location_status"
                    type="radio"
                    value="Remote"
                    checked={formData.location_status === "Remote"}
                    onChange={handleChange}
                    className={style.locationStatusCheckbox}
                    />
                </Label>
        </fieldset>
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