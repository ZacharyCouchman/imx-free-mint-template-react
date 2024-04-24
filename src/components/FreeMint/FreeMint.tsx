import { Button, Card, CardBody, CardFooter, Image, Heading, Stack, Text, useToast } from "@chakra-ui/react";
import { config } from "../../api/config";
import { eligibility } from "../../api/eligibility";
import { mint } from "../../api/mint";
import { useEffect, useState } from "react";

export function FreeMint() {
  const [whitelistLoading, setWhitelistLoading] = useState(false);
  const [whitelistError, setWhitelistError] = useState(false);

  const toast = useToast();

  async function mintButton() {
    setWhitelistLoading(true);
    try {
      const result = await mint();
      console.log("whitelist", result);
    } catch (err) {
      console.log(err);
      setWhitelistError(true);
    } finally {
      setWhitelistLoading(false);
    }
  }

  async function checkConfigButton() {
    setWhitelistLoading(true);
    try {
      const result = await config();
      console.log("whitelist", result);
    } catch (err) {
      console.log(err);
      setWhitelistError(true);
    } finally {
      setWhitelistLoading(false);
    }
  }

  async function checkEligibilityButton() {
    setWhitelistLoading(true);
    try {
      const result = await eligibility();
      console.log("whitelist", result);
    } catch (err) {
      console.log(err);
      setWhitelistError(true);
    } finally {
      setWhitelistLoading(false);
    }
  }

  useEffect(() => {
    if (whitelistError) {
      toast({
        title: "Failed to check whitelist",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });

      setTimeout(() => {
        setWhitelistError(false);
      });
    }
  }, [whitelistError]);

  return (
    <Card minH={"650px"} minW="sm" w={["100%", "430px"]}>
      {/* <CardHeader></CardHeader> */}
      <CardBody>
        <Image src="https://paradisetycoon.com/wp-content/uploads/2023/02/splash_logo_with_leaves_update.png" alt="Partner mint image" borderRadius="lg" />
        <Stack mt="6" spacing="3" alignItems={"center"}>
          <Heading size="lg">Free Mint</Heading>
          <Text>Some text about the mint event. Perhaps a countdown.</Text>
        </Stack>
      </CardBody>
      <CardFooter display={"flex"} flexDirection={"column"}>
        <Button variant="solid" colorScheme="blue" onClick={mintButton}>
          Mint
        </Button>
        <Button variant="solid" colorScheme="blue" onClick={checkConfigButton}>
          Config
        </Button>
        <Button variant="solid" colorScheme="blue" onClick={checkEligibilityButton}>
          Eligibility
        </Button>
      </CardFooter>
    </Card>
  );
}
