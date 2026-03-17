import { fetchAPI } from './client';

export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
}

export async function sendChatMessage(
  message: string,
  sessionId?: string
): Promise<ChatResponse> {
  return fetchAPI<ChatResponse>('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message, sessionId } satisfies ChatRequest),
  });
}

export async function clearChatSession(sessionId: string): Promise<void> {
  await fetchAPI(`/ai/chat/${sessionId}`, { method: 'DELETE' });
}
