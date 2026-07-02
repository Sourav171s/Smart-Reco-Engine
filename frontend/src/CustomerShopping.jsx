import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box, Typography, Container, Grid, Dialog, DialogContent, IconButton,
  Chip, Skeleton, Fade, Grow, Slider, Tooltip, Drawer, Divider, Rating,
} from '@mui/material';
import {
  ShoppingCart, Star, X, Zap, Heart, SlidersHorizontal, Sparkles, TrendingUp,
  ShieldCheck, Truck, Tag, ArrowRight, Check, Milk, Cookie, Soup, Package,
  PackageSearch,
} from 'lucide-react';
import { api, toUiProduct } from './api';

/* ============================================================================
   MOCK DATA
   Unchanged from the original component — no business logic, shape, or values
   were altered.
   ============================================================================ */
const allProducts = [
  { id: 1, name: 'Amul Milk 500ml', brand: 'Amul', category: 'Dairy', price: 30, rating: 4.5, image: '', badge: 'Hot' },
  { id: 2, name: 'Nandini Milk 500ml', brand: 'Nandini', category: 'Dairy', price: 31, rating: 4.3, image: '', badge: '' },
  { id: 3, name: 'Heritage Milk 500ml', brand: 'Heritage', category: 'Dairy', price: 28, rating: 4.6, image: '', badge: 'Sale' },
  { id: 4, name: "Lay's Chips Classic 120g", brand: "Lay's", category: 'Snacks', price: 40, rating: 4.2, image: '', badge: 'New' },
  { id: 5, name: 'Maggi Noodles 280g', brand: 'Maggi', category: 'Instant', price: 56, rating: 4.7, image: '', badge: '-14%' },
  { id: 17, name: 'Yippee Noodles 280g', brand: 'ITC', category: 'Instant', price: 50, rating: 4.4, image: '', badge: '' },
];

/* ============================================================================
   PRESENTATION HELPERS
   Purely visual lookups layered on top of existing fields (category / badge /
   rank). Nothing here alters what a product "is" — only how it's drawn.
   ============================================================================ */
const CATEGORY_META = {
  Dairy: { icon: Milk, color: 'var(--blue)', bg: 'var(--blue-bg)' },
  Snacks: { icon: Cookie, color: 'var(--orange)', bg: 'var(--orange-bg)' },
  Instant: { icon: Soup, color: 'var(--green-600)', bg: 'var(--green-50)' },
};
function getCategoryMeta(category) {
  return CATEGORY_META[category] ?? { icon: Package, color: 'var(--ink-600)', bg: 'var(--canvas-subtle)' };
}

function getBadgeClass(badge) {
  if (badge === 'Hot') return 'badge-hot';
  if (badge === 'Sale') return 'badge-sale';
  if (badge === 'New') return 'badge-new';
  return 'badge-discount';
}

// Rank-based confidence label for the AI recommendation list. Derived purely
// from the existing sort order (rating desc, price asc) — no new score is
// invented, just a friendlier way of presenting "1st" vs "2nd".
function getRecRank(index) {
  return index === 0
    ? { label: 'Top Pick', color: 'var(--green-700)', bg: 'var(--green-50)', icon: Sparkles }
    : { label: 'Also Great', color: 'var(--blue)', bg: 'var(--blue-bg)', icon: Zap };
}

/* ============================================================================
   SKELETON CARD — shown briefly on first paint so the grid never "pops in"
   empty, and so slower connections get a clear loading affordance instead of
   a blank gap.
   ============================================================================ */
function ProductSkeleton() {
  return (
    <Box sx={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', p: 2, bgcolor: 'var(--surface)' }}>
      <Skeleton variant="rounded" height={170} sx={{ borderRadius: 'var(--radius-md)', mb: 1.5, bgcolor: 'var(--canvas-subtle)' }} />
      <Skeleton width="40%" height={16} sx={{ bgcolor: 'var(--canvas-subtle)' }} />
      <Skeleton width="85%" height={22} sx={{ mt: 0.5, bgcolor: 'var(--canvas-subtle)' }} />
      <Skeleton width="55%" height={16} sx={{ mt: 0.5, mb: 1.5, bgcolor: 'var(--canvas-subtle)' }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="30%" height={28} sx={{ bgcolor: 'var(--canvas-subtle)' }} />
        <Skeleton width={72} height={32} sx={{ borderRadius: 'var(--radius-md)', bgcolor: 'var(--canvas-subtle)' }} />
      </Box>
    </Box>
  );
}

/* ============================================================================
   EMPTY STATE
   ============================================================================ */
function EmptyState({ onClear }) {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 8, md: 11 }, px: 3 }}>
      <Box
        sx={{
          width: 72, height: 72, borderRadius: '50%', bgcolor: 'var(--canvas-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-400)',
          mx: 'auto', mb: 3,
        }}
      >
        <PackageSearch size={30} />
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--ink-900)', mb: 1 }}>
        No products match those filters
      </Typography>
      <Typography sx={{ color: 'var(--ink-600)', fontSize: '0.9rem', mb: 3, maxWidth: 360, mx: 'auto' }}>
        Try widening your price range, clearing the category, or searching a different term.
      </Typography>
      <button className="btn-outline" onClick={onClear}>Clear all filters</button>
    </Box>
  );
}

/* ============================================================================
   PRODUCT CARD
   ============================================================================ */
function ProductCard({ product, isWishlisted, onToggleWishlist, onOpenDetails, onAddToCart, compact = false }) {
  const [status, setStatus] = useState('idle'); // idle | loading | success
  const meta = getCategoryMeta(product.category);
  const CategoryIcon = meta.icon;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (status !== 'idle') return;
    setStatus('loading');
    window.setTimeout(() => {
      onAddToCart(product);
      setStatus('success');
      window.setTimeout(() => setStatus('idle'), 1300);
    }, 450);
  };

  return (
    <Box
      className="product-card fade-in"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
      onClick={() => onOpenDetails(product)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenDetails(product); }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: compact ? 240 : 'auto',
        flexShrink: compact ? 0 : undefined,
      }}
    >
      {product.badge && <Box className={`badge ${getBadgeClass(product.badge)}`}>{product.badge}</Box>}

      {/* Wishlist toggle — reachable by keyboard, stops card-click propagation */}
      <Tooltip title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}>
        <IconButton
          size="small"
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          sx={{
            position: 'absolute', top: 10, right: 10, zIndex: 2,
            bgcolor: 'var(--surface)', boxShadow: 'var(--shadow-sm)',
            width: 32, height: 32,
            transition: 'transform var(--duration-fast) var(--ease), background var(--duration-fast) var(--ease)',
            '&:hover': { bgcolor: 'var(--surface)', transform: 'scale(1.08)' },
            '&:active': { transform: 'scale(0.92)' },
          }}
        >
          <Heart
            size={15}
            color={isWishlisted ? 'var(--red)' : 'var(--ink-400)'}
            fill={isWishlisted ? 'var(--red)' : 'none'}
            strokeWidth={2}
          />
        </IconButton>
      </Tooltip>

      {/* Image area */}
      {product.image ? (
        <Box component="img" src={product.image} alt={product.name} sx={{ width: '100%', height: 168, objectFit: 'contain', mb: 1.5, borderRadius: 'var(--radius-md)' }} />
      ) : (
        <Box
          sx={{
            width: '100%', height: 168, borderRadius: 'var(--radius-md)', mb: 1.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(155deg, ${meta.bg}, var(--surface))`,
            border: '1px solid var(--border)',
          }}
        >
          <CategoryIcon size={40} color={meta.color} strokeWidth={1.5} />
        </Box>
      )}

      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: meta.color, mb: 0.5 }}>
        {product.category}
      </Typography>
      <Typography
        sx={{
          fontWeight: 700, fontSize: '0.92rem', color: 'var(--ink-900)', mb: 0.75, lineHeight: 1.35,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.5em',
        }}
      >
        {product.name}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
        <Star size={13} className="star-filled" fill="currentColor" />
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-700)' }}>{product.rating}</Typography>
        <Typography sx={{ fontSize: '0.78rem', color: 'var(--ink-400)' }}>· {product.brand}</Typography>
      </Box>

      <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--green-700)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          ₹{product.price}
        </Typography>
        <button
          className="btn-outline"
          onClick={handleAdd}
          disabled={status !== 'idle'}
          aria-label={status === 'success' ? `${product.name} added to cart` : `Add ${product.name} to cart`}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', minWidth: 84, justifyContent: 'center',
            ...(status === 'success' ? { background: 'var(--green-600)', color: 'white', borderColor: 'var(--green-600)' } : {}),
          }}
        >
          {status === 'idle' && (<><ShoppingCart size={14} /> Add</>)}
          {status === 'loading' && (
            <Box
              aria-hidden="true"
              sx={{
                width: 14, height: 14, borderRadius: '50%',
                border: '2px solid rgba(47,158,110,0.3)', borderTopColor: 'var(--green-600)',
                animation: 'spin 0.7s linear infinite',
                '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
              }}
            />
          )}
          {status === 'success' && (<><Check size={14} /> Added</>)}
        </button>
      </Box>
    </Box>
  );
}

/* ============================================================================
   FILTER PANEL (shared between the desktop sidebar and mobile drawer)
   ============================================================================ */
function FilterPanel({ categories, activeCategory, setActiveCategory, priceRange, setPriceRange, hasActiveFilters, onClear }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink-900)' }}>Filters</Typography>
        {hasActiveFilters && (
          <Typography
            role="button"
            tabIndex={0}
            onClick={onClear}
            onKeyDown={(e) => { if (e.key === 'Enter') onClear(); }}
            sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--green-700)', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            Clear all
          </Typography>
        )}
      </Box>

      <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-600)', letterSpacing: '0.03em', textTransform: 'uppercase', mb: 1.25 }}>
        Category
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 3 }}>
        {[{ name: 'All', count: null }, ...categories].map((cat) => {
          const active = activeCategory === cat.name;
          const meta = cat.name === 'All' ? null : getCategoryMeta(cat.name);
          const Icon = meta?.icon;
          return (
            <Box
              key={cat.name}
              role="button"
              tabIndex={0}
              onClick={() => setActiveCategory(cat.name)}
              onKeyDown={(e) => { if (e.key === 'Enter') setActiveCategory(cat.name); }}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                px: 1.25, py: 1, borderRadius: 'var(--radius-md)',
                border: '1px solid', borderColor: active ? 'var(--green-600)' : 'transparent',
                bgcolor: active ? 'var(--green-50)' : 'transparent',
                transition: 'all var(--duration-fast) var(--ease)',
                '&:hover': { bgcolor: active ? 'var(--green-50)' : 'var(--canvas)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {Icon && <Icon size={15} color={active ? 'var(--green-700)' : 'var(--ink-400)'} />}
                <Typography sx={{ fontSize: '0.88rem', fontWeight: active ? 700 : 500, color: active ? 'var(--green-700)' : 'var(--ink-800, var(--ink-900))' }}>
                  {cat.name}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: active ? 'var(--green-700)' : 'var(--ink-400)' }}>
                {cat.count ?? allProducts.length}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ borderColor: 'var(--border)', mb: 3 }} />

      <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-600)', letterSpacing: '0.03em', textTransform: 'uppercase', mb: 2 }}>
        Max price
      </Typography>
      <Box sx={{ px: 0.5 }}>
        <Slider
          value={priceRange}
          min={0}
          max={500}
          onChange={(e, v) => setPriceRange(v)}
          aria-label="Maximum price"
          sx={{
            color: 'var(--green-600)',
            '& .MuiSlider-thumb': { boxShadow: 'var(--shadow-sm)', '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 8px rgba(47,158,110,0.16)' } },
            '& .MuiSlider-rail': { opacity: 1, bgcolor: 'var(--border-strong)' },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography sx={{ fontSize: '0.8rem', color: 'var(--ink-600)' }}>₹0</Typography>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--green-700)' }}>Up to ₹{priceRange}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

/* ============================================================================
   MAIN COMPONENT
   ============================================================================ */
export default function CustomerShopping({ addToCart }) {
  // Preserved exactly as in the original implementation.
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [apiError, setApiError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');

  // New presentation-only state: none of it feeds business logic or the cart.
  const [wishlist, setWishlist] = useState(() => new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const gridRef = useRef(null);

  useEffect(() => {
    let active = true;
    Promise.all([api.listProducts(), api.listInventory()])
      .then(([productRows, inventoryRows]) => {
        if (!active) return;
        const inventoryByProduct = new Map(inventoryRows.map((row) => [row.productId?._id, row]));
        const mappedProducts = productRows.map((product) => toUiProduct(product, inventoryByProduct.get(product._id)));
        setProducts(mappedProducts.length ? mappedProducts : allProducts);
        setApiError('');
      })
      .catch((error) => active && setApiError(error.message))
      .finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }
    let active = true;
    api.generateRecommendations(selectedProduct.id)
      .then((rows) => active && setRecommendations(rows.map((row) => ({
        ...toUiProduct(row.recommendedProductId),
        explanation: row.reason,
        recommendationScore: row.recommendationScore,
      }))))
      .catch((error) => active && setApiError(error.message));
    return () => { active = false; };
  }, [selectedProduct]);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.map(c => ({ name: c, count: products.filter(p => p.category === c).length }));
  }, [products]);

  const filtered = useMemo(() => {
    let result = products;
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    result = result.filter(p => p.price <= priceRange);
    return result;
  }, [products, activeCategory, searchQuery, priceRange]);

  // Presentation-only derivation: top-rated items for the "Trending Now"
  // strip. Same array, same fields — just sorted and sliced for display.
  const trending = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 3),
    [products]
  );

  const getRecommendations = () => recommendations;

  const toggleWishlist = (id) => {
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setActiveCategory('All');
    setPriceRange(500);
    setSearchQuery('');
  };

  const hasActiveFilters = activeCategory !== 'All' || priceRange < 500 || searchQuery !== '';

  const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <Box sx={{ bgcolor: 'var(--canvas)' }}>
      {apiError && <Container maxWidth="xl"><Box role="alert" sx={{ pt: 2, color: 'var(--red)', fontSize: '0.85rem' }}>{apiError}</Box></Container>}
      {/* ====================================================================
          HERO
          Full-bleed gradient banner. Green is the brand color everywhere
          else in the app, so the hero deepens it (green-900 → green-700)
          rather than introducing a new accent, and layers two soft radial
          highlights for depth instead of a stock photo the app doesn't have.
          ==================================================================== */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--green-900) 0%, var(--green-700) 55%, var(--green-600) 100%)',
          color: 'white',
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.10), transparent 40%), radial-gradient(circle at 85% 75%, rgba(255,255,255,0.10), transparent 45%)',
          }}
        />
        <Container maxWidth="xl" sx={{ position: 'relative', py: { xs: 7, md: 10 } }}>
          <Fade in timeout={500}>
            <Box sx={{ maxWidth: 640 }}>
              <Box
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.75,
                  bgcolor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.24)',
                  borderRadius: 'var(--radius-full)', px: 1.75, py: 0.6, mb: 2.5,
                }}
              >
                <Sparkles size={13} />
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  AI-powered recommendations
                </Typography>
              </Box>

              <Typography sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, mb: 2 }}>
                Every product, plus a smarter pick beside it.
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, color: 'rgba(255,255,255,0.88)', lineHeight: 1.6, mb: 4, maxWidth: 520 }}>
                Browse the full catalog and let our recommendation engine surface a better-rated
                or better-priced alternative the moment you're deciding.
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 5 }}>
                <button
                  className="btn-green"
                  style={{ padding: '12px 22px', fontSize: '0.9rem', background: 'white', color: 'var(--green-700)', boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}
                  onClick={scrollToGrid}
                >
                  Browse products <ArrowRight size={16} />
                </button>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 3, md: 4 } }}>
                {[
                  { icon: Truck, label: 'Delivered in 10 minutes' },
                  { icon: ShieldCheck, label: '100% secure checkout' },
                  { icon: Tag, label: 'AI-matched best prices' },
                ].map(({ icon: Icon, label }) => (
                  <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon size={16} />
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>{label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        {/* ==================================================================
            TRENDING NOW — a curated, presentation-only slice of the same
            data (top 3 by rating), styled as a horizontal shelf so the
            recommendation engine's judgement is visible before someone even
            opens the catalog below.
            ================================================================== */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
            <TrendingUp size={18} color="var(--green-600)" />
            <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink-900)' }}>Trending now</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2.5, overflowX: 'auto', pb: 1, mx: -0.5, px: 0.5 }}>
            {trending.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                compact
                isWishlisted={wishlist.has(product.id)}
                onToggleWishlist={toggleWishlist}
                onOpenDetails={setSelectedProduct}
                onAddToCart={addToCart}
              />
            ))}
          </Box>
        </Box>

        {/* ==================================================================
            STICKY SUB-BAR — result count + mobile filter trigger. Sticks to
            the viewport as the grid scrolls so filters/search stay reachable
            without following the visitor back up to the hero.
            ================================================================== */}
        <Box
          ref={gridRef}
          sx={{
            position: 'sticky', top: 0, zIndex: 5,
            bgcolor: 'rgba(246,248,247,0.92)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            py: 1.5, mb: 3, borderBottom: '1px solid var(--border)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', bgcolor: 'var(--surface)', px: 1.5, py: 1, minWidth: 220, '&:focus-within': { borderColor: 'var(--green-600)', boxShadow: 'var(--shadow-focus)' } }}>
              <Box component="input"
                type="text"
                placeholder="Search products or brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
                sx={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.85rem', color: 'var(--ink-900)', fontFamily: 'Inter, sans-serif', width: '100%', '&::placeholder': { color: 'var(--ink-400)' } }}
              />
            </Box>
            <Typography sx={{ color: 'var(--ink-600)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              <strong style={{ color: 'var(--green-700)' }}>{filtered.length}</strong> item{filtered.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>

          <button
            className="btn-outline"
            onClick={() => setFilterDrawerOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px' }}
          >
            <SlidersHorizontal size={14} />
            Filters
            {hasActiveFilters && (
              <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'var(--green-600)', ml: 0.25 }} />
            )}
          </button>
        </Box>

        {/* Active filter chips — derived from existing state only */}
        {hasActiveFilters && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {activeCategory !== 'All' && (
              <Chip size="small" label={activeCategory} onDelete={() => setActiveCategory('All')}
                sx={{ bgcolor: 'var(--green-50)', color: 'var(--green-700)', fontWeight: 600, '& .MuiChip-deleteIcon': { color: 'var(--green-700)' } }} />
            )}
            {priceRange < 500 && (
              <Chip size="small" label={`Up to ₹${priceRange}`} onDelete={() => setPriceRange(500)}
                sx={{ bgcolor: 'var(--green-50)', color: 'var(--green-700)', fontWeight: 600, '& .MuiChip-deleteIcon': { color: 'var(--green-700)' } }} />
            )}
            {searchQuery !== '' && (
              <Chip size="small" label={`"${searchQuery}"`} onDelete={() => setSearchQuery('')}
                sx={{ bgcolor: 'var(--green-50)', color: 'var(--green-700)', fontWeight: 600, '& .MuiChip-deleteIcon': { color: 'var(--green-700)' } }} />
            )}
            <Typography role="button" tabIndex={0} onClick={clearFilters}
              onKeyDown={(e) => { if (e.key === 'Enter') clearFilters(); }}
              sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-500, var(--ink-600))', cursor: 'pointer', alignSelf: 'center', ml: 0.5, '&:hover': { color: 'var(--ink-900)', textDecoration: 'underline' } }}>
              Clear all
            </Typography>
          </Box>
        )}

        {/* ==================================================================
            CATALOG — sidebar (desktop) + grid
            ================================================================== */}
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          <Box sx={{ display: { xs: 'none', lg: 'block' }, width: 260, flexShrink: 0, position: 'sticky', top: 72 }}>
            <Box className="filter-card">
              <FilterPanel
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                hasActiveFilters={hasActiveFilters}
                onClear={clearFilters}
              />
            </Box>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {isLoading ? (
              <Grid container spacing={3}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={i}><ProductSkeleton /></Grid>
                ))}
              </Grid>
            ) : filtered.length === 0 ? (
              <EmptyState onClear={clearFilters} />
            ) : (
              <Grid container spacing={3}>
                {filtered.map((product) => (
                  <Grow in key={product.id} timeout={350}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <ProductCard
                        product={product}
                        isWishlisted={wishlist.has(product.id)}
                        onToggleWishlist={toggleWishlist}
                        onOpenDetails={setSelectedProduct}
                        onAddToCart={addToCart}
                      />
                    </Grid>
                  </Grow>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Container>

      {/* ======================================================================
          MOBILE / TABLET FILTER DRAWER — same FilterPanel, different shell
          ====================================================================== */}
      <Drawer anchor="bottom" open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{ sx: { borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)', maxHeight: '85vh' } }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ width: 40, height: 4, bgcolor: 'var(--border-strong)', borderRadius: 'var(--radius-full)', mx: 'auto', mb: 2.5 }} />
          <FilterPanel
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            hasActiveFilters={hasActiveFilters}
            onClear={clearFilters}
          />
          <button className="btn-green" style={{ width: '100%', justifyContent: 'center', marginTop: 24 }} onClick={() => setFilterDrawerOpen(false)}>
            Show {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </button>
        </Box>
      </Drawer>

      {/* ======================================================================
          SMART RECOMMENDATION MODAL
          ====================================================================== */}
      <Dialog
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 'var(--radius-xl)', overflow: 'hidden' } }}
      >
        {selectedProduct && (
          <DialogContent sx={{ p: 0, bgcolor: 'var(--surface)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 3, md: 4 }, py: 2.5, borderBottom: '1px solid var(--border)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box sx={{ p: 1, borderRadius: 'var(--radius-md)', bgcolor: 'var(--green-50)', color: 'var(--green-600)', display: 'flex' }}>
                  <Sparkles size={18} />
                </Box>
                <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink-900)' }}>AI Smart Assistant</Typography>
              </Box>
              <IconButton onClick={() => setSelectedProduct(null)} aria-label="Close">
                <X size={20} />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 4 }, p: { xs: 3, md: 4 } }}>
              {/* Selected product */}
              <Box sx={{ flex: { md: '0 0 38%' } }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-500, var(--ink-600))', mb: 1.5 }}>
                  You selected
                </Typography>
                <Box sx={{ p: 2.5, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', bgcolor: 'var(--canvas)' }}>
                  {selectedProduct.image ? (
                    <Box component="img" src={selectedProduct.image} alt={selectedProduct.name} sx={{ width: '100%', height: 140, objectFit: 'contain', mb: 1.5 }} />
                  ) : (
                    (() => {
                      const meta = getCategoryMeta(selectedProduct.category);
                      const Icon = meta.icon;
                      return (
                        <Box sx={{ height: 140, borderRadius: 'var(--radius-md)', mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(155deg, ${meta.bg}, var(--surface))`, border: '1px solid var(--border)' }}>
                          <Icon size={40} color={meta.color} strokeWidth={1.5} />
                        </Box>
                      );
                    })()
                  )}
                  <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink-900)', mb: 0.5 }}>{selectedProduct.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                    <Rating value={selectedProduct.rating} precision={0.1} readOnly size="small"
                      sx={{ color: '#F5A524', '& .MuiRating-iconEmpty': { color: 'var(--ink-200)' } }} />
                    <Typography sx={{ fontSize: '0.8rem', color: 'var(--ink-600)' }}>({selectedProduct.rating})</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--green-700)', mb: 1 }}>₹{selectedProduct.price}</Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: 'var(--ink-600)', mb: 2 }}>
                    ✓ In stock · Delivered in 10 minutes
                  </Typography>
                  <button className="btn-green" style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>
                    Add original to cart
                  </button>
                </Box>
              </Box>

              {/* Recommendations */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--green-700)', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Zap size={14} fill="currentColor" /> Smarter alternatives found
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {getRecommendations(selectedProduct).length > 0 ? getRecommendations(selectedProduct).map((rec, i) => {
                    const rank = getRecRank(i);
                    const RankIcon = rank.icon;
                    return (
                      <Box key={rec.id} sx={{ p: 2, border: '1.5px solid var(--green-500)', borderRadius: 'var(--radius-lg)', bgcolor: 'var(--green-50)', position: 'relative' }}>
                        <Chip
                          size="small"
                          icon={<RankIcon size={12} />}
                          label={rank.label}
                          sx={{ position: 'absolute', top: -12, left: 14, height: 22, fontSize: '0.68rem', fontWeight: 700, bgcolor: rank.bg, color: rank.color, boxShadow: 'var(--shadow-xs)', '& .MuiChip-icon': { color: rank.color, ml: '6px' } }}
                        />
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          {rec.image ? (
                            <Box component="img" src={rec.image} sx={{ width: 60, height: 60, objectFit: 'contain', flexShrink: 0 }} />
                          ) : (
                            (() => {
                              const meta = getCategoryMeta(rec.category);
                              const Icon = meta.icon;
                              return (
                                <Box sx={{ width: 60, height: 60, borderRadius: 'var(--radius-md)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--surface)', border: '1px solid var(--green-500)' }}>
                                  <Icon size={24} color={meta.color} strokeWidth={1.5} />
                                </Box>
                              );
                            })()
                          )}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--ink-900)' }}>{rec.name}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                              <Typography sx={{ fontSize: '0.9rem', color: 'var(--green-700)', fontWeight: 700 }}>₹{rec.price}</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                <Star size={12} className="star-filled" fill="currentColor" />
                                <Typography sx={{ fontSize: '0.82rem', color: 'var(--ink-600)' }}>{rec.rating}</Typography>
                              </Box>
                            </Box>
                            <Typography sx={{ fontSize: '0.78rem', color: 'var(--ink-800, var(--ink-900))', mt: 1, p: 1, bgcolor: 'var(--surface)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--green-600)', lineHeight: 1.45 }}>
                              {rec.explanation}
                            </Typography>
                          </Box>
                        </Box>
                        <button className="btn-green" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
                          onClick={() => { addToCart(rec); setSelectedProduct(null); }}>
                          Choose this instead
                        </button>
                      </Box>
                    );
                  }) : (
                    <Typography sx={{ color: 'var(--ink-600)', fontSize: '0.9rem' }}>No alternatives found for this item.</Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
}
