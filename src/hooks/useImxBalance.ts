import { Provider } from "@imtbl/sdk/passport";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";

export function useImxBalance(provider: Provider, address: string) {
  const [imxBalance, setImxBalance] = useState(new BigNumber(0));
  const [loading, setLoading] = useState(false);

  // fetch balance for walletAddress
  useEffect(() => {
    if (!provider || !address) return;
    setLoading(true);
    provider.request({ method: 'eth_getBalance', params: [address, 'latest'] })
      .then((balance) => {
        setImxBalance(new BigNumber(balance))
        setLoading(false);
      })
  }, [provider, address])

  return {
    loading,
    balance: imxBalance,
    formattedBalance: (imxBalance.div(new BigNumber(10 ** 18))).toString() // format as IMX has 18 decimals
  }
}