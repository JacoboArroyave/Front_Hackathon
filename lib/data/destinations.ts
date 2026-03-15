import type { Destination } from '@/lib/types';

export const destinations: Destination[] = [
  {
    id: 'nevado-ruiz',
    name: 'Parque Nacional Natural Los Nevados',
    slug: 'nevado-ruiz',
    description: 'Majestuoso parque natural que alberga el volcán Nevado del Ruiz. Un ecosistema único de páramo donde podrás observar frailejones, lagunas glaciares y una biodiversidad impresionante. La experiencia de estar a más de 4,000 metros de altura con vistas panorámicas es inolvidable.',
    shortDescription: 'Volcán activo y paisajes de páramo únicos en el mundo',
    category: 'naturaleza',
    location: {
      municipality: 'Villamaría',
      coordinates: { lat: 4.8917, lng: -75.3222 },
      altitude: 5321,
      climate: 'Páramo - Temperatura promedio 5°C'
    },
    images: ['/images/nevado-ruiz.jpg'],
    priceRange: { min: 150000, max: 350000, currency: 'COP' },
    duration: { minHours: 8, maxHours: 12, recommended: 'Día completo' },
    highlights: ['Volcán activo', 'Frailejones', 'Lagunas glaciares', 'Avistamiento de cóndores'],
    rating: 4.9,
    reviewCount: 1250,
    tags: ['naturaleza', 'senderismo', 'fotografía', 'aventura'],
    isPopular: true,
    activities: [
      {
        id: 'nevado-hiking',
        name: 'Ascenso al Nevado',
        description: 'Caminata guiada hasta el borde del cráter',
        duration: '6-8 horas',
        difficulty: 'dificil',
        included: ['Guía certificado', 'Seguro', 'Refrigerio'],
        price: 280000
      }
    ]
  },
  {
    id: 'termales-santa-rosa',
    name: 'Termales de Santa Rosa de Cabal',
    slug: 'termales-santa-rosa',
    description: 'Aguas termales naturales rodeadas de exuberante vegetación tropical. Disfruta de piscinas a diferentes temperaturas mientras contemplas cascadas naturales. Un santuario de relajación donde el agua caliente brota directamente de la montaña.',
    shortDescription: 'Aguas termales naturales con cascadas y spa',
    category: 'termalismo',
    location: {
      municipality: 'Santa Rosa de Cabal',
      coordinates: { lat: 4.8694, lng: -75.6211 },
      altitude: 1840,
      climate: 'Templado húmedo - 18°C promedio'
    },
    images: ['/images/termales-santa-rosa.jpg'],
    priceRange: { min: 50000, max: 180000, currency: 'COP' },
    duration: { minHours: 3, maxHours: 8, recommended: 'Medio día o día completo' },
    highlights: ['Cascada termal', 'Spa natural', 'Senderos ecológicos', 'Restaurante típico'],
    rating: 4.7,
    reviewCount: 3420,
    tags: ['relajación', 'termalismo', 'naturaleza', 'spa'],
    isPopular: true,
    activities: [
      {
        id: 'termales-day',
        name: 'Día de Termalismo',
        description: 'Acceso completo a todas las piscinas termales',
        duration: '4-6 horas',
        difficulty: 'facil',
        included: ['Entrada', 'Locker', 'Toalla'],
        price: 85000
      }
    ]
  },
  {
    id: 'salamina',
    name: 'Salamina - Pueblo Patrimonio',
    slug: 'salamina',
    description: 'Ciudad patrimonio de la humanidad que conserva la arquitectura colonial más bella de la región cafetera. Sus balcones tallados en madera, casas de bahareque y calles empedradas te transportan al pasado. Cuna de poetas y artistas.',
    shortDescription: 'Patrimonio de la humanidad, arquitectura colonial única',
    category: 'cultura',
    location: {
      municipality: 'Salamina',
      coordinates: { lat: 5.4068, lng: -75.4903 },
      altitude: 1822,
      climate: 'Templado - 19°C promedio'
    },
    images: ['/images/salamina.jpg'],
    priceRange: { min: 30000, max: 120000, currency: 'COP' },
    duration: { minHours: 4, maxHours: 8, recommended: 'Día completo' },
    highlights: ['Arquitectura colonial', 'Balcones tallados', 'Casa de la Cultura', 'Gastronomía típica'],
    rating: 4.8,
    reviewCount: 890,
    tags: ['cultura', 'patrimonio', 'arquitectura', 'fotografía'],
    isPopular: true,
    activities: [
      {
        id: 'salamina-tour',
        name: 'Tour Patrimonial',
        description: 'Recorrido guiado por el centro histórico',
        duration: '3-4 horas',
        difficulty: 'facil',
        included: ['Guía local', 'Degustación de café', 'Entrada museos'],
        price: 65000
      }
    ]
  },
  {
    id: 'recuca',
    name: 'Recuca - Recorrido de la Cultura Cafetera',
    slug: 'recuca',
    description: 'Experiencia inmersiva en la cultura cafetera colombiana. Viste como un arriero, aprende a recolectar café, conoce todo el proceso desde la semilla hasta la taza y degusta el mejor café del mundo mientras escuchas las historias de los caficultores.',
    shortDescription: 'Experiencia inmersiva en la cultura del café',
    category: 'cafetero',
    location: {
      municipality: 'Montenegro',
      coordinates: { lat: 4.5589, lng: -75.7500 },
      altitude: 1200,
      climate: 'Templado - 22°C promedio'
    },
    images: ['/images/recuca.jpg'],
    priceRange: { min: 45000, max: 95000, currency: 'COP' },
    duration: { minHours: 3, maxHours: 5, recommended: '4 horas' },
    highlights: ['Recolección de café', 'Proceso del café', 'Degustación', 'Vestimenta típica'],
    rating: 4.9,
    reviewCount: 2150,
    tags: ['café', 'cultura', 'experiencia', 'gastronomía'],
    isPopular: true,
    activities: [
      {
        id: 'recuca-experience',
        name: 'Experiencia Cafetera Completa',
        description: 'Vive un día como caficultor colombiano',
        duration: '4 horas',
        difficulty: 'facil',
        included: ['Vestimenta', 'Guía', 'Almuerzo típico', 'Café para llevar'],
        price: 85000
      }
    ]
  },
  {
    id: 'cocora',
    name: 'Valle de Cocora',
    slug: 'cocora',
    description: 'Hogar de las palmas de cera más altas del mundo, el árbol nacional de Colombia. Senderos que serpentean entre estas majestuosas palmas que pueden alcanzar los 60 metros de altura, creando un paisaje surrealista único en el planeta.',
    shortDescription: 'Las palmas de cera más altas del mundo',
    category: 'naturaleza',
    location: {
      municipality: 'Salento',
      coordinates: { lat: 4.6378, lng: -75.4875 },
      altitude: 2400,
      climate: 'Frío de montaña - 15°C promedio'
    },
    images: ['/images/cocora.jpg'],
    priceRange: { min: 25000, max: 80000, currency: 'COP' },
    duration: { minHours: 4, maxHours: 7, recommended: '5-6 horas' },
    highlights: ['Palmas de cera', 'Senderismo', 'Reserva natural', 'Colibríes'],
    rating: 4.9,
    reviewCount: 4200,
    tags: ['naturaleza', 'senderismo', 'fotografía', 'icónico'],
    isPopular: true,
    activities: [
      {
        id: 'cocora-hike',
        name: 'Senderismo Valle de Cocora',
        description: 'Caminata circular completa del valle',
        duration: '5-6 horas',
        difficulty: 'moderado',
        included: ['Guía', 'Bastones', 'Refrigerio'],
        price: 55000
      }
    ]
  },
  {
    id: 'manizales-centro',
    name: 'Centro Histórico de Manizales',
    slug: 'manizales-centro',
    description: 'Capital del departamento con una rica mezcla de arquitectura republicana y moderna. Visita la impresionante Catedral Basílica, el Cable Aéreo con vistas panorámicas, y disfruta de la vibrante vida cultural universitaria.',
    shortDescription: 'Capital cultural con arquitectura impresionante',
    category: 'cultura',
    location: {
      municipality: 'Manizales',
      coordinates: { lat: 5.0689, lng: -75.5174 },
      altitude: 2160,
      climate: 'Templado frío - 17°C promedio'
    },
    images: ['/images/manizales.jpg'],
    priceRange: { min: 20000, max: 100000, currency: 'COP' },
    duration: { minHours: 3, maxHours: 8, recommended: 'Medio día' },
    highlights: ['Catedral Basílica', 'Cable Aéreo', 'Torre del Cable', 'Chipre'],
    rating: 4.6,
    reviewCount: 1890,
    tags: ['ciudad', 'cultura', 'arquitectura', 'gastronomía'],
    isPopular: true,
    activities: [
      {
        id: 'manizales-tour',
        name: 'City Tour Manizales',
        description: 'Recorrido por los principales atractivos de la ciudad',
        duration: '4 horas',
        difficulty: 'facil',
        included: ['Transporte', 'Guía', 'Entradas'],
        price: 75000
      }
    ]
  },
  {
    id: 'rio-blanco',
    name: 'Reserva Ecológica Río Blanco',
    slug: 'rio-blanco',
    description: 'Una de las reservas con mayor biodiversidad de aves en el mundo. Más de 380 especies de aves registradas, incluyendo el gallito de roca y múltiples especies de colibríes. Un paraíso para observadores de aves y amantes de la naturaleza.',
    shortDescription: 'Paraíso del avistamiento de aves',
    category: 'naturaleza',
    location: {
      municipality: 'Manizales',
      coordinates: { lat: 5.0567, lng: -75.4567 },
      altitude: 2600,
      climate: 'Frío húmedo - 14°C promedio'
    },
    images: ['/images/rio-blanco.jpg'],
    priceRange: { min: 80000, max: 200000, currency: 'COP' },
    duration: { minHours: 4, maxHours: 8, recommended: 'Madrugada hasta mediodía' },
    highlights: ['380+ especies de aves', 'Gallito de roca', 'Colibríes', 'Bosque de niebla'],
    rating: 4.9,
    reviewCount: 650,
    tags: ['avistamiento', 'naturaleza', 'fotografía', 'biodiversidad'],
    isPopular: false,
    activities: [
      {
        id: 'birdwatching',
        name: 'Tour de Avistamiento de Aves',
        description: 'Excursión guiada con experto ornitólogo',
        duration: '6 horas',
        difficulty: 'moderado',
        included: ['Guía especializado', 'Transporte', 'Desayuno', 'Binoculares'],
        price: 180000
      }
    ]
  },
  {
    id: 'hacienda-venecia',
    name: 'Hacienda Venecia',
    slug: 'hacienda-venecia',
    description: 'Finca cafetera tradicional que ofrece una experiencia auténtica del café de especialidad. Aprende sobre el cultivo sostenible, participa en la catación profesional y disfruta de alojamiento en medio de los cafetales.',
    shortDescription: 'Finca cafetera con experiencia de café premium',
    category: 'cafetero',
    location: {
      municipality: 'Manizales',
      coordinates: { lat: 4.9833, lng: -75.6167 },
      altitude: 1500,
      climate: 'Templado - 20°C promedio'
    },
    images: ['/images/hacienda-venecia.jpg'],
    priceRange: { min: 60000, max: 250000, currency: 'COP' },
    duration: { minHours: 3, maxHours: 24, recommended: '4 horas o estadía' },
    highlights: ['Tour del café', 'Catación', 'Alojamiento', 'Vistas panorámicas'],
    rating: 4.8,
    reviewCount: 1120,
    tags: ['café', 'alojamiento', 'naturaleza', 'premium'],
    isPopular: true,
    activities: [
      {
        id: 'venecia-tour',
        name: 'Tour del Café Premium',
        description: 'Experiencia completa del café de especialidad',
        duration: '3-4 horas',
        difficulty: 'facil',
        included: ['Tour finca', 'Catación', 'Café de especialidad'],
        price: 95000
      }
    ]
  }
];

export const getDestinationById = (id: string): Destination | undefined => {
  return destinations.find(d => d.id === id);
};

export const getDestinationsByCategory = (category: string): Destination[] => {
  return destinations.filter(d => d.category === category);
};

export const getPopularDestinations = (): Destination[] => {
  return destinations.filter(d => d.isPopular);
};

export const searchDestinations = (query: string): Destination[] => {
  const lowercaseQuery = query.toLowerCase();
  return destinations.filter(d => 
    d.name.toLowerCase().includes(lowercaseQuery) ||
    d.description.toLowerCase().includes(lowercaseQuery) ||
    d.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
