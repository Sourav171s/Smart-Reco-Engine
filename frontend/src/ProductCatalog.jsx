import React, { useState } from 'react';
import { Box, Typography, IconButton, Button, Container, Dialog, DialogContent } from '@mui/material';
import { Search, SlidersHorizontal, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Star, X } from 'lucide-react';

const allProducts = [
  { id: 1, name: 'Amul Milk 500ml', brand: 'Amul', category: 'Dairy', price: 30, rating: 4.5, stock: 120, sku: 'DRY-001' },
  { id: 2, name: 'Nandini Milk 500ml', brand: 'Nandini', category: 'Dairy', price: 31, rating: 4.3, stock: 90, sku: 'DRY-002' },
  { id: 3, name: 'Heritage Milk 500ml', brand: 'Heritage', category: 'Dairy', price: 35, rating: 4.1, stock: 50, sku: 'DRY-003' },
  { id: 4, name: "Lay's Chips Classic 120g", brand: "Lay's", category: 'Snacks', price: 40, rating: 4.2, stock: 200, sku: 'SNK-001' },
  { id: 5, name: 'Maggi Noodles 280g', brand: 'Maggi', category: 'Instant', price: 56, rating: 4.7, stock: 340, sku: 'INS-001' },
  { id: 6, name: 'Britannia Bread 400g', brand: 'Britannia', category: 'Bakery', price: 45, rating: 4.0, stock: 60, sku: 'BKR-001' },
  { id: 7, name: 'Tata Tea 250g', brand: 'Tata', category: 'Beverages', price: 120, rating: 4.8, stock: 150, sku: 'BEV-001' },
  { id: 8, name: 'Parle-G 800g', brand: 'Parle', category: 'Snacks', price: 80, rating: 4.6, stock: 500, sku: 'SNK-002' },
  { id: 9, name: 'Aashirvaad Atta 5kg', brand: 'Aashirvaad', category: 'Staples', price: 280, rating: 4.4, stock: 45, sku: 'STP-001' },
  { id: 10, name: 'Surf Excel 1kg', brand: 'Surf Excel', category: 'Household', price: 195, rating: 4.1, stock: 90, sku: 'HHD-001' },
  { id: 11, name: 'Amul Butter 500g', brand: 'Amul', category: 'Dairy', price: 270, rating: 4.9, stock: 30, sku: 'DRY-004' },
  { id: 12, name: 'Haldiram Namkeen 400g', brand: 'Haldiram', category: 'Snacks', price: 110, rating: 4.3, stock: 175, sku: 'SNK-003' },
  { id: 13, name: 'Nescafe Coffee 200g', brand: 'Nescafe', category: 'Beverages', price: 350, rating: 4.7, stock: 65, sku: 'BEV-002' },
  { id: 14, name: 'Vim Dishwash 500ml', brand: 'Vim', category: 'Household', price: 99, rating: 3.9, stock: 110, sku: 'HHD-002' },
  { id: 15, name: 'Dettol Soap 75g', brand: 'Dettol', category: 'Personal Care', price: 42, rating: 4.0, stock: 220, sku: 'PRC-001' },
  { id: 16, name: 'Bournvita 500g', brand: 'Cadbury', category: 'Beverages', price: 230, rating: 4.5, stock: 80, sku: 'BEV-003' },
];

const ITEMS_PER_PAGE = 6;
const categories = ['All', ...new Set(allProducts.map(p => p.category))];

export default function ProductCatalog() {
  const [products, setProducts] = useState(allProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state for add/edit
  const [formData, setFormData] = useState({ name: '', brand: '', category: 'Dairy', price: '', rating: '', stock: '', sku: '' });

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, brand: product.brand, category: product.category, price: product.price.toString(), rating: product.rating.toString(), stock: product.stock.toString(), sku: product.sku });
    setShowAddModal(true);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', brand: '', category: 'Dairy', price: '', rating: '', stock: '', sku: '' });
    setShowAddModal(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.brand || !formData.price) return;
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? {
        ...p, name: formData.name, brand: formData.brand, category: formData.category,
        price: parseFloat(formData.price), rating: parseFloat(formData.rating) || 0,
        stock: parseInt(formData.stock) || 0, sku: formData.sku
      } : p));
    } else {
      const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1,
        name: formData.name, brand: formData.brand, category: formData.category,
        price: parseFloat(formData.price), rating: parseFloat(formData.rating) || 0,
        stock: parseInt(formData.stock) || 0, sku: formData.sku || `NEW-${Date.now()}`
      };
      setProducts([...products, newProduct]);
    }
    setShowAddModal(false);
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    background: 'var(--bg-panel-light)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', fontFamily: 'var(--mono)', fontSize: '0.8rem',
    outline: 'none', letterSpacing: '0.03em',
  };

  const labelStyle = {
    fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)',
    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', display: 'block'
  };

  const getStockColor = (stock) => {
    if (stock > 100) return 'var(--accent-green)';
    if (stock > 30) return 'var(--text-secondary)';
    return 'var(--accent-red)';
  };

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 4, md: 8 }, color: 'var(--text-primary)' }}>
      <Container maxWidth="lg">

        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 5 }}>
          <Box>
            <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)', letterSpacing: '0.3em', mb: 1, textTransform: 'uppercase' }}>
              Admin Panel
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 300, letterSpacing: '-0.05em', display: 'flex', alignItems: 'center' }}>
              Product_Catalog<span className="blink" style={{ color: 'var(--text-tertiary)', marginLeft: '4px' }}>_</span>
            </Typography>
          </Box>
          <Button
            onClick={openAdd}
            sx={{
              bgcolor: 'var(--text-primary)', color: 'var(--bg-base)',
              borderRadius: 0, px: 3, py: 1.5,
              fontFamily: 'var(--mono)', fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 1,
              '&:hover': { bgcolor: 'var(--text-secondary)' },
            }}
          >
            <Plus size={16} />
            Add Product
          </Button>
        </Box>

        {/* Search & Filters Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 1.5,
            border: '1px solid var(--border)', bgcolor: 'var(--bg-panel)', px: 2, py: 1.5,
            '&:focus-within': { borderColor: 'var(--border-light)' }
          }}>
            <Search size={16} color="var(--text-tertiary)" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text-primary)', fontFamily: 'var(--mono)', fontSize: '0.8rem',
                letterSpacing: '0.03em'
              }}
            />
          </Box>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              border: '1px solid var(--border)', borderRadius: 0, px: 3, py: 1.5,
              fontFamily: 'var(--mono)', fontSize: '0.75rem', letterSpacing: '0.1em',
              color: showFilters ? 'var(--bg-base)' : 'var(--text-secondary)',
              bgcolor: showFilters ? 'var(--text-primary)' : 'transparent',
              textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 1,
              '&:hover': { borderColor: 'var(--border-light)', color: showFilters ? 'var(--bg-base)' : 'var(--text-primary)' }
            }}
          >
            <SlidersHorizontal size={14} />
            Filters
          </Button>
        </Box>

        {/* Filter Chips (collapsible) */}
        {showFilters && (
          <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap', p: 3, border: '1px solid var(--border)', bgcolor: 'var(--bg-panel)' }}>
            <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)', letterSpacing: '0.1em', mr: 2, alignSelf: 'center' }}>
              CATEGORY:
            </Typography>
            {categories.map(cat => (
              <Box
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                sx={{
                  px: 2, py: 0.8,
                  border: '1px solid',
                  borderColor: activeCategory === cat ? 'var(--text-primary)' : 'var(--border)',
                  bgcolor: activeCategory === cat ? 'var(--text-primary)' : 'transparent',
                  color: activeCategory === cat ? 'var(--bg-base)' : 'var(--text-secondary)',
                  fontFamily: 'var(--mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
                  cursor: 'pointer', textTransform: 'uppercase',
                  transition: 'all 0.15s',
                  '&:hover': { borderColor: 'var(--border-light)', color: activeCategory === cat ? 'var(--bg-base)' : 'var(--text-primary)' }
                }}
              >
                {cat}
              </Box>
            ))}
          </Box>
        )}

        {/* Product Table */}
        <Box sx={{ border: '1px solid var(--border)', bgcolor: 'var(--bg-panel)', overflow: 'hidden' }}>
          {/* Table Header */}
          <Box sx={{
            display: { xs: 'none', md: 'grid' },
            gridTemplateColumns: '2fr 1fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr',
            gap: 2, px: 3, py: 2,
            borderBottom: '1px solid var(--border)', bgcolor: 'var(--bg-panel-light)',
            color: 'var(--text-tertiary)',
          }}>
            {['Product Name', 'Brand', 'Category', 'Price', 'Rating', 'Stock', 'Actions'].map(h => (
              <Typography key={h} sx={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: h === 'Actions' ? 'right' : 'left' }}>
                {h}
              </Typography>
            ))}
          </Box>

          {/* Table Rows */}
          {paginated.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                &gt; NO_RECORDS_FOUND
              </Typography>
            </Box>
          ) : (
            paginated.map((product, index) => (
              <Box key={product.id} sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr' },
                gap: 2, px: 3, py: 2.5,
                borderBottom: index < paginated.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'center',
                transition: 'background-color 0.15s',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }
              }}>
                {/* Product Name */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 40, height: 40, border: '1px solid var(--border)',
                    bgcolor: 'var(--bg-panel-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--mono)', fontSize: '0.5rem', color: 'var(--text-tertiary)',
                    flexShrink: 0
                  }}>
                    {product.sku.substring(0, 3)}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {product.name}
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-tertiary)', mt: 0.5, display: { xs: 'block', md: 'none' } }}>
                      {product.brand} · {product.category} · ₹{product.price}
                    </Typography>
                  </Box>
                </Box>

                {/* Brand */}
                <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: { xs: 'none', md: 'block' } }}>
                  {product.brand}
                </Typography>

                {/* Category */}
                <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: { xs: 'none', md: 'block' } }}>
                  {product.category}
                </Typography>

                {/* Price */}
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.875rem', display: { xs: 'none', md: 'block' } }}>
                  ₹{product.price}
                </Typography>

                {/* Rating */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
                  <Star size={12} color="var(--text-secondary)" fill="var(--text-secondary)" />
                  <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {product.rating}
                  </Typography>
                </Box>

                {/* Stock */}
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.875rem', color: getStockColor(product.stock), fontWeight: 600, display: { xs: 'none', md: 'block' } }}>
                  {product.stock}
                </Typography>

                {/* Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  <IconButton
                    size="small"
                    onClick={() => openEdit(product)}
                    sx={{ border: '1px solid var(--border)', borderRadius: 0, width: 30, height: 30, color: 'var(--text-secondary)', '&:hover': { bgcolor: 'var(--border)', color: 'var(--text-primary)' } }}
                  >
                    <Pencil size={14} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(product.id)}
                    sx={{ border: '1px solid var(--border)', borderRadius: 0, width: 30, height: 30, color: 'var(--text-secondary)', '&:hover': { bgcolor: 'var(--accent-red)', borderColor: 'var(--accent-red)', color: '#fff' } }}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 4 }}>
            <IconButton
              size="small"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              sx={{ border: '1px solid var(--border)', borderRadius: 0, width: 32, height: 32, color: 'var(--text-secondary)', '&:hover': { bgcolor: 'var(--border)' }, '&.Mui-disabled': { color: 'var(--text-tertiary)', borderColor: 'var(--border)' } }}
            >
              <ChevronLeft size={14} />
            </IconButton>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Box
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                sx={{
                  width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid',
                  borderColor: currentPage === i + 1 ? 'var(--text-primary)' : 'var(--border)',
                  bgcolor: currentPage === i + 1 ? 'var(--text-primary)' : 'transparent',
                  color: currentPage === i + 1 ? 'var(--bg-base)' : 'var(--text-secondary)',
                  fontFamily: 'var(--mono)', fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': { borderColor: 'var(--border-light)' }
                }}
              >
                {i + 1}
              </Box>
            ))}
            <IconButton
              size="small"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              sx={{ border: '1px solid var(--border)', borderRadius: 0, width: 32, height: 32, color: 'var(--text-secondary)', '&:hover': { bgcolor: 'var(--border)' }, '&.Mui-disabled': { color: 'var(--text-tertiary)', borderColor: 'var(--border)' } }}
            >
              <ChevronRight size={14} />
            </IconButton>
          </Box>
        )}

        <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)', textAlign: 'center', mt: 2 }}>
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} products
        </Typography>

      </Container>

      {/* Add/Edit Product Modal */}
      <Dialog
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 0, color: 'var(--text-primary)' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          {/* Modal Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderBottom: '1px solid var(--border)', bgcolor: 'var(--bg-panel-light)' }}>
            <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {editingProduct ? '> Edit_Product' : '> Add_Product'}
            </Typography>
            <IconButton size="small" onClick={() => setShowAddModal(false)} sx={{ color: 'var(--text-secondary)' }}>
              <X size={18} />
            </IconButton>
          </Box>

          {/* Modal Body */}
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <label style={labelStyle}>Product Name</label>
                <input style={inputStyle} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Amul Milk 500ml" />
              </Box>
              <Box>
                <label style={labelStyle}>Brand</label>
                <input style={inputStyle} value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} placeholder="e.g. Amul" />
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <label style={labelStyle}>Category</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat} style={{ background: 'var(--bg-panel)' }}>{cat}</option>
                  ))}
                </select>
              </Box>
              <Box>
                <label style={labelStyle}>SKU</label>
                <input style={inputStyle} value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} placeholder="e.g. DRY-001" />
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              <Box>
                <label style={labelStyle}>Price (₹)</label>
                <input style={inputStyle} type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0" />
              </Box>
              <Box>
                <label style={labelStyle}>Rating</label>
                <input style={inputStyle} type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} placeholder="0.0" />
              </Box>
              <Box>
                <label style={labelStyle}>Stock</label>
                <input style={inputStyle} type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="0" />
              </Box>
            </Box>
          </Box>

          {/* Modal Footer */}
          <Box sx={{ display: 'flex', gap: 2, p: 3, borderTop: '1px solid var(--border)', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => setShowAddModal(false)}
              sx={{
                border: '1px solid var(--border)', borderRadius: 0, px: 3, py: 1,
                fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-secondary)',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                '&:hover': { borderColor: 'var(--border-light)', color: 'var(--text-primary)' }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              sx={{
                bgcolor: 'var(--text-primary)', color: 'var(--bg-base)', borderRadius: 0, px: 3, py: 1,
                fontFamily: 'var(--mono)', fontSize: '0.75rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                '&:hover': { bgcolor: 'var(--text-secondary)' }
              }}
            >
              {editingProduct ? '> Save_Changes' : '> Add_Product'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
