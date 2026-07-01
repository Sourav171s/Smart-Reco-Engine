import React, { useState, useMemo } from 'react';
import { Box, Typography, Container, Grid, Dialog, DialogContent, IconButton, Badge } from '@mui/material';
import { Search, Plus, Pencil, Trash2, X, Star, ShoppingCart } from 'lucide-react';

const initialProducts = [
  { id: 1, name: 'Amul Milk 500ml', brand: 'Amul', category: 'Dairy', price: 30, rating: 4.5, stock: 120, sku: 'DRY-001', image: '', badge: 'Hot' },
  { id: 2, name: 'Nandini Milk 500ml', brand: 'Nandini', category: 'Dairy', price: 31, rating: 4.3, stock: 90, sku: 'DRY-002', image: '', badge: '' },
  { id: 3, name: 'Heritage Milk 500ml', brand: 'Heritage', category: 'Dairy', price: 35, rating: 4.1, stock: 50, sku: 'DRY-003', image: '', badge: 'Sale' },
  { id: 4, name: "Lay's Chips Classic 120g", brand: "Lay's", category: 'Snacks', price: 40, rating: 4.2, stock: 200, sku: 'SNK-001', image: '', badge: 'New' },
  { id: 5, name: 'Maggi Noodles 280g', brand: 'Maggi', category: 'Instant', price: 56, rating: 4.7, stock: 340, sku: 'INS-001', image: '', badge: '-10%' },
  { id: 6, name: 'Britannia Bread 400g', brand: 'Britannia', category: 'Bakery', price: 45, rating: 4.0, stock: 60, sku: 'BKR-001', image: '', badge: '' },
];

export default function ProductCatalog() {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(100);
  const [sortBy, setSortBy] = useState('Featured');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({ name: '', brand: '', category: 'Dairy', customCategory: '', price: '', rating: '', stock: '', sku: '', image: '' });
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  // Derived data
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.map(c => ({ name: c, count: products.filter(p => p.category === c).length }));
  }, [products]);

  const filtered = useMemo(() => {
    let result = products;
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    result = result.filter(p => p.price <= priceRange);
    
    if (sortBy === 'Price: Low to High') result.sort((a,b) => a.price - b.price);
    if (sortBy === 'Price: High to Low') result.sort((a,b) => b.price - a.price);
    if (sortBy === 'Rating') result.sort((a,b) => b.rating - a.rating);
    
    return result;
  }, [products, activeCategory, searchQuery, priceRange, sortBy]);

  const handleDelete = (id) => setProducts(products.filter(p => p.id !== id));

  const openEdit = (product) => {
    setEditingProduct(product);
    const hasStandardCat = categories.some(c => c.name === product.category);
    setIsCustomCategory(!hasStandardCat);
    setFormData({ 
      name: product.name, brand: product.brand, 
      category: hasStandardCat ? product.category : 'Other', customCategory: hasStandardCat ? '' : product.category,
      price: product.price, rating: product.rating, stock: product.stock, sku: product.sku, image: product.image || '' 
    });
    setShowAddModal(true);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setIsCustomCategory(false);
    setFormData({ name: '', brand: '', category: categories[0]?.name || 'Other', customCategory: '', price: '', rating: '', stock: '', sku: '', image: '' });
    setShowAddModal(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price) return;
    const finalCategory = isCustomCategory ? formData.customCategory : formData.category;
    
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? {
        ...p, name: formData.name, brand: formData.brand, category: finalCategory,
        price: parseFloat(formData.price), rating: parseFloat(formData.rating) || 0,
        stock: parseInt(formData.stock) || 0, sku: formData.sku, image: formData.image
      } : p));
    } else {
      setProducts([...products, {
        id: Date.now(), name: formData.name, brand: formData.brand, category: finalCategory,
        price: parseFloat(formData.price), rating: parseFloat(formData.rating) || 0,
        stock: parseInt(formData.stock) || 0, sku: formData.sku || `NEW-${Date.now()}`, image: formData.image, badge: 'New'
      }]);
    }
    setShowAddModal(false);
  };

  const getBadgeClass = (badge) => {
    if (badge === 'Hot') return 'badge-hot';
    if (badge === 'Sale') return 'badge-sale';
    if (badge === 'New') return 'badge-new';
    return 'badge-discount';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Top Controls Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography sx={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          We found <strong style={{ color: 'var(--green)' }}>{filtered.length}</strong> items for you!
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ border: '1px solid var(--border)', borderRadius: '4px', px: 2, py: 1, display: 'flex', alignItems: 'center', bgcolor: 'var(--bg-white)' }}>
            <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)', mr: 1 }}>Sort by:</Typography>
            <select style={{ border: 'none', outline: 'none', background: 'transparent', fontWeight: 600, color: 'var(--text-primary)' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
          </Box>
          <button className="btn-green" onClick={openAdd}><Plus size={16} /> Add Product</button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
        {/* Main Grid */}
        <Box sx={{ flex: 3 }}>
          <Grid container spacing={3}>
            {filtered.map((product, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Box className="product-card fade-in">
                  {product.badge && <Box className={`badge ${getBadgeClass(product.badge)}`}>{product.badge}</Box>}
                  
                  {/* Action overlay for admin */}
                  <Box sx={{ position: 'absolute', top: 12, right: -40, display: 'flex', flexDirection: 'column', gap: 1, transition: 'all 0.3s', opacity: 0 }} className="card-actions">
                    <IconButton size="small" sx={{ bgcolor: 'var(--green-light)', color: 'var(--green)', '&:hover':{bgcolor:'var(--green)', color:'white'} }} onClick={(e) => { e.stopPropagation(); openEdit(product); }}><Pencil size={14} /></IconButton>
                    <IconButton size="small" sx={{ bgcolor: '#ffe1e1', color: 'var(--red)', '&:hover':{bgcolor:'var(--red)', color:'white'} }} onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}><Trash2 size={14} /></IconButton>
                  </Box>

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
                      {product.badge === 'Sale' && <Typography sx={{ fontSize: '0.8rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>₹{Math.round(product.price * 1.2)}</Typography>}
                    </Box>
                    <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px' }}>
                      <ShoppingCart size={14} /> Add
                    </button>
                  </Box>

                  <style>{`
                    .product-card:hover .card-actions { right: 12px; opacity: 1; }
                  `}</style>
                </Box>
              </Grid>
            ))}
          </Grid>
          {filtered.length === 0 && (
             <Box sx={{ textAlign: 'center', py: 10 }}>
               <Typography sx={{ color: 'var(--text-secondary)' }}>No products found.</Typography>
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
                <Badge badgeContent={products.length} sx={{ '& .MuiBadge-badge': { bgcolor: 'var(--green-light)', color: 'var(--green)' }, position: 'relative', transform: 'none' }} />
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
            <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', mb: 2, pb: 2, borderBottom: '1px solid var(--border)' }}>Fill by price</Typography>
            <input type="range" min="0" max="500" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>From: <span style={{ color: 'var(--green)', fontWeight: 600 }}>₹0</span></Typography>
              <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>To: <span style={{ color: 'var(--green)', fontWeight: 600 }}>₹{priceRange}</span></Typography>
            </Box>
            
            <button className="btn-green" style={{ width: '100%', justifyContent: 'center', marginTop: 24 }} onClick={() => {}}>Filter</button>
          </Box>
        </Box>
      </Box>

      {/* Add / Edit Modal */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 4, bgcolor: 'var(--bg-white)', borderRadius: '12px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{editingProduct ? 'Edit Product' : 'Add Product'}</Typography>
            <IconButton onClick={() => setShowAddModal(false)}><X /></IconButton>
          </Box>
          
          <Grid container spacing={2}>
            {/* Image Upload Area */}
            <Grid item xs={12}>
              <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)', mb: 1 }}>Product Image (URL)</Typography>
              {formData.image ? (
                <Box sx={{ position: 'relative', width: 100, height: 100, mb: 1 }}>
                  <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  <IconButton size="small" sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'var(--red)', color: 'white', '&:hover':{bgcolor:'darkred'} }} onClick={() => setFormData({...formData, image: ''})}><X size={14}/></IconButton>
                </Box>
              ) : (
                <input className="form-input" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)', mb: 1 }}>Product Name *</Typography>
              <input className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)', mb: 1 }}>Brand *</Typography>
              <input className="form-input" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
            </Grid>
            
            {/* Dynamic Category Selection */}
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)', mb: 1 }}>Category</Typography>
              <select className="form-input" value={isCustomCategory ? 'Other' : formData.category} onChange={e => {
                if (e.target.value === 'Other') {
                  setIsCustomCategory(true);
                  setFormData({...formData, category: 'Other'});
                } else {
                  setIsCustomCategory(false);
                  setFormData({...formData, category: e.target.value, customCategory: ''});
                }
              }}>
                {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                <option value="Other">Other (Type custom...)</option>
              </select>
            </Grid>
            
            {isCustomCategory && (
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)', mb: 1 }}>Custom Category Name *</Typography>
                <input className="form-input" value={formData.customCategory} onChange={e => setFormData({...formData, customCategory: e.target.value})} placeholder="e.g. Organic Food" />
              </Grid>
            )}

            <Grid item xs={6} sm={4}>
              <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)', mb: 1 }}>Price (₹) *</Typography>
              <input type="number" className="form-input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)', mb: 1 }}>Stock Qty</Typography>
              <input type="number" className="form-input" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)', mb: 1 }}>Rating (1-5)</Typography>
              <input type="number" step="0.1" max="5" className="form-input" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} />
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <button className="btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn-green" onClick={handleSubmit}>{editingProduct ? 'Save Changes' : 'Add Product'}</button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
