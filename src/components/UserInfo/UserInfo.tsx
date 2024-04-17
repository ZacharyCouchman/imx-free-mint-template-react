import "./UserInfo.css"

interface UserInfo {
  id: string;
  email: string;
  walletAddress: string;
}

export default function UserInfo({
  id,
  email,
  walletAddress
}: UserInfo) {
  return (
    <div className='user-info'>
      <div className='user-info-row'><strong>Id:</strong><p>{id}</p></div>
      <div className='user-info-row'><strong>Email:</strong><p>{email}</p></div>
      {walletAddress && <div className='user-info-row'><strong>Wallet:</strong><p>{walletAddress}</p></div>}
    </div>
  )
}


{/* <div className='docs-link-container'>
        <a href='https://docs.immutable.com/docs/zkEVM/products/passport' target='_blank'>Immutable zkEVM Docs</a>
        <a href='https://docs.immutable.com/docs/x/passport' target='_blank'>Immutable X Docs</a>
      </div> */}