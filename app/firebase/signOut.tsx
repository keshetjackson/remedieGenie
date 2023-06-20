"use client"
import { useDispatch } from "react-redux";
import { logout } from "../redux";
import { signOut } from "firebase/auth";
import { auth  } from "./index";
import { store } from ".././redux";



export const SignOutButton = () => {
   const dispatch = useDispatch();

   const handleSignOut = () => {
    try {
        dispatch(logout())
        signOut(auth);
        console.log(store.getState());
    } catch (error) {
        
    }
   };
   return (
    <div>
        <button className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" onClick={handleSignOut}>sign out</button>
    </div>
   )
};