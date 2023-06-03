"use client"
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { signOut } from "firebase/auth";
import { auth  } from "./firebaseApp";
import { store } from "../redux/store";



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