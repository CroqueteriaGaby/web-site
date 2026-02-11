const CLOUD_NAME = 'df3mkkfdo';

function getImageUrl(product) {
    if (product.image && product.image.startsWith('http')) return product.image;

    let imageName = product.image || product.name;
    if (imageName.startsWith('productos/')) {
        imageName = imageName.replace('productos/', '');
    }
    imageName = imageName.replace(/\.(jpg|png|webp|jpeg)$/i, '');
    imageName = imageName.trim();

    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_500/v1/${imageName}.jpg`;
}

function generatePlaceholderDataUrl() {
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFF0F0';
    ctx.fillRect(0, 0, 150, 150);

    ctx.fillStyle = '#FF6B6B';
    ctx.font = 'bold 14px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Sin Foto', 75, 75);

    return canvas.toDataURL('image/png');
}

function loadSingleImage(product) {
    const url = getImageUrl(product);

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        const timeout = setTimeout(() => {
            img.src = '';
            reject(new Error('timeout'));
        }, 8000);

        img.onload = () => {
            clearTimeout(timeout);
            try {
                const canvas = document.createElement('canvas');
                const maxWidth = 150;
                const scale = Math.min(1, maxWidth / img.naturalWidth);
                canvas.width = img.naturalWidth * scale;
                canvas.height = img.naturalHeight * scale;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            } catch (e) {
                reject(e);
            }
        };

        img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('load failed'));
        };

        img.src = url;
    });
}

export async function preloadImages(products, onProgress) {
    const cache = {};
    const PLACEHOLDER = generatePlaceholderDataUrl();
    const CONCURRENCY = 6;

    for (let i = 0; i < products.length; i += CONCURRENCY) {
        const batch = products.slice(i, i + CONCURRENCY);
        const results = await Promise.allSettled(
            batch.map((product) => loadSingleImage(product))
        );

        results.forEach((result, idx) => {
            const product = batch[idx];
            cache[product.id] = result.status === 'fulfilled' ? result.value : PLACEHOLDER;
        });

        onProgress(Math.min(i + CONCURRENCY, products.length), products.length);
    }

    return cache;
}

export async function loadLogoAsBase64(logoUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            } catch {
                resolve(null);
            }
        };
        img.onerror = () => resolve(null);
        img.src = logoUrl;
    });
}
