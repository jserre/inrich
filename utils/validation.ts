// Notion database IDs are 32-character hex strings
export function isValidDatabaseId(id: string): boolean {
  return /^[a-f0-9]{32}$/.test(id);
}

// Search query validation
export function isValidSearchQuery(query: string): boolean {
  return query.length > 0 && query.length <= 100;
}

// Error response helper
export function createErrorResponse(message: string, status: number = 400) {
  return Response.json({ error: message }, { status });
}
