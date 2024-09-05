'use client'

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Header() {
  
  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: "w-10 h-10",
    },
  };

  return (
    <header className='flex fixed w-full justify-between bg-slate-800 py-4 px-6'>
      <Link href="/"><h3 className='inline-block font-serif tracking-widest text-2xl text-slate-300'>
        AI FlashCards
      </h3></Link>
      
      <SignedOut> <SignInButton className="border-2 border-slate-600 py-1 px-2 rounded-lg bg-gray-900 text-slate-300" /> </SignedOut>
      <SignedIn> 
        <div className='flex'> <UserButton  appearance={userButtonAppearance} /> </div>
      </SignedIn>
    </header>    
  );
}
