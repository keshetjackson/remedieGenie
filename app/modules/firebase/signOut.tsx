"use client"
import { useDispatch } from "react-redux";
import { logout } from "..";
import { signOut } from "firebase/auth";
import { auth  } from "..";
import { store } from "..";



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
        <button onClick={handleSignOut}>sign out</button>
    </div>
   )
};