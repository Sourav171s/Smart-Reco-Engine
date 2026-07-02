import { lazy, Suspense, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Box, Typography, Container, Drawer, IconButton, Badge, InputBase, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { ShoppingCart, Heart, User, Search, MapPin, Grid, ChevronDown, X } from 'lucide-react';
import './App.css';

const Cart = lazy(() => import('./Cart'));
const ProductCatalog = lazy(() => import('./ProductCatalog'));
const Inventory = lazy(() => import('./Inventory'));
const CustomerShopping = lazy(() => import('./CustomerShopping'));
const Home = lazy(() => import('./Home'));

/* ============================================================================
   THEME
   Centralizes the design tokens (defined as CSS variables in index.css) into
   a single MUI theme so every MUI component (Drawer, Badge, IconButton, etc.)
   inherits consistent color, radius, shadow and typography by default instead
   of being restyled ad hoc via `sx` on every usage.
   ============================================================================ */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2F9E6E', dark: '#23825A', light: '#EAFBF3', contrastText: '#ffffff' },
    error: { main: '#E5484D' },
    info: { main: '#3E8FD6' },
    warning: { main: '#F2934D' },
    text: { primary: '#16212B', secondary: '#5B6B76', disabled: '#94A3AB' },
    background: { default: '#F6F8F7', paper: '#FFFFFF' },
    divider: '#E5E9E7',
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  shadows: [
    'none',
    '0 1px 2px rgba(22,33,43,0.05)',
    '0 2px 8px rgba(22,33,43,0.06)',
    '0 8px 24px rgba(22,33,43,0.08)',
    '0 16px 40px rgba(22,33,43,0.12)',
    ...Array(20).fill('0 16px 40px rgba(22,33,43,0.12)'),
  ],
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'background-color 120ms ease, transform 120ms ease',
          '&:hover': { backgroundColor: 'rgba(47, 158, 110, 0.08)' },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: { fontWeight: 700, fontSize: '0.65rem' },
      },
    },
  },
});

function TopHeader({ cartCount, onCartToggle }) {
  return (
    <>
      {/* Topmost utility bar */}
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', py: 1 }}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['About Us', 'My Account', 'Wishlist', 'Order Tracking'].map((label) => (
              <Typography
                key={label}
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'color 120ms ease',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {label}
              </Typography>
            ))}
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
            100% Secure delivery without contacting the courier
          </Typography>
        </Container>
      </Box>

      {/* Main Search & Logo Bar */}
      <Box sx={{ bgcolor: 'background.paper', py: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 }, flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 190 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'primary.main',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 1,
              }}
            >
              <ShoppingCart size={20} color="white" strokeWidth={2} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: 'primary.main', lineHeight: 1 }}>
                Smart
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'text.secondary', letterSpacing: '0.08em' }}>
                STOREFRONT
              </Typography>
            </Box>
          </Box>

          {/* Search Bar */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              border: '1.5px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.paper',
              overflow: 'hidden',
              minWidth: 240,
              transition: 'border-color 120ms ease, box-shadow 120ms ease',
              '&:focus-within': { borderColor: 'primary.main', boxShadow: '0 0 0 3px rgba(47,158,110,0.15)' },
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderRight: '1px solid',
                borderColor: 'divider',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                minWidth: 150,
                display: { xs: 'none', md: 'flex' },
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'text.primary' }}>
                All Categories
              </Typography>
              <ChevronDown size={14} />
            </Box>
            <InputBase
              placeholder="Search for items..."
              inputProps={{ 'aria-label': 'Search for items' }}
              sx={{ flex: 1, px: 2, fontSize: '0.9rem', color: 'text.primary' }}
            />
            <IconButton aria-label="Search" sx={{ mr: 0.5 }}>
              <Search size={20} color="var(--ink-600)" />
            </IconButton>
          </Box>

          {/* Location */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1,
              border: '1px solid',
              borderColor: 'divider',
              px: 2,
              py: 1.25,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'border-color 120ms ease, box-shadow 120ms ease',
              '&:hover': { borderColor: 'primary.main', boxShadow: 1 },
            }}
          >
            <MapPin size={16} color="var(--green-600)" />
            <Typography sx={{ color: 'primary.main', fontSize: '0.85rem', fontWeight: 600 }}>
              Your Location
            </Typography>
            <ChevronDown size={14} color="var(--ink-400)" />
          </Box>

          {/* Action Icons */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
              <IconButton aria-label="Wishlist" size="small">
                <Badge badgeContent={0} color="primary">
                  <Heart size={22} color="var(--ink-900)" strokeWidth={1.75} />
                </Badge>
              </IconButton>
              <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
                Wishlist
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={onCartToggle}>
              <IconButton aria-label={`Cart, ${cartCount} items`} size="small" onClick={onCartToggle}>
                <Badge badgeContent={cartCount} color="primary">
                  <ShoppingCart size={22} color="var(--ink-900)" strokeWidth={1.75} />
                </Badge>
              </IconButton>
              <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
                Cart
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
              <IconButton aria-label="Account" size="small">
                <User size={22} color="var(--ink-900)" strokeWidth={1.75} />
              </IconButton>
              <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
                Account
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

function NavigationBar() {
  const location = useLocation();
  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/catalog', label: 'Catalog (Admin)' },
    { to: '/inventory', label: 'Inventory (Admin)' },
  ];

  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', py: 1.5, gap: { xs: 2, md: 4 }, flexWrap: 'wrap' }}>
        {/* Browse Categories Button */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            px: 2.5,
            py: 1.25,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            transition: 'background-color 120ms ease, transform 120ms ease',
            '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-1px)' },
          }}
        >
          <Grid size={18} />
          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Browse All Categories</Typography>
          <ChevronDown size={18} />
        </Box>

        {/* Main Nav Links */}
        <Box sx={{ display: 'flex', gap: 4, flex: 1, flexWrap: 'wrap' }}>
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <NavLink key={link.label} to={link.to} style={{ textDecoration: 'none' }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: isActive ? 'primary.main' : 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    position: 'relative',
                    pb: 0.5,
                    transition: 'color 120ms ease',
                    '&:hover': { color: 'primary.main' },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: -18,
                      height: 2,
                      bgcolor: 'primary.main',
                      opacity: isActive ? 1 : 0,
                      transition: 'opacity 120ms ease',
                    },
                  }}
                >
                  {link.label}
                  <ChevronDown size={14} />
                </Typography>
              </NavLink>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}

function CartDrawer({ open, onClose, cartItems, setCartItems }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateQty = (id, delta) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeItem = (id) => setCartItems(cartItems.filter((i) => i.id !== id));

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { boxShadow: 4 } }}
    >
      <Box sx={{ width: { xs: '100vw', sm: 400 }, bgcolor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Drawer Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: 'text.primary' }}>Your Cart</Typography>
          <IconButton onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cartItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
              <ShoppingCart size={44} color="var(--ink-200)" style={{ marginBottom: 16 }} />
              <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Your cart is empty</Typography>
            </Box>
          ) : (
            cartItems.map((item) => (
              <Box
                key={item.id}
                className="fade-in"
                sx={{ display: 'flex', gap: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
              >
                {item.image ? (
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1.5, flexShrink: 0 }}
                  />
                ) : (
                  <Box className="img-placeholder" sx={{ width: 60, height: 60, mb: 0, flexShrink: 0 }} />
                )}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: 'text.primary' }} noWrap>
                    {item.name}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mt: 0.5 }}>₹{item.price}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'primary.main', borderRadius: 1.5, overflow: 'hidden' }}>
                      <Box
                        role="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        sx={{ px: 1.25, py: 0.5, cursor: 'pointer', color: 'primary.main', fontWeight: 600, '&:hover': { bgcolor: 'primary.light' } }}
                        onClick={() => updateQty(item.id, -1)}
                      >
                        −
                      </Box>
                      <Box sx={{ px: 1.5, py: 0.5, fontSize: '0.85rem', fontWeight: 600 }}>{item.quantity}</Box>
                      <Box
                        role="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        sx={{ px: 1.25, py: 0.5, cursor: 'pointer', color: 'primary.main', fontWeight: 600, '&:hover': { bgcolor: 'primary.light' } }}
                        onClick={() => updateQty(item.id, 1)}
                      >
                        +
                      </Box>
                    </Box>
                    <Typography
                      role="button"
                      aria-label={`Remove ${item.name} from cart`}
                      sx={{ fontSize: '0.8rem', cursor: 'pointer', color: 'text.disabled', fontWeight: 500, transition: 'color 120ms ease', '&:hover': { color: 'error.main' } }}
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontWeight: 700, color: 'primary.main', whiteSpace: 'nowrap' }}>
                  ₹{item.price * item.quantity}
                </Typography>
              </Box>
            ))
          )}
        </Box>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>Total:</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: 'primary.main' }}>₹{total}</Typography>
            </Box>
            <button className="btn-green" style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}>
              Proceed to Checkout
            </button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p));
      }
      return [...prev, { ...product, quantity }];
    });
    setCartOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
          {/* Top Header & Nav */}
          <TopHeader cartCount={cartCount} onCartToggle={() => setCartOpen(true)} />
          <NavigationBar />

          {/* Main Content Area */}
          <Box component="main" sx={{ flex: 1 }}>
            <Suspense fallback={<Container sx={{ py: 6 }}><Typography>Loading…</Typography></Container>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<ProductCatalog />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/shop" element={<CustomerShopping addToCart={addToCart} />} />
                <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
              </Routes>
            </Suspense>
          </Box>

          {/* Slide-in Cart */}
          <CartDrawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
