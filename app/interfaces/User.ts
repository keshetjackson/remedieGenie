export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    isSubscribed: boolean;
    provider: any | null;
    // add any other properties you need from the Firebase User object
  }