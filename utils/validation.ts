// Notion database IDs are 32-character hex strings with optional hyphens
export function isValidDatabaseId(id: string): boolean {
  // Allow 32 hex chars with optional hyphens between them
  return /^[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}$/.test(id);
}

// Search query validation
export function isValidSearchQuery(query: string): boolean {
  return query.length > 0 && query.length <= 100;
}

// Error response helper
export function createErrorResponse(message: string, status: number = 400) {
  return Response.json({ error: message }, { status });
}
