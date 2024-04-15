import { IMXProvider, TokenAmount } from "@imtbl/sdk/x"

export async function createOrder(imxProvider: IMXProvider) {
  const unsignedOrderRequest = {
    buy: {
      amount: '10000000000000000',
      type: 'ETH',
    } as TokenAmount,
    sell: {
      amount: '1',
      tokenAddress: '0xacb3c6a43d15b907e8433077b6d38ae40936fe2c',
      tokenId: '164419351',
      type: 'ERC721'
    } as TokenAmount
    // expiration_timestamp?: number;
    // fees?: Array<FeeEntry>;
  }
  try {
    const response = await imxProvider.createOrder(unsignedOrderRequest);
    console.log("create order response", response)
    return response;
  } catch (err) {
    console.error(err)
  }
}