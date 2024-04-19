import { Provider } from "@imtbl/sdk/passport";
import { useImxBalance } from "../../hooks/useImxBalance";
import { shortenAddress } from "../../utils/walletAddress";
import config, { applicationEnvironment } from "../../config/config";
import { Box, Flex, Image, Text, IconButton, useClipboard, useToast } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useEffect } from 'react';

interface ImxBalanceProps {
  address: string;
  provider: Provider;
}

function ImxBalance({ address, provider }: ImxBalanceProps) {
  const { loading, formattedBalance } = useImxBalance(provider, address);
  const { onCopy, hasCopied } = useClipboard(address);
  const toast = useToast();

  useEffect(() => {
    // Only trigger the toast if the copy action has occurred
    if (hasCopied) {
      toast({
        title: "Address copied!",
        status: "success",
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
    <Flex align="center" gap="2">
      <Image src="https://checkout-cdn.immutable.com/v1/blob/img/tokens/imx.svg" height="40px" />
      <Box flexDir="column">
        <Text fontSize="lg" fontWeight="bold">{formattedBalance.substring(0, 10)}</Text>
        <Flex align="center">
          <Text color="white" mr="2" cursor="pointer" onClick={goToExplorer}>
            {shortenAddress(address)}
          </Text>

        </Flex>
      </Box>
      <IconButton
            icon={<CopyIcon />}
            size="sm"
            aria-label="Copy address"
            onClick={handleCopy}
          />
    </Flex>
  );
}

export default ImxBalance;
