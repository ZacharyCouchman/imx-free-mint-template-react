
export async function checkWhitelist(address: string): Promise<{ whitelisted: boolean }> {
  return Promise.resolve({ whitelisted: true });
  // // const accessToken = await passportInstance.getAccessToken();
  // const response = await fetch(`http://localhost:3000/mock/${address}`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     // "Authorization": `Bearer ${accessToken}`
  //   },
  // });

  // if (response.status >= 200 && response.status <= 299) return await response.json();

  // throw new Error(`${response.status} - Fetch check whitelist failed`);
}