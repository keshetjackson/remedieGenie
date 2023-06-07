import { User } from "..";
export interface AuthState {
    isLoggingIn: boolean;
    isLoggedIn: boolean;
    user: User | null; 
    error: string | null;
  }
  
  