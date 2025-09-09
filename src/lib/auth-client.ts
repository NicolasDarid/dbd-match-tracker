import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: "https://dbd-match-tracker.vercel.app",
});
