'use client'

import React, { useState, useEffect, useRef } from 'react';
import { collection, doc, getDoc,getDocs, setDoc, addDoc,updateDoc,deleteDoc, } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import { db } from './firebase';

export default function Home() {

  const { isLoaded, isSignedIn, user } = useUser();
  const [prompt, setPrompt] = useState('');
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
  
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  
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
        card.width = e.target.offsetWidth;
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
  
  return (
    <main className="flex min-h-screen flex-col items-center pt-20 sm:pt-24 p-4 sm:px-24 bg-slate-900 text-slate-100">
      <div className="w-full max-w-5xl items-center justify-between bg-slate-700 rounded-lg p-4 sm:p-6">
        
        <form className="flex p-2 pb-4 mb-8 border-b-2 border-b-slate-500" onSubmit={handleGenerateCards}>
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

        
        {isResponseLoading && (
          <h2 className='p-2 text-lg tracking-wide'>Loading...</h2>
        )}

        {(flashcards && !isResponseLoading ) && (
          <div className=''>
            
            {/* Flashcards Title Bar */}
            <div>
              <h2 className='inline-block p-2 text-lg font-bold tracking-wide'>Flashcards-Set Title:</h2>
              <form className="inline-block">
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
                <button key={index} onClick={(e)=>handleCardCLick(e,card.id)} className={`flex flex-wrap min-w-28 min-h-28 max-w-36 md:max-w-48 m-4 px-5 py-4 justify-center items-center rounded-xl bg-slate-800 border-[3px] border-slate-600 text-slate-200 ${card.isFlipped ? 'transform rotate-x-180 border-cyan-800 bg-slate-900 text-green-100' + ' w-['+card.width+'px]' : ''}`}>
                  {card.isFlipped ? card.back : card.front}
                </button>
              ))}
            </div>
          </div>
        )}
        
      </div>
    </main>
  );
}
