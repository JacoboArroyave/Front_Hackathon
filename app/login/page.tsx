'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { login } from '@/lib/api';
import type { LoginRequest } from '@/lib/api';
import { Loader2 } from 'lucide-react';

// ─── Formulario de login ──────────────────────────────────────────────────────
// Separado en su propio componente siguiendo el principio de responsabilidad única
// La página solo ensambla, el formulario maneja su propia lógica

function LoginForm() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const loginData: LoginRequest = { email, password };
      const response = await login(loginData);

      // Guardar el userId en localStorage para usarlo en reservas
      localStorage.setItem('userId', response.userId.toString());

      // Redirigir a la página principal después del login
      router.push('/');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Tu contraseña"
              disabled={isLoading}
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </form>

        {/* Credenciales de prueba */}
        <div className="mt-4 p-3 bg-secondary/50 rounded-md">
          <p className="text-xs text-muted-foreground font-medium mb-1">Credenciales de prueba:</p>
          <p className="text-xs text-muted-foreground">Email: juan@caldas.com</p>
          <p className="text-xs text-muted-foreground">Contraseña: 1234</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Página de Login ──────────────────────────────────────────────────────────
// La página solo ensambla los componentes — no tiene lógica propia
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoginForm />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
