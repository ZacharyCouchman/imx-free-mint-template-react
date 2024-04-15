import PassportSymbol from '../assets/passport_logo_32px.svg?react';
import './PassportButton.css';

interface PassportButton {
  title: string;
  onClick: () => void;
}

export function PassportButton({title, onClick}: PassportButton) {
  return (
    <button onClick={onClick} className='passport-button'>
      <PassportSymbol height={32}/>
      <span className='passport-button-title'>{title}</span>
    </button>
  )
}