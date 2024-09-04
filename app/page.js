'use client'

import React, { useState, useEffect, useRef } from 'react';
import { collection, doc, getDoc,getDocs, addDoc,updateDoc,deleteDoc, } from 'firebase/firestore';
import { db } from './firebase';

//Potential New Features to Implement

export default function Home() {

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
    <main className="flex min-h-screen flex-col items-center sm:p-24 p-4 bg-slate-900 text-slate-100">
      <div className="max-w-5xl w-full items-center justify-between font-mono text-s">
        <h1 className="text-4xl p-4 text-center">AI Inventory Management</h1>
        
        <div className="bg-slate-700 rounded-xl p-6 sm:p-8">
        
        </div>

      </div>
    </main>
  );
}
