import { Button, Card, CardBody, CardFooter, Image, Heading, Stack, Text, useToast, ButtonGroup } from "@chakra-ui/react";
import { config } from "../../api/config";
import { eligibility } from "../../api/eligibility";
import { mint } from "../../api/mint";
import { useCallback, useContext, useEffect, useState } from "react";
import { EIP1193Context } from "../../contexts/EIP1193Context";

export function FreeMint() {
  const {walletAddress, provider} = useContext(EIP1193Context);

  // Local state
  const [mintConfigLoading, setMintConfigLoading] = useState(false);
  const [mintConfigError, setMintConfigError] = useState(false);
  
  const [mintLoading, setMintLoading] = useState(false);
  const [mintError, setMintError] = useState(false);

  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibilityError, setEligibilityError] = useState(false);

  const toast = useToast();

  const fetchMintConfiguration = useCallback(async () => {
    setMintConfigLoading(true);
    try {
      const result = await config();
      console.log("Mint configuration", result);
    } catch (err) {
      console.log(err);
      setMintConfigError(true);
    } finally {
      setMintConfigLoading(false);
    }
  }, [])

  // get free mint config on load
  useEffect(() => {
    fetchMintConfiguration();
  }, [fetchMintConfiguration]);

  async function mintButton() {
    setMintLoading(true);
    try {
      const result = await mint();
      console.log("whitelist", result);
    } catch (err) {
      console.log(err);
      setMintError(true);
    } finally {
      setMintLoading(false);
    }
  }

  async function checkEligibilityButton() {
    setEligibilityLoading(true);
    try {
      const result = await eligibility();
      console.log("whitelist", result);
    } catch (err) {
      console.log(err);
      setEligibilityError(true);
    } finally {
      setEligibilityLoading(false);
    }
  }

  useEffect(() => {
    if (mintConfigError) {
      toast({
        title: "Failed to retrieve mint configuration",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });

      setTimeout(() => {
        setMintConfigError(false);
      });
    }
  }, [mintConfigError, toast]);

  return (
    <Card minH={"650px"}  minW="sm" w={["100%", "430px"]}>
      {/* <CardHeader></CardHeader> */}
      <CardBody>
        <Image src="https://paradisetycoon.com/wp-content/uploads/2023/02/splash_logo_with_leaves_update.png" alt="Partner mint image" borderRadius="lg" />
        <Stack mt="6" spacing="3" alignItems={"center"}>
          <Heading size="lg">Free Mint</Heading>
          <Text>Some text about the mint event. Perhaps a countdown.</Text>
        </Stack>
      </CardBody>
      <CardFooter display={"flex"} flexDirection={"column"}>
        <ButtonGroup gap={2}>
        <Button variant="solid" colorScheme="blue" onClick={mintButton}>
          Mint
        </Button>
        {/* <Button variant="solid" colorScheme="blue" onClick={fetchMintConfiguration}>
          Config
        </Button> */}
        <Button variant="solid" colorScheme="blue" onClick={checkEligibilityButton}>
          Eligibility
        </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
