export const CLOUD_NAME = 'df3mkkfdo';

export const WHATSAPP_NUMBER = '5213325322715';

export const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/400x400/FFF0F0/FF6B6B?text=Sin+Foto';

export const CATEGORIES = [
  'Todos',
  'Alimento Econ\u00f3mico',
  'Alimento Premium',
  'Sobres - Pouches Y Premios',
  'Arena para Gatos',
] as const;

export type Category = (typeof CATEGORIES)[number];
