import { NextResponse } from 'next/server';
import { getDatabaseSchema } from '@/utils/notion';

export async function GET(request: Request) {
  try {
    // Try to get ID from referer first
    const referer = request.headers.get('referer');
    let databaseId = process.env.NOTION_DATABASE_ID;

    if (referer) {
      const url = new URL(referer);
      const idFromUrl = url.searchParams.get('id');
      if (idFromUrl) {
        databaseId = idFromUrl;
      }
    }

    if (!databaseId) {
      return NextResponse.json({ error: 'Missing database ID' }, { status: 400 });
    }

    const schema = await getDatabaseSchema(databaseId);
    return NextResponse.json(schema);
  } catch (error) {
    console.error('Error in schema route:', error);
    return NextResponse.json({ error: 'Failed to fetch database schema' }, { status: 500 });
  }
}
