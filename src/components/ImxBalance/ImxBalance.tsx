import { Provider } from "@imtbl/sdk/passport";
import { useImxBalance } from "../../hooks/useImxBalance";
import { shortenAddress } from "../../utils/walletAddress";
import './ImxBalance.css'

interface ImxBalance {
  address: string;
  provider: Provider;
}
function ImxBalance({address, provider}: ImxBalance) {
  const {formattedBalance} = useImxBalance(provider, address);

  function copyAddress() {
    navigator.clipboard.writeText(address);
  }

  return (
    <div className="imx-balance">
      <img src="https://checkout-cdn.immutable.com/v1/blob/img/tokens/imx.svg" height={40} />
      <div className="balance-info">
        <strong>{formattedBalance.substring(0,10)}</strong>
        <p className="wallet-address-copy" onClick={copyAddress}>{shortenAddress(address)}</p>
        </div>
    </div>
  )
}

export default ImxBalance