import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import { Database, Package, ShoppingCart, Store } from 'lucide-react';
import Cart from './Cart';
import ProductCatalog from './ProductCatalog';
import Inventory from './Inventory';
import CustomerShopping from './CustomerShopping';

function NavBar({ cartCount }) {
  const location = useLocation();

  const links = [
    { to: '/', label: 'CATALOG', icon: <Database size={14} /> },
    { to: '/inventory', label: 'INVENTORY', icon: <Package size={14} /> },
    { to: '/shop', label: 'SHOP', icon: <Store size={14} /> },
    { to: '/cart', label: 'CART', icon: <ShoppingCart size={14} />, badge: cartCount },
  ];

  return (
    <Box sx={{
      position: 'sticky', top: 0, zIndex: 100,
      bgcolor: 'var(--bg-base)',
      borderBottom: '1px solid var(--border)',
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 8, height: 8, bgcolor: 'var(--text-primary)' }} />
            <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.15em', color: 'var(--text-primary)' }}>
              OVERWATCH
            </Typography>
          </Box>

          {/* Nav Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {links.map(link => {
              const isActive = location.pathname === link.to;
              return (
                <NavLink key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
                  <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    px: 2, py: 1,
                    border: '1px solid',
                    borderColor: isActive ? 'var(--text-primary)' : 'transparent',
                    bgcolor: isActive ? 'var(--text-primary)' : 'transparent',
                    color: isActive ? 'var(--bg-base)' : 'var(--text-secondary)',
                    fontFamily: 'var(--mono)', fontSize: '0.7rem', letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    transition: 'all 0.15s',
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover': {
                      borderColor: isActive ? 'var(--text-primary)' : 'var(--border)',
                      color: isActive ? 'var(--bg-base)' : 'var(--text-primary)',
                    }
                  }}>
                    {link.icon}
                    {link.label}
                    {link.badge > 0 && (
                      <Box sx={{
                        ml: 0.5, px: 0.8, py: 0.2,
                        bgcolor: isActive ? 'var(--bg-base)' : 'var(--text-primary)',
                        color: isActive ? 'var(--text-primary)' : 'var(--bg-base)',
                        fontFamily: 'var(--mono)', fontSize: '0.6rem', fontWeight: 700,
                        lineHeight: 1,
                      }}>
                        {link.badge}
                      </Box>
                    )}
                  </Box>
                </NavLink>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function App() {
  const [cartItems, setCartItems] = useState([]);

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
      <NavBar cartCount={cartCount} />
      <Routes>
        <Route path="/" element={<ProductCatalog addToCart={addToCart} />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/shop" element={<CustomerShopping addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart items={cartItems} updateQuantity={updateQuantity} removeItem={removeItem} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
