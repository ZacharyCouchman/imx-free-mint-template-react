import { Button, Card, CardBody, CardFooter, Image as ChakraImage, Heading, Text, VStack, useToast } from "@chakra-ui/react";
import { mintConfiguration } from "../../api/mintConfiguration";
import { eligibility } from "../../api/eligibility";
import { useCallback, useContext, useEffect, useState } from "react";
import { EIP1193Context } from "../../contexts/EIP1193Context";
import { MintConfigurationResult } from "../../types/mintConfiguration";
import { MintPhaseDetails } from "../MintPhaseDetails/MintPhaseDetails";
import { EligibilityResult } from "../../types/eligibility";
import { Mint } from "../../types/mint";
import { MintStatus } from "../MintStatus/MintStatus";
import { WidgetType } from "@imtbl/sdk/checkout";
import { CheckoutContext } from "../../contexts/CheckoutContext";
import { mintForPassport } from "../../api/mintForPassport";
import { mintForEOA } from "../../api/mintForEOA";
import { eoaSignableMessage } from "../../api/eoaSignableMessage";

export function FreeMint() {
  const {walletAddress, provider, isPassportProvider} = useContext(EIP1193Context);
  const {openWidget} = useContext(CheckoutContext);

  // Local state
  const [mintConfigLoading, setMintConfigLoading] = useState(false);
  const [mintConfigResult, setMintConfigResult] = useState<MintConfigurationResult>();
  
  const [mintLoading, setMintLoading] = useState(false);
  const [mintResult, setMintResult] = useState<Mint | null>(null);

  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult>();

  const eligiblityActivePhase = eligibilityResult?.mintPhases
  .find((phase) => phase.isActive);

  const toast = useToast();

  const fetchMintConfiguration = useCallback(async () => {
    setMintConfigLoading(true);
    try {
      const result = await mintConfiguration();
      console.log(result)
      setMintConfigResult(result);
    } catch (err) {
      console.log(err);
      toast({
        title: "Failed to retrieve mint configuration",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setMintConfigLoading(false);
    }
  }, [toast])

  const checkEligibility = useCallback(async (walletAddress: string) => {
    setEligibilityLoading(true);
    try {
      const result = await eligibility(walletAddress);
      setEligibilityResult(result)
    } catch (err) {
      console.log(err);
      toast({
        title: "Failed to check mint eligibility",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setEligibilityLoading(false);
    }
  },[toast]);

  const signMessage = useCallback(async (message: string): Promise<string> => {
    if(!provider) return "";
    try { 
      return await provider.getSigner().signMessage(message);
    } catch(err) {
      console.error(err);
      return "";
    }
  }, [provider])

  const mintButton = useCallback(async () => {
    setMintLoading(true);
    let result: Mint;
    try{
      if(isPassportProvider) {
        // mint for Passport using JWT
        result = await mintForPassport();
      } else {
        // mint for EOA using signMessage
        const messageToSign = await eoaSignableMessage();
        const signature = await signMessage(messageToSign.serverConfig);
        console.log(signature);
        if(!signature) {
          console.log("User must sign message to continue")
          toast({
            title: "You must sign the message to continue",
            position: 'bottom-right',
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
          return;
        }
        result = await mintForEOA(signature);
      }

      setMintResult(result);
      localStorage.setItem("immutable-mint-request-result", JSON.stringify({...result, status: "pending"}))
      toast({
        title: "Minting request received! Please wait...",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch(err) {
      console.error(err)
    } finally {
      setMintLoading(false);
    }
  }, [isPassportProvider, toast, signMessage]);

  // get mint config on load
  useEffect(() => {
    fetchMintConfiguration();
  }, [fetchMintConfiguration]);

  // check eligibility when user connects
  useEffect(() => {
    if(walletAddress) checkEligibility(walletAddress);
  }, [walletAddress, checkEligibility])

  // recheck config and eligibility after countdown reaches deadline
  useEffect(() => {
    if(!walletAddress) return;
    const reloadCheck = () => fetchMintConfiguration().then(() => checkEligibility(walletAddress));
    window.addEventListener('countdownMintPhase', reloadCheck)

    return () => {
      window.removeEventListener('countdownMintPhase', reloadCheck)
    }
  }, [walletAddress, fetchMintConfiguration, checkEligibility])

  useEffect(() => {
    if(!mintResult && walletAddress) {
      const lsMintResultString = localStorage.getItem("immutable-mint-request-result");
      if(!lsMintResultString) return;
      
      const restoredMintResult: Mint = JSON.parse(lsMintResultString);

      if(restoredMintResult.walletAddress.length > 0
        && walletAddress.length > 0 
        && restoredMintResult.walletAddress.toLowerCase() === walletAddress.toLowerCase()) {
        console.log('restoring mint result from localstorage', restoredMintResult)
        // current wallet address matches previous mint result in localstorage
        setMintResult(restoredMintResult)
      }
    }
  }, [mintResult, walletAddress])

  // Edge case for when changing wallet addresses
  useEffect(() => {
    if(!walletAddress) setMintResult(null);
  }, [walletAddress])

  return (
    <Card minW="xs" w={["100%", "430px"]} bgColor={'rgba(0,0,0,0.75)'}>
      <CardBody>
        <VStack mt="6" gap={4} alignItems={"center"}>
          <Heading size="lg">Free Mint Pass</Heading>
          <Text>Mint your free pass for exclusive access and rewards</Text>
          <ChakraImage 
            src="https://checkout-cdn.immutable.com/v1/blob/img/tokens/imx.svg" 
            alt="Example Image" 
            width={["250px", "300px"]}
            />
          {(!mintConfigLoading && mintConfigResult) && <MintPhaseDetails mintPhases={mintConfigResult.mintPhases} />}
        </VStack>
      </CardBody>
      <CardFooter display={"flex"} flexDirection={"column"}>
          {(!walletAddress || !provider) && <Button variant="solid" colorScheme='blue' onClick={() => openWidget(WidgetType.CONNECT)}>Connect Wallet</Button>}
          {(walletAddress && provider && eligibilityResult && !eligibilityLoading && !mintResult) && (
            <Button 
            variant="solid" 
            colorScheme="blue" 
            isDisabled={!eligiblityActivePhase 
              || !eligiblityActivePhase.isEligible 
              || (eligiblityActivePhase.walletTokenAllowance && eligiblityActivePhase.walletTokenAllowance === 0) 
              || mintLoading 
              || Boolean(mintResult)
            }
            onClick={mintButton}
            >
              Mint
            </Button>
          )}
          {mintResult && walletAddress && <MintStatus mint={mintResult} walletAddress={walletAddress} />}
      </CardFooter>
    </Card>
  );
}