'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import Label, { labelStyles } from '@/components/ui/Label/Label';
import Input, { inputStyles } from '@/components/ui/Input/Input';
import Textarea, { textareaStyles } from '@/components/ui/Textarea/Textarea';
import MultiSelectDropdown from '@/components/ui/MultiSelectDropdown/MultiSelectDropdown';
import Image from 'next/image';
import style from './EditStudentForm.module.css';

// Sample options array
const knowledgeOptions = [
  { value: 'Figma', label: 'FIGMA' },
  { value: 'Illustrator', label: 'ILLUSTRATOR' },
  { value: 'Photoshop', label: 'PHOTOSHOP' },
  { value: 'Unreal engine', label: 'UNREAL ENGINE' },
  { value: 'Framer', label: 'FRAMER' },
  { value: 'php', label: 'PHP' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'react', label: 'REACT' },
  { value: 'nextjs', label: 'NEXT' },
  { value: 'tailwind', label: 'TAILWIND CSS' },
  { value: 'typescript', label: 'TYPESCRIPT' },
  { value: 'node', label: 'NODE' },
];

export default function EditStudentForm({ user, profile }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    education_program: profile?.education_program || '',
    linkedin_url: profile?.linkedin_url || '',
    portfolio_url: profile?.portfolio_url || '',
    bio: profile?.bio || '',
    knowledge: profile?.knowledge || [],
    cv: profile?.cv || '',
    profile_picture: profile?.profile_picture || ''
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // For radio buttons handling the education_program field
    if (type === 'radio' && name === 'education_program') {
      setFormData(prev => ({
        ...prev,
        education_program: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle knowledge multi-select
  const handleKnowledgeChange = (selectedValues) => {
    setFormData(prev => ({
      ...prev,
      knowledge: selectedValues
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
  
    if (name === "knowledge") {
      setFormData((prevData) => {
        const updatedKnowledge = checked
          ? [...prevData.knowledge, value] // add if checked
          : prevData.knowledge.filter((item) => item !== value); // remove if unchecked
  
        return {
          ...prevData,
          knowledge: updatedKnowledge,
        };
      });
    }
  };  
  
  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      return;
    }
    
    setFile(selectedFile);
    setUploading(true);
    setMessage('Laddar upp...');

    const filePath = `${user.id}/${selectedFile.name}`;

    const { data, error } = await supabase.storage
      .from('profile-picture')
      .upload(filePath, selectedFile, {
        cacheControl: '3600',
        upsert: true, // overwrite if same name
      });

    if (error) {
      setMessage(`Upload error: ${error.message}`);
    } else {
      // Save the file path to your table
      const { error: dbError } = await supabase
        .from('student_profiles')
        .update({ profile_picture: data.path })
        .eq('id', user.id);

      if (dbError) {
        setMessage(`DB update error: ${dbError.message}`);
      } else {
        // Update the form data state with the new CV path
        setFormData(prev => ({
          ...prev,
          profile_picture: data.path
        }));
        setMessage('Profile picture uploaded successfully!');
      }
    }

    setUploading(false);
  };

  const handleCvUpload = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      return;
    }
    
    setFile(selectedFile);
    setUploading(true);
    setMessage('Laddar upp...');

    const filePath = `${user.id}/${selectedFile.name}`;

    const { data, error } = await supabase.storage
      .from('cv')
      .upload(filePath, selectedFile, {
        cacheControl: '3600',
        upsert: true, // overwrite if same name
      });

    if (error) {
      setMessage(`Upload error: ${error.message}`);
    } else {
      // Save the file path to your table
      const { error: dbError } = await supabase
        .from('student_profiles')
        .update({ cv: data.path })
        .eq('id', user.id);

      if (dbError) {
        setMessage(`DB update error: ${dbError.message}`);
      } else {
        // Update the form data state with the new CV path
        setFormData(prev => ({
          ...prev,
          cv: data.path
        }));
      }
    }

    setUploading(false);
  };
  
  const handleRemoveCV = async () => {
    if (!formData.cv) return;
    
    setUploading(true);
    setMessage('Raderar CV...');
    
    try {
      // First, delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('cv')
        .remove([formData.cv]);
        
      if (storageError) {
        throw storageError;
      }
      
      // Then, update the database record
      const { error: dbError } = await supabase
        .from('student_profiles')
        .update({ cv: null })
        .eq('id', user.id);
        
      if (dbError) {
        throw dbError;
      }
      
      // Update local state
      setFormData(prev => ({
        ...prev,
        cv: ''
      }));
      
      setMessage('CV borttagen');
    } catch (error) {
      console.error('Error removing CV:', error);
      setMessage(`Error removing CV: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!formData.profile_picture) return;
    
    setUploading(true);
    setMessage('Raderar profilbild...');
    
    try {
      // First, delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('profile-picture')
        .remove([formData.profile_picture]);
        
      if (storageError) {
        throw storageError;
      }
      
      // Then, update the database record
      const { error: dbError } = await supabase
        .from('student_profiles')
        .update({ profile_picture: null })
        .eq('id', user.id);
        
      if (dbError) {
        throw dbError;
      }
      
      // Update local state
      setFormData(prev => ({
        ...prev,
        profile_picture: ''
      }));
      
      setMessage('Profilbild borttagen');
    } catch (error) {
      console.error('Error removing profile picture:', error);
      setMessage(`Error removing profile picture: ${error.message}`);
    } finally {
      setUploading(false);
    }
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
        knowledge: formData.knowledge,
        cv: formData.cv,
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
    <div className={style.editStudentView}>
    <form onSubmit={handleSubmit} className={style.editStudentForm}>
      {message && (
        <div className={`p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
        <fieldset className={style.profilePicture}>
        {formData.profile_picture && (
                <Button 
                    type="button" 
                    className={style.deletePictureButton}
                    onClick={handleRemoveImage} 
                >
                    <Image
                    src="/icons/delete_white.svg"
                    alt="Delete icon"
                    width={15}
                    height={15}
                    />
                </Button>
            )}
            <Button 
            type="button" 
            className={style.uploadProfilePicture}
            onClick={() => document.getElementById('profile_picture').click()}
            disabled={uploading}
            >
            <Image
            src="/icons/photo_camera.svg"
            alt="icon for removing"
            width={40}
            height={40}
            className=""
            />{formData.profile_picture && (
              <Image 
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-picture/${profile.profile_picture}`} 
              alt={`${profile.first_name} ${profile.last_name}`} 
              width={150.4}
              height={150.4}
            />
          )}
            {uploading ? 'LADDAR UPP...' : 'VÄLJ PROFILBILD'}
            <input
                type="file"
                id="profile_picture"
                accept="application/jpg"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ display: 'none' }} 
            />
            </Button>
        </fieldset>
        <fieldset className={style.nameField}>
            <label htmlFor="first_name" className={style.label}>
              * FÖRNAMN
            <Input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={inputStyles.inputBlack}
              required
            />
            </label>
            <label htmlFor="last_name" className={style.label}>
              *EFTERNAMN
            <Input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={inputStyles.inputBlack}
              required
            />
            </label>
        </fieldset>
        <fieldset required className={style.educationField}>
            <legend className={style.label}>
                *JAG STUDERAR TILL
            </legend>
                <label htmlFor="webbutveckling" className={style.educationChoice}>
                WEBBUTVECKLARE
                <Input
                id="webbutveckling"
                name="education_program"
                type="radio"
                value="Webbutveckling"
                checked={formData.education_program === "Webbutveckling"}
                onChange={handleChange}
                className={style.educationCheckbox}
                required
                />
                </label>
                <label htmlFor="digital-design" className={style.educationChoice}>
                    DIGITAL DESIGNER
                    <Input
                    id="digital-design"
                    name="education_program"
                    type="radio"
                    value="Digital Design"
                    checked={formData.education_program === "Digital Design"}
                    onChange={handleChange}
                    className={style.educationCheckbox}
                    />
                </label>
        </fieldset>
        <fieldset className={style.linkField}>
            <label htmlFor="linkedin_url" className={style.label}>
                LINKEDIN
                <Input
                type="text"
                id="linkedin_url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                className={inputStyles.inputBlack}
                />
            </label>
            <label htmlFor="portfolio_url" className={style.label}>
                PORTFOLIO
                <Input
                type="text"
                id="portfolio_url"
                name="portfolio_url"
                value={formData.portfolio_url}
                onChange={handleChange}
                className={inputStyles.inputBlack}
                />
            </label>
        </fieldset>
            <label htmlFor="bio" className={style.label}>
                *BIO
            <Textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className={textareaStyles.textareaBlack}
                placeholder="Skriv en bio om dig själv, max 200 tecken"
                required
            />
            </label>
            <legend className={style.label}>*KUNSKAPER
            <div className={style.multiSelectContainer}>
                <MultiSelectDropdown
                    options={knowledgeOptions}
                    selectedValues={formData.knowledge}
                    onChange={handleKnowledgeChange}
                    placeholder="Välj kunskaper"
                    maxHeight="250px"
                />
            </div>
            </legend>
            <legend className={style.label}>LADDA UPP CV
            </legend>
        <fieldset className={style.cvField}>
            <Button 
                type="button" 
                className={buttonStyles.filledBlack}
                onClick={() => document.getElementById('cv').click()}
                disabled={uploading}
            >
                {uploading ? 'LADDAR UPP CV...' : 'TRYCK HÄR FÖR ATT LADDA UPP CV'}
            </Button>
            <input 
                type="file" 
                id="cv" 
                accept="application/pdf" 
                onChange={handleCvUpload} 
                disabled={uploading}
                style={{ display: 'none' }} 
            />
            {formData.cv && (
                <Button 
                    type="button" 
                    className={buttonStyles.labelButton}
                    onClick={handleRemoveCV}
                    style={{ margin: '0.5rem 0rem' }} 
                >
                    {formData.cv.split('/').pop()}
                    <Image
                    src="/icons/exit-white.svg"
                    alt="icon for removing"
                    width={10}
                    height={10}
                    />
                </Button>
            )}
        </fieldset>
        <Button
          type="submit"
          disabled={loading}
          className={buttonStyles.filledBlack}
        >
          {loading ? 'SPARAR...' : 'SPARA ÄNDRINGAR'}
        </Button>
    </form>
    </div>
  );
}