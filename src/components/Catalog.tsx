import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/product';
import catalogRaw from '../data/catalog.json';
import { getProductKey } from '../utils/productKey';
import ProductModal from './ProductModal';
import Loader from './Loader';
import DownloadPDFButton from './DownloadPDFButton';
import './Catalog.css';

const catalogData = catalogRaw as Product[];

function Catalog() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortOrder, setSortOrder] = useState('az');
  const [isLoading, setIsLoading] = useState(true);

  const CLOUD_NAME = 'df3mkkfdo';

  const categories = [
    'Todos',
    'Alimento Económico',
    'Alimento Premium',
    'Sobres - Pouches Y Premios',
    'Arena para Gatos',
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const getProductImage = (product: Product): string => {
    if (product.image && product.image.startsWith('http')) return product.image;

    let imageName = product.image || product.name;

    if (imageName.startsWith('productos/')) {
      imageName = imageName.replace('productos/', '');
    }

    imageName = imageName.replace(/\.(jpg|png|webp|jpeg)$/i, '');
    imageName = imageName.trim();

    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_500/v1/${imageName}.jpg`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    img.onerror = null;
    img.src = 'https://placehold.co/400x400/FFF0F0/FF6B6B?text=Sin+Foto';
  };

  const groupedData = useMemo(() => {
    if (!catalogData) return {} as Record<string, Record<string, Product[]>>;

    const filtered = catalogData.filter((item) => {
      const matchesTab = activeTab === 'Todos' || item.category === activeTab;
      const term = searchTerm.toLowerCase();
      const name = item.name ? item.name.toLowerCase() : '';
      const brand = item.brand ? item.brand.toLowerCase() : '';
      const matchesSearch = name.includes(term) || brand.includes(term);
      return matchesTab && matchesSearch;
    });

    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'az':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    const groups: Record<string, Record<string, Product[]>> = {};
    filtered.forEach((item) => {
      if (!groups[item.brand]) groups[item.brand] = {};
      if (!groups[item.brand]![item.breed]) groups[item.brand]![item.breed] = [];
      groups[item.brand]![item.breed]!.push(item);
    });
    return groups;
  }, [activeTab, searchTerm, sortOrder]);

  const brands = Object.keys(groupedData);

  if (isLoading) return <Loader />;

  return (
    <div className="catalog-wrapper">
      <div className="catalog-container">
        <header className="catalog-header">
          <button onClick={() => navigate('/')} className="back-button" aria-label="Volver">
            <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>🡠</span>
          </button>
          <h1 className="catalog-title-main">Catálogo 🐾</h1>
          <DownloadPDFButton />
        </header>

        <div className="tabs-container">
          {categories.map((cat) => (
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
              placeholder="🔍 Buscar producto..."
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
          brands.map((brand) => (
            <div key={brand} className="brand-section">
              <h2 className="brand-title">{brand}</h2>
              {Object.keys(groupedData[brand]!).map((breed) => (
                <div key={breed} className="breed-section">
                  <h3 className="breed-title">{breed}</h3>
                  <div className="products-grid">
                    {groupedData[brand]![breed]!.map((product) => {
                      const imageUrl = getProductImage(product);
                      const productKey = getProductKey(product);
                      return (
                        <div
                          key={productKey}
                          className="product-card"
                          data-product-id={productKey}
                          onClick={() => setSelectedProduct({ ...product, image: imageUrl })}
                        >
                          <div className="card-image-container">
                            <img
                              key={productKey}
                              src={imageUrl}
                              alt={product.name}
                              className="card-image"
                              data-product-id={productKey}
                              loading="lazy"
                              onError={handleImageError}
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
