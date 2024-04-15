import PassportSymbol from '../assets/passport_logo_32px.svg?react';
import './PassportButton.css';

interface PassportButton {
  onClick: () => void;
}

export function PassportButton({onClick}: PassportButton) {
  return (
    <button onClick={onClick} className='passport-button'>
      <PassportSymbol height={32}/>
      <span>Sign in with Immutable</span>
    </button>
  )
}