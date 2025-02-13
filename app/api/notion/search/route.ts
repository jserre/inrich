import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/utils/notion';
import { isFullDatabase } from '@notionhq/client';

export async function GET(request: NextRequest) {
  try {
    // Get database ID from referer
    const referer = request.headers.get('referer');
    if (!referer) {
      return NextResponse.json({ error: 'No referer found' }, { status: 400 });
    }

    const url = new URL(referer);
    const databaseId = url.searchParams.get('id');
    if (!databaseId) {
      return NextResponse.json({ error: 'No database ID found' }, { status: 400 });
    }

    // Get search query from URL params
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    if (!query) {
      return NextResponse.json({ error: 'No search query provided' }, { status: 400 });
    }

    // Get database to verify access and get title
    const database = await notion.databases.retrieve({ database_id: databaseId });
    if (!isFullDatabase(database)) {
      return NextResponse.json({ error: 'Invalid database response' }, { status: 500 });
    }

    // Search records in database
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        or: [
          {
            property: 'title',
            title: {
              contains: query
            }
          },
          {
            property: 'rich_text',
            rich_text: {
              contains: query
            }
          }
        ]
      }
    });

    // Format response
    const records = response.results.map(page => ({
      id: page.id,
      properties: page.properties
    }));

    return NextResponse.json({
      records,
      title: database.title[0]?.plain_text || 'Untitled'
    });

  } catch (error) {
    console.error('Error searching records:', error);
    return NextResponse.json(
      { error: 'Failed to search records' },
      { status: 500 }
    );
  }
}
