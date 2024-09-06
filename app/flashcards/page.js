"use client"
import React, { useState, useEffect, useRef } from 'react';
import { collection, doc, getDoc,getDocs, setDoc, addDoc,updateDoc,deleteDoc, writeBatch } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { db } from '../firebase';

export default function FlashcardsSets() {
  
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcardSets, setflashcardSets] = useState(null);

  useEffect(() => {
    async function fetchSavedFlashcards() {
      if (!user)
        return;
      
      try {
        const userDocRef = doc(collection(db, 'users'), user.id);
        const flashcardsColRef = collection(userDocRef, 'flashcardSets');
        
        const docsSnap = await getDocs(flashcardsColRef);
        const flashcardsArray = docsSnap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setflashcardSets(flashcardsArray);
      }
      catch(error) {
        console.error('Error Retreiving Flashcards from Database: ', error);
      }
    }

    fetchSavedFlashcards();
  }, [user]);

  return (
    <div className='w-full max-w-5xl items-center justify-between bg-slate-700 rounded-lg p-6'>
      <h1 className='text-xl font-bold tracking-wide text-center'>Your Saved Flashcard Sets</h1>

      <div id="flashcard-sets" className='flex flex-row flex-wrap bg-slate-800 my-6 mx-[-12px] sm:mx-4 sm:my-8 px-2 py-4 sm:px-4 sm:py-8 sm:p-5 rounded-3xl'>
        
        {!isLoaded && (
          <p className="text-slate-400">Loading...</p>
        )}

        {(isLoaded && !isSignedIn) && (
          <p className="text-slate-400">Please, SignIn First...</p>
        )}

        {(isLoaded && flashcardSets && !flashcardSets.length) && (
          <p className="text-slate-400">Currently, You have No saved Flashcards...</p>
        )}

        {flashcardSets?.map((cardsSet, id) => (
          <Link key={id} 
            href={{
              pathname:`/flashcards/${cardsSet.id}`,
              query: { flashcards:JSON.stringify(cardsSet) } //Pass Data as Query Parameters
            }} 
            className="border-[3px] border-slate-700 m-2 p-4 rounded-2xl text-slate-200 bg-slate-900"
          >
            {cardsSet.title}
          </Link>
        ))}
        
      </div>
    </div>
  );
};
