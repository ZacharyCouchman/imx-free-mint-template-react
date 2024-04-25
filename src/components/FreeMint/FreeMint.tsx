import { Button, Card, CardBody, CardFooter, Image, Heading, Stack, useToast } from "@chakra-ui/react";
import { mintConfiguration } from "../../api/mintConfiguration";
import { eligibility } from "../../api/eligibility";
import { mint } from "../../api/mint";
import { useCallback, useContext, useEffect, useState } from "react";
import { EIP1193Context } from "../../contexts/EIP1193Context";
import { MintConfigurationResult } from "../../types/mintConfiguration";
import { MintPhaseDetails } from "../MintPhaseDetails/MintPhaseDetails";
import { WidgetType } from "@imtbl/sdk/checkout";
import { CheckoutContext } from "../../contexts/CheckoutContext";
import { EligibilityResult } from "../../types/eligibility";

export function FreeMint() {
  const {walletAddress, provider} = useContext(EIP1193Context);
  const {openWidget} = useContext(CheckoutContext);

  // Local state
  const [mintConfigLoading, setMintConfigLoading] = useState(false);
  const [mintConfigError, setMintConfigError] = useState(false);
  const [mintConfigResult, setMintConfigResult] = useState<MintConfigurationResult>();
  
  const [mintLoading, setMintLoading] = useState(false);
  const [mintError, setMintError] = useState(false);

  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibilityError, setEligibilityError] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult>();

  const toast = useToast();

  const fetchMintConfiguration = useCallback(async () => {
    setMintConfigLoading(true);
    try {
      const result = await mintConfiguration();
      setMintConfigResult(result);
      console.log("Mint configuration", result);
    } catch (err) {
      console.log(err);
      setMintConfigError(true);
      toast({
        title: "Failed to retrieve mint configuration",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setMintConfigLoading(false);
    }
  }, [])

  async function checkEligibility() {
    setEligibilityLoading(true);
    try {
      const result = await eligibility();
      setEligibilityResult(result)
      console.log(result);
    } catch (err) {
      console.log(err);
      setEligibilityError(true);
    } finally {
      setEligibilityLoading(false);
    }
  }

  async function mintButton() {
    setMintLoading(true);
    try {
      const result = await mint();
      console.log(result);
    } catch (err) {
      console.log(err);
      setMintError(true);
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
  }, [walletAddress])

  // recheck config and eligibility after countdown reaches deadline
  useEffect(() => {
    const reloadCheck = () => fetchMintConfiguration().then(() => checkEligibility());
    window.addEventListener('countdownDeadline', reloadCheck)

    return () => {
      window.removeEventListener('countdownDeadline', reloadCheck)
    }
  }, [fetchMintConfiguration])

  return (
    <Card minH={"650px"}  minW="sm" w={["100%", "430px"]}>
      {/* <CardHeader></CardHeader> */}
      <CardBody>
        <Stack mt="6" spacing="3" alignItems={"center"}>
          <Heading size="lg">Free Mint Title</Heading>
          <Image src="https://paradisetycoon.com/wp-content/uploads/2023/02/splash_logo_with_leaves_update.png" alt="Partner mint image" borderRadius="lg" />
          {(!mintConfigLoading && mintConfigResult) && <MintPhaseDetails mintPhases={mintConfigResult.mintPhases} />}
        </Stack>
      </CardBody>
      <CardFooter display={"flex"} flexDirection={"column"}>
          {(!walletAddress || !provider) && <Button variant="solid" colorScheme='blue' onClick={() => openWidget(WidgetType.CONNECT)}>Connect Wallet</Button>}
          {(walletAddress && provider && eligibilityResult && !eligibilityLoading) && (
            <Button 
            variant="solid" 
            colorScheme="blue" 
            isDisabled={!eligibilityResult?.phases.find((phase) => phase.isActive)?.isEligible || mintLoading} 
            onClick={mintButton}
            >
              Mint
            </Button>
          )}
      </CardFooter>
    </Card>
  );
}
