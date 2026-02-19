'use server';
import { suggestTaskDescription } from '@/ai/flows/suggest-task-description-flow';

export async function getSuggestions(partialDescription: string) {
  if (!partialDescription || partialDescription.trim().length < 3) {
    return [];
  }
  try {
    const result = await suggestTaskDescription({ partialDescription });
    return result.suggestions;
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    // Gracefully fail and return empty array
    return [];
  }
}
