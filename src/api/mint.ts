import { passportInstance } from "../immutable/passport";

export async function mint(): Promise<void> {
  // return Promise.resolve({ whitelisted: true });
  const IDToken = await passportInstance.getIdToken();
  const response = await fetch(`http://localhost:3000/mint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${IDToken}`,
    },
    body: JSON.stringify({}),
  });

  if (response.status >= 200 && response.status <= 299) return await response.json();

  throw new Error(`${response.status} - Mint post failed.`);
}
