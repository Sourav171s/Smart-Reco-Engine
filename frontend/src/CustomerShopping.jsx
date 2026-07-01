import React, { useState, useMemo } from 'react';
import { Box, Typography, Container, Grid, Dialog, DialogContent, IconButton, Badge } from '@mui/material';
import { Search, ShoppingCart, Star, X, Zap } from 'lucide-react';

const allProducts = [
  { id: 1, name: 'Amul Milk 500ml', brand: 'Amul', category: 'Dairy', price: 30, rating: 4.5, image: '', badge: 'Hot' },
  { id: 2, name: 'Nandini Milk 500ml', brand: 'Nandini', category: 'Dairy', price: 31, rating: 4.3, image: '', badge: '' },
  { id: 3, name: 'Heritage Milk 500ml', brand: 'Heritage', category: 'Dairy', price: 28, rating: 4.6, image: '', badge: 'Sale' },
  { id: 4, name: "Lay's Chips Classic 120g", brand: "Lay's", category: 'Snacks', price: 40, rating: 4.2, image: '', badge: 'New' },
  { id: 5, name: 'Maggi Noodles 280g', brand: 'Maggi', category: 'Instant', price: 56, rating: 4.7, image: '', badge: '-14%' },
  { id: 17, name: 'Yippee Noodles 280g', brand: 'ITC', category: 'Instant', price: 50, rating: 4.4, image: '', badge: '' },
];

export default function CustomerShopping({ addToCart }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const cats = [...new Set(allProducts.map(p => p.category))];
    return cats.map(c => ({ name: c, count: allProducts.filter(p => p.category === c).length }));
  }, []);

  const filtered = useMemo(() => {
    let result = allProducts;
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    result = result.filter(p => p.price <= priceRange);
    return result;
  }, [activeCategory, searchQuery, priceRange]);

  const getBadgeClass = (badge) => {
    if (badge === 'Hot') return 'badge-hot';
    if (badge === 'Sale') return 'badge-sale';
    if (badge === 'New') return 'badge-new';
    return 'badge-discount';
  };

  const getRecommendations = (product) => {
    const itemKeywords = ['Milk', 'Butter', 'Noodles', 'Bread', 'Tea', 'Coffee', 'Chips'];
    let coreType = itemKeywords.find(keyword => product.name.includes(keyword));
    
    let candidates = coreType 
      ? allProducts.filter(p => p.name.includes(coreType) && p.id !== product.id)
      : allProducts.filter(p => p.category === product.category && p.id !== product.id);
    
    candidates.sort((a, b) => b.rating - a.rating || a.price - b.price);
    
    return candidates.slice(0, 2).map(rec => {
      let explanation = "";
      const itemName = coreType || rec.category;
      
      if (rec.rating > product.rating && rec.price < product.price) {
        explanation = `Higher user rating (${rec.rating} vs ${product.rating}) and lower price (₹${rec.price} vs ₹${product.price}). Optimal value detected.`;
      } else if (rec.rating > product.rating) {
        explanation = `Superior community rating (${rec.rating} vs ${product.rating}) for ${itemName}.`;
      } else if (rec.price < product.price) {
        explanation = `More cost-effective alternative for ${itemName} (Saves ₹${product.price - rec.price}).`;
      } else {
        explanation = `Highly popular alternative choice for ${itemName}.`;
      }
      return { ...rec, explanation };
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', mb: 1 }}>Smart Storefront</Typography>
        <Typography sx={{ color: 'var(--text-secondary)' }}>Click on any product to see our AI recommendation engine in action.</Typography>
      </Box>

      {/* Top Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography sx={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          We found <strong style={{ color: 'var(--green)' }}>{filtered.length}</strong> items for you!
        </Typography>
        <Box sx={{ border: '1px solid var(--border)', borderRadius: '4px', px: 2, py: 1, display: 'flex', alignItems: 'center', bgcolor: 'var(--bg-white)' }}>
          <Search size={16} color="var(--text-light)" style={{ marginRight: 8 }} />
          <input 
            type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'Inter' }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
        {/* Product Grid */}
        <Box sx={{ flex: 3 }}>
          <Grid container spacing={3}>
            {filtered.map(product => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Box className="product-card fade-in" onClick={() => setSelectedProduct(product)}>
                  {product.badge && <Box className={`badge ${getBadgeClass(product.badge)}`}>{product.badge}</Box>}
                  
                  {product.image ? (
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: 180, objectFit: 'contain', marginBottom: 12 }} />
                  ) : (
                    <Box className="img-placeholder" />
                  )}

                  <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-light)', mb: 0.5 }}>{product.category}</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', mb: 1, lineHeight: 1.3 }}>{product.name}</Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <Star size={14} className="star-filled" fill="currentColor" />
                    <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>({product.rating})</Typography>
                  </Box>
                  
                  <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-light)', mb: 2 }}>
                    By <span style={{ color: 'var(--green)' }}>{product.brand}</span>
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--green)', lineHeight: 1 }}>₹{product.price}</Typography>
                    </Box>
                    <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px' }} onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
                      <ShoppingCart size={14} /> Add
                    </button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          {filtered.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography sx={{ color: 'var(--text-secondary)' }}>No products found matching your filters.</Typography>
            </Box>
          )}
        </Box>

        {/* Right Sidebar Filters */}
        <Box sx={{ flex: 1, minWidth: 260 }}>
          {/* Category Filter */}
          <Box className="filter-card">
            <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', mb: 2, pb: 2, borderBottom: '1px solid var(--border)' }}>Category</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box 
                sx={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', p: 1, borderRadius: '6px', border: '1px solid', borderColor: activeCategory === 'All' ? 'var(--green)' : 'transparent', bgcolor: activeCategory === 'All' ? 'var(--green-light)' : 'transparent', '&:hover': { bgcolor: 'var(--bg-base)' } }}
                onClick={() => setActiveCategory('All')}
              >
                <Typography sx={{ fontSize: '0.9rem', color: activeCategory === 'All' ? 'var(--green)' : 'var(--text-primary)' }}>All Categories</Typography>
                <Badge badgeContent={allProducts.length} sx={{ '& .MuiBadge-badge': { bgcolor: 'var(--green-light)', color: 'var(--green)' }, position: 'relative', transform: 'none' }} />
              </Box>
              {categories.map(cat => (
                <Box 
                  key={cat.name}
                  sx={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', p: 1, borderRadius: '6px', border: '1px solid', borderColor: activeCategory === cat.name ? 'var(--green)' : 'transparent', bgcolor: activeCategory === cat.name ? 'var(--green-light)' : 'transparent', '&:hover': { bgcolor: 'var(--bg-base)' } }}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  <Typography sx={{ fontSize: '0.9rem', color: activeCategory === cat.name ? 'var(--green)' : 'var(--text-primary)' }}>{cat.name}</Typography>
                  <Badge badgeContent={cat.count} sx={{ '& .MuiBadge-badge': { bgcolor: 'var(--bg-base)', color: 'var(--text-secondary)' }, position: 'relative', transform: 'none' }} />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Price Filter */}
          <Box className="filter-card">
            <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', mb: 2, pb: 2, borderBottom: '1px solid var(--border)' }}>Filter by Price</Typography>
            <input type="range" min="0" max="500" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>From: <span style={{ color: 'var(--green)', fontWeight: 600 }}>₹0</span></Typography>
              <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>To: <span style={{ color: 'var(--green)', fontWeight: 600 }}>₹{priceRange}</span></Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Smart Recommendation Modal */}
      <Dialog open={!!selectedProduct} onClose={() => setSelectedProduct(null)} maxWidth="md" fullWidth>
        {selectedProduct && (
          <DialogContent sx={{ p: 4, bgcolor: 'var(--bg-white)', borderRadius: '12px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ fontSize: '1.4rem', fontWeight: 700 }}>AI Smart Assistant</Typography>
              <IconButton onClick={() => setSelectedProduct(null)}><X /></IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 4, flexDirection: 'row' }}>
              <Box sx={{ flex: '0 0 40%' }}>
                <Typography sx={{ fontWeight: 600, color: 'var(--text-secondary)', mb: 2 }}>You Selected:</Typography>
                <Box sx={{ p: 2, border: '1px solid var(--border)', borderRadius: '12px', bgcolor: 'var(--bg-base)' }}>
                  {selectedProduct.image ? (
                     <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', height: 140, objectFit: 'contain', marginBottom: 12 }} />
                  ) : (
                     <Box className="img-placeholder" sx={{ height: 140 }} />
                  )}
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedProduct.name}</Typography>
                  <Typography sx={{ color: 'var(--text-secondary)', mt: 1 }}>Price: ₹{selectedProduct.price}</Typography>
                  <Typography sx={{ color: 'var(--text-secondary)' }}>Rating: {selectedProduct.rating} <Star size={12} className="star-filled" fill="currentColor"/></Typography>
                  <button className="btn-green" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }} onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>
                    Add Original to Cart
                  </button>
                </Box>
              </Box>

              <Box sx={{ flex: '1 1 auto' }}>
                <Typography sx={{ fontWeight: 600, color: 'var(--green)', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Zap size={18} fill="currentColor" /> Smarter Alternatives Found:
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {getRecommendations(selectedProduct).length > 0 ? getRecommendations(selectedProduct).map(rec => (
                    <Box key={rec.id} sx={{ p: 2, border: '1px solid var(--green)', borderRadius: '12px', bgcolor: 'var(--green-light)' }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {rec.image ? (
                           <img src={rec.image} style={{ width: 60, height: 60, objectFit: 'contain' }} />
                        ) : (
                           <Box className="img-placeholder" sx={{ width: 60, height: 60, mb: 0, bgcolor: 'var(--bg-white)', borderColor: 'var(--green)' }} />
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 700 }}>{rec.name}</Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Typography sx={{ fontSize: '0.9rem', color: 'var(--green)', fontWeight: 600 }}>₹{rec.price}</Typography>
                            <Typography sx={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{rec.rating} <Star size={12} className="star-filled" fill="currentColor"/></Typography>
                          </Box>
                          <Typography sx={{ fontSize: '0.8rem', color: 'var(--text-primary)', mt: 1, p: 1, bgcolor: 'var(--bg-white)', borderRadius: '4px', borderLeft: '3px solid var(--green)' }}>
                            {rec.explanation}
                          </Typography>
                        </Box>
                      </Box>
                      <button className="btn-green" style={{ width: '100%', marginTop: 12, justifyContent: 'center' }} onClick={() => { addToCart(rec); setSelectedProduct(null); }}>
                        Choose Alternative
                      </button>
                    </Box>
                  )) : (
                    <Typography sx={{ color: 'var(--text-secondary)' }}>No alternatives found.</Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Container>
  );
}
