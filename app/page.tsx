import Link from 'next/link';
import { Suspense } from 'react';
import ProfileViewer from './components/ProfileViewer';

interface PageProps {
  params: Promise<any>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Home({ params, searchParams }: PageProps) {
  const profileUrl = (await params).p as string | undefined;

  if (profileUrl) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <ProfileViewer profileUrl={profileUrl} />
        </Suspense>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Notion Database Explorer</h1>
        <p className="text-xl mb-4">Browse and explore your Notion databases</p>
        <div className="space-y-4">
          <div>
            <Link 
              href="/databases" 
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