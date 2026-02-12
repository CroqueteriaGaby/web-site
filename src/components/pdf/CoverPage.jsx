import React from 'react';
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { styles } from './PDFStyles';

function CoverPage({ logoBase64 }) {
  const now = new Date();
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  const dateStr = `${months[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <Page size="A4" style={styles.coverPage}>
      {logoBase64 && <Image style={styles.coverLogo} src={logoBase64} />}
      <Text style={styles.coverSubtitle}>Croqueteria Gaby</Text>
      <View style={styles.coverDecorativeLine} />
      <Text style={styles.coverTitle}>Catalogo de Productos</Text>
      <Text style={styles.coverDate}>{dateStr}</Text>
    </Page>
  );
}

export default CoverPage;
