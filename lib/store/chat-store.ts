// Chat Store - Using Observer Pattern for state management
import type { ChatMessage, TripPlan, AIRecommendation } from '@/lib/types';
import { destinations } from '@/lib/data/destinations';

type Listener = () => void;

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  currentPlan: TripPlan | null;
}

// Singleton Store with Observer Pattern
class ChatStore {
  private state: ChatState = {
    messages: [],
    isLoading: false,
    currentPlan: null,
  };

  private listeners: Set<Listener> = new Set();

  // Observer Pattern: Subscribe
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all subscribers
  private notify(): void {
    this.listeners.forEach(listener => listener());
  }

  // Getters
  getState(): ChatState {
    return this.state;
  }

  getMessages(): ChatMessage[] {
    return this.state.messages;
  }

  // Actions
  async sendMessage(content: string): Promise<void> {
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    this.state = {
      ...this.state,
      messages: [...this.state.messages, userMessage],
      isLoading: true,
    };
    this.notify();

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiResponse = this.generateAIResponse(content);
    
    this.state = {
      ...this.state,
      messages: [...this.state.messages, aiResponse],
      isLoading: false,
      currentPlan: aiResponse.tripPlan || this.state.currentPlan,
    };
    this.notify();
  }

  clearChat(): void {
    this.state = {
      messages: [],
      isLoading: false,
      currentPlan: null,
    };
    this.notify();
  }

  // AI Response Generator (Strategy Pattern based on user intent)
  private generateAIResponse(userMessage: string): ChatMessage {
    const lowerMessage = userMessage.toLowerCase();
    
    // Intent detection
    if (this.detectFamilyTripIntent(lowerMessage)) {
      return this.generateFamilyTripResponse();
    }
    
    if (this.detectAdventureIntent(lowerMessage)) {
      return this.generateAdventureResponse();
    }
    
    if (this.detectRelaxationIntent(lowerMessage)) {
      return this.generateRelaxationResponse();
    }
    
    if (this.detectCoffeeIntent(lowerMessage)) {
      return this.generateCoffeeResponse();
    }
    
    if (this.detectDurationIntent(lowerMessage)) {
      return this.generateDurationBasedResponse(lowerMessage);
    }

    // Default response
    return this.generateDefaultResponse();
  }

  private detectFamilyTripIntent(message: string): boolean {
    const keywords = ['familia', 'niños', 'hijos', 'padres', 'abuelos', 'familiar'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private detectAdventureIntent(message: string): boolean {
    const keywords = ['aventura', 'senderismo', 'montaña', 'nevado', 'excursión', 'extremo'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private detectRelaxationIntent(message: string): boolean {
    const keywords = ['relajar', 'descansar', 'termal', 'spa', 'tranquilo', 'paz'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private detectCoffeeIntent(message: string): boolean {
    const keywords = ['café', 'cafetero', 'finca', 'hacienda', 'catación'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private detectDurationIntent(message: string): boolean {
    const keywords = ['día', 'dias', 'días', 'semana', 'fin de semana', 'weekend'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private generateFamilyTripResponse(): ChatMessage {
    const tripPlan: TripPlan = {
      id: 'plan-family',
      name: 'Aventura Familiar en Caldas',
      description: 'Un viaje diseñado para toda la familia con actividades para todas las edades.',
      days: [
        {
          day: 1,
          destinations: [destinations.find(d => d.id === 'cocora')!],
          meals: [
            { type: 'lunch', name: 'Trucha al Ajillo', description: 'Trucha fresca de la región', location: 'Salento', priceRange: { min: 25000, max: 45000, currency: 'COP' } }
          ],
          notes: 'Caminata suave apta para niños por el valle. Recomendamos llevar ropa abrigada.',
        },
        {
          day: 2,
          destinations: [destinations.find(d => d.id === 'termales-santa-rosa')!],
          meals: [
            { type: 'lunch', name: 'Bandeja Paisa', description: 'Plato típico regional', location: 'Santa Rosa de Cabal', priceRange: { min: 20000, max: 35000, currency: 'COP' } }
          ],
          notes: 'Día de relajación en las termales. Hay piscinas especiales para niños.',
        },
        {
          day: 3,
          destinations: [destinations.find(d => d.id === 'recuca')!],
          meals: [
            { type: 'lunch', name: 'Almuerzo Típico Campesino', description: 'Incluido en la experiencia', location: 'Montenegro', priceRange: { min: 0, max: 0, currency: 'COP' } }
          ],
          notes: 'Los niños disfrutan especialmente vistiendo el traje típico cafetero.',
        },
      ],
      totalBudget: { min: 800000, max: 1200000, currency: 'COP' },
      highlights: ['Actividades para todas las edades', 'Experiencias educativas', 'Contacto con la naturaleza'],
      generatedBy: 'ai',
    };

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `¡Perfecto! He diseñado un plan de 3 días ideal para familias. Incluye actividades que pueden disfrutar tanto niños como adultos:\n\n**Día 1: Valle de Cocora**\nCaminata entre las palmas de cera más altas del mundo. El sendero tiene opciones cortas para familias con niños.\n\n**Día 2: Termales de Santa Rosa**\nRelájense en aguas termales naturales. Hay piscinas especiales para niños y áreas de juego.\n\n**Día 3: Experiencia Cafetera RECUCA**\nLos niños pueden vestirse como caficultores y aprender sobre el café de forma divertida.\n\n¿Te gustaría que ajuste algo en este plan?`,
      timestamp: new Date(),
      tripPlan,
    };
  }

  private generateAdventureResponse(): ChatMessage {
    const tripPlan: TripPlan = {
      id: 'plan-adventure',
      name: 'Expedición de Aventura',
      description: 'Para los amantes de la adrenalina y los paisajes extremos.',
      days: [
        {
          day: 1,
          destinations: [destinations.find(d => d.id === 'nevado-ruiz')!],
          meals: [],
          notes: 'Ascenso temprano al Nevado del Ruiz. Nivel de dificultad alto.',
        },
        {
          day: 2,
          destinations: [destinations.find(d => d.id === 'cocora')!],
          meals: [],
          notes: 'Senderismo completo por el valle con visita a la reserva de colibríes.',
        },
      ],
      totalBudget: { min: 500000, max: 800000, currency: 'COP' },
      highlights: ['Volcán activo', 'Senderismo de montaña', 'Paisajes únicos'],
      generatedBy: 'ai',
    };

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `¡Aventura es mi especialidad! Te propongo una expedición intensa:\n\n**Día 1: Nevado del Ruiz**\nAscenso al volcán activo más accesible de Colombia. Vistas impresionantes desde 4,800m de altura. Requiere buena condición física.\n\n**Día 2: Valle de Cocora (ruta completa)**\nSenderismo de 5-6 horas por bosques de niebla, cruzando puentes colgantes y explorando la reserva natural.\n\n¿Quieres que agregue más días o ajuste el nivel de dificultad?`,
      timestamp: new Date(),
      tripPlan,
    };
  }

  private generateRelaxationResponse(): ChatMessage {
    const tripPlan: TripPlan = {
      id: 'plan-relax',
      name: 'Escape de Relajación',
      description: 'Desconéctate del estrés con termalismo y naturaleza.',
      days: [
        {
          day: 1,
          destinations: [destinations.find(d => d.id === 'termales-santa-rosa')!],
          meals: [],
          notes: 'Día completo de spa y aguas termales naturales.',
        },
        {
          day: 2,
          destinations: [destinations.find(d => d.id === 'hacienda-venecia')!],
          meals: [],
          notes: 'Mañana tranquila en la hacienda cafetera con catación premium.',
        },
      ],
      totalBudget: { min: 400000, max: 600000, currency: 'COP' },
      highlights: ['Aguas termales', 'Spa natural', 'Paisajes cafeteros'],
      generatedBy: 'ai',
    };

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `Entiendo, necesitas desconectarte. Te tengo el plan perfecto:\n\n**Día 1: Termales de Santa Rosa de Cabal**\nPiscinas de aguas termales a diferentes temperaturas, cascada natural y tratamientos de spa. Pura relajación.\n\n**Día 2: Hacienda Venecia**\nDespierta con vistas a los cafetales, disfruta de una catación tranquila y pasea por los jardines.\n\n¿Prefieres más días de termalismo o te gustaría agregar alguna experiencia cultural tranquila?`,
      timestamp: new Date(),
      tripPlan,
    };
  }

  private generateCoffeeResponse(): ChatMessage {
    const tripPlan: TripPlan = {
      id: 'plan-coffee',
      name: 'Ruta del Café Premium',
      description: 'Sumérgete en la cultura cafetera de clase mundial.',
      days: [
        {
          day: 1,
          destinations: [destinations.find(d => d.id === 'hacienda-venecia')!],
          meals: [],
          notes: 'Tour premium del café con catación profesional.',
        },
        {
          day: 2,
          destinations: [destinations.find(d => d.id === 'recuca')!],
          meals: [],
          notes: 'Experiencia inmersiva como caficultor.',
        },
        {
          day: 3,
          destinations: [destinations.find(d => d.id === 'salamina')!],
          meals: [],
          notes: 'Historia y cultura del eje cafetero en un pueblo patrimonio.',
        },
      ],
      totalBudget: { min: 600000, max: 900000, currency: 'COP' },
      highlights: ['Café de especialidad', 'Cultura cafetera', 'Patrimonio histórico'],
      generatedBy: 'ai',
    };

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `¡Un verdadero amante del café! Te diseñé la ruta definitiva:\n\n**Día 1: Hacienda Venecia**\nAprende sobre café de especialidad con catación profesional. Conocerás las notas de sabor y el proceso completo.\n\n**Día 2: RECUCA**\nVive un día como caficultor: viste el traje típico, recolecta café y prepara tu propia taza.\n\n**Día 3: Salamina**\nDescubre la historia del café en este pueblo patrimonio de la humanidad.\n\n¿Te gustaría que incluya hospedaje en alguna finca cafetera?`,
      timestamp: new Date(),
      tripPlan,
    };
  }

  private generateDurationBasedResponse(message: string): ChatMessage {
    // Extract duration from message
    const dayMatch = message.match(/(\d+)\s*d[íi]a/);
    const days = dayMatch ? parseInt(dayMatch[1]) : 3;

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `¡Genial! Un viaje de ${days} días es perfecto para conocer lo mejor de Caldas.\n\nPara diseñarte el plan ideal, cuéntame:\n\n1. **¿Viajas solo, en pareja o con familia?**\n2. **¿Qué tipo de experiencias prefieres?** (aventura, relajación, cultura, naturaleza)\n3. **¿Tienes algún presupuesto en mente?** (económico, moderado, premium)\n\nCon esta información te armaré un itinerario personalizado.`,
      timestamp: new Date(),
    };
  }

  private generateDefaultResponse(): ChatMessage {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `¡Hola! Soy tu asistente de viaje para el departamento de Caldas. Estoy aquí para ayudarte a planificar tu aventura perfecta.\n\nPuedo ayudarte a:\n- Crear un itinerario personalizado\n- Recomendar destinos según tus intereses\n- Sugerir actividades para familias, parejas o aventureros\n- Encontrar las mejores experiencias cafeteras\n\n**Cuéntame: ¿Qué tipo de viaje tienes en mente?**\n\nPor ejemplo, puedes decirme:\n- "Quiero un viaje de aventura de 3 días"\n- "Viajo con mi familia y nos gusta la naturaleza"\n- "Busco relajación y experiencias de café"`,
      timestamp: new Date(),
    };
  }
}

// Export singleton instance
export const chatStore = new ChatStore();
