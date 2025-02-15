import Link from 'next/link';
import { listDatabases } from '../../../utils/notion';

export default async function DatabasesPage() {
  try {
    const databases = await listDatabases();

    return (
      <main className="min-h-screen p-8">
        <h1 className="text-4xl font-bold mb-8">Your Notion Databases</h1>
        <div className="space-y-4">
          {databases.map((db) => (
            <div key={db.id} className="p-4 border rounded-lg hover:bg-gray-50">
              <Link 
                href={`/notion?id=${db.id}`} 
                className="text-xl text-blue-600 hover:text-blue-800"
              >
                {db.title}
              </Link>
            </div>
          ))}
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error in DatabasesPage:', error);
    throw error;
  }
}
