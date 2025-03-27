// src/app/companies/page.js
import Link from 'next/link';

export default function Companies() {
  return (
    <div>
      <h1>Företagssida</h1>
      <p>Här kommer information om företag att visas.</p>
      <Link href="/">
        <button>Tillbaka till startsidan</button>
      </Link>
    </div>
  );
}