'use client'

import React, { useState, useEffect, useRef } from 'react';
import { collection, doc, getDoc,getDocs, setDoc, addDoc,updateDoc,deleteDoc, } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import { db } from './firebase';

export default function Home() {

  const { isLoaded, isSignedIn, user } = useUser();
  const [prompt, setPrompt] = useState('');
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  
  async function handleSendPrompt(e) {
    e.preventDefault();
    
    if(prompt.trim() === '')
      return; //Empty Prompt
    if(isResponseLoading)
      return; //First wait for the Response

    setPrompt('');
    
    try {
      setIsResponseLoading(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt:prompt })
      })
      
      if(!response.ok)
        throw new Error('The Response was not OK!');

      const data = await response.json();
      console.log(data);
    }
    catch (error) {
      console.error('Error Fetching Generate Response:', error);
    }
    
    setIsResponseLoading(false);
  }

  return (
    <div className="w-full max-w-5xl items-center justify-between bg-slate-700 rounded-lg p-4 sm:p-6">
      
      {(isLoaded && isSignedIn) ? (
        <div>Hello, {user.firstName} welcome to Clerk</div>
      )
      : (
        <div>Hello, Guest User</div>
      )}

      
    </div>
  );
}
