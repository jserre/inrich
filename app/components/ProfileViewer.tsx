'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LinkedInProfile {
  firstName?: string;
  lastName?: string;
  headline?: string;
  summary?: string;
  profilePicture?: string;
  location?: string;
  positions?: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  education?: Array<{
    school: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
  }>;
  skills?: string[];
  error?: string;
}

export default function ProfileViewer({ profileUrl }: { profileUrl: string }) {
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/linkedin/profile?url=${encodeURIComponent(profileUrl)}`);
        if (!isMounted) return;

        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || 'Failed to fetch profile');
          return;
        }
        
        if (!data || typeof data !== 'object') {
          setError('Invalid response format');
          return;
        }

        setProfile(data);
      } catch {
        if (isMounted) {
          setError('An unexpected error occurred while fetching the profile');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [profileUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-red-800 font-semibold text-lg mb-2">Profile Not Available</h2>
            <p className="text-red-600">{error}</p>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Unknown User';

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full space-y-8">
      {/* Header section with profile picture and basic info */}
      <div className="flex items-start space-x-6">
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={profile.profilePicture || '/images/default-avatar.png'}
            alt={`${fullName}'s profile picture`}
            fill
            className="rounded-full object-cover"
            sizes="(max-width: 128px) 100vw, 128px"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
          {profile.headline && (
            <p className="text-xl text-gray-600 mt-1">{profile.headline}</p>
          )}
          {profile.location && (
            <p className="text-gray-500 mt-2">{profile.location}</p>
          )}
        </div>
      </div>

      {/* Summary section */}
      {profile.summary && (
        <section className="border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">About</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{profile.summary}</p>
        </section>
      )}

      {/* Experience section */}
      {profile.positions && profile.positions.length > 0 && (
        <section className="border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">Experience</h2>
          <div className="space-y-6">
            {profile.positions.map((position, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-xl font-medium text-gray-900">{position.title}</h3>
                <p className="text-gray-600">{position.company}</p>
                <p className="text-gray-500">
                  {position.startDate} - {position.endDate || 'Present'}
                </p>
                {position.description && (
                  <p className="text-gray-700 mt-2">{position.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education section */}
      {profile.education && profile.education.length > 0 && (
        <section className="border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">Education</h2>
          <div className="space-y-6">
            {profile.education.map((edu, index) => (
              <div key={index} className="space-y-1">
                <h3 className="text-xl font-medium text-gray-900">{edu.school}</h3>
                {edu.degree && edu.field && (
                  <p className="text-gray-600">{edu.degree} - {edu.field}</p>
                )}
                {edu.startDate && (
                  <p className="text-gray-500">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills section */}
      {profile.skills && profile.skills.length > 0 && (
        <section className="border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="border-t pt-6 flex justify-end">
        <button 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add to Notion
        </button>
      </div>
    </div>
  );
}
