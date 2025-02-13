'use client';

import { useState } from 'react';

export default function LinkedInPage() {
  const [profileUrl, setProfileUrl] = useState('');
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testProfile = 'https://www.linkedin.com/in/jean-marc-jancovici/';

  const fetchProfile = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/linkedin/profile?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }
      
      setProfileData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-8 bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-bold mb-4">LinkedIn Profile Viewer</h1>
      
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
          placeholder="Enter LinkedIn profile URL"
          className="flex-1 p-2 border rounded bg-gray-800 text-gray-100 border-gray-700"
        />
        <button
          onClick={() => fetchProfile(profileUrl)}
          disabled={loading || !profileUrl}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-700"
        >
          {loading ? 'Loading...' : 'Fetch Profile'}
        </button>
        <button
          onClick={() => fetchProfile(testProfile)}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-700"
        >
          Test with Sample Profile
        </button>
      </div>

      {error && (
        <div className="text-red-400 mb-4 p-4 bg-red-900/50 rounded">
          Error: {error}
        </div>
      )}

      {profileData && (
        <pre className="bg-gray-800 p-4 rounded overflow-auto text-gray-100 border border-gray-700">
          {JSON.stringify(profileData, null, 2)}
        </pre>
      )}
    </main>
  );
}
