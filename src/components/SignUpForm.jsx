"use client";

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      // passing user_type in metadata to supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        setMessage({
          type: 'success',
          text: `Registration successful! User created with ID: ${data.user.id} and type: ${userType}`
        });
        
        // Clear form
        setEmail('');
        setPassword('');

        // Add a short delay before redirecting
      setTimeout(() => {
        router.push('/edit-profile');
      }, 1500); // 1.5 seconds
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred during sign-up'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h2 className="">Create an Account</h2>
      
      {message && (
        <div className={
          message.type === 'success' 
            ? 'success' 
            : 'error'
        }>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSignUp}>
        <div className="">
          <label className="">Account Type</label>
          <div className="">
            <label className="">
              <input
                type="radio"
                name="userType"
                value="student"
                checked={userType === 'student'}
                onChange={() => setUserType('student')}
                className=""
              />
              Student
            </label>
            <label className="">
              <input
                type="radio"
                name="userType"
                value="company"
                checked={userType === 'company'}
                onChange={() => setUserType('company')}
                className=""
              />
              Company
            </label>
          </div>
        </div>
        
        <div className="">
          <label className="" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className=""
          />
        </div>
        
        <div className="">
          <label className="" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className=""
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className=""
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}