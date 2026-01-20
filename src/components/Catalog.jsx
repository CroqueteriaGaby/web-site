import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogData from '../data/catalog.json';
import ProductModal from './ProductModal';
import Loader from './Loader';
import './Catalog.css';

function Catalog() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Alimento Económico');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sortOrder, setSortOrder] = useState('az');
    const [isLoading, setIsLoading] = useState(true);

    // Tu Cloud Name
    const CLOUD_NAME = "df3mkkfdo";

    const categories = [
        'Alimento Económico', 
        'Alimento Premium', 
        'Sobres - Pouches Y Premios', 
        'Arena para Gatos'
    ];

    // Simulación de carga (1.5 segundos)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // --- FUNCIÓN INTELIGENTE DE IMÁGENES ---
    const getProductImage = (product) => {
        // 1. Si ya es un link de internet completo, úsalo.
        if (product.image && product.image.startsWith('http')) {
            return product.image;
        }

        // 2. Limpieza de ruta
        // Toma lo que haya en "image" (ej: "Cagnolino Adulto 25 kg")
        const rawName = product.image || product.name;
        
        // Quita rutas de carpetas si las hubiera
        const fileNameWithExt = rawName.split('/').pop();

        // 3. Quita extensiones duplicadas y espacios extra
        const cleanName = fileNameWithExt.replace(/\.(jpg|png|webp|jpeg)$/i, '').trim();

        // 4. Codifica para URL (convierte espacios en %20) y agrega .jpg
        const finalName = encodeURIComponent(cleanName) + '.jpg';

        // 5. URL Final de Cloudinary
        return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_500/v1/productos/${finalName}`;
    };

    const groupedData = useMemo(() => {
        if (!catalogData) return {};
        
        // A. Filtrado
        let filtered = catalogData.filter(item => {
            const matchesTab = item.category === activeTab;
            const term = searchTerm.toLowerCase();
            
            const name = item.name ? item.name.toLowerCase() : '';
            const brand = item.brand ? item.brand.toLowerCase() : '';
            const breed = item.breed ? item.breed.toLowerCase() : '';

            const matchesSearch = name.includes(term) || brand.includes(term) || breed.includes(term);
            return matchesTab && matchesSearch;
        });

        // B. Ordenamiento
        filtered.sort((a, b) => {
            switch (sortOrder) {
                case 'price_asc': return a.price - b.price;
                case 'price_desc': return b.price - a.price;
                case 'az': default: return a.name.localeCompare(b.name);
            }
        });

        // C. Agrupamiento
        const groups = {};
        filtered.forEach(item => {
            if (!groups[item.brand]) groups[item.brand] = {};
            if (!groups[item.brand][item.breed]) groups[item.brand][item.breed] = [];
            groups[item.brand][item.breed].push(item);
        });
        return groups;
        
    }, [activeTab, searchTerm, sortOrder]);

    const brands = Object.keys(groupedData);

    // Si está cargando, mostramos la animación
    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="catalog-wrapper">
            <div className="catalog-container">
                
                <header className="catalog-header">
                    <button onClick={() => navigate('/')} className="back-button">
                        <span>⬅</span> Volver al inicio
                    </button>
                </header>
                
                <h1 className="catalog-title-main">Nuestros Productos 🐾</h1>

                <div className="tabs-container">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`tab-button ${activeTab === cat ? 'active' : ''}`}
                            onClick={() => setActiveTab(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="filters-row">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="🔍 Buscar marca, raza o producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <select 
                        className="sort-select" 
                        value={sortOrder} 
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="az">🔤 Nombre (A-Z)</option>
                        <option value="price_asc">💰 Precio: Menor a Mayor</option>
                        <option value="price_desc">💎 Precio: Mayor a Menor</option>
                    </select>
                </div>

                {brands.length === 0 ? (
                    <div className="empty-state">
                        <h3>No encontramos productos 🐶</h3>
                        <p>Intenta cambiar la categoría o tu búsqueda.</p>
                    </div>
                ) : (
                    brands.map(brand => (
                        <div key={brand} className="brand-section">
                            <h2 className="brand-title">{brand}</h2>
                            {Object.keys(groupedData[brand]).map(breed => (
                                <div key={breed} className="breed-section">
                                    <h3 className="breed-title">{breed}</h3>
                                    <div className="products-grid">
                                        {groupedData[brand][breed].map(product => {
                                            const imageUrl = getProductImage(product);
                                            return (
                                                <div 
                                                    key={product.id} 
                                                    className="product-card"
                                                    onClick={() => setSelectedProduct({...product, image: imageUrl})}
                                                >
                                                    <div className="card-image-container">
                                                        <img 
                                                            src={imageUrl} 
                                                            alt={product.name} 
                                                            className="card-image"
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                e.target.onerror = null; 
                                                                e.target.src = "https://via.placeholder.com/300x300?text=Sin+Imagen";
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="card-info">
                                                        <div className="card-title">{product.name}</div>
                                                        <div className="card-details">
                                                            <span className="card-price">${product.price}</span>
                                                            <button className="buy-button">Ver más</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}

                <ProductModal 
                    product={selectedProduct} 
                    isOpen={!!selectedProduct} 
                    onClose={() => setSelectedProduct(null)} 
                />
            </div>
        </div>
    );
}

export default Catalog;