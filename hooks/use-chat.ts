'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { chatStore } from '@/lib/store/chat-store';

export function useChat() {
  const state = useSyncExternalStore(
    chatStore.subscribe.bind(chatStore),
    () => chatStore.getState(),
    () => chatStore.getState()
  );

  const sendMessage = useCallback(async (content: string) => {
    await chatStore.sendMessage(content);
  }, []);

  const clearChat = useCallback(() => {
    chatStore.clearChat();
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    currentPlan: state.currentPlan,
    sendMessage,
    clearChat,
  };
}
