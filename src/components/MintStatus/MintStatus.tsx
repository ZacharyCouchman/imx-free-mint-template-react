import { useEffect, useRef, useState } from 'react'
import { Mint } from '../../types/mint'
import { MintRequestByIDResult } from '../../types/mintRequestById'
import { Heading, Link, Text, VStack } from '@chakra-ui/react'
import config, { applicationEnvironment } from '../../config/config'
import { shortenAddress } from '../../utils/walletAddress'
import { mintRequestById } from '../../api/mintRequestById'
import Countdown from '../Countdown/Countdown'

interface MintStatus {
  mint: Mint;
  walletAddress: string;
}
export const MintStatus = ({ mint, walletAddress }: MintStatus) => {
  const [mintSucceeded, setMintSucceeded] = useState(false);
  const [mintStatusFailed, setMintStatusFailed] = useState(false);
  
  const mintStatusRequestCount = useRef(0);

  useEffect(() => {
    const checkMintStatus = async (uuid: string) => {
      const result: MintRequestByIDResult = await mintRequestById(uuid);
      
      if(mintStatusRequestCount.current === 4) {
        // if we get to here, stop trying.
        setMintStatusFailed(true);
        return;
      }

      if(result.result[0].status === "pending") {
        mintStatusRequestCount.current++;
        setTimeout(async () => await checkMintStatus(mint.uuid), 4000 * mintStatusRequestCount.current);
        return;
      }

      if(result.result[0].status === "succeeded"){
        localStorage.setItem("immutable-mint-request-result", JSON.stringify({...mint, status: 'succeeded'}))
        setMintSucceeded(true);
      }
    }

    if(mint) {
      // start polling from mint uuid
      setTimeout(async() => await checkMintStatus(mint.uuid), 10000);
    }
  }, [mint])

  return (
    <div>
      {!mintSucceeded && (
        <VStack gap={2} alignItems={'center'}>
          <Text>Mint request receieved. Please be patient. Checking your mint status in: </Text>
          <Countdown endTime={(Date.now() + 10000)/1000} deadlineEventTopic='countdownMintStatus' />
        </VStack>
      )}
      {!mintStatusFailed && mintSucceeded && (
        <VStack>
          <Heading fontSize={"x-large"} color={'blue.400'}>Mint Succeeded!</Heading>
          <Link onClick={() => window.open(`${config[applicationEnvironment].explorerUrl}/address/${walletAddress}?tab=token_transfers`, "_blank")}>Inpect token transactions {shortenAddress(walletAddress)}</Link>
        </VStack>
        )}
      {mintStatusFailed && <Text>There was a problem checking the status of your mint. Please be patient</Text>}
    </div>
  )
}