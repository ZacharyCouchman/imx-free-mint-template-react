import { passport } from "@imtbl/sdk";
import { useContext, useEffect, useState } from "react";
import { Provider, UserProfile } from "@imtbl/sdk/passport";
import { PassportButton } from "./components/PassportButton/PassportButton";
import { parseJwt } from "./utils/jwt";
import "./App.css";
import ImxBalance from "./components/ImxBalance/ImxBalance";
import { CheckoutContext } from "./contexts/CheckoutContext";
import { OrchestrationEventType, RequestBridgeEvent, RequestOnrampEvent, RequestSwapEvent, WalletEventType } from "@imtbl/sdk/checkout";
import { Web3Provider } from '@ethersproject/providers';

function App({ passportInstance }: { passportInstance: passport.Passport }) {
  const [userInfo, setUserInfo] = useState<UserProfile>();
  const [walletAddress, setWalletAddress] = useState<string>("");

  // Providers to use for Immmutable zkEVM and ImmutableX
  const [zkEVMProvider, setZkEVMProvider] = useState<Provider>();
  // const [imxProvider, setImxProvider] = useState<IMXProvider>();

  const {widgets: {wallet, bridge, swap, onramp}, widgetsFactory} = useContext(CheckoutContext);

  useEffect(() => {
    // create zkEVMProvider to use Passport with Immutable zkEVM
    setZkEVMProvider(passportInstance.connectEvm());

    // create ImxProvider to use Passport with ImmutableX
    // passportInstance.connectImx().then((imxProvider) => setImxProvider(imxProvider))
  }, [passportInstance]);

  async function login() {
    try {
      await zkEVMProvider?.request({ method: "eth_requestAccounts" });
    } catch (err) {
      console.log("Failed to login");
      console.error(err);
    }

    try {
      const userProfile = await passportInstance.getUserInfo();
      setUserInfo(userProfile);
    } catch (err) {
      console.log("Failed to fetch user info");
      console.error(err);
    }

    try {
      const idToken = await passportInstance.getIdToken();
      console.log(idToken);
      const parsedIdToken = parseJwt(idToken!);
      console.log(parsedIdToken);
      console.log("parsing ID token");
      console.log(`wallet address: ${parsedIdToken.passport.zkevm_eth_address}`);
      setWalletAddress(parsedIdToken.passport.zkevm_eth_address);
    } catch (err) {
      console.log("Failed to fetch idToken");
      console.error(err);
    }

    // inject Passport's zkEVM provider into widgets using the widgetFactory.updateProvider
    widgetsFactory?.updateProvider(new Web3Provider(zkEVMProvider!))
  }

  function logout() {
    passportInstance.logout();
  }

  function openWalletBalances() {
    wallet!.mount('widget-target');
    wallet?.addListener(WalletEventType.DISCONNECT_WALLET, () => {
      logout();
    })
    wallet!.addListener(OrchestrationEventType.REQUEST_BRIDGE, (data: RequestBridgeEvent) => {
      wallet?.unmount();
      bridge?.mount('widget-target', {...data})
    })
    wallet!.addListener(OrchestrationEventType.REQUEST_SWAP, (data: RequestSwapEvent) => {
      wallet?.unmount();
      swap?.mount('widget-target', {...data})
    })
    wallet!.addListener(OrchestrationEventType.REQUEST_ONRAMP, (data: RequestOnrampEvent) => {
      wallet?.unmount();
      onramp?.mount('widget-target', {...data})
    })
  }

  return (
    <div id="app">
      <div className="header">
        {!userInfo && <PassportButton title="Sign in with Immutable" onClick={login} />}
        {userInfo && (
          <div className="logout">
            <ImxBalance provider={zkEVMProvider!} address={walletAddress} />
            <button onClick={openWalletBalances}>Balances</button>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>
      <div className="widget-container">
        <div id="widget-target"/>
      </div>
    </div>
  );
}

export default App;
