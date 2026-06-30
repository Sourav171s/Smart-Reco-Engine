import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Box, Typography, IconButton, Drawer } from '@mui/material';
import { Database, Package, ShoppingCart, Store, Home as HomeIcon, Settings, Zap, Bell, Search, X, Trash2, Plus, Minus } from 'lucide-react';
import Cart from './Cart';
import ProductCatalog from './ProductCatalog';
import Inventory from './Inventory';
import CustomerShopping from './CustomerShopping';
import Home from './Home';

const SIDEBAR_WIDTH = 220;

function Sidebar({ cartCount }) {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Dashboard', icon: <HomeIcon size={16} /> },
    { to: '/catalog', label: 'Product Catalog', icon: <Database size={16} /> },
    { to: '/inventory', label: 'Inventory', icon: <Package size={16} /> },
    { to: '/shop', label: 'Smart Storefront', icon: <Store size={16} />, badge: null },
    { to: '/cart', label: 'Cart', icon: <ShoppingCart size={16} />, badge: cartCount },
  ];

  return (
    <Box sx={{
      width: SIDEBAR_WIDTH, minHeight: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 200,
      bgcolor: 'var(--bg-panel)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', py: 3,
    }}>
      {/* Logo */}
      <Box sx={{ px: 3, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 32, height: 32, border: '2px solid var(--accent-green)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Zap size={16} color="var(--accent-green)" />
        </Box>
        <Box>
          <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent-green)' }}>
            SMART
          </Typography>
          <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.5rem', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
            RECO_ENGINE
          </Typography>
        </Box>
      </Box>

      {/* Nav Links */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, px: 1.5, flex: 1 }}>
        {links.map(link => {
          const isActive = location.pathname === link.to;
          return (
            <NavLink key={link.label} to={link.to} style={{ textDecoration: 'none' }}>
              <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                px: 2, py: 1.5, borderRadius: 0,
                bgcolor: isActive ? 'var(--text-primary)' : 'transparent',
                color: isActive ? 'var(--bg-base)' : 'var(--text-secondary)',
                fontFamily: 'var(--mono)', fontSize: '0.75rem', letterSpacing: '0.05em',
                transition: 'all 0.15s', cursor: 'pointer',
                border: '1px solid',
                borderColor: isActive ? 'var(--text-primary)' : 'transparent',
                '&:hover': {
                  bgcolor: isActive ? 'var(--text-primary)' : 'var(--bg-panel-light)',
                  color: isActive ? 'var(--bg-base)' : 'var(--text-primary)',
                  borderColor: isActive ? 'var(--text-primary)' : 'var(--border)',
                }
              }}>
                {link.icon}
                {link.label}
                {link.badge > 0 && (
                  <Box sx={{
                    ml: 'auto', px: 0.8, py: 0.2,
                    bgcolor: isActive ? 'var(--bg-base)' : 'var(--accent-green)',
                    color: isActive ? 'var(--text-primary)' : 'var(--bg-base)',
                    fontFamily: 'var(--mono)', fontSize: '0.6rem', fontWeight: 700, lineHeight: 1,
                  }}>
                    {link.badge}
                  </Box>
                )}
              </Box>
            </NavLink>
          );
        })}
      </Box>

      {/* Bottom Tagline */}
      <Box sx={{ px: 3, pt: 3, borderTop: '1px solid var(--border)', mt: 'auto' }}>
        <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--accent-green)', letterSpacing: '0.05em' }}>
          Smart choices,
        </Typography>
        <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
          Better experience!
        </Typography>
      </Box>
    </Box>
  );
}

function TopHeader({ cartCount, onCartToggle }) {
  return (
    <Box sx={{
      position: 'sticky', top: 0, zIndex: 100,
      bgcolor: 'var(--bg-base)', borderBottom: '1px solid var(--border)',
      px: 4, py: 2,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Greeting */}
      <Box>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 500 }}>
          Welcome back, Admin!
        </Typography>
        <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
          Here's what's happening with your store today.
        </Typography>
      </Box>

      {/* Right Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Search */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1,
          border: '1px solid var(--border)', bgcolor: 'var(--bg-panel)',
          width: 240,
        }}>
          <Search size={14} color="var(--text-tertiary)" />
          <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
            Search products...
          </Typography>
        </Box>

        {/* Notification Bell */}
        <Box sx={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={18} color="var(--text-secondary)" />
          <Box sx={{
            position: 'absolute', top: -4, right: -4, width: 14, height: 14,
            bgcolor: 'var(--accent-red)', borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.5rem', fontWeight: 700, color: '#fff' }}>3</Typography>
          </Box>
        </Box>

        {/* Cart Toggle */}
        <Box onClick={onCartToggle} sx={{
          position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1,
          px: 1.5, py: 0.8, border: '1px solid var(--border)',
          '&:hover': { borderColor: 'var(--text-primary)' }
        }}>
          <ShoppingCart size={16} color="var(--text-secondary)" />
          {cartCount > 0 && (
            <Box sx={{
              position: 'absolute', top: -6, right: -6, width: 16, height: 16,
              bgcolor: 'var(--accent-green)', borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', fontWeight: 700, color: 'var(--bg-base)' }}>{cartCount}</Typography>
            </Box>
          )}
        </Box>

        {/* User Avatar */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.8,
          border: '1px solid var(--border)', cursor: 'pointer',
          '&:hover': { borderColor: 'var(--text-primary)' }
        }}>
          <Box sx={{ width: 24, height: 24, bgcolor: 'var(--bg-panel-light)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', fontWeight: 700 }}>A</Typography>
          </Box>
          <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Admin</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function CartDrawer({ open, onClose, items, updateQuantity, removeItem }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 20 : 0;
  const packagingFee = items.length > 0 ? 10 : 0;
  const total = subtotal + deliveryFee + packagingFee;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 340, bgcolor: 'var(--bg-panel)', borderLeft: '1px solid var(--border)', color: 'var(--text-primary)' } } }}
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid var(--border)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingCart size={16} />
            <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em' }}>
              YOUR_CART
            </Typography>
            <Box sx={{ px: 0.8, py: 0.2, bgcolor: 'var(--accent-green)', color: 'var(--bg-base)', fontFamily: 'var(--mono)', fontSize: '0.6rem', fontWeight: 700 }}>
              {items.length}
            </Box>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ color: 'var(--text-secondary)' }}>
            <X size={16} />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {items.length === 0 && (
            <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center', mt: 4 }}>
              &gt; CART_EMPTY
            </Typography>
          )}
          {items.map(item => (
            <Box key={item.id} sx={{ display: 'flex', gap: 2, p: 2, border: '1px solid var(--border)', bgcolor: 'var(--bg-panel-light)' }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, mb: 0.5 }}>{item.name}</Typography>
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>₹{item.price}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                  <IconButton size="small" onClick={() => updateQuantity(item.id, -1)} sx={{ color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 0, p: 0.3 }}>
                    <Minus size={12} />
                  </IconButton>
                  <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', fontWeight: 700 }}>{item.quantity}</Typography>
                  <IconButton size="small" onClick={() => updateQuantity(item.id, 1)} sx={{ color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 0, p: 0.3 }}>
                    <Plus size={12} />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <IconButton size="small" onClick={() => removeItem(item.id)} sx={{ color: 'var(--accent-red)', p: 0.3 }}>
                  <Trash2 size={14} />
                </IconButton>
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.85rem', fontWeight: 700 }}>₹{item.price * item.quantity}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Totals */}
        {items.length > 0 && (
          <Box sx={{ pt: 2, mt: 2, borderTop: '1px solid var(--border)' }}>
            {[
              { label: 'Subtotal', value: subtotal },
              { label: 'Delivery Fee', value: deliveryFee },
              { label: 'Packaging Fee', value: packagingFee },
            ].map((row, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{row.label}</Typography>
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem' }}>₹{row.value}</Typography>
              </Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5, pt: 1.5, borderTop: '1px solid var(--border)' }}>
              <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.85rem', fontWeight: 700 }}>Total Amount</Typography>
              <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '1rem', fontWeight: 700 }}>₹{total}</Typography>
            </Box>

            <Box sx={{
              mt: 2, py: 1.5, textAlign: 'center', cursor: 'pointer',
              bgcolor: 'var(--accent-green)', color: 'var(--bg-base)',
              fontFamily: 'var(--mono)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em',
              '&:hover': { bgcolor: '#0ea5e9' }
            }}>
              Proceed to Checkout →
            </Box>

            <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-tertiary)', textAlign: 'center', mt: 1.5 }}>
              🔒 100% Secure Payments
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return { ...item, quantity: newQ > 0 ? newQ : 1 };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <Sidebar cartCount={cartCount} />
      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, minHeight: '100vh' }}>
        <TopHeader cartCount={cartCount} onCartToggle={() => setCartOpen(true)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<ProductCatalog addToCart={addToCart} />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/shop" element={<CustomerShopping addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart items={cartItems} updateQuantity={updateQuantity} removeItem={removeItem} />} />
        </Routes>
      </Box>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} updateQuantity={updateQuantity} removeItem={removeItem} />
    </BrowserRouter>
  );
}

export default App;
