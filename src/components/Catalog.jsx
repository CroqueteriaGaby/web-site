import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import catalogData from '../data/catalog.json'

function Catalog() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('Alimento Económico')
    const [searchTerm, setSearchTerm] = useState('')

    // Categories
    const categories = [
        'Alimento Económico',
        'Alimento Premium',
        'Sobres - Pouches Y Premios',
        'Arena para Gatos'
    ]

    // Filter and Group Data
    const groupedData = useMemo(() => {
        // 1. Filter by Category (Tab) and Search Term
        const filtered = catalogData.filter(item => {
            const matchesTab = item.category === activeTab
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.breed.toLowerCase().includes(searchTerm.toLowerCase())
            return matchesTab && matchesSearch
        })

        // 2. Sort by Popularity (Low # is better) -> then Name
        filtered.sort((a, b) => {
            if (a.popularity !== b.popularity) {
                return a.popularity - b.popularity
            }
            return a.name.localeCompare(b.name)
        })

        // 3. Group by Brand -> Breed. 
        // Note: Sorted order is preserved in object insertion in modern JS, but for display we explicitly sort brands again if needed.
        const groups = {}

        filtered.forEach(item => {
            if (!groups[item.brand]) {
                groups[item.brand] = {}
            }
            if (!groups[item.brand][item.breed]) {
                groups[item.brand][item.breed] = []
            }
            groups[item.brand][item.breed].push(item)
        })

        return groups
    }, [activeTab, searchTerm])

    // Get sorted brands based on minimum popularity of their items in this category logic
    const brands = Object.keys(groupedData).sort((a, b) => {
        // Find the "best" popularity item in brand A and B to sort the sections
        // Actually, let's just sort brands alphabetically for display stability, 
        // or prioritize popular brands if user wants. User said "popularidad para el orden que se muestran",
        // likely meaning products inside. But sorting sections by popular brands is also nice.
        // Let's stick to simple alphabetical for Brand headers for now, but PRODUCTS inside are sorted.
        // Actually, user explicitly mentioned: "en economico ponle 1 a purina y 2 pro plan". This implies Brand Sorting.

        const minPopA = Math.min(...Object.values(groupedData[a]).flat().map(i => i.popularity))
        const minPopB = Math.min(...Object.values(groupedData[b]).flat().map(i => i.popularity))

        if (minPopA !== minPopB) return minPopA - minPopB
        return a.localeCompare(b)
    })

    const styles = {
        container: {
            minHeight: '100vh',
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
        },
        backButton: {
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#666'
        },
        title: {
            fontSize: '2rem',
            color: '#333',
            margin: 0
        },
        tabs: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2rem',
            gap: '1rem',
            flexWrap: 'wrap'
        },
        tab: (isActive) => ({
            padding: '0.8rem 2rem',
            fontSize: '1rem',
            borderRadius: '50px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: isActive ? '#ff6b6b' : '#e9ecef',
            color: isActive ? 'white' : '#495057',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: isActive ? '0 4px 15px rgba(255, 107, 107, 0.4)' : 'none'
        }),
        searchContainer: {
            maxWidth: '600px',
            margin: '0 auto 3rem',
            position: 'relative'
        },
        searchInput: {
            width: '100%',
            padding: '1rem 1.5rem',
            fontSize: '1.1rem',
            borderRadius: '30px',
            border: '2px solid #eee',
            outline: 'none',
            transition: 'border-color 0.3s',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        },
        brandSection: {
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
        },
        brandTitle: {
            fontSize: '1.8rem',
            color: '#2c3e50',
            marginBottom: '1.5rem',
            borderBottom: '2px solid #ff6b6b',
            display: 'inline-block',
            paddingBottom: '0.5rem'
        },
        breedSection: {
            marginBottom: '1.5rem',
            paddingLeft: '1rem'
        },
        breedTitle: {
            fontSize: '1.3rem',
            color: '#7f8c8d',
            marginBottom: '1rem',
            fontWeight: '600'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1.5rem'
        },
        card: {
            border: '1px solid #eee',
            borderRadius: '15px',
            padding: '1rem',
            textAlign: 'center',
            transition: 'transform 0.2s',
            cursor: 'pointer',
            backgroundColor: '#fff'
        },
        cardImage: {
            width: '100%',
            height: '150px',
            objectFit: 'contain',
            marginBottom: '1rem'
        },
        cardTitle: {
            fontSize: '1rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: '#333'
        },
        cardPrice: {
            fontSize: '1.2rem',
            color: '#ff6b6b',
            fontWeight: 'bold'
        }
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <button onClick={() => navigate('/')} style={styles.backButton}>
                    ⬅ Volver
                </button>
                <h1 style={styles.title}>Catálogo de Productos</h1>
                <div style={{ width: '40px' }}></div> {/* Spacer for alignment */}
            </header>

            {/* Tabs */}
            <div style={styles.tabs}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        style={styles.tab(activeTab === cat)}
                        onClick={() => setActiveTab(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar por marca, raza o nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
            </div>

            {/* Content */}
            {brands.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#999', marginTop: '3rem' }}>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta con otra búsqueda o categoría</p>
                </div>
            ) : (
                brands.map(brand => (
                    <div key={brand} style={styles.brandSection}>
                        <h2 style={styles.brandTitle}>{brand}</h2>
                        {Object.keys(groupedData[brand]).map(breed => (
                            <div key={breed} style={styles.breedSection}>
                                <h3 style={styles.breedTitle}>{breed}</h3>
                                <div style={styles.grid}>
                                    {groupedData[brand][breed].map(product => (
                                        <div
                                            key={product.id}
                                            style={styles.card}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <img src={product.image} alt={product.name} style={styles.cardImage} />
                                            <div style={styles.cardTitle}>{product.name}</div>
                                            <div style={styles.cardPrice}>${product.price} MXN</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    )
}

export default Catalog
