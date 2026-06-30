import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Terminal, ShoppingBag, TrendingUp, Package, Cpu, AlertTriangle, ShoppingCart, BarChart3, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [logs, setLogs] = useState([]);
  const logRef = useRef(null);

  useEffect(() => {
    const activityMessages = [
      { text: "User selected Mother Dairy Milk 500ml → Recommended Amul Milk 500ml", type: "ai", time: "2 sec ago" },
      { text: "User viewed Lay's Chips Classic 120g → Recommended Bingo Chips", type: "ai", time: "15 sec ago" },
      { text: "Mother Dairy Milk 500ml is Out of Stock → Alternative generated automatically", type: "alert", time: "32 sec ago" },
      { text: "User added Amul Milk 500ml to Cart", type: "success", time: "1 min ago" },
      { text: "New product added: Nestle A+ Milk 1L", type: "system", time: "3 min ago" },
      { text: "AI generated explanation for Amul Milk recommendation", type: "ai", time: "5 min ago" },
    ];
    setLogs(activityMessages);
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const stats = [
    { label: 'TOTAL PRODUCTS', value: '1200', sub: 'All products in catalog', icon: <Package size={20} />, color: 'var(--accent-green)' },
    { label: 'IN STOCK', value: '1080', sub: 'Products available', icon: <ShoppingBag size={20} />, color: 'var(--accent-green)' },
    { label: 'OUT OF STOCK', value: '120', sub: 'Currently unavailable', icon: <AlertTriangle size={20} />, color: 'var(--accent-red)' },
    { label: 'TOTAL ORDERS', value: '4560', sub: 'Orders placed', icon: <ShoppingCart size={20} />, color: 'var(--text-primary)' },
    { label: 'TOTAL RECOMMENDATIONS', value: '3400', sub: 'Recommendations generated', icon: <Cpu size={20} />, color: 'var(--accent-green)' },
  ];

  const demandProducts = [
    { rank: 1, name: 'Amul Milk 500ml', category: 'Dairy', score: '98 / 100', trend: '23%' },
    { rank: 2, name: "Lay's Chips Classic 120g", category: 'Snacks', score: '92 / 100', trend: '15%' },
    { rank: 3, name: 'Nandini Milk 500ml', category: 'Dairy', score: '90 / 100', trend: '18%' },
    { rank: 4, name: 'Nescafe Coffee 200g', category: 'Beverages', score: '88 / 100', trend: '12%' },
    { rank: 5, name: 'Amul Butter 500g', category: 'Dairy', score: '85 / 100', trend: '10%' },
    { rank: 6, name: 'Parle-G 800g', category: 'Snacks', score: '83 / 100', trend: '9%' },
    { rank: 7, name: 'Maggi Noodles 280g', category: 'Instant', score: '80 / 100', trend: '8%' },
  ];

  const typeColors = {
    ai: 'var(--accent-green)',
    alert: 'var(--accent-red)',
    success: 'var(--accent-green)',
    system: 'var(--text-tertiary)',
  };

  const typeIcons = {
    ai: '🤖',
    alert: '🔴',
    success: '🟢',
    system: '🟣',
  };

  return (
    <Box sx={{ p: 4, color: 'var(--text-primary)' }}>

      {/* Stats Row */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md key={i}>
            <Box className="hud-box hud-box-tl hud-box-br" sx={{
              p: 2.5, border: '1px solid var(--border)', bgcolor: 'var(--bg-panel)',
              display: 'flex', flexDirection: 'column', height: '100%',
              transition: 'all 0.2s',
              '&:hover': { borderColor: stat.color, transform: 'translateY(-2px)' }
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', color: 'var(--text-tertiary)', letterSpacing: '0.1em' }}>
                  {stat.label}
                </Typography>
                <Box sx={{ color: stat.color }}>{stat.icon}</Box>
              </Box>
              <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '1.5rem', fontWeight: 700, color: stat.color, mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', color: 'var(--text-secondary)' }}>
                {stat.sub}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Main Row: Demand Table + Activity Feed */}
      <Grid container spacing={3} sx={{ mb: 4 }}>

        {/* Products on High Demand */}
        <Grid item xs={12} md={7}>
          <Box sx={{ border: '1px solid var(--border)', bgcolor: 'var(--bg-panel)', p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp size={16} color="var(--accent-green)" />
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  PRODUCTS ON HIGH DEMAND
                </Typography>
              </Box>
              <Link to="/catalog" style={{ textDecoration: 'none' }}>
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 0.5, '&:hover': { color: 'var(--text-primary)' } }}>
                  View all products <ChevronRight size={12} />
                </Typography>
              </Link>
            </Box>
            <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-tertiary)', mb: 3 }}>
              Products that customers are searching and buying the most right now.
            </Typography>

            {/* Table Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', py: 1, mb: 1, borderBottom: '1px solid var(--border)' }}>
              {['#', 'Product', 'Category', 'Demand Score', 'Trend', 'Actions'].map((h, i) => (
                <Typography key={h} sx={{
                  fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-tertiary)', letterSpacing: '0.05em',
                  width: i === 0 ? '8%' : i === 1 ? '28%' : i === 2 ? '18%' : i === 3 ? '20%' : i === 4 ? '14%' : '12%',
                }}>
                  {h}
                </Typography>
              ))}
            </Box>

            {/* Table Rows */}
            {demandProducts.map((p) => (
              <Box key={p.rank} sx={{
                display: 'flex', alignItems: 'center', py: 1.5,
                borderBottom: '1px solid var(--border)',
                transition: 'background 0.15s',
                '&:hover': { bgcolor: 'var(--bg-panel-light)' }
              }}>
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', width: '8%' }}>
                  {p.rank}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, width: '28%' }}>
                  {p.name}
                </Typography>
                <Box sx={{ width: '18%' }}>
                  <Box sx={{
                    display: 'inline-block', px: 1, py: 0.3,
                    border: '1px solid var(--border)', bgcolor: 'var(--bg-panel-light)',
                    fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--accent-green)',
                  }}>
                    {p.category}
                  </Box>
                </Box>
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', width: '20%' }}>
                  {p.score}
                </Typography>
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--accent-green)', width: '14%' }}>
                  ↗ {p.trend}
                </Typography>
                <Box sx={{ width: '12%' }}>
                  <ShoppingCart size={14} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Live Activity Feed */}
        <Grid item xs={12} md={5}>
          <Box sx={{ border: '1px solid var(--border)', bgcolor: 'var(--bg-panel)', p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Terminal size={16} color="var(--accent-green)" />
              <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                LIVE ACTIVITY FEED
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-tertiary)', mb: 3 }}>
              Real-time updates from your store
            </Typography>

            <Box ref={logRef} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1, overflowY: 'auto' }}>
              {logs.map((log, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, animation: 'fadeSlideIn 0.4s ease-out' }}>
                  {/* Timeline dot + line */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.3, flexShrink: 0 }}>
                    <Typography sx={{ fontSize: '0.8rem' }}>{typeIcons[log.type]}</Typography>
                    {i < logs.length - 1 && (
                      <Box sx={{ width: 1, flex: 1, bgcolor: 'var(--border)', mt: 0.5 }} />
                    )}
                  </Box>
                  
                  <Box>
                    <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: typeColors[log.type], mb: 0.5, fontWeight: 700 }}>
                      {log.time}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {log.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Link to="/shop" style={{ textDecoration: 'none' }}>
              <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', mt: 2, pt: 2, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 0.5, '&:hover': { color: 'var(--text-primary)' } }}>
                View all activity <ChevronRight size={12} />
              </Typography>
            </Link>
          </Box>
        </Grid>
      </Grid>

      {/* Bottom CTA Banner */}
      <Box sx={{
        border: '1px solid var(--border)', bgcolor: 'var(--bg-panel)', p: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 48, height: 48, border: '2px solid var(--accent-green)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Cpu size={24} color="var(--accent-green)" />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, mb: 0.5 }}>
              Let AI find the best alternatives for your customers!
            </Typography>
            <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Increase satisfaction and never miss a sale.
            </Typography>
          </Box>
        </Box>
        <Link to="/shop" style={{ textDecoration: 'none' }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.5,
            px: 4, py: 1.5, bgcolor: 'var(--accent-green)', color: 'var(--bg-base)',
            fontFamily: 'var(--mono)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em',
            cursor: 'pointer', transition: 'all 0.2s',
            '&:hover': { bgcolor: '#0ea5e9', transform: 'translateY(-2px)' }
          }}>
            <Zap size={16} /> Generate Recommendations
          </Box>
        </Link>
      </Box>

    </Box>
  );
}
