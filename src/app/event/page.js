// src/app/companies/page.js
import Link from 'next/link';

export default function Companies() {
  return (
    <div>
      <h1>Event</h1>
      <p>Här kommer information om LIA-eventet att visas.</p>
      <Link href="/">
        <button>Tillbaka till startsidan</button>
      </Link>
    </div>
  );
}