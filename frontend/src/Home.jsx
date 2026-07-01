import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { ShoppingBag, Database, Package, Zap, Activity, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Total Products', value: '12,402', icon: <Package size={24} />, change: '+14%', color: 'var(--blue)' },
  { label: 'Active Categories', value: '48', icon: <Database size={24} />, change: '+2%', color: 'var(--orange)' },
  { label: 'Live Sessions', value: '1,204', icon: <Users size={24} />, change: '+24%', color: 'var(--green)' },
  { label: 'Orders Today', value: '432', icon: <ShoppingBag size={24} />, change: '+18%', color: 'var(--red)' },
  { label: 'AI Recommends', value: '8,092', icon: <Zap size={24} />, change: '+44%', color: 'var(--green)' },
];

const mockDemand = [
  { id: 1, name: "Lay's Classic", cat: "Snacks", score: 98, trend: "+12%" },
  { id: 2, name: "Amul Butter", cat: "Dairy", score: 95, trend: "+8%" },
  { id: 3, name: "Maggi Noodles", cat: "Instant", score: 91, trend: "+15%" },
  { id: 4, name: "Tata Tea", cat: "Beverages", score: 88, trend: "+5%" },
  { id: 5, name: "Britannia Bread", cat: "Bakery", score: 85, trend: "+2%" },
  { id: 6, name: "Nandini Milk", cat: "Dairy", score: 82, trend: "+1%" },
  { id: 7, name: "Aashirvaad Atta", cat: "Staples", score: 79, trend: "-2%" },
  { id: 8, name: "Parle-G", cat: "Snacks", score: 75, trend: "+4%" },
];

const recentOrders = [
  { id: "#4920", item: "Amul Milk & 2 more", total: "₹140", status: "Delivered", time: "2m ago" },
  { id: "#4919", item: "Lay's Classic", total: "₹40", status: "Processing", time: "15m ago" },
  { id: "#4918", item: "Britannia Bread", total: "₹45", status: "Delivered", time: "1h ago" },
  { id: "#4917", item: "Maggi Noodles", total: "₹112", status: "Delivered", time: "2h ago" },
];

const initialLogs = [
  "SYSTEM: Node cluster initialized successfully.",
  "AI_ENGINE: Recommendation model loaded (v2.4.1).",
  "USER_EVENT: Anonymous user started session.",
];

const mockEvents = [
  "USER_EVENT: Added 'Amul Milk' to Cart.",
  "AI_ENGINE: Suggested 'Nandini Milk' -> Accepted.",
  "SYSTEM: Stock alert - 'Lay's Chips' below 20 units.",
  "USER_EVENT: Checkout completed (Order #4920).",
  "AI_ENGINE: Calculated new demand vector for 'Snacks'.",
  "SYSTEM: Payment gateway synchronized.",
];

export default function Home() {
  const [logs, setLogs] = useState(initialLogs);
  const feedContainerRef = useRef(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = [...prev, mockEvents[i % mockEvents.length]];
        return next.slice(-10);
      });
      i++;
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (feedContainerRef.current) {
      feedContainerRef.current.scrollTop = feedContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Banner */}
      <Box sx={{ 
        bgcolor: 'var(--green-light)', borderRadius: '12px', p: 4, mb: 4,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        border: '1px solid var(--green)'
      }}>
        <Box>
          <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', mb: 1 }}>Dashboard Overview</Typography>
          <Typography sx={{ color: 'var(--text-secondary)' }}>Welcome to the Smart Storefront management system.</Typography>
        </Box>
        <Link to="/shop" style={{ textDecoration: 'none' }}>
          <button className="btn-green" style={{ padding: '12px 24px', fontSize: '1rem' }}>
            Open Storefront <ArrowUpRight size={18} />
          </button>
        </Link>
      </Box>

      {/* Top Stats - Fully fluid grid taking up entire width */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' }, 
        gap: 3, mb: 4,
        width: '100%'
      }}>
        {stats.map((stat, i) => (
          <Box key={i} sx={{ 
            p: 3, bgcolor: 'var(--bg-white)', borderRadius: '12px', border: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', gap: 2, transition: 'transform 0.2s',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)', width: '100%',
            '&:hover': { transform: 'translateY(-4px)', borderColor: 'var(--green)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ 
                p: 1.5, borderRadius: '8px', 
                bgcolor: stat.label === 'AI Recommends' ? 'var(--green-light)' : 'var(--bg-base)', 
                color: stat.color 
              }}>
                {stat.icon}
              </Box>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: stat.color, bgcolor: stat.label === 'AI Recommends' ? 'var(--green-light)' : 'var(--bg-base)', px: 1, py: 0.5, borderRadius: '4px' }}>
                {stat.change}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: 'var(--text-secondary)', mt: 0.5 }}>{stat.label}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Main Content Layout */}
      <Grid container spacing={4} sx={{ width: '100%', m: 0 }}>
        
        {/* Left Column: High Demand Table */}
        <Grid item xs={12} md={7} sx={{ pl: '0 !important', pr: { xs: 0, md: 2 } }}>
          <Box sx={{ bgcolor: 'var(--bg-white)', borderRadius: '12px', border: '1px solid var(--border)', p: 4, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
              <TrendingUp size={24} color="var(--green)" />
              <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>High Demand Products</Typography>
            </Box>
            
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>RANK</th>
                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>PRODUCT</th>
                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>CATEGORY</th>
                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>DEMAND SCORE</th>
                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>TREND</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDemand.map((item, i) => (
                    <tr key={item.id} style={{ borderBottom: i !== mockDemand.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                      <td style={{ padding: '24px 12px', fontWeight: 700, color: 'var(--text-primary)' }}>#{i + 1}</td>
                      <td style={{ padding: '24px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</td>
                      <td style={{ padding: '24px 12px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{item.cat}</td>
                      <td style={{ padding: '24px 12px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ flex: 1, height: 8, bgcolor: 'var(--bg-base)', borderRadius: 4 }}>
                            <Box sx={{ width: `${item.score}%`, height: '100%', bgcolor: 'var(--green)', borderRadius: 4 }} />
                          </Box>
                          <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', width: '30px' }}>{item.score}</Typography>
                        </Box>
                      </td>
                      <td style={{ padding: '24px 12px', color: 'var(--green)', fontWeight: 600, fontSize: '0.95rem' }}>{item.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Box>
        </Grid>

        {/* Right Column: Stacked Elements */}
        <Grid item xs={12} md={5} sx={{ pl: { xs: 0, md: 2 }, pr: '0 !important', pt: { xs: 4, md: 0 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, height: '100%' }}>
            
            {/* Recent Orders Box */}
            <Box sx={{ bgcolor: 'var(--bg-white)', borderRadius: '12px', border: '1px solid var(--border)', p: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', mb: 4 }}>Recent Orders</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {recentOrders.map((order, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2.5, borderBottom: i !== 3 ? '1px solid var(--border-light)' : 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 48, height: 48, bgcolor: 'var(--bg-base)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                        <ShoppingBag size={20} color="var(--text-secondary)" />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{order.id}</Typography>
                        <Typography sx={{ fontSize: '0.9rem', color: 'var(--text-secondary)', mt: 0.5 }}>{order.item}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--green)' }}>{order.total}</Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: order.status === 'Delivered' ? 'var(--text-light)' : 'var(--orange)', mt: 0.5 }}>{order.status}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Live Feed Box */}
            <Box sx={{ bgcolor: 'var(--bg-white)', borderRadius: '12px', border: '1px solid var(--border)', p: 4, flex: 1, display: 'flex', flexDirection: 'column', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                <Activity size={24} color="var(--green)" />
                <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>Live System Feed</Typography>
              </Box>
              
              <Box ref={feedContainerRef} sx={{ flex: 1, bgcolor: 'var(--bg-base)', borderRadius: '12px', p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, border: '1px solid var(--border)', maxHeight: '380px' }}>
                {logs.map((log, i) => {
                  let color = "var(--text-secondary)";
                  let iconColor = "var(--border)";
                  if (log.includes("AI_ENGINE")) { color = "var(--green)"; iconColor = "var(--green)"; }
                  else if (log.includes("USER_EVENT")) { color = "var(--blue)"; iconColor = "var(--blue)"; }
                  else if (log.includes("SYSTEM")) { color = "var(--orange)"; iconColor = "var(--orange)"; }
                  if (log.includes("alert")) { color = "var(--red)"; iconColor = "var(--red)"; }

                  return (
                    <Box key={i} className="fade-in" sx={{ display: 'flex', gap: 2, p: 2, bgcolor: 'var(--bg-white)', borderRadius: '8px', borderLeft: `4px solid ${iconColor}`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: iconColor, mt: 1, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                        <span style={{ color, fontWeight: 700, marginRight: 8 }}>[{log.split(':')[0]}]</span>
                        {log.split(':')[1]}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            </Box>

          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
