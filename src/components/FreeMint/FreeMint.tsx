import { Button, Card, CardBody, CardFooter, Image, Heading, Stack, Text, useToast } from '@chakra-ui/react'
import { checkWhitelist } from '../../api/checkWhitelist'
import { useEffect, useState } from 'react';

export function FreeMint() {

  const [whitelistLoading, setWhitelistLoading] = useState(false);
  const [whitelistError, setWhitelistError] = useState(false);

  const toast = useToast();


  async function mint() {
    setWhitelistLoading(true);
    try{
      const result = await checkWhitelist("0x09833d7d1416dc269e11c87115775f8346c46048");
      console.log("whitelist", result);
    } catch(err) {
      console.log(err);
      setWhitelistError(true);
    } finally {
      setWhitelistLoading(false)
    }
  }

  useEffect(() => {
    if(whitelistError) {
      toast({
        title: 'Failed to check whitelist',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right'
      })

      setTimeout(() => {
        setWhitelistError(false);
      })
    }

  }, [whitelistError]);

  return (
      <Card minH={"650px"} minW="sm" w={['100%', '430px']}>
      {/* <CardHeader></CardHeader> */}
      <CardBody>
        <Image
          src='https://paradisetycoon.com/wp-content/uploads/2023/02/splash_logo_with_leaves_update.png'
          alt='Partner mint image'
          borderRadius='lg'
        />
        <Stack mt='6' spacing='3' alignItems={"center"}>
          <Heading size='lg'>Free Mint</Heading>
          <Text>
            Some text about the mint event.
            Perhaps a countdown.
          </Text>
        </Stack>
      </CardBody>
      <CardFooter display={"flex"} flexDirection={"column"}>
        <Button disabled={whitelistLoading} variant='solid' colorScheme='blue' onClick={mint}>
          Mint
        </Button>
      </CardFooter>
    </Card>
  )
}