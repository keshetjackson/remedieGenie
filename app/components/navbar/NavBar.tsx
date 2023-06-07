"use client"
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState, store } from '@/app/modules/redux/store';
import { SignOutButton } from '@/app/modules/firebase/signOut';
import SignInButton from '@/app/modules/firebase/SignInButton';

export const Navbar = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const handleGetState = () => {
    console.log(store.getState().auth)
 }

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
        <Link href='/'>home</Link>
        {isLoggedIn ? (
        <>
        <SignOutButton/>
        <Link href="/subscription">subscribe</Link>
        </>
        ) : <SignInButton/>}
        <button onClick={handleGetState}>get state</button>
    </nav>
  );
};

