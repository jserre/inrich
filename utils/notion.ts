import { Client, isFullDatabase } from '@notionhq/client';
import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

if (!process.env.NOTION_API_KEY) {
  throw new Error('Missing NOTION_API_KEY environment variable');
}

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getDatabaseSchema(databaseId: string): Promise<{ properties: DatabaseObjectResponse['properties'], title: string }> {
  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });

    if (!isFullDatabase(response)) {
      throw new Error('Received incomplete database response');
    }
    
    return {
      properties: response.properties,
      title: response.title[0]?.plain_text || 'Untitled',
    };
  } catch (error) {
    console.error('Error fetching database schema:', error);
    throw error;
  }
}
