import { Box, Button, Flex, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, theme, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react'
import PassportButton from '../PassportButton/PassportButton'
import { passportInstance, zkEVMProvider } from '../../immutable/passport';
import { UserProfile } from '@imtbl/sdk/passport';
import { shortenAddress } from '../../utils/walletAddress';
import ImxBalance from '../ImxBalance/ImxBalance';
import { parseJwt } from '../../utils/jwt';
import { ChevronDownIcon } from '@chakra-ui/icons';

export function AppHeaderBar() {
  const [userInfo, setUserInfo] = useState<UserProfile>();
  const [walletAddress, setWalletAddress] = useState<string>("");

  const headerBgColor = useColorModeValue(theme.colors.blackAlpha[300], theme.colors.blackAlpha[500])

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
  }

  function logout() {
    passportInstance.logout();
  }

  return (
    <Flex as={'nav'} 
      width={'100vw'} 
      height={'auto'} 
      p={4} 
      flexDirection={"row"} 
      alignItems={"center"} 
      justifyContent={"space-between"}
      bg={headerBgColor}
      >
      <Box>
        {/** Put logo in here */}
      </Box>
      <Box>
      {!userInfo ? (<PassportButton title="Sign in with Immutable" onClick={login} />) : (
        <Menu>
          <MenuButton as={Button} colorScheme='blue' rightIcon={<ChevronDownIcon />}>
            <Flex flexDirection="column">
              <Text>{shortenAddress(walletAddress)}</Text>
            </Flex>
          </MenuButton>
          <MenuList minW={40} w={60}>
            <ImxBalance address={walletAddress} provider={zkEVMProvider!} />
            <MenuDivider />
            {/* <MenuItem onClick={() => openWidget(WidgetType.WALLET)}>Balances (Widget)</MenuItem> */}
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      )}
      </Box>
    </Flex>
  )
}