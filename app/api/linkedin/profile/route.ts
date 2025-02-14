import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge'; // Opt for edge runtime for better performance

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileUrl = searchParams.get('url');

    if (!profileUrl?.startsWith('https://www.linkedin.com/in/')) {
      return NextResponse.json(
        { error: 'Invalid LinkedIn profile URL. Must start with https://www.linkedin.com/in/' },
        { status: 400 }
      );
    }

    const apiKey = process.env.X_RapidAPI_Key;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    const response = await fetch(
      `https://linkedin-api8.p.rapidapi.com/get-profile-data-by-url?url=${encodeURIComponent(profileUrl)}`,
      {
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
        }
      }
    ).catch(() => null);

    if (!response) {
      return NextResponse.json(
        { error: 'Failed to connect to LinkedIn API' },
        { status: 503 }
      );
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Handle 404 specifically for profile not found
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Profile not found. Please check if the LinkedIn URL is correct and the profile is public.' },
          { status: 404 }
        );
      }
      
      // Handle other API errors
      return NextResponse.json(
        { 
          error: response.status === 403 
            ? 'Unable to access this profile. The profile might be private or require authentication.'
            : 'Unable to fetch profile data. Please try again later.'
        },
        { status: response.status }
      );
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Invalid response from LinkedIn API' },
        { status: 502 }
      );
    }

    // Validate that we have at least some basic profile data
    if (!data.firstName && !data.lastName && !data.headline) {
      return NextResponse.json(
        { error: 'No profile data available. The profile might be private or require authentication.' },
        { status: 404 }
      );
    }

    // Sanitize the response to only include what we need
    const sanitizedData = {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      headline: data.headline || '',
      profilePicture: typeof data.profilePicture === 'string' ? data.profilePicture : undefined
    };
    
    return NextResponse.json(sanitizedData);
  } catch {
    // Return a generic error without exposing internal details
    return NextResponse.json(
      { error: 'An error occurred while fetching the profile. Please try again later.' },
      { status: 500 }
    );
  }
}
