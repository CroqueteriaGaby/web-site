import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './PDFStyles';

function PDFFooter() {
    return (
        <View style={styles.footer} fixed>
            <Text style={styles.footerText}>Croqueteria Gaby</Text>
            <Text style={styles.footerPaw}>🐾</Text>
            <Text
                style={styles.footerText}
                render={({ pageNumber, totalPages }) =>
                    `Pagina ${pageNumber} de ${totalPages}`
                }
            />
        </View>
    );
}

export default PDFFooter;
