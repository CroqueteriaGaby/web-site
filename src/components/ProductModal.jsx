import React, { useState, useEffect } from 'react';
import './ProductModal.css';

function ProductModal({ product, isOpen, onClose }) {
    const [quantity, setQuantity] = useState(1);

    // Resetear cantidad al abrir
    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen]);

    if (!isOpen || !product) return null;

    // Fallback por si acaso el modal recibe un producto sin imagen válida
    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/400x400/FDFBF7/FF6B6B?text=${encodeURIComponent(product.name)}`;
    };

    const handleQuantity = (op) => {
        if (op === 'dec' && quantity > 1) setQuantity(q => q - 1);
        if (op === 'inc') setQuantity(q => q + 1);
    };

    // --- LÓGICA DE COMPRA (CORREGIDA: TRIGGER MANYCHAT) ---
    const handleBuy = () => {
        // Número con el '1' para que funcione el link internacional
        const phoneNumber = "5213325322715"; 
        
        const total = product.price * quantity;

        // --- MENSAJE ESTRUCTURADO PARA ACTIVAR MANYCHAT ---
        // CLAVE: La palabra "*PEDIDO:*" es lo que dispara tu automatización.
        // No cambies esa palabra o la IA no sabrá que es una venta web.
        const message = `Hola Croquetería Gaby 🐶!
            Quiero finalizar mi compra web:

*PEDIDO WEB* 🛒
- Producto: ${product.name}
- Presentación: ${product.weight || 'Estándar'}
- Cantidad: ${quantity}
- Total: $${total}

¿Me ayudan a confirmar entrega?`;

        // Codificación segura para URL
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        // Abrir WhatsApp
        window.open(url, '_blank');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>&times;</button>
                
                <div className="modal-body">
                    {/* SECCIÓN DE IMAGEN ÚNICA */}
                    <div className="gallery-section">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="main-image" 
                            onError={handleImageError}
                        />
                        {/* Eliminamos la sección de thumbnails aquí */}
                    </div>

                    {/* Información */}
                    <div className="info-section">
                        <span className="modal-brand">{product.brand}</span>
                        <h2 className="modal-title">{product.name}</h2>
                        <p className="modal-weight">Presentación: {product.weight || 'Estándar'}</p>

                        <div className="description-container">
                            <h4 className="section-title">Descripción</h4>
                            <p className="description-text">
                                {product.description || `Alimento de alta calidad de la marca ${product.brand}.`}
                            </p>
                        </div>

                        {/* Cantidad y Precio */}
                        <div className="quantity-selector">
                            <span className="section-title" style={{marginBottom:0}}>Cantidad:</span>
                            <button className="qty-btn" onClick={() => handleQuantity('dec')}>-</button>
                            <span className="qty-number">{quantity}</span>
                            <button className="qty-btn" onClick={() => handleQuantity('inc')}>+</button>
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