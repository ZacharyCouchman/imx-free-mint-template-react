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
import { mint } from "../../api/mint";

export function FreeMint() {
  const {walletAddress, provider} = useContext(EIP1193Context);
  const {openWidget} = useContext(CheckoutContext);

  // Local state
  const [mintConfigLoading, setMintConfigLoading] = useState(false);
  const [mintConfigResult, setMintConfigResult] = useState<MintConfigurationResult>();
  
  const [mintLoading, setMintLoading] = useState(false);
  const [mintResult, setMintResult] = useState<Mint>();

  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult>();

  const toast = useToast();

  const fetchMintConfiguration = useCallback(async () => {
    setMintConfigLoading(true);
    try {
      const result = await mintConfiguration();
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

  const checkEligibility = useCallback(async () => {
    setEligibilityLoading(true);
    try {
      const result = await eligibility();
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

  async function mintButton() {
    setMintLoading(true);
    try {
      const result = await mint();
      localStorage.setItem("immutable-mint-request-result", JSON.stringify({...result, status: "pending"}))
      setMintResult(result);
      toast({
        title: "Minting request received! Please wait...",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setMintLoading(false);
    }
  }

  // get mint config on load
  useEffect(() => {
    fetchMintConfiguration();
  }, [fetchMintConfiguration]);

  // check eligibility when user connects
  useEffect(() => {
    if(walletAddress) checkEligibility();
  }, [walletAddress, checkEligibility])

  // recheck config and eligibility after countdown reaches deadline
  useEffect(() => {
    const reloadCheck = () => fetchMintConfiguration().then(() => checkEligibility());
    window.addEventListener('countdownMintPhase', reloadCheck)

    return () => {
      window.removeEventListener('countdownMintPhase', reloadCheck)
    }
  }, [fetchMintConfiguration, checkEligibility])

  useEffect(() => {
    if(!mintResult && walletAddress) {
      const lsMintResultString = localStorage.getItem("immutable-mint-request-result");
      if(!lsMintResultString) return;
      console.log('restoring mint result from localstorage')
      const restoredMintResult = JSON.parse(lsMintResultString);
      if(restoredMintResult.walletAddress.toLowerCase() === walletAddress.toLowerCase()) {
        // current wallet address matches previous mint result in localstorage
        setMintResult(restoredMintResult)
      }
    }
  }, [mintResult, walletAddress])

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
            isDisabled={!eligibilityResult?.mintPhases.find((phase) => phase.isActive)?.isEligible || mintLoading || Boolean(mintResult)} 
            onClick={mintButton}
            >
              Mint
            </Button>
          )}
          {mintResult && <MintStatus mint={mintResult} walletAddress={walletAddress} />}
      </CardFooter>
    </Card>
  );
}