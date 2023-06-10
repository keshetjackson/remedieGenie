"use client"
import React from "react";
import { selectSubscription, selectUserName, updateSubscription,selectUserUid, store } from "../redux";
import { updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { getUserDocRef } from "../firebase";

const Page = async() => {
    const isSubscribed = useSelector(selectSubscription);
    const userUid = useSelector(selectUserUid);
    const dispatch = useDispatch();
    const docRef = await getUserDocRef(userUid!)

    const handleSubscribe = async() => {  
        if (!docRef) {
          console.log('docRef is undefined');
          return;
        }
      
        await updateDoc(docRef, {  
          isSubscribed: true  
        })  
        dispatch(updateSubscription(true));  
      }
      

    const handleUnSubscribe = async() => {
        if(docRef)
        await updateDoc(docRef, {
            isSubscribed: false
        })
        dispatch(updateSubscription(false));
    }

    return (
        <>
        {isSubscribed ? 
        <>
        <button onClick={handleUnSubscribe}>unsubscribe</button>
        </>
        :
        <>
        <button onClick={handleSubscribe}>subscribe</button>
        </>}
        </>
    )
}

export default Page;