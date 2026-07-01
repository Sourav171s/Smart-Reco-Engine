import React from 'react';
import { Box, Typography, Container, Grid, IconButton } from '@mui/material';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart({ cartItems, setCartItems }) {
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
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography sx={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', mb: 4 }}>Your Cart</Typography>

      {cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'var(--bg-white)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <ShoppingCart size={64} color="var(--border)" style={{ marginBottom: 24 }} />
          <Typography sx={{ fontSize: '1.2rem', color: 'var(--text-secondary)', mb: 3 }}>Your cart is currently empty.</Typography>
          <Link to="/shop" style={{ textDecoration: 'none' }}>
            <button className="btn-green">Continue Shopping</button>
          </Link>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ bgcolor: 'var(--bg-white)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', bgcolor: 'var(--bg-base)' }}>
                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>PRODUCT</th>
                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>PRICE</th>
                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>QUANTITY</th>
                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>SUBTOTAL</th>
                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '16px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {item.image ? (
                             <img src={item.image} style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: '6px', border: '1px solid var(--border)' }} />
                          ) : (
                             <Box className="img-placeholder" sx={{ width: 60, height: 60, mb: 0 }} />
                          )}
                          <Box>
                            <Typography sx={{ fontWeight: 600, color: 'var(--green)' }}>{item.name}</Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>By {item.brand}</Typography>
                          </Box>
                        </Box>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>₹{item.price}</td>
                      <td style={{ padding: '16px' }}>
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--green)', borderRadius: '4px', overflow: 'hidden' }}>
                          <Box sx={{ px: 1.5, py: 1, cursor: 'pointer', color: 'var(--green)', '&:hover': { bgcolor: 'var(--green-light)' } }} onClick={() => updateQty(item.id, -1)}>-</Box>
                          <Box sx={{ px: 2, py: 1, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.quantity}</Box>
                          <Box sx={{ px: 1.5, py: 1, cursor: 'pointer', color: 'var(--green)', '&:hover': { bgcolor: 'var(--green-light)' } }} onClick={() => updateQty(item.id, 1)}>+</Box>
                        </Box>
                      </td>
                      <td style={{ padding: '16px', fontWeight: 700, color: 'var(--green)' }}>₹{item.price * item.quantity}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <IconButton onClick={() => removeItem(item.id)} sx={{ color: 'var(--text-light)', '&:hover': { color: 'var(--red)' } }}>
                          <Trash2 size={18} />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box className="filter-card">
              <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', mb: 3, pb: 2, borderBottom: '1px solid var(--border)' }}>Cart Totals</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ color: 'var(--text-secondary)' }}>Subtotal</Typography>
                <Typography sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{total}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, pb: 3, borderBottom: '1px solid var(--border)' }}>
                <Typography sx={{ color: 'var(--text-secondary)' }}>Shipping</Typography>
                <Typography sx={{ fontWeight: 600, color: 'var(--green)' }}>Free</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Total</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.4rem', color: 'var(--green)' }}>₹{total}</Typography>
              </Box>
              
              <button className="btn-green" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}>
                Proceed To Checkout <ArrowRight size={18} />
              </button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
