'use client';

import { useState } from 'react';

interface LinkedInProfile {
  firstName?: string;
  lastName?: string;
  headline?: string;
  summary?: string;
  profilePicture?: string;
  position?: Array<{
    title?: string;
    companyName?: string;
    description?: string;
    location?: string;
    start?: { year: number; month: number };
    end?: { year: number; month: number };
  }>;
  educations?: Array<{
    schoolName?: string;
    degree?: string;
    fieldOfStudy?: string;
  }>;
  skills?: Array<{
    name: string;
    endorsementsCount: number;
  }>;
}

export default function LinkedInPage() {
  const [profileUrl, setProfileUrl] = useState('');
  const [profileData, setProfileData] = useState<LinkedInProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const testProfile = 'https://www.linkedin.com/in/jean-marc-jancovici/';

  const fetchProfile = async (url: string) => {
    // Basic URL validation
    if (!url.includes('linkedin.com/in/')) {
      setError('Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)');
      return;
    }

    setLoading(true);
    setError(null);
    setProfileData(null); // Clear previous data while loading
    
    try {
      const response = await fetch(`/api/linkedin/profile?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      // Check if profile exists and has basic data
      if (!data || (!data.firstName && !data.lastName)) {
        throw new Error('Profile not found or is not accessible');
      }
      
      setProfileData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileUrl) {
      fetchProfile(profileUrl);
    }
  };

  const formatDate = (date?: { year: number; month: number }) => {
    if (!date?.year) return '';
    const month = date.month ? new Date(2000, date.month - 1).toLocaleString('default', { month: 'short' }) : '';
    return `${month} ${date.year}`;
  };

  return (
    <main className="flex min-h-screen flex-col p-8 bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-bold mb-4">LinkedIn Profile Viewer</h1>
      
      <form onSubmit={handleSubmit} className="flex gap-4 mb-4">
        <input
          type="text"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
          placeholder="Enter LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)"
          className="flex-1 p-2 border rounded bg-gray-800 text-gray-100 border-gray-700"
        />
        <button
          type="submit"
          disabled={loading || !profileUrl}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-700 hover:bg-blue-700 transition-colors"
        >
          {loading ? 'Loading...' : 'Fetch Profile'}
        </button>
        <button
          type="button"
          onClick={() => fetchProfile(testProfile)}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-700 hover:bg-green-700 transition-colors"
        >
          Test with Sample Profile
        </button>
      </form>

      {error && (
        <div className="text-red-400 mb-4 p-4 bg-red-900/50 rounded flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="text-blue-400 mb-4 p-4 bg-blue-900/50 rounded flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Fetching profile data...</span>
        </div>
      )}

      {profileData && (
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-6 bg-gray-800 p-6 rounded-lg">
            {profileData.profilePicture && (
              <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={profileData.profilePicture} 
                  alt="Profile" 
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-xl text-gray-300 mt-1">{profileData.headline}</p>
              {profileData.summary && (
                <p className="mt-4 text-gray-400 max-w-2xl">{profileData.summary}</p>
              )}
            </div>
          </div>

          {/* Experience */}
          {profileData.position && profileData.position.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Experience</h3>
              <div className="space-y-6">
                {profileData.position.map((pos, index) => (
                  <div key={index} className="border-l-2 border-gray-700 pl-4">
                    <h4 className="font-semibold text-lg">{pos.title}</h4>
                    <p className="text-gray-300">{pos.companyName}</p>
                    <p className="text-gray-400 text-sm">
                      {formatDate(pos.start)} - {pos.end ? formatDate(pos.end) : 'Present'}
                      {pos.location && ` · ${pos.location}`}
                    </p>
                    {pos.description && (
                      <p className="mt-2 text-gray-400">{pos.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {profileData.educations && profileData.educations.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Education</h3>
              <div className="space-y-4">
                {profileData.educations.map((edu, index) => (
                  <div key={index}>
                    <h4 className="font-semibold">{edu.schoolName}</h4>
                    <p className="text-gray-300">
                      {edu.degree}{edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {profileData.skills && profileData.skills.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 px-3 py-1 rounded-full text-sm"
                    title={`${skill.endorsementsCount} endorsements`}
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Toggle Raw JSON */}
          <div className="mt-4">
            <button
              onClick={() => setShowRaw(!showRaw)}
              className="text-gray-400 hover:text-gray-300 text-sm"
            >
              {showRaw ? 'Hide' : 'Show'} Raw JSON
            </button>
            {showRaw && (
              <pre className="mt-2 bg-gray-800 p-4 rounded overflow-auto text-gray-100 border border-gray-700">
                {JSON.stringify(profileData, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
