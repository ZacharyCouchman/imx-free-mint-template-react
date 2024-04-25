import config, { applicationEnvironment } from "../config/config";
import { passportInstance } from "../immutable/passport";

export async function eligibility(): Promise<void> {
  // return Promise.resolve({ whitelisted: true });
  const IDToken = await passportInstance.getIdToken();
  const response = await fetch(`${config[applicationEnvironment].mintingBackendApiBaseUrl}/eligibility`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${IDToken}`,
    },
  });

  if (response.status >= 200 && response.status <= 299) return await response.json();

  throw new Error(`${response.status} - Fetch check eligibility failed.`);
}
