import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Notion Database Explorer</h1>
        <p className="text-xl mb-4">Browse and explore your Notion databases</p>
        <div className="space-y-4">
          <div>
            <Link 
              href="/notion/databases-list" 
              className="text-blue-500 hover:text-blue-700 underline"
            >
              View Your Databases →
            </Link>
          </div>
          <div>
            <Link 
              href="/linkedin" 
              className="text-blue-500 hover:text-blue-700 underline"
            >
              LinkedIn Profile Viewer →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}