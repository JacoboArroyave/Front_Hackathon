// ============================================================
//  lib/store/chat-store.ts
//  Maneja el estado del chat y se comunica con el backend
//  El hook useChat (hooks/use-chat.ts) consume este store
// ============================================================

import type { ChatMessage, TripPlan } from '@/lib/types';
import { sendChatMessage, clearChatSession } from '@/lib/api';

// Tipo para los listeners (funciones que se llaman cuando el estado cambia)
type Listener = () => void;

// Forma del estado del chat
interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  currentPlan: TripPlan | null;
  sessionId: string | null; // ID de sesión que maneja el backend
}

// ─── Store con patrón Observer ────────────────────────────────────────────────
// Observer: los componentes se suscriben y reciben notificaciones cuando
// el estado cambia. React lo conecta con useSyncExternalStore en use-chat.ts

class ChatStore {
  private state: ChatState = {
    messages: [],
    isLoading: false,
    currentPlan: null,
    sessionId: null,
  };

  // Set de funciones suscritas — cada componente que usa useChat agrega una
  private listeners: Set<Listener> = new Set();

  // Suscribirse al store — devuelve función para desuscribirse
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notificar a todos los componentes suscritos que el estado cambió
  private notify(): void {
    this.listeners.forEach(listener => listener());
  }

  // Devuelve el estado actual (lo usa useSyncExternalStore)
  getState(): ChatState {
    return this.state;
  }

  // ── Enviar mensaje ─────────────────────────────────────────────────────────
  async sendMessage(content: string): Promise<void> {

    // 1. Agrega el mensaje del usuario a la lista inmediatamente
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    this.state = {
      ...this.state,
      messages: [...this.state.messages, userMessage],
      isLoading: true, // activa el spinner en el chat
    };
    this.notify();

    try {
      // 2. Llama al backend real — POST /ai/chat
      // Pasa el sessionId si ya existe para mantener el historial
      const response = await sendChatMessage(
        content,
        this.state.sessionId ?? undefined
      );

      // 3. Agrega la respuesta de la IA a la lista
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date(),
      };

      this.state = {
        ...this.state,
        messages: [...this.state.messages, aiMessage],
        isLoading: false,
        // Guarda el sessionId para los siguientes mensajes
        // Así el backend mantiene el contexto de la conversación
        sessionId: response.sessionId,
      };

    } catch (error) {
      // 4. Si el backend falla, muestra un mensaje de error amigable
      // Esto pasa si Ollama no está corriendo o el backend está caído
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content:
          'Lo siento, no pude conectarme con el asistente en este momento. ' +
          'Verifica que el backend esté corriendo e intenta de nuevo.',
        timestamp: new Date(),
      };

      this.state = {
        ...this.state,
        messages: [...this.state.messages, errorMessage],
        isLoading: false,
      };
    }

    this.notify();
  }

  // ── Limpiar chat ───────────────────────────────────────────────────────────
  async clearChat(): Promise<void> {
    // Limpia también el historial en el backend para liberar memoria
    if (this.state.sessionId) {
      try {
        await clearChatSession(this.state.sessionId);
      } catch {
        // Si falla al limpiar en el backend, no importa
        // El frontend igual borra su estado local
      }
    }

    this.state = {
      messages: [],
      isLoading: false,
      currentPlan: null,
      sessionId: null,
    };
    this.notify();
  }
}

// Exporta una única instancia — singleton
// Todos los componentes comparten el mismo store
export const chatStore = new ChatStore();
