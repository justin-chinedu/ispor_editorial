import { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from "../../core/constants";

const client = new SupabaseClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
export default client;