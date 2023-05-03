import { User } from "@supabase/supabase-js";
import { LoginCredentials } from "../models/auth/login_cred";
import { SignupCredentials } from "../models/auth/signup_cred";
import { SupabaseAuthService } from "./supabase_auth";

export interface AuthServiceI {
    getUser(): Promise<User | null>;
    loginUser(cred: LoginCredentials): Promise<User>;
    signupUser(cred: SignupCredentials): Promise<User>;
    signOutUser(): Promise<void>;
}

const authService: AuthServiceI = new SupabaseAuthService();
export default authService;