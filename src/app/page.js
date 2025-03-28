import Link from 'next/link';


export default function Home() {
  return (
    <div>
      <h1>Välkommen till min app</h1>
      <Link href="/companies">
        <button>Visa företag</button>
      </Link>
    </div>
  );
}