import { User } from "@supabase/supabase-js";
import { LoginCredentials } from "../models/auth/login_cred";
import { SignupCredentials } from "../models/auth/signup_cred";
import { AuthServiceI } from "./auth";
import client from "./supabase";

export class SupabaseAuthService implements AuthServiceI {
    async getUser(): Promise<User | null> {

        const resp = await client.auth.getUser();
        if (resp.error) {
            throw resp.error
        } else if (resp.data.user) {
            return resp.data.user;
        }
        return null;
    }
    async signOutUser(): Promise<void> {
        const error = await client.auth.signOut();
        if (error) {
            throw error
        }
    }

    async loginUser(cred: LoginCredentials): Promise<User> {
        const resp = await client.auth.signInWithPassword(cred);
        if (resp.error) {
            throw resp.error
        } else if (resp.data.user) {
            return resp.data.user;
        }
        throw Error("Unable to login user")
    }

    async signupUser(cred: SignupCredentials): Promise<User> {
        const resp = await client.auth.signUp(cred);
        if (resp.error) {
            throw resp.error
        } else if (resp.data.user) {
            return resp.data.user;
        }
        throw Error("Unable to signup user")
    }

}

