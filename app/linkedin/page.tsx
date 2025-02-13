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
    <main className="flex min-h-screen flex-col p-8">
      <h1 className="text-2xl font-bold mb-4">LinkedIn Profile Viewer</h1>
      
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
          placeholder="Enter LinkedIn profile URL"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={() => fetchProfile(profileUrl)}
          disabled={loading || !profileUrl}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {loading ? 'Loading...' : 'Fetch Profile'}
        </button>
        <button
          onClick={() => fetchProfile(testProfile)}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
        >
          Test with Sample Profile
        </button>
      </div>

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      {profileData && (
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(profileData, null, 2)}
        </pre>
      )}
    </main>
  );
}
