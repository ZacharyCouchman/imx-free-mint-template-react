// App.tsx
import { Box, Button, Menu, MenuButton, MenuList, MenuItem, Flex, Text, useDisclosure, theme, MenuDivider } from '@chakra-ui/react';
import { passport } from "@imtbl/sdk";
import { useContext, useEffect, useState } from "react";
import { Provider, UserProfile } from "@imtbl/sdk/passport";
import { PassportButton } from "./components/PassportButton/PassportButton";
import { parseJwt } from "./utils/jwt";
import { CheckoutContext } from "./contexts/CheckoutContext";
import { WidgetType } from "@imtbl/sdk/checkout";
import { Web3Provider } from '@ethersproject/providers';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { shortenAddress } from './utils/walletAddress';
import WidgetModal from './components/WidgetModal/WidgetModal';
import ImxBalance from './components/ImxBalance/ImxBalance';

function App({ passportInstance }: { passportInstance: passport.Passport }) {
  const [userInfo, setUserInfo] = useState<UserProfile>();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [zkEVMProvider, setZkEVMProvider] = useState<Provider>();
  const {widgetsFactory} = useContext(CheckoutContext);
  const [selectedWidget, setSelectedWidget] = useState(WidgetType.WALLET);
  const {isOpen, onOpen, onClose} = useDisclosure();

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

  function openWidget(widgetType: WidgetType) {
    setSelectedWidget(widgetType);
    onOpen();
  }

  return (
    <Box id="app" minW="100vw" minH="100vh" display="flex" flexDirection="column">
    <Box className="header" h="64px" px={4} display="flex" justifyContent="flex-end" alignItems="center">
      {!userInfo ? (
        <PassportButton title="Sign in with Immutable" onClick={login} />
      ) : (
        <Menu>
          <MenuButton as={Button} bg={theme.colors.blackAlpha[50]} rightIcon={<ChevronDownIcon />}>
            <Flex flexDirection="column">
              <Text>{shortenAddress(walletAddress)}</Text>
            </Flex>
          </MenuButton>
          <MenuList minW={40} w={60}>
            <ImxBalance address={walletAddress} provider={zkEVMProvider!} />
            <MenuDivider />
            <MenuItem onClick={() => openWidget(WidgetType.WALLET)}>Balances (Widget)</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      )}
    </Box>
    <WidgetModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} widgetType={selectedWidget} />
  </Box>
  );
}

export default App;
