import config, { applicationEnvironment } from "../config/config";

export async function mintConfigurationg(): Promise<void> {
  // return Promise.resolve({ whitelisted: true });
  const response = await fetch(`${config[applicationEnvironment].mintingBackendApiBaseUrl}/config`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status >= 200 && response.status <= 299) return await response.json();

  throw new Error(`${response.status} - Fetch check config failed`);
}
