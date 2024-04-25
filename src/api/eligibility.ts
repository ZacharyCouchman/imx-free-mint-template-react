import config, { applicationEnvironment } from "../config/config";
import { passportInstance } from "../immutable/passport";
import { EligibilityResult } from "../types/eligibility";

export async function eligibility(): Promise<EligibilityResult> {
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
