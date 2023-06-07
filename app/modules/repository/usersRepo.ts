import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "..";
import { User } from "..";

class UserRepository {
  async getUserDoc(user : any): Promise<User> {
    const userDocRef = doc(db, "users", user.uid);
  
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      return this.createUserDoc(user);
    }
  }

  async createUserDoc(user: any): Promise<User> {
    const userDocRef = doc(db, "users", user.uid);
  
    const userDocData = {
      email: user.email,
      displayName: user.displayName,
      provider: user.providerId,
      uid: user.uid,
      docRef: userDocRef,
      isSubscribed: false // Default to false if the user document doesn't exist yet
    };
  
    await setDoc(userDocRef, userDocData, {merge:true});

    return userDocData;
  }
}

export const userRepository = new UserRepository();
