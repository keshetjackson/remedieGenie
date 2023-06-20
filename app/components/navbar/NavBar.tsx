"use client"
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState, store } from '../../redux';
import { SignOutButton,SignInButton } from '../../firebase';
import { Button } from '../button/button';
import './Navbar.css'

export const Navbar = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const handleGetState = () => {
    console.log(store.getState().auth)
 }

  return (
    <nav className="nav flex items-center justify-between flex-wrap p-5">
        <Link className=' link text-2xl  font-bold text-green-500' href='/'>RemedieGenie</Link>
        <Button handleClick={() => console.log("click")}>click</Button>
        <Link href='/chat'>Genie</Link>
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

