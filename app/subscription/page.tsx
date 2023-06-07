"use client"
import React from "react";
import { selectUserUid, store } from "../modules";
import { updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { selectSubscription, selectUserName, updateSubscription, getUserDocRef} from "../modules";

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
        <button onClick={handleSubscribe}>unsubscribe</button>
        </>
        :
        <>
        <button onClick={handleUnSubscribe}>subscribe</button>
        </>}
        </>
    )
}

export default Page;