import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <h1>Header placeholder</h1>
      <Link href="/companies">
        <button>companies</button>
      </Link>
      <Link href="/event">
        <button>event</button>
      </Link>
      <Link href="/instruments">
        <button>instruments</button>
      </Link>
   

      
    </header>
  );

  
}