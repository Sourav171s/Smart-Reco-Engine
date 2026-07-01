import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Box, Typography, Container, Drawer, IconButton, Badge, InputBase, Button } from '@mui/material';
import { ShoppingCart, Heart, User, Search, MapPin, Grid, PhoneCall, ChevronDown, Menu as MenuIcon, X } from 'lucide-react';
import Cart from './Cart';
import ProductCatalog from './ProductCatalog';
import Inventory from './Inventory';
import CustomerShopping from './CustomerShopping';
import Home from './Home';

function TopHeader({ cartCount, onCartToggle }) {
  return (
    <>
      {/* Topmost utility bar */}
      <Box sx={{ borderBottom: '1px solid var(--border)', bgcolor: 'var(--bg-white)', py: 1 }}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', '&:hover':{color:'var(--green)'} }}>About Us</Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', '&:hover':{color:'var(--green)'} }}>My Account</Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', '&:hover':{color:'var(--green)'} }}>Wishlist</Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', '&:hover':{color:'var(--green)'} }}>Order Tracking</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            100% Secure delivery without contacting the courier
          </Typography>
        </Container>
      </Box>

      {/* Main Search & Logo Bar */}
      <Box sx={{ bgcolor: 'var(--bg-white)', py: 3, borderBottom: '1px solid var(--border)' }}>
        <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
            <Box sx={{ 
              width: 40, height: 40, 
              bgcolor: 'var(--green)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ShoppingCart size={20} color="white" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--green)', lineHeight: 1, fontFamily: 'Inter' }}>Smart</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>STOREFRONT</Typography>
            </Box>
          </Box>

          {/* Search Bar */}
          <Box sx={{ 
            flex: 1, display: 'flex', alignItems: 'center', 
            border: '2px solid var(--border)', borderRadius: '4px',
            bgcolor: 'var(--bg-white)', overflow: 'hidden'
          }}>
            <Box sx={{ 
              px: 2, py: 1.5, borderRight: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
              minWidth: 150
            }}>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>All Categories</Typography>
              <ChevronDown size={14} />
            </Box>
            <InputBase 
              placeholder="Search for items..."
              sx={{ flex: 1, px: 2, fontSize: '0.9rem', color: 'var(--text-primary)' }}
            />
            <IconButton sx={{ mr: 1 }}>
              <Search size={20} color="var(--text-secondary)" />
            </IconButton>
          </Box>

          {/* Location */}
          <Box sx={{ 
            display: 'flex', alignItems: 'center', gap: 1, 
            border: '1px solid var(--border)', px: 2, py: 1, borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)', cursor: 'pointer'
          }}>
            <MapPin size={16} color="var(--green)" />
            <Typography sx={{ color: 'var(--green)', fontSize: '0.85rem', fontWeight: 500 }}>Your Location</Typography>
            <ChevronDown size={14} color="var(--text-light)" />
          </Box>

          {/* Action Icons */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
              <Badge badgeContent={0} sx={{ '& .MuiBadge-badge': { bgcolor: 'var(--green)', color: 'white' } }}>
                <Heart size={24} color="var(--text-primary)" strokeWidth={1.5} />
              </Badge>
              <Typography sx={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Wishlist</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={onCartToggle}>
              <Badge badgeContent={cartCount} sx={{ '& .MuiBadge-badge': { bgcolor: 'var(--green)', color: 'white' } }}>
                <ShoppingCart size={24} color="var(--text-primary)" strokeWidth={1.5} />
              </Badge>
              <Typography sx={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cart</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
              <User size={24} color="var(--text-primary)" strokeWidth={1.5} />
              <Typography sx={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Account</Typography>
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
    <Box sx={{ borderBottom: '1px solid var(--border)', bgcolor: 'var(--bg-white)' }}>
      <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', py: 1.5, gap: 4 }}>
        
        {/* Browse Categories Button */}
        <Box sx={{ 
          bgcolor: 'var(--green)', color: 'white', px: 3, py: 1.5, 
          borderRadius: '4px', display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
          '&:hover': { bgcolor: 'var(--green-dark)' }, transition: 'all 0.2s'
        }}>
          <Grid size={18} />
          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Browse All Categories</Typography>
          <ChevronDown size={18} />
        </Box>

        {/* Main Nav Links */}
        <Box sx={{ display: 'flex', gap: 4, flex: 1 }}>
          {links.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <NavLink key={link.label} to={link.to} style={{ textDecoration: 'none' }}>
                <Typography sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.95rem',
                  color: isActive ? 'var(--green)' : 'var(--text-primary)',
                  display: 'flex', alignItems: 'center', gap: 0.5,
                  '&:hover': { color: 'var(--green)' }, transition: 'color 0.2s'
                }}>
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

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, bgcolor: 'var(--bg-white)', height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {/* Drawer Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Your Cart</Typography>
          <IconButton onClick={onClose}><X size={20} /></IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cartItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
              <ShoppingCart size={48} color="var(--border)" style={{ marginBottom: 16 }} />
              <Typography sx={{ color: 'var(--text-secondary)' }}>Your cart is empty</Typography>
            </Box>
          ) : (
            cartItems.map(item => (
              <Box key={item.id} sx={{ display: 'flex', gap: 2, p: 2, border: '1px solid var(--border)', borderRadius: '8px' }}>
                {item.image ? (
                   <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '4px' }} />
                ) : (
                   <Box className="img-placeholder" sx={{ width: 60, height: 60, mb: 0 }} />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--green)' }}>{item.name}</Typography>
                  <Typography sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem', mt: 0.5 }}>₹{item.price}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid var(--green)', borderRadius: '4px', overflow: 'hidden' }}>
                      <Box sx={{ px: 1, py: 0.5, cursor: 'pointer', color: 'var(--green)', '&:hover': { bgcolor: 'var(--green-light)' } }} onClick={() => updateQty(item.id, -1)}>-</Box>
                      <Box sx={{ px: 1.5, py: 0.5, fontSize: '0.85rem', fontWeight: 600 }}>{item.quantity}</Box>
                      <Box sx={{ px: 1, py: 0.5, cursor: 'pointer', color: 'var(--green)', '&:hover': { bgcolor: 'var(--green-light)' } }} onClick={() => updateQty(item.id, 1)}>+</Box>
                    </Box>
                    <Typography sx={{ fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-light)', '&:hover':{color: 'var(--red)'} }} onClick={() => removeItem(item.id)}>Remove</Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontWeight: 700, color: 'var(--green)' }}>₹{item.price * item.quantity}</Typography>
              </Box>
            ))
          )}
        </Box>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <Box sx={{ p: 3, borderTop: '1px solid var(--border)', bgcolor: 'var(--bg-base)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Total:</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--green)' }}>₹{total}</Typography>
            </Box>
            <button className="btn-green" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '1rem' }}>
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

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p);
      }
      return [...prev, { ...product, quantity }];
    });
    setCartOpen(true);
  };

  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'var(--bg-base)' }}>
        
        {/* Top Header & Nav */}
        <TopHeader cartCount={cartCount} onCartToggle={() => setCartOpen(true)} />
        <NavigationBar />

        {/* Main Content Area */}
        <Box sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<ProductCatalog />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/shop" element={<CustomerShopping addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
          </Routes>
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
  );
}

export default App;
