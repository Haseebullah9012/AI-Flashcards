'use client'

import React, { useState, useEffect, useRef } from 'react';
import { collection, doc, getDoc,getDocs, setDoc, addDoc,updateDoc,deleteDoc, writeBatch } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { db } from './firebase';

export default function Home() {

  const { isLoaded, isSignedIn, user } = useUser();
  const [prompt, setPrompt] = useState('');
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [flashcards, setFlashcards] = useState({
    "title": "Random Trivia", 
    "cards": [
      {"front": "What is the smallest country in the world?", "back": "Vatican City", "difficulty": "Easy"}, 
      {"front": "What is the largest planet in our solar system?", "back": "Jupiter", "difficulty": "Easy"}, 
      {"front": "What is the name of the highest mountain in the world?", "back": "Mount Everest", "difficulty": "Easy"}, 
      {"front": "What is the chemical symbol for gold?", "back": "Au", "difficulty": "Medium"}, 
      {"front": "What is the name of the first woman to fly solo across the Atlantic Ocean?", "back": "Amelia Earhart", "difficulty": "Medium"}, 
      {"front": "What is the name of the famous painting by Leonardo da Vinci that depicts the Last Supper?", "back": "The Last Supper", "difficulty": "Medium"}, 
      {"front": "What is the capital of Australia?", "back": "Canberra", "difficulty": "Hard"}, 
      {"front": "Who wrote the play Hamlet?", "back": "William Shakespeare", "difficulty": "Hard"}, 
      {"front": "What is the name of the largest ocean on Earth?", "back": "Pacific Ocean", "difficulty": "Hard"}
    ]
  });
  
  async function handleGenerateCards(e) {
    e.preventDefault();
    
    if(prompt.trim() === '')
      return; //Empty Prompt
    if(isResponseLoading)
      return; //First wait for the Response

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
      setFlashcards(data);
      assignFlashcardIDs(data);
    }
    catch (error) {
      console.error('Error Fetching Generate Response:', error);
    }
    
    setPrompt('');
    setIsResponseLoading(false);
  }

  function handleCardCLick(e,cardId) {
    const cards = [...flashcards.cards];
    cards.forEach(card => {
      if (card.id === cardId) {
        if(!card.isFlipped)
          card.width = 'w-['+ e.target.offsetWidth +'px]';
        card.isFlipped = !card.isFlipped;
      }
    });
    setFlashcards({...flashcards, cards});
  }
  
  const assignFlashcardIDs = (flashcards) => {
    flashcards.cards.forEach((card, index) => {
      card.id = index + 1;
      card.isFlipped = false;
      //card.width = "auto";
    });
    setFlashcards(flashcards);
  };
  
  useEffect(() => {
    assignFlashcardIDs(flashcards);
  },[]);

  async function handleSaveFlashcards(e) {
    e.preventDefault();
    
    if(flashcards.title.trim() === '') {
      alert('First Enter some Title for this Flashcards Set!');
      return; //No Title
    }

    if(!isSignedIn || !user) {
      //Redirect to Sign In Page
      alert('Please Sign In to Save the Flashcards Set!');
      return;
    }
    
    try {
      const userDocRef = doc(collection(db, 'users'), user.id);
      const flashcardsColRef = collection(userDocRef, 'flashcardSets');
      
      const docRef = await addDoc(flashcardsColRef, flashcards); //Save the FlashcardsSet on the User's Sub-collection
      console.log('Document written with ID: ', docRef.id);
      alert('The Flashcards Set is saved successfully!, with Title: ' + flashcards.title);
    }
    catch (error) {
      console.error('Error Saving Flashcards:', error);
      alert('An error occurred while saving flashcards. Please try again.');
    }
  }
  
  return (
    <div className="w-full max-w-5xl items-center justify-between bg-slate-700 rounded-lg p-4 sm:px-6 sm:py-10">
      
      <h1 className='text-2xl font-bold tracking-wide text-center'>Flashcards Generator</h1>

      <form className="flex p-2 py-4 my-8 border-y-2 border-y-slate-500 rounded-xl" onSubmit={handleGenerateCards}>
        <input className="w-full border-2 border-slate-600 bg-slate-800 text-slate-200 rounded-md px-2 py-1 mx-1 outline-slate-600"
          type="text"
          value={prompt}
          placeholder="Enter any Topic or Subject..."
          onChange={(e)=>setPrompt(e.target.value)}
        />
        <button className="border-2 border-slate-600 bg-gray-900 px-2 py-1 mx-1 rounded-lg text-slate-300" type="submit">
          Generate
        </button>
      </form>

      <div className='flex justify-center mb-16'>
        {isSignedIn && (
          <Link href="/flashcards" className='border border-slate-600 bg-slate-900 text-slate-200 px-7 py-5 text-lg rounded-2xl underline tracking-wide'>
            Saved Flashcard Sets
          </Link>
        )}
      </div>

      {isResponseLoading && (
        <h2 className='p-2 text-lg tracking-wide'>Loading...</h2>
      )}

      {(flashcards && !isResponseLoading ) && (
        <div className=''>
          
          {/* Flashcards Title Bar */}
          <div>
            <h2 className='inline-block p-2 text-lg font-bold tracking-wide'>Flashcards-Set Title:</h2>
            <form className="inline-block" onSubmit={handleSaveFlashcards}>
              <input className="border-1 border-slate-800 bg-slate-600 text-slate-200 rounded-md px-2 py-1 mx-1 outline-slate-800"
                type="text"
                value={flashcards.title}
                placeholder="Enter Title..."
                onChange={(e)=> setFlashcards({...flashcards, title:e.target.value}) }
              />
              <button className="border-2 border-slate-600 bg-gray-900 px-2 py-1 mx-1 rounded-lg text-slate-300" type="submit">
                Save
              </button>
            </form>
          </div>

          <div id='flashcardsSet' className="flex flex-row flex-wrap justify-around w-full p-3">
            {flashcards.cards?.map((card, index) => (
              <button key={index} onClick={(e)=>handleCardCLick(e,card.id)} className={`flex flex-wrap min-h-28 max-w-48 m-4 px-5 py-4 justify-center items-center rounded-xl border-[3px]  ${card.isFlipped ? 'bg-slate-900 text-green-200 border-cyan-600 ' + card.width : 'min-w-28 bg-slate-800 text-slate-200 border-slate-600'}`}>
                {card.isFlipped ? card.back : card.front}
              </button>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
}
