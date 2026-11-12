// Kept apart from api.ts so client components (via catalog.ts) can import it
// without pulling in next/headers, which only works on the server.
export const API_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3034"
).replace(/\/$/, "");
