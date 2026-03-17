import type { AIRecommendation, TripPlan } from './ai';
import type { TravelPreferences } from './reservation';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recommendations?: AIRecommendation[];
  tripPlan?: TripPlan;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  context: TravelPreferences;
  createdAt: Date;
}
