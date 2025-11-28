# Croquetería Gaby - Landing Page

Una hermosa página de "Próximamente" para Croquetería Gaby, con un diseño cálido y juguetón.

## Características

- Diseño responsive (móvil, tablet, escritorio)
- Animaciones suaves y elegantes
- Colores cálidos que combinan con el logo
- Sección de contacto con teléfono, email y redes sociales
- Elementos decorativos temáticos de mascotas

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar servidor de desarrollo:
```bash
npm run dev
```

3. Abrir en el navegador: `http://localhost:5173`

## Compilar para producción

```bash
npm run build
```

Los archivos listos para producción estarán en la carpeta `dist/`.

## Previsualizar compilación de producción

```bash
npm run preview
```

## Tecnologías

- React 18
- Vite 6
- CSS3 con animaciones personalizadas
- Diseño responsive con media queries

## Personalización

### Actualizar información de contacto

Edita el archivo `src/App.jsx` y modifica los enlaces en la sección de contacto:

- Teléfono: `tel:+525512345678`
- Email: `mailto:info@croqueteriagaby.com`
- Redes sociales: `https://www.facebook.com/croqueteriagaby`

### Cambiar colores

Los colores principales se encuentran en `src/App.css` y `src/index.css`:

- Marrón oscuro: `#654321`
- Marrón claro: `#8B6F47`
- Dorado: `#D4A574`
- Fondo crema: `#f5e6d3`, `#f9f0e5`, `#fef8f1`

## Despliegue

Esta aplicación puede ser desplegada en:

- **Vercel**: `npm install -g vercel && vercel`
- **Netlify**: Arrastra la carpeta `dist` a Netlify
- **GitHub Pages**: Configura GitHub Actions o usa `gh-pages`
- **Cualquier hosting estático**: Sube la carpeta `dist`

¡Disfruta tu hermosa landing page! 🐾
