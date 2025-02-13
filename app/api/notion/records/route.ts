import { NextResponse } from 'next/server';
import { notion } from '@/utils/notion';
import { isFullPage } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

interface NotionRecord {
  id: string;
  properties: PageObjectResponse['properties'];
}

interface RecordsResponse {
  records: NotionRecord[];
  title: string;
}

export async function GET(request: Request) {
  try {
    // Get database ID from referer, same pattern as schema endpoint
    const referer = request.headers.get('referer');
    console.log('Debug - Referer:', referer); // Debug log
    
    let databaseId = process.env.NOTION_DATABASE_ID;

    if (referer) {
      const url = new URL(referer);
      const idFromUrl = url.searchParams.get('id');
      console.log('Debug - ID from URL:', idFromUrl); // Debug log
      if (idFromUrl) {
        databaseId = idFromUrl;
      }
    }

    console.log('Debug - Using Database ID:', databaseId); // Debug log

    if (!databaseId) {
      return NextResponse.json({ error: 'Missing database ID' }, { status: 400 });
    }

    // Fetch just first few records for now
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 10,
    });

    // Type guard each record
    const records: NotionRecord[] = response.results.map(result => {
      if (!isFullPage(result)) {
        throw new Error('Received incomplete page response');
      }
      return {
        id: result.id,
        properties: result.properties,
      };
    });

    // Get title from first record's title property if available
    let title = 'Untitled';
    if (records.length > 0) {
      const titleProperty = Object.values(records[0].properties).find(prop => prop.type === 'title');
      if (titleProperty?.type === 'title' && titleProperty.title[0]) {
        title = titleProperty.title[0].plain_text;
      }
    }

    const responseData: RecordsResponse = {
      records,
      title,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in records route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch records' },
      { status: 500 }
    );
  }
}
