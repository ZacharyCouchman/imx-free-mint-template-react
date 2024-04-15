import { IMXProvider } from '@imtbl/sdk/x'
import { createOrder } from '../utils/immutableX';

interface ImmutableX {
  imxProvider: IMXProvider;
}

export default function ImmutableX({ imxProvider }: ImmutableX) {
  return (
    <div>
      <button onClick={() => createOrder(imxProvider)}>Create Order</button>
    </div>
  )
}