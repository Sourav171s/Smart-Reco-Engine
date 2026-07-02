import { useState, useMemo, useId, useEffect } from 'react';
import { Box, Typography, Container, Grid, Dialog, DialogContent, IconButton, Chip, Tooltip, InputBase } from '@mui/material';
import { Search, Plus, Pencil, Trash2, X, Star, ShoppingCart, PackageSearch, ChevronDown, SlidersHorizontal, AlertTriangle } from 'lucide-react';
import { api, toProductPayload, toUiProduct } from './api';

const initialProducts = [
  { id: 1, name: 'Amul Milk 500ml', brand: 'Amul', category: 'Dairy', price: 30, rating: 4.5, stock: 120, sku: 'DRY-001', image: '', badge: 'Hot' },
  { id: 2, name: 'Nandini Milk 500ml', brand: 'Nandini', category: 'Dairy', price: 31, rating: 4.3, stock: 90, sku: 'DRY-002', image: '', badge: '' },
  { id: 3, name: 'Heritage Milk 500ml', brand: 'Heritage', category: 'Dairy', price: 35, rating: 4.1, stock: 50, sku: 'DRY-003', image: '', badge: 'Sale' },
  { id: 4, name: "Lay's Chips Classic 120g", brand: "Lay's", category: 'Snacks', price: 40, rating: 4.2, stock: 200, sku: 'SNK-001', image: '', badge: 'New' },
  { id: 5, name: 'Maggi Noodles 280g', brand: 'Maggi', category: 'Instant', price: 56, rating: 4.7, stock: 340, sku: 'INS-001', image: '', badge: '-10%' },
  { id: 6, name: 'Britannia Bread 400g', brand: 'Britannia', category: 'Bakery', price: 45, rating: 4.0, stock: 60, sku: 'BKR-001', image: '', badge: '' },
];

/* ============================================================================
   HELPERS
   ============================================================================ */

// Stock -> status mapping, kept in one place so the threshold logic (the
// only "business rule" here) is defined once and reused by both the card
// grid and anywhere else that needs to describe a stock level.
function getStockStatus(stock) {
  if (stock <= 0) return { label: 'Out of Stock', color: 'var(--red)', bg: 'var(--red-bg)' };
  if (stock <= 75) return { label: 'Low Stock', color: 'var(--orange)', bg: 'var(--orange-bg)' };
  return { label: 'In Stock', color: 'var(--green-700)', bg: 'var(--green-50)' };
}

function getBadgeClass(badge) {
  if (badge === 'Hot') return 'badge-hot';
  if (badge === 'Sale') return 'badge-sale';
  if (badge === 'New') return 'badge-new';
  return 'badge-discount';
}

/* ============================================================================
   PRODUCT CARD
   Extracted as its own component purely for readability — no props were
   invented; everything passed in already existed in the parent's scope.
   ============================================================================ */
function ProductCard({ product, onEdit, onDelete }) {
  const stockStatus = getStockStatus(product.stock);

  return (
    <Box className="product-card fade-in" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {product.badge && <Box className={`badge ${getBadgeClass(product.badge)}`}>{product.badge}</Box>}

      {/* Admin action overlay — reveals on hover/focus-within so it's reachable
          by keyboard users tabbing into the card, not just mouse hover. */}
      <Box
        className="card-actions"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          zIndex: 2,
          opacity: 0,
          transform: 'translateX(8px)',
          transition: 'opacity 180ms ease, transform 180ms ease',
        }}
      >
        <Tooltip title="Edit product" placement="left">
          <IconButton
            size="small"
            aria-label={`Edit ${product.name}`}
            sx={{
              bgcolor: 'var(--surface)',
              color: 'var(--green-600)',
              boxShadow: 'var(--shadow-sm)',
              '&:hover': { bgcolor: 'var(--green-600)', color: 'white' },
            }}
            onClick={(e) => { e.stopPropagation(); onEdit(product); }}
          >
            <Pencil size={14} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete product" placement="left">
          <IconButton
            size="small"
            aria-label={`Delete ${product.name}`}
            sx={{
              bgcolor: 'var(--surface)',
              color: 'var(--red)',
              boxShadow: 'var(--shadow-sm)',
              '&:hover': { bgcolor: 'var(--red)', color: 'white' },
            }}
            onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
          >
            <Trash2 size={14} />
          </IconButton>
        </Tooltip>
      </Box>

      {product.image ? (
        <Box
          component="img"
          src={product.image}
          alt={product.name}
          sx={{ width: '100%', height: 180, objectFit: 'contain', mb: 1.5, borderRadius: 'var(--radius-md)' }}
        />
      ) : (
        <Box className="img-placeholder">
          <PackageSearch size={28} strokeWidth={1.5} />
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-400)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {product.category}
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: 'var(--ink-400)', fontFamily: 'monospace' }}>
          {product.sku}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '0.95rem',
          color: 'var(--ink-900)',
          mb: 1,
          lineHeight: 1.35,
          minHeight: '2.6em',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {product.name}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
        <Star size={14} className="star-filled" fill="currentColor" />
        <Typography sx={{ fontSize: '0.78rem', color: 'var(--ink-600)', fontWeight: 600 }}>{product.rating}</Typography>
        <Typography sx={{ fontSize: '0.78rem', color: 'var(--ink-400)' }}>
          · By <Box component="span" sx={{ color: 'var(--green-700)', fontWeight: 600 }}>{product.brand}</Box>
        </Typography>
      </Box>

      <Chip
        icon={stockStatus.label === 'Out of Stock' ? <AlertTriangle size={12} /> : undefined}
        label={stockStatus.label === 'Out of Stock' ? stockStatus.label : `${stockStatus.label} · ${product.stock} units`}
        size="small"
        sx={{
          alignSelf: 'flex-start',
          bgcolor: stockStatus.bg,
          color: stockStatus.color,
          fontWeight: 700,
          fontSize: '0.68rem',
          height: 22,
          mb: 2,
          '& .MuiChip-icon': { color: stockStatus.color, ml: '6px' },
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--ink-900)', lineHeight: 1 }}>
            ₹{product.price}
          </Typography>
          {product.badge === 'Sale' && (
            <Typography sx={{ fontSize: '0.8rem', color: 'var(--ink-400)', textDecoration: 'line-through', mb: '1px' }}>
              ₹{Math.round(product.price * 1.2)}
            </Typography>
          )}
        </Box>
        <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 14px' }}>
          <ShoppingCart size={14} /> Add
        </button>
      </Box>

      <style>{`
        .product-card:hover .card-actions,
        .product-card:focus-within .card-actions {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>
    </Box>
  );
}

/* ============================================================================
   EMPTY STATE
   ============================================================================ */
function EmptyState({ hasQuery, onClearFilters, onAdd }) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 8, md: 10 },
        px: 3,
        border: '1.5px dashed var(--border-strong)',
        borderRadius: 'var(--radius-lg)',
        bgcolor: 'var(--surface)',
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'var(--canvas-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ink-400)',
          mx: 'auto',
          mb: 2.5,
        }}
      >
        <PackageSearch size={28} strokeWidth={1.5} />
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink-900)', mb: 0.75 }}>
        {hasQuery ? 'No products match your search' : 'No products yet'}
      </Typography>
      <Typography sx={{ color: 'var(--ink-600)', fontSize: '0.9rem', mb: 3, maxWidth: 360, mx: 'auto' }}>
        {hasQuery
          ? 'Try adjusting your search term or clearing filters to see more results.'
          : 'Get started by adding your first product to the catalog.'}
      </Typography>
      {hasQuery ? (
        <button className="btn-outline" onClick={onClearFilters}>Clear filters</button>
      ) : (
        <button className="btn-green" onClick={onAdd} style={{ margin: '0 auto' }}>
          <Plus size={16} /> Add Product
        </button>
      )}
    </Box>
  );
}

/* ============================================================================
   PAGE
   ============================================================================ */
export default function ProductCatalog() {
  const [products, setProducts] = useState(initialProducts);
  const [apiError, setApiError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Featured');
  const [activeCategory, setActiveCategory] = useState('All');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state
  const [formData, setFormData] = useState({ name: '', brand: '', category: 'Dairy', customCategory: '', price: '', rating: '', stock: '', sku: '', image: '' });
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const nameId = useId();
  const brandId = useId();

  // Derived data
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return cats.map((c) => ({ name: c, count: products.filter((p) => p.category === c).length }));
  }, [products]);

  useEffect(() => {
    let active = true;
    Promise.all([api.listProducts(), api.listInventory()])
      .then(([productRows, inventoryRows]) => {
        if (!active) return;
        const inventoryByProduct = new Map(inventoryRows.map((row) => [row.productId?._id, row]));
        setProducts(productRows.map((product) => toUiProduct(product, inventoryByProduct.get(product._id))));
        setApiError('');
      })
      .catch((error) => active && setApiError(error.message));
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    let result = products;

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    // Sort against a shallow copy so we never mutate `products` (or the
    // already-filtered array from a previous render) in place.
    result = [...result];
    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'Rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [products, searchQuery, sortBy, activeCategory]);

  const hasActiveFilters = searchQuery !== '' || activeCategory !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteProduct(id);
      setProducts((current) => current.filter((product) => product.id !== id));
    } catch (error) {
      setApiError(error.message);
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    const hasStandardCat = categories.some((c) => c.name === product.category);
    setIsCustomCategory(!hasStandardCat);
    setFormErrors({});
    setFormData({
      name: product.name, brand: product.brand,
      category: hasStandardCat ? product.category : 'Other', customCategory: hasStandardCat ? '' : product.category,
      price: product.price, rating: product.rating, stock: product.stock, sku: product.sku, image: product.image || '',
    });
    setShowAddModal(true);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setIsCustomCategory(false);
    setFormErrors({});
    setFormData({ name: '', brand: '', category: categories[0]?.name || 'Other', customCategory: '', price: '', rating: '', stock: '', sku: '', image: '' });
    setShowAddModal(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required.';
    if (!formData.brand.trim()) errors.brand = 'Brand is required.';
    if (!formData.price || Number(formData.price) <= 0) errors.price = 'Enter a valid price.';
    if (formData.stock === '' || !Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0) errors.stock = 'Enter a valid whole-number stock quantity.';
    if (isCustomCategory && !formData.customCategory.trim()) errors.customCategory = 'Enter a category name.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const finalCategory = isCustomCategory ? formData.customCategory : formData.category;

    const draft = { ...formData, category: finalCategory };
    try {
      if (editingProduct) {
        const saved = await api.updateProduct(editingProduct.id, toProductPayload(draft));
        if (editingProduct.inventoryId) {
          await api.updateInventory(editingProduct.inventoryId, { availableQuantity: Number(formData.stock || 0) });
        }
        setProducts((current) => current.map((product) => product.id === editingProduct.id
          ? { ...product, ...toUiProduct(saved), stock: Number(formData.stock || 0), inventoryId: editingProduct.inventoryId }
          : product));
      } else {
        const saved = await api.createProduct(toProductPayload(draft));
        const inventory = await api.createInventory({ productId: saved._id, availableQuantity: Number(formData.stock || 0) });
        setProducts((current) => [...current, { ...toUiProduct(saved, inventory), sku: formData.sku, image: formData.image, badge: 'New' }]);
      }
      setApiError('');
      setShowAddModal(false);
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
      {apiError && <Box role="alert" sx={{ mb: 2, color: 'var(--red)', fontSize: '0.85rem' }}>{apiError}</Box>}
      {/* ================= PAGE HEADER ================= */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box>
            <Typography component="h1" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 800, color: 'var(--ink-900)', letterSpacing: '-0.02em', mb: 0.5 }}>
              Product Catalog
            </Typography>
            <Typography sx={{ color: 'var(--ink-600)', fontSize: '0.9rem' }}>
              Manage products, pricing, and inventory across your storefront.
            </Typography>
          </Box>
          <button className="btn-green" onClick={openAdd} style={{ flexShrink: 0 }}>
            <Plus size={16} /> Add Product
          </button>
        </Box>
      </Box>

      {/* ================= TOOLBAR: SEARCH + SORT ================= */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 3,
          bgcolor: 'var(--canvas)',
          pt: 0.5,
          pb: 2,
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
          {/* Search */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'var(--surface)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              px: 1.75,
              py: 1,
              transition: 'border-color 120ms ease, box-shadow 120ms ease',
              '&:focus-within': { borderColor: 'var(--green-600)', boxShadow: 'var(--shadow-focus)' },
            }}
          >
            <Search size={18} color="var(--ink-400)" style={{ flexShrink: 0 }} />
            <InputBase
              placeholder="Search by product, brand, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              inputProps={{ 'aria-label': 'Search products' }}
              sx={{ flex: 1, fontSize: '0.9rem', color: 'var(--ink-900)' }}
            />
            {searchQuery && (
              <IconButton size="small" aria-label="Clear search" onClick={() => setSearchQuery('')} sx={{ p: 0.5 }}>
                <X size={14} />
              </IconButton>
            )}
          </Box>

          {/* Sort */}
          <Box
            sx={{
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              px: 1.75,
              py: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'var(--surface)',
              flexShrink: 0,
              transition: 'border-color 120ms ease',
              '&:focus-within': { borderColor: 'var(--green-600)' },
            }}
          >
            <SlidersHorizontal size={15} color="var(--ink-400)" />
            <Typography sx={{ fontSize: '0.85rem', color: 'var(--ink-600)', flexShrink: 0 }}>Sort:</Typography>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select
                aria-label="Sort products"
                style={{ border: 'none', outline: 'none', background: 'transparent', fontWeight: 600, color: 'var(--ink-900)', fontSize: '0.85rem', fontFamily: 'inherit', appearance: 'none', paddingRight: 18, cursor: 'pointer' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
              <ChevronDown size={13} color="var(--ink-400)" style={{ position: 'absolute', right: 0, pointerEvents: 'none' }} />
            </Box>
          </Box>
        </Box>

        {/* ================= CATEGORY FILTER CHIPS ================= */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          <Box
            component="button"
            onClick={() => setActiveCategory('All')}
            className={`category-tag ${activeCategory === 'All' ? 'active' : ''}`}
            style={{ fontFamily: 'inherit' }}
          >
            All <Box component="span" sx={{ opacity: 0.6, ml: 0.25 }}>({products.length})</Box>
          </Box>
          {categories.map((cat) => (
            <Box
              key={cat.name}
              component="button"
              onClick={() => setActiveCategory(cat.name)}
              className={`category-tag ${activeCategory === cat.name ? 'active' : ''}`}
              style={{ fontFamily: 'inherit' }}
            >
              {cat.name} <Box component="span" sx={{ opacity: 0.6, ml: 0.25 }}>({cat.count})</Box>
            </Box>
          ))}

          {hasActiveFilters && (
            <Typography
              component="button"
              onClick={clearFilters}
              sx={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--ink-600)',
                bgcolor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontFamily: 'inherit',
                ml: 0.5,
                '&:hover': { color: 'var(--red)' },
              }}
            >
              Clear filters
            </Typography>
          )}
        </Box>
      </Box>

      {/* ================= RESULT COUNT ================= */}
      <Typography sx={{ color: 'var(--ink-600)', fontSize: '0.85rem', mb: 2.5 }}>
        <Box component="span" sx={{ color: 'var(--ink-900)', fontWeight: 700 }}>{filtered.length}</Box>{' '}
        {filtered.length === 1 ? 'product' : 'products'} found
      </Typography>

      {/* ================= PRODUCT GRID ================= */}
      {filtered.length > 0 ? (
        <Grid container spacing={3}>
          {filtered.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} sx={{ display: 'flex' }}>
              <ProductCard product={product} onEdit={openEdit} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyState hasQuery={hasActiveFilters} onClearFilters={clearFilters} onAdd={openAdd} />
      )}

      {/* ================= ADD / EDIT DIALOG ================= */}
      <Dialog
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 'var(--radius-lg)' } }}
      >
        <DialogContent sx={{ p: { xs: 3, sm: 4 }, bgcolor: 'var(--surface)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.01em' }}>
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </Typography>
            <IconButton onClick={() => setShowAddModal(false)} aria-label="Close dialog">
              <X />
            </IconButton>
          </Box>

          <Grid container spacing={2.5}>
            {/* Image Upload Area */}
            <Grid item xs={12}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-700)', mb: 1 }}>Product Image (URL)</Typography>
              {formData.image ? (
                <Box sx={{ position: 'relative', width: 96, height: 96 }}>
                  <Box
                    component="img"
                    src={formData.image}
                    alt="Product preview"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                  />
                  <IconButton
                    size="small"
                    aria-label="Remove image"
                    sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'var(--red)', color: 'white', width: 22, height: 22, '&:hover': { bgcolor: '#c93a3f' } }}
                    onClick={() => setFormData({ ...formData, image: '' })}
                  >
                    <X size={12} />
                  </IconButton>
                </Box>
              ) : (
                <input
                  className="form-input"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  aria-label="Product image URL"
                />
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography component="label" htmlFor={nameId} sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-700)', mb: 1, display: 'block' }}>
                Product Name *
              </Typography>
              <input
                id={nameId}
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                aria-invalid={!!formErrors.name}
                aria-describedby={formErrors.name ? `${nameId}-error` : undefined}
                style={formErrors.name ? { borderColor: 'var(--red)' } : undefined}
              />
              {formErrors.name && (
                <Typography id={`${nameId}-error`} role="alert" sx={{ fontSize: '0.75rem', color: 'var(--red)', mt: 0.5 }}>
                  {formErrors.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography component="label" htmlFor={brandId} sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-700)', mb: 1, display: 'block' }}>
                Brand
              </Typography>
              <input
                id={brandId}
                className="form-input"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </Grid>

            {/* Dynamic Category Selection */}
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-700)', mb: 1 }}>Category</Typography>
              <select
                className="form-input"
                aria-label="Product category"
                value={isCustomCategory ? 'Other' : formData.category}
                onChange={(e) => {
                  if (e.target.value === 'Other') {
                    setIsCustomCategory(true);
                    setFormData({ ...formData, category: 'Other' });
                  } else {
                    setIsCustomCategory(false);
                    setFormData({ ...formData, category: e.target.value, customCategory: '' });
                  }
                }}
              >
                {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                <option value="Other">Other (Type custom...)</option>
              </select>
            </Grid>

            {isCustomCategory && (
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-700)', mb: 1 }}>Custom Category Name *</Typography>
                <input
                  className="form-input"
                  value={formData.customCategory}
                  onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                  placeholder="e.g. Organic Food"
                  aria-invalid={!!formErrors.customCategory}
                  style={formErrors.customCategory ? { borderColor: 'var(--red)' } : undefined}
                />
                {formErrors.customCategory && (
                  <Typography role="alert" sx={{ fontSize: '0.75rem', color: 'var(--red)', mt: 0.5 }}>
                    {formErrors.customCategory}
                  </Typography>
                )}
              </Grid>
            )}

            <Grid item xs={6} sm={4}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-700)', mb: 1 }}>Price (₹) *</Typography>
              <input
                type="number"
                className="form-input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                aria-invalid={!!formErrors.price}
                style={formErrors.price ? { borderColor: 'var(--red)' } : undefined}
              />
              {formErrors.price && (
                <Typography role="alert" sx={{ fontSize: '0.75rem', color: 'var(--red)', mt: 0.5 }}>
                  {formErrors.price}
                </Typography>
              )}
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-700)', mb: 1 }}>Stock Qty</Typography>
              <input type="number" className="form-input" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-700)', mb: 1 }}>Rating (1-5)</Typography>
              <input type="number" step="0.1" max="5" className="form-input" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
            <button className="btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn-green" onClick={handleSubmit}>{editingProduct ? 'Save Changes' : 'Add Product'}</button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
