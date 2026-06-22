import React, { useState } from 'react';
import { Box, Typography, Button, Container, Dialog, DialogContent, IconButton } from '@mui/material';
import { ShoppingCart, Star, X, Cpu, Zap, ArrowRight } from 'lucide-react';

const allProducts = [
  { id: 1, name: 'Amul Milk 500ml', brand: 'Amul', category: 'Dairy', price: 30, rating: 4.5, image: 'https://via.placeholder.com/200/121212/52525b?text=AMUL_MILK' },
  { id: 2, name: 'Nandini Milk 500ml', brand: 'Nandini', category: 'Dairy', price: 31, rating: 4.3, image: 'https://via.placeholder.com/200/121212/52525b?text=NANDINI_MILK' },
  { id: 3, name: 'Heritage Milk 500ml', brand: 'Heritage', category: 'Dairy', price: 28, rating: 4.6, image: 'https://via.placeholder.com/200/121212/52525b?text=HERITAGE_MILK' },
  { id: 4, name: "Lay's Chips Classic 120g", brand: "Lay's", category: 'Snacks', price: 40, rating: 4.2, image: 'https://via.placeholder.com/200/121212/52525b?text=LAYS_CHIPS' },
  { id: 5, name: 'Maggi Noodles 280g', brand: 'Maggi', category: 'Instant', price: 56, rating: 4.7, image: 'https://via.placeholder.com/200/121212/52525b?text=MAGGI_NDL' },
  { id: 17, name: 'Yippee Noodles 280g', brand: 'ITC', category: 'Instant', price: 50, rating: 4.4, image: 'https://via.placeholder.com/200/121212/52525b?text=YIPPEE_NDL' },
  { id: 6, name: 'Britannia Bread 400g', brand: 'Britannia', category: 'Bakery', price: 45, rating: 4.0, image: 'https://via.placeholder.com/200/121212/52525b?text=BRIT_BREAD' },
  { id: 18, name: 'Modern Bread 400g', brand: 'Modern', category: 'Bakery', price: 40, rating: 4.1, image: 'https://via.placeholder.com/200/121212/52525b?text=MODERN_BRD' },
  { id: 7, name: 'Tata Tea 250g', brand: 'Tata', category: 'Beverages', price: 120, rating: 4.8, image: 'https://via.placeholder.com/200/121212/52525b?text=TATA_TEA' },
  { id: 8, name: 'Parle-G 800g', brand: 'Parle', category: 'Snacks', price: 80, rating: 4.6, image: 'https://via.placeholder.com/200/121212/52525b?text=PARLE_G' },
  { id: 9, name: 'Aashirvaad Atta 5kg', brand: 'Aashirvaad', category: 'Staples', price: 280, rating: 4.4, image: 'https://via.placeholder.com/200/121212/52525b?text=ASHIR_ATTA' },
  { id: 10, name: 'Surf Excel 1kg', brand: 'Surf Excel', category: 'Household', price: 195, rating: 4.1, image: 'https://via.placeholder.com/200/121212/52525b?text=SURF_EXCEL' },
  { id: 11, name: 'Amul Butter 500g', brand: 'Amul', category: 'Dairy', price: 270, rating: 4.9, image: 'https://via.placeholder.com/200/121212/52525b?text=AMUL_BTR' },
  { id: 19, name: 'Nandini Butter 500g', brand: 'Nandini', category: 'Dairy', price: 260, rating: 4.6, image: 'https://via.placeholder.com/200/121212/52525b?text=NANDINI_BTR' },
  { id: 12, name: 'Haldiram Namkeen 400g', brand: 'Haldiram', category: 'Snacks', price: 110, rating: 4.3, image: 'https://via.placeholder.com/200/121212/52525b?text=HALDI_NMK' },
  { id: 13, name: 'Nescafe Coffee 200g', brand: 'Nescafe', category: 'Beverages', price: 350, rating: 4.7, image: 'https://via.placeholder.com/200/121212/52525b?text=NESCAFE' },
  { id: 14, name: 'Vim Dishwash 500ml', brand: 'Vim', category: 'Household', price: 99, rating: 3.9, image: 'https://via.placeholder.com/200/121212/52525b?text=VIM_DISH' },
  { id: 15, name: 'Dettol Soap 75g', brand: 'Dettol', category: 'Personal Care', price: 42, rating: 4.0, image: 'https://via.placeholder.com/200/121212/52525b?text=DETTOL' },
  { id: 16, name: 'Bournvita 500g', brand: 'Cadbury', category: 'Beverages', price: 230, rating: 4.5, image: 'https://via.placeholder.com/200/121212/52525b?text=BOURNVITA' },
];

export default function CustomerShopping({ addToCart }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Improved mock recommendation logic: matches specific item types
  const getRecommendations = (product) => {
    // 1. Identify the core item type based on keywords in the name
    const itemKeywords = ['Milk', 'Butter', 'Noodles', 'Bread', 'Tea', 'Coffee', 'Chips'];
    let coreType = itemKeywords.find(keyword => product.name.includes(keyword));
    
    let candidates = [];

    if (coreType) {
      // 2. Find exact matches for this specific item (e.g. only other Milk)
      candidates = allProducts.filter(p => p.name.includes(coreType) && p.id !== product.id);
    } else {
      // Fallback: Just look in the same category if no specific keyword matched
      candidates = allProducts.filter(p => p.category === product.category && p.id !== product.id);
    }
    
    // Sort by rating (descending) then price (ascending)
    candidates.sort((a, b) => b.rating - a.rating || a.price - b.price);
    
    // Take top 2
    return candidates.slice(0, 2).map(rec => {
      // Generate AI explanation based on stats
      let explanation = "";
      const itemName = coreType || rec.category;
      
      if (rec.rating > product.rating && rec.price < product.price) {
        explanation = `Higher user rating (${rec.rating} vs ${product.rating}) and lower price (₹${rec.price} vs ₹${product.price}). Optimal value detected.`;
      } else if (rec.rating > product.rating) {
        explanation = `Superior community rating (${rec.rating} vs ${product.rating}) for ${itemName}.`;
      } else if (rec.price < product.price) {
        explanation = `More cost-effective alternative for ${itemName} (Saves ₹${product.price - rec.price}).`;
      } else {
        explanation = `Frequently purchased alternative for ${itemName}.`;
      }
      return { ...rec, aiExplanation: explanation };
    });
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const recommendations = selectedProduct ? getRecommendations(selectedProduct) : [];

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 4, md: 8 }, color: 'var(--text-primary)' }}>
      <Container maxWidth="lg">

        {/* Page Title */}
        <Box sx={{ mb: 6, maxWidth: 600 }}>
          <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)', letterSpacing: '0.3em', mb: 1, textTransform: 'uppercase' }}>
            Customer Access Node
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 300, letterSpacing: '-0.05em', mb: 2, display: 'flex', alignItems: 'center' }}>
            Storefront<span className="blink" style={{ color: 'var(--text-tertiary)', marginLeft: '4px' }}>_</span>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ width: '1px', bgcolor: 'var(--border)', my: 0.5 }} />
            <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.6 }}>
              Browse available data blocks. Click any item to initialize the predictive recommendation engine.
            </Typography>
          </Box>
        </Box>

        {/* Product Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
          {allProducts.map(product => (
            <Box 
              key={product.id} 
              onClick={() => handleProductClick(product)}
              className="hud-box hud-box-tl hud-box-tr hud-box-bl hud-box-br"
              sx={{
                border: '1px solid var(--border)', bgcolor: 'var(--bg-panel)',
                display: 'flex', flexDirection: 'column', cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'var(--text-primary)', transform: 'translateY(-2px)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }
              }}
            >
              <Box sx={{ 
                height: 160, backgroundImage: `url(${product.image})`, 
                backgroundSize: 'cover', backgroundPosition: 'center',
                borderBottom: '1px solid var(--border)',
                filter: 'grayscale(100%) contrast(1.2)'
              }} />
              
              <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-tertiary)', letterSpacing: '0.1em', mb: 0.5, textTransform: 'uppercase' }}>
                  {product.category}
                </Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 500, letterSpacing: '0.03em', mb: 2 }}>
                  {product.name}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 'auto' }}>
                  <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '1.25rem', fontWeight: 700 }}>₹{product.price}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star size={12} color="var(--accent-green)" fill="var(--accent-green)" />
                    <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {product.rating}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

      </Container>

      {/* Recommendation Engine Modal */}
      <Dialog
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { bgcolor: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 0, color: 'var(--text-primary)' } }}
      >
        {selectedProduct && (
          <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
            
            {/* Modal Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid var(--border)', bgcolor: 'var(--bg-panel-light)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Cpu size={16} color="var(--text-tertiary)" />
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  AI_RECOMMENDATION_SYSTEM // INITIALIZED
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => setSelectedProduct(null)} sx={{ color: 'var(--text-secondary)' }}>
                <X size={18} />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
              
              {/* Left Side: Selected Product */}
              <Box sx={{ flex: 1, p: 3, borderRight: { md: '1px solid var(--border)' }, borderBottom: { xs: '1px solid var(--border)', md: 'none' } }}>
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)', letterSpacing: '0.1em', mb: 2 }}>
                  [ TARGET_SELECTION ]
                </Typography>
                
                <Box sx={{ 
                  height: 200, backgroundImage: `url(${selectedProduct.image})`, 
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  border: '1px solid var(--border)', mb: 3, filter: 'grayscale(100%)'
                }} />
                
                <Typography variant="h5" sx={{ mb: 1 }}>{selectedProduct.name}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '1.5rem', fontWeight: 700 }}>₹{selectedProduct.price}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star size={16} color="var(--text-secondary)" fill="var(--text-secondary)" />
                    <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                      {selectedProduct.rating}
                    </Typography>
                  </Box>
                </Box>
                
                <Button 
                  fullWidth 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  sx={{ 
                    bgcolor: 'var(--bg-panel-light)', color: 'var(--text-primary)', border: '1px solid var(--border)',
                    borderRadius: 0, py: 1.5, fontFamily: 'var(--mono)', fontSize: '0.75rem', letterSpacing: '0.1em',
                    '&:hover': { bgcolor: 'var(--border)' }
                  }}
                >
                  &gt; ADD_TARGET_TO_CART
                </Button>
              </Box>

              {/* Right Side: Recommendations */}
              <Box sx={{ flex: 1.5, p: 3, bgcolor: 'var(--bg-base)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Zap size={16} color="var(--accent-green)" />
                  <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--accent-green)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
                    OPTIMIZED_ALTERNATIVES_DETECTED
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {recommendations.length > 0 ? recommendations.map((rec, idx) => (
                    <Box key={rec.id} sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ 
                        width: 80, height: 80, backgroundImage: `url(${rec.image})`, 
                        backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--border)', filter: 'grayscale(100%) contrast(1.2)'
                      }} />
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', mb: 0.5 }}>{rec.name}</Typography>
                          <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-green)' }}>₹{rec.price}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                          <Star size={10} color="var(--text-secondary)" fill="var(--text-secondary)" />
                          <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{rec.rating} Rating</Typography>
                        </Box>

                        {/* AI Explanation Box */}
                        <Box sx={{ 
                          p: 1.5, bgcolor: 'rgba(16, 185, 129, 0.05)', borderLeft: '2px solid var(--accent-green)',
                          fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-secondary)',
                          display: 'flex', gap: 1, mb: 1.5, lineHeight: 1.5
                        }}>
                          <Typography sx={{ color: 'var(--accent-green)' }}>&gt;</Typography>
                          {rec.aiExplanation}
                        </Box>
                        
                        <Button 
                          size="small"
                          onClick={() => { addToCart(rec); setSelectedProduct(null); }}
                          sx={{ 
                            alignSelf: 'flex-start', color: 'var(--bg-base)', bgcolor: 'var(--accent-green)',
                            borderRadius: 0, px: 2, py: 0.5, fontFamily: 'var(--mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
                            '&:hover': { bgcolor: '#0ea5e9' }
                          }}
                        >
                          + ADD_ALTERNATIVE
                        </Button>
                      </Box>
                    </Box>
                  )) : (
                    <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      &gt; NO_BETTER_ALTERNATIVES_FOUND. TARGET IS OPTIMAL.
                    </Typography>
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
