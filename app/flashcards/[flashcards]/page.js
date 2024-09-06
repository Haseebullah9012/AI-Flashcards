'use client'
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function FlashcardSetPage({ params }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const flashcardSet = JSON.parse( searchParams.get('flashcards') );

  const [flashcards, setFlashcards] = useState( flashcardSet );

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
  
  return (
    <div className='w-full max-w-5xl items-center justify-between bg-slate-700 rounded-lg p-6'>
      
      <button onClick={() => router.back()} className="mb-4 px-4 py-2 bg-slate-900 border-2 border-slate-600 text-slate-300 rounded-lg">
        Back
      </button>
      
      <h1 className='text-xl font-bold tracking-wide text-center'>{flashcards?.title}</h1>

      {!flashcards && (
        <div>Loading...</div>
      )}
      
      <div className=''>
        <div id='flashcardsSet' className="flex flex-row flex-wrap justify-around w-full p-3">
          {flashcards.cards?.map((card, index) => (
            <button key={index} onClick={(e)=>handleCardCLick(e,card.id)} className={`flex flex-wrap min-h-28 max-w-48 m-4 px-5 py-4 justify-center items-center rounded-xl border-[3px]  ${card.isFlipped ? 'bg-slate-900 text-green-200 border-cyan-600 ' + card.width : 'min-w-28 bg-slate-800 text-slate-200 border-slate-600'}`}>
              {card.isFlipped ? card.back : card.front}
            </button>
          ))}
        </div>
      </div>
    
    </div>
  );
};
