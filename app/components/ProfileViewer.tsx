'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LinkedInProfile {
  firstName?: string;
  lastName?: string;
  headline?: string;
  profilePicture?: string;
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
        
        // Type guard for profile data
        if (!data || typeof data !== 'object') {
          setError('Invalid response format');
          return;
        }

        setProfile(data);
      } catch (err) {
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg w-full">
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
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-32 h-32">
          <Image
            src={profile.profilePicture || '/images/defaultavatar.png'}
            alt={`${fullName}'s profile picture`}
            fill
            sizes="(max-width: 128px) 100vw, 128px"
            className="rounded-full object-cover"
            priority
          />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">{fullName}</h1>
          {profile.headline && (
            <p className="text-gray-600 mt-1">{profile.headline}</p>
          )}
        </div>
      </div>
      
      <button 
        type="button"
        onClick={() => {}} // To be implemented later
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800"
        aria-label="Add profile to Notion"
      >
        Add to Notion?
      </button>
    </div>
  );
}
