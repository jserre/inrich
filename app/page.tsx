import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Hello World! 👋</h1>
        <p className="text-xl mb-4">Welcome to my first Next.js app</p>
        <Link 
          href="/notion" 
          className="text-blue-500 hover:text-blue-700 underline"
        >
          View Notion Database Structure
        </Link>
      </div>
    </main>
  );
}