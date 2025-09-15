import { createClient } from "@supabase/supabase-js";
import { DB_KEY, DB_URL } from "@/config/";
import { Database } from "./types";

const supabase = createClient<Database>(DB_URL, DB_KEY);

export default supabase;
