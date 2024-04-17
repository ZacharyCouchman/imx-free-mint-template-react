import { passport } from '@imtbl/sdk'
import { useEffect, useState } from 'react'
import { Provider, UserProfile } from '@imtbl/sdk/passport';
import { PassportButton } from './components/PassportButton/PassportButton';
import { parseJwt } from './utils/jwt';
import './App.css'
import ImxBalance from './components/ImxBalance/ImxBalance';

function App({passportInstance}: {passportInstance: passport.Passport}) {
  const [userInfo, setUserInfo] = useState<UserProfile>();
  const [walletAddress, setWalletAddress] = useState<string>('');

  // Providers to use for Immmutable zkEVM and ImmutableX
  const [zkEVMProvider, setZkEVMProvider] = useState<Provider>();
  // const [imxProvider, setImxProvider] = useState<IMXProvider>();

  useEffect(() => {
    // create zkEVMProvider to use Passport with Immutable zkEVM
    setZkEVMProvider(passportInstance.connectEvm());

    // create ImxProvider to use Passport with ImmutableX
    // passportInstance.connectImx().then((imxProvider) => setImxProvider(imxProvider))
    
  }, [passportInstance]);

  async function login(){
    try{
      await zkEVMProvider?.request({ method: 'eth_requestAccounts' });
    } catch(err) {
      console.log("Failed to login");
      console.error(err);
    }

    try{
      const userProfile = await passportInstance.getUserInfo();
      setUserInfo(userProfile)
    } catch(err) {
      console.log("Failed to fetch user info");
      console.error(err);
    }

    try{
      const idToken = await passportInstance.getIdToken();
      const parsedIdToken = parseJwt(idToken!);
      setWalletAddress(parsedIdToken.passport.imx_eth_address)
    } catch(err) {
      console.log("Failed to fetch idToken");
      console.error(err);
    }
  }

  function logout(){
    passportInstance.logout();
  }

  return (
    <div id="app">
      <div className='header'>
        {!userInfo && <PassportButton title="Sign in with Immutable" onClick={login} />}
        {userInfo && <div className='logout'>
          <ImxBalance provider={zkEVMProvider!} address={walletAddress} />
          <button onClick={logout}>Logout</button>
        </div>}
      </div>
    </div>
  )
}

export default App
