import { NextResponse } from 'next/server';
import { notion } from '@/utils/notion';
import { isFullPage } from '@notionhq/client';

export async function GET(request: Request) {
  try {
    // Get database ID from referer, same pattern as schema endpoint
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

    // Fetch just first few records for now
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 10,
    });

    // Type guard each record
    const records = response.results.map(result => {
      if (!isFullPage(result)) {
        throw new Error('Received incomplete page response');
      }
      return {
        id: result.id,
        properties: result.properties,
      };
    });

    return NextResponse.json({
      records,
      title: records[0]?.properties?.Name?.title?.[0]?.plain_text || 'Untitled',
    });
  } catch (error) {
    console.error('Error in records route:', error);
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}
