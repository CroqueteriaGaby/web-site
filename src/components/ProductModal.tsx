import { useState, useEffect } from 'react';
import type { Product } from '../types/product';
import { WHATSAPP_NUMBER } from '../constants';
import { handleImageError } from '../utils/images';
import './ProductModal.css';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleBuy = () => {
    const total = product.price * quantity;

    const message = `Hola Croquetería Gaby 🐶!
            Quiero finalizar mi compra web:

*PEDIDO WEB* 🛒
- Producto: ${product.name}
- Presentación: ${product.weight || 'Estándar'}
- Cantidad: ${quantity}
- Total: $${total}

¿Me ayudan a confirmar entrega?`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        <div className="modal-body">
          <div className="gallery-section">
            <img
              src={product.image}
              alt={product.name}
              className="main-image"
              onError={handleImageError}
            />
          </div>

          <div className="info-section">
            <span className="modal-brand">{product.brand}</span>
            <h2 className="modal-title">{product.name}</h2>
            <p className="modal-weight">Presentación: {product.weight || 'Estándar'}</p>

            <div className="description-container">
              <h4 className="section-title">Descripción</h4>
              <p className="description-text">
                {`Alimento de alta calidad de la marca ${product.brand}.`}
              </p>
            </div>

            <div className="quantity-selector">
              <span className="section-title" style={{ marginBottom: 0 }}>
                Cantidad:
              </span>
              <button className="qty-btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                -
              </button>
              <span className="qty-number">{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity((q) => q + 1)}>
                +
              </button>
            </div>

            <div className="modal-footer">
              <div className="price-info">
                <small>Total:</small>
                <div className="total-price">${product.price * quantity}</div>
              </div>
              <button className="modal-buy-btn" onClick={handleBuy}>
                Pedir por WhatsApp 💬
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
