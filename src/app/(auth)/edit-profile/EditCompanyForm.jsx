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
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newFunBenefit, setNewFunBenefit] = useState('');
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

  const handleChecked = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
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
  

  const handleRemoveCity = async (cityToRemove, index) => {
    setUploading(true);
    setMessage('Raderar ort...');
    
    try {
      console.log(`Attempting to remove city at index ${index}: "${cityToRemove}"`);
      
      // Get the current city array from database
      const { data, error: fetchError } = await supabase
        .from('company_profiles')
        .select('city')
        .eq('id', user.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Safety check for the city array
      const currentCities = Array.isArray(data?.city) ? [...data.city] : [];
      console.log('Current cities from DB:', currentCities);
      
      // Create a new array by removing the element at the specified index
      let updatedCities;
      
      if (index === 0) {
        // Special handling for first element
        console.log('Special handling for first element');
        if (currentCities.length === 1) {
          // If there's only one element, set to empty array
          updatedCities = [];
        } else {
          // Otherwise remove just the first element
          updatedCities = currentCities.slice(1);
        }
      } else {
        // For other elements, use the normal approach
        updatedCities = [
          ...currentCities.slice(0, index),
          ...currentCities.slice(index + 1)
        ];
      }
      
      console.log('Updated cities array after removal:', updatedCities);
      
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

      // Making sure at least one of the education programs are selected
      if (!formData.accepts_webb_developer && !formData.accepts_digital_designer) {
        setError("Please select at least one education option");
        return;
      }
      
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
    <form onSubmit={handleSubmit} className={style.editCompanyForm}>
      {message && (
        <div className={`p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
        <fieldset className={style.nameField}>
          <label htmlFor="name" className={style.label}>
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
        </fieldset>
        
        <div className="">
    <label htmlFor="newCity" className={style.label}>
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
            onClick={() => handleRemoveCity(city, index)}
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
          
  <fieldset required className={style.checkboxField}>
            <legend className={style.label}>
                *DISTANS
            </legend>
                <Label htmlFor="webbutveckling" className={style.checkboxChoice}>
                ON SITE
                <Input
                id="on_site"
                name="location_status"
                type="radio"
                value="on site"
                checked={formData.location_status === "On site"}
                onChange={handleChange}
                className={style.checkbox}
                required
                />
                </Label>
                <Label htmlFor="digital-design" className={style.checkboxChoice}>
                    HYBRID
                    <Input
                    id="Hybrid"
                    name="location_status"
                    type="radio"
                    value="Hybrid"
                    checked={formData.location_status === "Hybrid"}
                    onChange={handleChange}
                    className={style.checkbox}
                    />
                </Label>
                <Label htmlFor="digital-design" className={style.checkboxChoice}>
                    REMOTE
                    <Input
                    id="Remote"
                    name="location_status"
                    type="radio"
                    value="Remote"
                    checked={formData.location_status === "Remote"}
                    onChange={handleChange}
                    className={style.checkbox}
                    />
                </Label>
        </fieldset>
        </div>
        <fieldset className={style.checkboxField}>
          <legend className={style.label}>
            *SÖKER
          </legend>
          <label htmlFor="accepts_webb_developer" className={style.checkboxChoice}>
            WEBBUTVECKLARE
            <Input
              id="accepts_webb_developer"
              name="accepts_webb_developer"
              type="checkbox"
              checked={formData.accepts_webb_developer || false}
              onChange={handleChecked}
              className={style.checkbox}
            />
          </label>
          <label htmlFor="accepts_digital_designer" className={style.checkboxChoice}>
            DIGITAL DESIGNER
            <Input
              id="accepts_digital_designer"
              name="accepts_digital_designer"
              type="checkbox"
              checked={formData.accepts_digital_designer || false}
              onChange={handleChecked}
              className={style.checkbox}
            />
          </label>
      </fieldset>
      <fieldset className={style.linkField}>
          <label htmlFor="linkedin_url" className={style.label}>
          LINKEDIN
          <Input
            type="url"
            id="linkedin_url"
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleChange}
            className={inputStyles.inputBlack}
            placeholder="Infoga länk till er Linkedin"
          />
          </label>
          <label htmlFor="website_url" className={style.label}>
            HEMSIDA
          <Input
            type="url"
            id="website_url"
            name="website_url"
            value={formData.website_url}
            onChange={handleChange}
            className={inputStyles.inputBlack}
            placeholder="Infoga länk till er hemsida"
          />
          </label>
        </fieldset>
        <fieldset className={style.mailField}>
          <label htmlFor="name" className={style.label}>
          MAIL
          </label>
          <Input
            type="email"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className={inputStyles.inputBlack}
          />
        </fieldset>
          <label htmlFor="bio" className={style.label}>
            *OM FÖRETAGET
          <Textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            className={textareaStyles.textareaBlack}
            placeholder="Skriv en kort bio om ert företag, max 200 tecken"
          />
          </label>
    {/*   <label htmlFor="fun_benefits" className="">
      *FÖRDELAR PÅ VÅRT KONTOR
      </label>
        <Input
          type="text"
          id="fun_benefits"
          name="fun_benefits"
          value={newFunBenefit}
          onChange={(e) => setNewFunBenefit(e.target.value)}
          className={inputStyles.inputBlack}
        />
        <Button 
          type="button"
          onClick={handleAddFunBenefit}
          className={buttonStyles.labelButton}
        >
          Lägg till
        </Button>
      
        {formData.fun_benefits && formData.fun_benefits.length > 0 && (
          formData.fun_benefits.map((fun_benefits, index) => (
            <Button
              key={index}
              type="button"
              className={buttonStyles.labelButton}
              onClick={() => handleRemoveFunBenefit(fun_benefits, index)}
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
        )} */}
      
        <Button
          type="submit"
          disabled={loading}
          className={buttonStyles.filledBlack}
        >
          {loading ? 'SPARAR...' : 'SPARA ÄNDRINGAR'}
        </Button>
    </form>
  );
}