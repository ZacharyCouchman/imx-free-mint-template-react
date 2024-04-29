import { Provider } from "@imtbl/sdk/passport";
import { useImxBalance } from "../../hooks/useImxBalance";
import { shortenAddress } from "../../utils/walletAddress";
import config, { applicationEnvironment } from "../../config/config";
import { Flex, Image, Text, IconButton, useClipboard, useToast, Link } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useEffect } from 'react';
import PassportSymbol from '../../assets/passport_logo_32px.svg?react';

interface ImxBalanceProps {
  address: string;
  provider: Provider;
}

function ImxBalance({ address, provider }: ImxBalanceProps) {
  const { loading, formattedBalance } = useImxBalance(provider, address);
  const { onCopy, hasCopied } = useClipboard(address.toLowerCase());
  const toast = useToast();

  useEffect(() => {
    // Only trigger the toast if the copy action has occurred
    if (hasCopied) {
      toast({
        title: "Address copied!",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  }, [hasCopied, toast]); // Add toast to dependency array to avoid exhaustive-deps warning

  function goToExplorer() {
    window.open(`${config[applicationEnvironment].explorerUrl}/address/${address}`, "_blank");
  }

  function handleCopy() {
    onCopy();
  }

  if (loading) return null;  // Render nothing if loading

  return (
    <Flex flexDir={"column"} gap="2" paddingX={3}>
      <Flex gap={2} alignItems={"center"}>
        <Image src="https://checkout-cdn.immutable.com/v1/blob/img/tokens/imx.svg" height="20px" width={"20px"} />
        <Text fontWeight="bold">{formattedBalance.substring(0, 10)}</Text>
      </Flex>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Flex gap={2}>
          <PassportSymbol height={"20px"} width={"20px"} />
          <Link cursor="pointer" onClick={goToExplorer}>
            {shortenAddress(address)}
          </Link>
        </Flex>
          <IconButton
          icon={<CopyIcon />}
          size="xs"
          aria-label="Copy address"
          onClick={handleCopy}
        />
      </Flex>
    </Flex>
  );
}

export default ImxBalance;
