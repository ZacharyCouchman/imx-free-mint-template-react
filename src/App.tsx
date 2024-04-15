import { passport } from '@imtbl/sdk'
import { useEffect, useState } from 'react'
import { Provider, UserProfile } from '@imtbl/sdk/passport';
import { PassportButton } from './components/PassportButton';
import { parseJwt } from './utils/passport';
import './App.css'

function App({passportInstance}: {passportInstance: passport.Passport}) {
  const [userInfo, setUserInfo] = useState<UserProfile>();
  const [walletAddress, setWalletAddress] = useState<string>();

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
      {!userInfo && <PassportButton title="Sign in with Immutable" onClick={login} />}
      {userInfo && (
        <>
        <div className='user-info'>
          <PassportButton title="Logout" onClick={logout} />
          <div className='user-info-row'><strong>Id:</strong><p>{userInfo.sub}</p></div>
          <div className='user-info-row'><strong>Email:</strong><p>{userInfo.email}</p></div>
          {walletAddress && <div className='user-info-row'><strong>Wallet:</strong><p>{walletAddress}</p></div>}
        </div>
        <div className='docs-link-container'>
          <a href='https://docs.immutable.com/docs/zkEVM/products/passport' target='_blank'>Immutable zkEVM Docs</a>
          <a href='https://docs.immutable.com/docs/x/passport' target='_blank'>Immutable X Docs</a>
        </div>
        </>
      )}
    </div>
  )
}

export default App
