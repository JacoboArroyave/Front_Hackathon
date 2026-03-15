import Link from 'next/link';
import { Mountain, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
  destinos: [
    { name: 'Nevado del Ruiz', href: '/destinos/nevado-ruiz' },
    { name: 'Termales Santa Rosa', href: '/destinos/termales-santa-rosa' },
    { name: 'Valle de Cocora', href: '/destinos/cocora' },
    { name: 'Salamina', href: '/destinos/salamina' },
  ],
  servicios: [
    { name: 'Reservar Viaje', href: '/reservar' },
    { name: 'Asistente IA', href: '/chat' },
    { name: 'Paquetes Turísticos', href: '/paquetes' },
    { name: 'Tours Personalizados', href: '/tours' },
  ],
  empresa: [
    { name: 'Sobre Nosotros', href: '/nosotros' },
    { name: 'Blog de Viajes', href: '/blog' },
    { name: 'Preguntas Frecuentes', href: '/faq' },
    { name: 'Contacto', href: '/contacto' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Mountain className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold leading-tight">
                  Caldas Viaja
                </span>
                <span className="text-[10px] text-background/60 tracking-wider uppercase">
                  Eje Cafetero
                </span>
              </div>
            </Link>
            
            <p className="text-background/70 text-sm leading-relaxed mb-6 max-w-sm">
              Descubre la magia del departamento de Caldas con recomendaciones 
              personalizadas de inteligencia artificial. Tu próxima aventura 
              en el corazón cafetero de Colombia te espera.
            </p>

            <div className="flex flex-col gap-3 text-sm text-background/70">
              <a href="mailto:info@caldasviaja.com" className="flex items-center gap-2 hover:text-background transition-colors">
                <Mail className="h-4 w-4" />
                info@caldasviaja.com
              </a>
              <a href="tel:+576068001234" className="flex items-center gap-2 hover:text-background transition-colors">
                <Phone className="h-4 w-4" />
                +57 606 800 1234
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Manizales, Caldas, Colombia
              </span>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Destinos
            </h3>
            <ul className="space-y-3">
              {footerLinks.destinos.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Servicios
            </h3>
            <ul className="space-y-3">
              {footerLinks.servicios.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Empresa
            </h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-background/20" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/60">
            &copy; {new Date().getFullYear()} Caldas Viaja. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
