import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Typography, IconButton, Container, Grid, Skeleton, Collapse, Fade, Tooltip, Divider,
} from '@mui/material';
import {
  Trash2, Plus, Minus, Lock, ShoppingCart, ArrowRight, Truck, ShieldCheck,
  Tag, Check, X, Sparkles, Star, Milk, Cookie, Soup, Croissant, Coffee, Wheat, Package,
} from 'lucide-react';

/* ============================================================================
   LOCAL DATA — "You might also like" strip.
   Follows the same pattern already used throughout the app (ProductCatalog,
   Inventory, CustomerShopping each define their own local mock dataset).
   ============================================================================ */
const relatedProducts = [
  { id: 101, name: 'Amul Butter 500g', brand: 'Amul', category: 'Dairy', price: 235, rating: 4.6, image: '' },
  { id: 102, name: 'Britannia Bread 400g', brand: 'Britannia', category: 'Bakery', price: 45, rating: 4.0, image: '' },
  { id: 103, name: 'Tata Tea Gold 250g', brand: 'Tata', category: 'Beverages', price: 140, rating: 4.5, image: '' },
  { id: 104, name: 'Aashirvaad Atta 5kg', brand: 'Aashirvaad', category: 'Staples', price: 249, rating: 4.4, image: '' },
];

/* ============================================================================
   PRESENTATION HELPERS
   ============================================================================ */
const CATEGORY_META = {
  Dairy: { icon: Milk, color: 'var(--blue)', bg: 'var(--blue-bg)' },
  Snacks: { icon: Cookie, color: 'var(--orange)', bg: 'var(--orange-bg)' },
  Instant: { icon: Soup, color: 'var(--green-600)', bg: 'var(--green-50)' },
  Bakery: { icon: Croissant, color: 'var(--orange)', bg: 'var(--orange-bg)' },
  Beverages: { icon: Coffee, color: 'var(--green-600)', bg: 'var(--green-50)' },
  Staples: { icon: Wheat, color: 'var(--blue)', bg: 'var(--blue-bg)' },
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

/* ============================================================================
   ITEM THUMBNAIL — shared between cart rows and recommendation cards so the
   "no image" treatment stays visually consistent across the page.
   ============================================================================ */
function ItemThumb({ item, size = 68 }) {
  const meta = getCategoryMeta(item.category);
  const Icon = meta.icon;
  if (item.image) {
    return (
      <Box component="img" src={item.image} alt={item.name}
        sx={{ width: size, height: size, objectFit: 'contain', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', flexShrink: 0 }} />
    );
  }
  return (
    <Box
      sx={{
        width: size, height: size, borderRadius: 'var(--radius-md)', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(155deg, ${meta.bg}, var(--surface))`,
        border: '1px solid var(--border)',
      }}
    >
      <Icon size={size * 0.4} color={meta.color} strokeWidth={1.5} />
    </Box>
  );
}

/* ============================================================================
   QUANTITY STEPPER
   ============================================================================ */
function QuantityStepper({ quantity, onDecrease, onIncrease, itemName }) {
  return (
    <Box
      sx={{
        display: 'inline-flex', alignItems: 'center', border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-md)', overflow: 'hidden', bgcolor: 'var(--surface)',
      }}
    >
      <IconButton
        size="small"
        disabled={quantity <= 1}
        onClick={onDecrease}
        aria-label={`Decrease quantity of ${itemName}`}
        sx={{
          borderRadius: 0, width: 32, height: 32, color: 'var(--green-700)',
          transition: 'background var(--duration-fast) var(--ease)',
          '&:hover': { bgcolor: 'var(--green-50)' },
          '&.Mui-disabled': { color: 'var(--ink-200)' },
        }}
      >
        <Minus size={14} />
      </IconButton>
      <Typography
        component="span"
        aria-live="polite"
        sx={{ minWidth: 32, textAlign: 'center', fontSize: '0.88rem', fontWeight: 700, color: 'var(--ink-900)', fontVariantNumeric: 'tabular-nums' }}
      >
        {quantity}
      </Typography>
      <IconButton
        size="small"
        onClick={onIncrease}
        aria-label={`Increase quantity of ${itemName}`}
        sx={{
          borderRadius: 0, width: 32, height: 32, color: 'var(--green-700)',
          transition: 'background var(--duration-fast) var(--ease)',
          '&:hover': { bgcolor: 'var(--green-50)' },
        }}
      >
        <Plus size={14} />
      </IconButton>
    </Box>
  );
}

/* ============================================================================
   CART ITEM ROW
   ============================================================================ */
function CartItemRow({ item, onUpdateQty, onRemove }) {
  return (
    <Box
      sx={{
        display: 'flex', gap: 2.5, p: { xs: 2, sm: 2.5 },
        borderBottom: '1px solid var(--border)',
        transition: 'background var(--duration-fast) var(--ease)',
        '&:hover': { bgcolor: 'var(--canvas)' },
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      <ItemThumb item={item} />

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: getCategoryMeta(item.category).color, mb: 0.25 }}>
              {item.category}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink-900)', lineHeight: 1.3 }} noWrap>
              {item.name}
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: 'var(--ink-600)', mt: 0.25 }}>By {item.brand}</Typography>
          </Box>

          <Tooltip title="Remove from cart">
            <IconButton
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.name} from cart`}
              size="small"
              sx={{ color: 'var(--ink-400)', flexShrink: 0, transition: 'color var(--duration-fast) var(--ease)', '&:hover': { color: 'var(--red)', bgcolor: 'var(--red-bg)' } }}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>

        {item.badge && (
          <Box className={`badge ${getBadgeClass(item.badge)}`} sx={{ position: 'static', display: 'inline-flex', width: 'fit-content', mt: 0.25 }}>
            {item.badge}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
          <Truck size={13} color="var(--green-600)" />
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--green-700)', fontWeight: 600 }}>
            In stock · Delivered in 10 minutes
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mt: 1.25 }}>
          <QuantityStepper
            quantity={item.quantity}
            itemName={item.name}
            onDecrease={() => onUpdateQty(item.id, -1)}
            onIncrease={() => onUpdateQty(item.id, 1)}
          />
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--ink-500, var(--ink-600))' }}>
              ₹{item.price} each
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--green-700)', fontVariantNumeric: 'tabular-nums' }}>
              ₹{item.price * item.quantity}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ============================================================================
   SKELETON ROW — first-paint loading state
   ============================================================================ */
function CartItemSkeleton() {
  return (
    <Box sx={{ display: 'flex', gap: 2.5, p: 2.5, borderBottom: '1px solid var(--border)' }}>
      <Skeleton variant="rounded" width={68} height={68} sx={{ borderRadius: 'var(--radius-md)', bgcolor: 'var(--canvas-subtle)', flexShrink: 0 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton width="30%" height={14} sx={{ bgcolor: 'var(--canvas-subtle)' }} />
        <Skeleton width="60%" height={22} sx={{ mt: 0.5, bgcolor: 'var(--canvas-subtle)' }} />
        <Skeleton width="40%" height={16} sx={{ mt: 0.5, mb: 1.5, bgcolor: 'var(--canvas-subtle)' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton width={96} height={32} sx={{ borderRadius: 'var(--radius-md)', bgcolor: 'var(--canvas-subtle)' }} />
          <Skeleton width={60} height={32} sx={{ bgcolor: 'var(--canvas-subtle)' }} />
        </Box>
      </Box>
    </Box>
  );
}

/* ============================================================================
   PROGRESS STEPPER — Cart → Checkout → Confirmation
   ============================================================================ */
function CheckoutSteps() {
  const steps = ['Cart', 'Checkout', 'Confirmation'];
  return (
    <Box component="ol" role="list" sx={{ display: 'flex', alignItems: 'center', listStyle: 'none', p: 0, m: 0, gap: 1 }}>
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <Box component="li" aria-current={i === 0 ? 'step' : undefined} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700,
                bgcolor: i === 0 ? 'var(--green-600)' : 'var(--canvas-subtle)',
                color: i === 0 ? 'white' : 'var(--ink-400)',
              }}
            >
              {i + 1}
            </Box>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: i === 0 ? 700 : 500, color: i === 0 ? 'var(--ink-900)' : 'var(--ink-400)' }}>
              {step}
            </Typography>
          </Box>
          {i < steps.length - 1 && <Box sx={{ width: 24, height: 1, bgcolor: 'var(--border)' }} aria-hidden="true" />}
        </React.Fragment>
      ))}
    </Box>
  );
}

/* ============================================================================
   RECOMMENDED PRODUCT CARD
   ============================================================================ */
function RecommendedCard({ product, onAdd }) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  };
  return (
    <Box
      className="fade-in"
      sx={{
        flexShrink: 0, width: 200, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        p: 2, bgcolor: 'var(--surface)', transition: 'all var(--duration-base) var(--ease)',
        '&:hover': { borderColor: 'var(--green-500)', boxShadow: 'var(--shadow-md)', transform: 'translateY(-3px)' },
      }}
    >
      <ItemThumb item={product} size={96} />
      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: getCategoryMeta(product.category).color, mt: 1.25 }}>
        {product.category}
      </Typography>
      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink-900)', mt: 0.25, mb: 0.5, lineHeight: 1.3, minHeight: '2.3em' }}>
        {product.name}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mb: 1 }}>
        <Star size={12} className="star-filled" fill="currentColor" />
        <Typography sx={{ fontSize: '0.75rem', color: 'var(--ink-600)' }}>{product.rating}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--green-700)' }}>₹{product.price}</Typography>
        <button
          className="btn-outline"
          onClick={handleAdd}
          disabled={added}
          style={{ padding: '5px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4, ...(added ? { background: 'var(--green-600)', color: 'white', borderColor: 'var(--green-600)' } : {}) }}
        >
          {added ? <><Check size={12} /> Added</> : 'Add'}
        </button>
      </Box>
    </Box>
  );
}

/* ============================================================================
   EMPTY CART
   ============================================================================ */
function EmptyCart() {
  const suggestions = ['Dairy', 'Snacks', 'Instant Food'];
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 8, md: 12 }, px: 3, bgcolor: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
      <Box
        sx={{
          width: 88, height: 88, borderRadius: '50%', bgcolor: 'var(--green-50)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-600)',
          mx: 'auto', mb: 3,
        }}
      >
        <ShoppingCart size={36} strokeWidth={1.5} />
      </Box>
      <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink-900)', mb: 1 }}>
        Your cart is empty
      </Typography>
      <Typography sx={{ color: 'var(--ink-600)', fontSize: '0.92rem', mb: 4, maxWidth: 380, mx: 'auto' }}>
        Looks like you haven't added anything yet. Explore the storefront and our recommendation
        engine will help you find exactly what you need.
      </Typography>
      <Link to="/shop" style={{ textDecoration: 'none' }}>
        <button className="btn-green" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>
          Continue shopping <ArrowRight size={16} />
        </button>
      </Link>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4, flexWrap: 'wrap' }}>
        {suggestions.map((s) => (
          <Link key={s} to="/shop" style={{ textDecoration: 'none' }}>
            <Box className="category-tag">{s}</Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
}

/* ============================================================================
   MAIN COMPONENT
   ============================================================================ */
export default function Cart({ cartItems, setCartItems }) {
  // Preserved exactly as in the original implementation.
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const updateQty = (id, delta) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id) => setCartItems(cartItems.filter(i => i.id !== id));

  // New presentation-only / self-contained UI state — none of it changes how
  // cartItems is shaped or how other pages read it.
  const [isLoading, setIsLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState(() => new Set());
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    const t = window.setTimeout(() => setIsLoading(false), 450);
    return () => window.clearTimeout(t);
  }, []);

  // Lets a row animate out (Collapse) before it's actually removed from
  // cartItems, instead of the row vanishing instantly.
  const handleRemove = (id) => {
    setRemovingIds(prev => new Set(prev).add(id));
    window.setTimeout(() => {
      removeItem(id);
      setRemovingIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    }, 260);
  };

  const VALID_COUPON = 'FRESH10';
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) { setCouponError('Enter a coupon code'); return; }
    if (code === VALID_COUPON) {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponApplied(false);
      setCouponError('This code is invalid or has expired');
    }
  };
  const removeCoupon = () => { setCouponApplied(false); setCouponInput(''); setCouponError(''); };

  // Transparent, self-contained pricing breakdown built on top of the
  // unchanged `total`. Grocery prices in this catalog are MRP (tax-inclusive),
  // consistent with how Indian quick-commerce apps typically price listings,
  // so no separate tax line is fabricated.
  const FREE_DELIVERY_THRESHOLD = 199;
  const DELIVERY_FEE = 25;
  const subtotal = total;
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const grandTotal = subtotal - discount + delivery;
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  // Mirrors the exact merge pattern App.jsx's addToCart uses, since this page
  // only receives setCartItems (no addToCart prop is passed by the router).
  const addRecommended = (product) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const suggestions = useMemo(
    () => relatedProducts.filter(p => !cartItems.some(c => c.id === p.id)),
    [cartItems]
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography sx={{ fontSize: { xs: '1.75rem', md: '2.1rem' }, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-900)', mb: 0.5 }}>
            Your Cart
          </Typography>
          <Typography sx={{ color: 'var(--ink-600)', fontSize: '0.9rem' }}>
            {cartItems.length > 0
              ? `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} ready for checkout`
              : 'Nothing here yet'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 1.5 }}>
          <CheckoutSteps />
          <Link to="/shop" style={{ textDecoration: 'none' }}>
            <Typography sx={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--green-700)', display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
              Continue shopping <ArrowRight size={14} />
            </Typography>
          </Link>
        </Box>
      </Box>

      {isLoading ? (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ bgcolor: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              {Array.from({ length: 3 }).map((_, i) => <CartItemSkeleton key={i} />)}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={340} sx={{ borderRadius: 'var(--radius-xl)', bgcolor: 'var(--canvas-subtle)' }} />
          </Grid>
        </Grid>
      ) : cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <Grid container spacing={4}>
            {/* Cart items */}
            <Grid item xs={12} md={8}>
              <Box sx={{ bgcolor: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
                {cartItems.map(item => (
                  <Collapse in={!removingIds.has(item.id)} timeout={260} key={item.id}>
                    <CartItemRow item={item} onUpdateQty={updateQty} onRemove={handleRemove} />
                  </Collapse>
                ))}
              </Box>
            </Grid>

            {/* Order summary */}
            <Grid item xs={12} md={4}>
              <Box className="filter-card" sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 2.5, pb: 2, borderBottom: '1px solid var(--border)' }}>
                  Order Summary
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: 'var(--ink-600)', fontSize: '0.88rem' }}>Subtotal</Typography>
                    <Typography sx={{ fontWeight: 600, color: 'var(--ink-900)', fontSize: '0.88rem', fontVariantNumeric: 'tabular-nums' }}>₹{subtotal}</Typography>
                  </Box>
                  {discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ color: 'var(--green-700)', fontSize: '0.88rem' }}>Discount ({VALID_COUPON})</Typography>
                      <Typography sx={{ fontWeight: 600, color: 'var(--green-700)', fontSize: '0.88rem' }}>−₹{discount}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: 'var(--ink-600)', fontSize: '0.88rem' }}>Delivery</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: delivery === 0 ? 'var(--green-700)' : 'var(--ink-900)' }}>
                      {delivery === 0 ? 'Free' : `₹${delivery}`}
                    </Typography>
                  </Box>
                  {amountToFreeDelivery > 0 && (
                    <Typography sx={{ fontSize: '0.76rem', color: 'var(--orange)', bgcolor: 'var(--orange-bg)', borderRadius: 'var(--radius-sm)', px: 1.25, py: 0.75 }}>
                      Add ₹{amountToFreeDelivery} more for free delivery
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ borderColor: 'var(--border)', mb: 2 }} />

                {/* Coupon */}
                <Box sx={{ mb: 2.5 }}>
                  {!couponApplied ? (
                    <>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Box sx={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', px: 1.25, '&:focus-within': { borderColor: 'var(--green-600)', boxShadow: 'var(--shadow-focus)' } }}>
                          <Tag size={14} color="var(--ink-400)" style={{ marginRight: 6, flexShrink: 0 }} />
                          <Box
                            component="input"
                            type="text"
                            placeholder="Coupon code"
                            value={couponInput}
                            onChange={(e) => { setCouponInput(e.target.value); setCouponError(''); }}
                            onKeyDown={(e) => { if (e.key === 'Enter') applyCoupon(); }}
                            aria-label="Coupon code"
                            sx={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.85rem', color: 'var(--ink-900)', fontFamily: 'Inter, sans-serif', width: '100%', py: 1 }}
                          />
                        </Box>
                        <button className="btn-outline" onClick={applyCoupon} style={{ padding: '0 16px', fontSize: '0.82rem' }}>
                          Apply
                        </button>
                      </Box>
                      <Fade in={!!couponError}>
                        <Typography sx={{ fontSize: '0.78rem', color: 'var(--red)', mt: 0.75, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {couponError && <><X size={13} /> {couponError}</>}
                        </Typography>
                      </Fade>
                      <Typography sx={{ fontSize: '0.74rem', color: 'var(--ink-400)', mt: 0.75 }}>
                        Try <strong>FRESH10</strong> for 10% off
                      </Typography>
                    </>
                  ) : (
                    <Fade in>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'var(--green-50)', border: '1px solid var(--green-500)', borderRadius: 'var(--radius-md)', px: 1.5, py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Check size={15} color="var(--green-700)" />
                          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--green-700)' }}>
                            {VALID_COUPON} applied
                          </Typography>
                        </Box>
                        <IconButton size="small" onClick={removeCoupon} aria-label="Remove coupon" sx={{ color: 'var(--green-700)' }}>
                          <X size={14} />
                        </IconButton>
                      </Box>
                    </Fade>
                  )}
                </Box>

                <Divider sx={{ borderColor: 'var(--border)', mb: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink-900)' }}>Total</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--green-700)', fontVariantNumeric: 'tabular-nums' }}>₹{grandTotal}</Typography>
                </Box>

                <button className="btn-green" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem' }}>
                  Proceed to Checkout <ArrowRight size={18} />
                </button>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Lock size={13} color="var(--ink-400)" />
                    <Typography sx={{ fontSize: '0.76rem', color: 'var(--ink-500, var(--ink-600))' }}>Secured with 256-bit encryption</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShieldCheck size={13} color="var(--ink-400)" />
                    <Typography sx={{ fontSize: '0.76rem', color: 'var(--ink-500, var(--ink-600))' }}>100% secure payments</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Truck size={13} color="var(--ink-400)" />
                    <Typography sx={{ fontSize: '0.76rem', color: 'var(--ink-500, var(--ink-600))' }}>Estimated delivery: 10–20 minutes</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Recommendations */}
          {suggestions.length > 0 && (
            <Box sx={{ mt: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <Sparkles size={17} color="var(--green-600)" />
                <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink-900)' }}>You might also like</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, mx: -0.5, px: 0.5 }}>
                {suggestions.map((product) => (
                  <RecommendedCard key={product.id} product={product} onAdd={addRecommended} />
                ))}
              </Box>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
