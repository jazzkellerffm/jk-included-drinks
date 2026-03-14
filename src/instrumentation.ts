export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Orders are stored in Supabase; no in-memory store to clear.
  }
}
