import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Container, Grid } from '@mui/material';
import { Trash2, Plus, Minus, Lock, Terminal } from 'lucide-react';

const initialItems = [
  { id: 1, name: 'AMUL_MILK_500ML', price: 30, quantity: 2, image: 'https://via.placeholder.com/150/121212/52525b?text=DATA_BLK_1' },
  { id: 2, name: 'NANDINI_MILK_500ML', price: 31, quantity: 1, image: 'https://via.placeholder.com/150/121212/52525b?text=DATA_BLK_2' },
  { id: 3, name: 'LAYS_CHIPS_120G', price: 40, quantity: 1, image: 'https://via.placeholder.com/150/121212/52525b?text=DATA_BLK_3' }
];

export default function Cart() {
  const [items, setItems] = useState(initialItems);

  const updateQuantity = (id, delta) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return { ...item, quantity: newQ > 0 ? newQ : 1 };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 20;
  const packagingFee = 10;
  const total = subtotal + deliveryFee + packagingFee;

  const freeDeliveryThreshold = 500;
  const awayFromFree = Math.max(0, freeDeliveryThreshold - total);
  const progressPercent = Math.min(100, (total / freeDeliveryThreshold) * 100);

  // Helper for generating terminal-like visual bars
  const renderLoadingBar = (percent) => {
    const totalBars = 40;
    const filledBars = Math.floor((percent / 100) * totalBars);
    return (
      <Box sx={{ display: 'flex', gap: '2px', height: '12px', width: '100%' }}>
        {Array.from({ length: totalBars }).map((_, i) => (
          <Box 
            key={i} 
            sx={{ 
              flex: 1, 
              bgcolor: i < filledBars ? 'var(--text-primary)' : 'var(--bg-panel-light)',
              opacity: i < filledBars ? 1 : 0.3
            }} 
          />
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      py: { xs: 4, md: 8 },
      color: 'var(--text-primary)',
    }}>
      <Container maxWidth="lg">
        
        {/* Top Header / Nav Bar Simulation */}
        <Box sx={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          borderBottom: '1px solid var(--border)', pb: 2, mb: 6,
          fontFamily: 'var(--mono)', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--text-primary)' }}>
              <Box sx={{ width: 8, height: 8, bgcolor: 'var(--text-primary)' }} />
              <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.15em' }}>
                OVERWATCH_CART
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Page Title */}
        <Box sx={{ mb: 6, maxWidth: 600 }}>
          <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)', letterSpacing: '0.3em', mb: 1, textTransform: 'uppercase' }}>
            Checkout Terminal
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 300, letterSpacing: '-0.05em', mb: 2, display: 'flex', alignItems: 'center' }}>
            Order_Manifest<span className="blink" style={{ color: 'var(--text-tertiary)', marginLeft: '4px' }}>_</span>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ width: '1px', bgcolor: 'var(--border)', my: 0.5 }} />
            <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.6 }}>
              Real-time synchronization of shopping cart contents. Validating {items.length} data blocks across payment nodes.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          
          {/* LEFT COLUMN - Items */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              
              {/* Free Delivery Banner */}
              <Box className="hud-box hud-box-tl hud-box-tr hud-box-bl hud-box-br" sx={{ 
                p: 3, 
                border: '1px solid var(--border)', 
                bgcolor: 'var(--bg-panel)',
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                  <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    Delivery_Status
                  </Typography>
                  <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                    ₹{total} <span style={{ color: 'var(--text-tertiary)' }}>/ ₹{freeDeliveryThreshold}</span>
                  </Typography>
                </Box>
                
                {renderLoadingBar(progressPercent)}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    {total >= freeDeliveryThreshold ? (
                      <span style={{ color: 'var(--accent-green)' }}>&gt; FREE_DELIVERY_UNLOCKED</span>
                    ) : (
                      <span>&gt; REQ_FUNDS: ₹{awayFromFree}</span>
                    )}
                  </Typography>
                </Box>
              </Box>

              {/* Cart Items Grid (like data cards) */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                {items.map(item => (
                  <Box key={item.id} sx={{ 
                    p: 2, 
                    border: '1px solid var(--border)', 
                    bgcolor: 'var(--bg-panel)', 
                    display: 'flex', flexDirection: 'column', gap: 2,
                    transition: 'border-color 0.2s',
                    '&:hover': { borderColor: 'var(--border-light)' }
                  }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {/* Image Block */}
                      <Box sx={{ 
                        width: 60, height: 60, 
                        border: '1px solid var(--border)',
                        backgroundImage: `url(${item.image})`, 
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        filter: 'grayscale(100%) contrast(1.2)'
                      }} />
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', mb: 0.5 }}>
                          ID: {item.id.toString().padStart(4, '0')}
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.05em' }}>
                          {item.name}
                        </Typography>
                        <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.875rem', color: 'var(--text-secondary)', mt: 1 }}>
                          ₹{item.price}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', pt: 2, mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton 
                          size="small"
                          onClick={() => updateQuantity(item.id, -1)}
                          sx={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 0, width: 24, height: 24, '&:hover': { bgcolor: 'var(--border)', color: 'var(--text-primary)' } }}
                        >
                          <Minus size={12} />
                        </IconButton>
                        <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.875rem', minWidth: 20, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton 
                          size="small"
                          onClick={() => updateQuantity(item.id, 1)}
                          sx={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 0, width: 24, height: 24, '&:hover': { bgcolor: 'var(--border)', color: 'var(--text-primary)' } }}
                        >
                          <Plus size={12} />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          ₹{item.price * item.quantity}
                        </Typography>
                        <IconButton 
                          size="small"
                          onClick={() => removeItem(item.id)} 
                          sx={{ color: 'var(--text-tertiary)', '&:hover': { color: 'var(--accent-red)' } }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>

            </Box>
          </Grid>

          {/* RIGHT COLUMN - Terminal Console */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 32, display: 'flex', flexDirection: 'column', gap: 4 }}>
              
              {/* Terminal Output */}
              <Box className="hud-box hud-box-tl hud-box-tr hud-box-bl hud-box-br" sx={{ 
                bgcolor: 'var(--bg-panel-light)', 
                border: '1px solid var(--border)', 
                p: 3, 
                fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)',
                display: 'flex', flexDirection: 'column', gap: 1
              }}>
                <Typography sx={{ fontFamily: 'inherit', color: 'var(--text-secondary)' }}>&gt; Establishing secure connection...</Typography>
                <Typography sx={{ fontFamily: 'inherit' }}>&gt; Compiling order items...</Typography>
                <Typography sx={{ fontFamily: 'inherit' }}>&gt; Calculating subtotal: ₹{subtotal}</Typography>
                <Typography sx={{ fontFamily: 'inherit' }}>&gt; Adding fees: ₹{deliveryFee + packagingFee}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography sx={{ fontFamily: 'inherit', color: 'var(--accent-green)' }}>&gt; READY_FOR_PAYMENT</Typography>
                  <Box className="blink" sx={{ width: 6, height: 12, bgcolor: 'var(--accent-green)' }} />
                </Box>
              </Box>

              {/* Action Console */}
              <Box sx={{ 
                border: '1px solid var(--border)', 
                bgcolor: 'var(--bg-panel)', 
                display: 'flex', flexDirection: 'column'
              }}>
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Subtotal</Typography>
                    <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.875rem' }}>₹{subtotal}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Delivery</Typography>
                    <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.875rem' }}>₹{deliveryFee}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Packaging</Typography>
                    <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.875rem' }}>₹{packagingFee}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ borderTop: '1px solid var(--border)', p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'var(--bg-panel-light)' }}>
                  <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total_Due</Typography>
                  <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>₹{total}</Typography>
                </Box>

                <Button 
                  fullWidth 
                  variant="text" 
                  sx={{ 
                    bgcolor: 'var(--text-primary)', 
                    color: 'var(--bg-base)',
                    borderRadius: 0, 
                    py: 2.5, 
                    fontFamily: 'var(--mono)',
                    textTransform: 'uppercase', 
                    fontSize: '0.875rem', 
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1.5,
                    '&:hover': { bgcolor: 'var(--text-secondary)' },
                  }}
                >
                  &gt; Execute_Checkout
                </Button>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'var(--text-tertiary)', fontFamily: 'var(--mono)', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                <Lock size={12} />
                <Typography sx={{ fontFamily: 'inherit' }}>
                  Encryption active. Payload secure.
                </Typography>
              </Box>

            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
