import { Header } from '@/components/layout/header';
import { ChatInterface } from '@/components/chat/chat-interface';

export const metadata = {
  title: 'Asistente IA | Caldas Viaja',
  description: 'Planifica tu viaje ideal al departamento de Caldas con nuestro asistente de inteligencia artificial.',
};

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ChatInterface />
        </div>
      </div>
    </main>
  );
}
