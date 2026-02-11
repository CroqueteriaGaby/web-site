import React, { useState } from 'react';
import catalogData from '../data/catalog.json';
import {
    waitForLazyImages,
    captureImagesFromDom,
    preloadMissingImages,
    loadLogoAsBase64,
} from '../utils/pdfImageLoader';
import './DownloadPDFButton.css';

function DownloadPDFButton() {
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState({ loaded: 0, total: 0 });

    const handleDownload = async () => {
        if (status !== 'idle') return;

        try {
            setStatus('loading_images');

            const [{ pdf }, { default: CatalogPDF }, logoBase64] =
                await Promise.all([
                    import('@react-pdf/renderer'),
                    import('./pdf/CatalogPDF'),
                    loadLogoAsBase64('/logo.png'),
                ]);

            setStatus('preparing');
            await waitForLazyImages();

            setStatus('loading_images');
            const domCache = captureImagesFromDom(catalogData);
            const imageCache = await preloadMissingImages(
                catalogData,
                domCache,
                (loaded, total) => setProgress({ loaded, total })
            );

            setStatus('building_pdf');

            const blob = await pdf(
                <CatalogPDF
                    catalogData={catalogData}
                    imageCache={imageCache}
                    logoBase64={logoBase64}
                />
            ).toBlob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Catalogo_Croqueteria_Gaby.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setStatus('idle');
        } catch (error) {
            console.error('Error generando PDF:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'preparing':
                return (
                    <>
                        <span className="btn-icon">⏳</span>
                        <span className="btn-text">Preparando imágenes…</span>
                    </>
                );
            case 'loading_images':
                return (
                    <>
                        <span className="btn-icon">⏳</span>
                        <span className="btn-text">
                            Cargando... {progress.loaded}/{progress.total}
                        </span>
                        <div className="pdf-progress-bar">
                            <div
                                className="pdf-progress-fill"
                                style={{
                                    width: progress.total
                                        ? `${(progress.loaded / progress.total) * 100}%`
                                        : '0%',
                                }}
                            />
                        </div>
                    </>
                );
            case 'building_pdf':
                return (
                    <>
                        <span className="btn-icon">📄</span>
                        <span className="btn-text">Armando PDF...</span>
                    </>
                );
            case 'error':
                return (
                    <>
                        <span className="btn-icon">⚠️</span>
                        <span className="btn-text">Error</span>
                    </>
                );
            default:
                return (
                    <>
                        <span className="btn-icon">📥</span>
                        <span className="btn-text">Descargar PDF</span>
                    </>
                );
        }
    };

    return (
        <button
            className={`pdf-download-btn ${status !== 'idle' ? 'loading' : ''}`}
            onClick={handleDownload}
            disabled={status !== 'idle' && status !== 'error'}
            aria-label="Descargar catalogo en PDF"
        >
            {renderContent()}
        </button>
    );
}

export default DownloadPDFButton;
