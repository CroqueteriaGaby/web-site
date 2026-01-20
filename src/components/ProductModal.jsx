import { useState, useEffect } from 'react'
import './ProductModal.css'

function ProductModal({ product, isOpen, onClose }) {
    const [quantity, setQuantity] = useState(1)
    const [currentImage, setCurrentImage] = useState(0)

    // Resetear estado cuando cambia el producto
    useEffect(() => {
        if (isOpen) {
            setQuantity(1)
            setCurrentImage(0)
            // Bloquear scroll del body cuando el modal está abierto
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen, product])

    if (!isOpen || !product) return null

    // Generador de datos (Si no existen en el JSON)
    const images = [
        product.image,
        product.image // Duplicamos la imagen para simular galería por ahora
    ]

    const defaultDesc = `Alimento de alta calidad de la marca ${product.brand}. Formulado específicamente para ${product.breed}s, garantizando una nutrición balanceada.`
    
    const defaultBenefits = [
        "Alta digestibilidad y absorción de nutrientes.",
        "Pelaje más brillante y piel sana.",
        "Heces firmes y con menos olor.",
        "Fortalecimiento del sistema inmune."
    ]

    const handleQuantity = (op) => {
        if (op === 'dec' && quantity > 1) setQuantity(q => q - 1)
        if (op === 'inc') setQuantity(q => q + 1)
    }

    const handleBuy = () => {
        const phone = "525512345678" // Tu número
        const total = product.price * quantity
        const message = `Hola Croquetería Gaby 🐾! Me interesa:
        
Producto: *${product.name}*
Presentación: ${product.weight}
Cantidad: ${quantity} pza(s)
Total Estimado: $${total}

¿Tienen disponible?`

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
        window.open(url, '_blank')
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>&times;</button>
                
                <div className="modal-body">
                    {/* Galería */}
                    <div className="gallery-section">
                        <img 
                            src={images[currentImage]} 
                            alt={product.name} 
                            className="main-image" 
                        />
                        <div className="thumbnails">
                            {images.map((img, idx) => (
                                <img 
                                    key={idx} 
                                    src={img} 
                                    className={`thumb ${currentImage === idx ? 'active' : ''}`}
                                    onClick={() => setCurrentImage(idx)}
                                    alt="thumbnail"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Información */}
                    <div className="info-section">
                        <span className="modal-brand">{product.brand}</span>
                        <h2 className="modal-title">{product.name}</h2>
                        <p className="modal-weight">Presentación: {product.weight}</p>

                        <div className="description-container">
                            <h4 className="section-title">Descripción</h4>
                            <p className="description-text">
                                {product.description || defaultDesc}
                            </p>
                        </div>

                        <div className="benefits-container">
                            <h4 className="section-title">Beneficios Clave</h4>
                            <ul className="benefits-list">
                                {(product.benefits || defaultBenefits).map((ben, idx) => (
                                    <li key={idx}>• {ben}</li>
                                ))}
                            </ul>
                        </div>

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
    )
}

export default ProductModal