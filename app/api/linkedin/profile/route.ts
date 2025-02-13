export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileUrl = searchParams.get('url');

  if (!profileUrl) {
    return Response.json({ error: 'Missing LinkedIn profile URL' }, { status: 400 });
  }

  const apiKey = process.env['X-RapidAPI-Key'];
  if (!apiKey) {
    return Response.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    // Debug logging
    console.log('Fetching profile:', profileUrl);
    
    const response = await fetch(
      `https://linkedin-api8.p.rapidapi.com/get-profile-data-by-url?url=${encodeURIComponent(profileUrl)}`,
      {
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
        }
      }
    );

    if (!response.ok) {
      console.error('API error:', {
        status: response.status,
        statusText: response.statusText
      });
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return Response.json({ error: `API error: ${response.status} ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('LinkedIn API error:', error);
    return Response.json({ error: 'Failed to fetch profile data' }, { status: 500 });
  }
}
