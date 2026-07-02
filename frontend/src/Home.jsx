import { useState, useEffect, useRef, useMemo, useId } from 'react';
import { Box, Typography, Container, Grid, Chip, Avatar, Fade } from '@mui/material';
import {
  ShoppingBag, Database, Package, Zap, Activity, Users, TrendingUp, TrendingDown,
  ArrowUpRight, Sparkles, CircleCheck, Clock, AlertTriangle, ShoppingCart, Brain,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from './api';

/* ============================================================================
   MOCK DATA
   Unchanged from the original component — no business logic, shape, or values
   were altered. Only presentation-layer fields (sparkline trend arrays) were
   added where needed for the new visual treatments.
   ============================================================================ */
const stats = [
  { label: 'Total Products', value: '12,402', icon: <Package size={20} />, change: '+14%', trend: 'up', color: 'var(--blue)', bg: 'var(--blue-bg)', spark: [4, 6, 5, 8, 7, 9, 8, 11, 10, 13] },
  { label: 'Active Categories', value: '48', icon: <Database size={20} />, change: '+2%', trend: 'up', color: 'var(--orange)', bg: 'var(--orange-bg)', spark: [8, 8, 9, 8, 9, 9, 10, 9, 10, 10] },
  { label: 'Live Sessions', value: '1,204', icon: <Users size={20} />, change: '+24%', trend: 'up', color: 'var(--green-600)', bg: 'var(--green-50)', spark: [3, 5, 4, 7, 9, 8, 11, 13, 12, 15] },
  { label: 'Orders Today', value: '432', icon: <ShoppingBag size={20} />, change: '+18%', trend: 'up', color: 'var(--red)', bg: 'var(--red-bg)', spark: [6, 5, 7, 6, 8, 10, 9, 11, 12, 14] },
  { label: 'AI Recommends', value: '8,092', icon: <Zap size={20} />, change: '+44%', trend: 'up', color: 'var(--green-600)', bg: 'var(--green-50)', spark: [2, 4, 3, 6, 8, 9, 12, 14, 17, 21] },
];

const mockDemand = [
  { id: 1, name: "Lay's Classic", cat: 'Snacks', score: 98, trend: '+12%' },
  { id: 2, name: 'Amul Butter', cat: 'Dairy', score: 95, trend: '+8%' },
  { id: 3, name: 'Maggi Noodles', cat: 'Instant', score: 91, trend: '+15%' },
  { id: 4, name: 'Tata Tea', cat: 'Beverages', score: 88, trend: '+5%' },
  { id: 5, name: 'Britannia Bread', cat: 'Bakery', score: 85, trend: '+2%' },
  { id: 6, name: 'Nandini Milk', cat: 'Dairy', score: 82, trend: '+1%' },
  { id: 7, name: 'Aashirvaad Atta', cat: 'Staples', score: 79, trend: '-2%' },
  { id: 8, name: 'Parle-G', cat: 'Snacks', score: 75, trend: '+4%' },
];

const recentOrders = [
  { id: '#4920', item: 'Amul Milk & 2 more', total: '₹140', status: 'Delivered', time: '2m ago' },
  { id: '#4919', item: "Lay's Classic", total: '₹40', status: 'Processing', time: '15m ago' },
  { id: '#4918', item: 'Britannia Bread', total: '₹45', status: 'Delivered', time: '1h ago' },
  { id: '#4917', item: 'Maggi Noodles', total: '₹112', status: 'Delivered', time: '2h ago' },
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

/* ============================================================================
   HELPERS
   ============================================================================ */

// Deterministic pastel-avatar color from a string (order id) — used for the
// customer/order avatar in Recent Orders so each row is visually distinct
// without needing real customer data.
const AVATAR_PALETTE = ['#2F9E6E', '#3E8FD6', '#F2934D', '#E5484D', '#8B6FE0'];
function colorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

// Minimal dependency-free sparkline. Renders a smooth trend line as inline
// SVG so stat cards get a real trend visual without adding a charting
// library to the project.
function Sparkline({ data, color, width = 84, height = 28 }) {
  const path = useMemo(() => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    const points = data.map((d, i) => {
      const x = i * stepX;
      const y = height - ((d - min) / range) * height;
      return [x, y];
    });
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
    return { linePath, areaPath };
  }, [data, width, height]);

  const gradientId = `spark-${useId().replace(/:/g, '')}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={path.areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <path d={path.linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Lightweight count-up animation for the stat headline numbers. Parses out
// the numeric portion of a formatted value (e.g. "12,402" -> 12402) and
// animates toward it, then re-applies the original formatting/prefix so
// values like percentages or currency remain intact.
function useCountUp(targetValue, durationMs = 900) {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    const numeric = parseFloat(String(targetValue).replace(/[^0-9.]/g, ''));
    if (Number.isNaN(numeric)) {
      return;
    }
    const prefix = String(targetValue).match(/^[^0-9]*/)?.[0] ?? '';
    const suffix = String(targetValue).match(/[^0-9]*$/)?.[0] ?? '';
    let start = null;
    let frame;
    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(numeric * eased);
      setDisplay(`${prefix}${current.toLocaleString('en-IN')}${suffix}`);
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [targetValue, durationMs]);
  return display;
}

// Status -> visual treatment map for order chips, kept in one place so
// adding a new status later is a one-line change.
const STATUS_STYLES = {
  Delivered: { color: 'var(--green-700)', bg: 'var(--green-50)', icon: <CircleCheck size={13} /> },
  Processing: { color: 'var(--orange)', bg: 'var(--orange-bg)', icon: <Clock size={13} /> },
};

// Event-type -> visual treatment for the live feed timeline.
function getEventStyle(log) {
  if (log.includes('alert')) return { color: 'var(--red)', bg: 'var(--red-bg)', icon: <AlertTriangle size={14} /> };
  if (log.includes('AI_ENGINE')) return { color: 'var(--green-600)', bg: 'var(--green-50)', icon: <Brain size={14} /> };
  if (log.includes('USER_EVENT')) return { color: 'var(--blue)', bg: 'var(--blue-bg)', icon: <ShoppingCart size={14} /> };
  return { color: 'var(--orange)', bg: 'var(--orange-bg)', icon: <Activity size={14} /> };
}

function formatLog(log) {
  const [tag, ...rest] = log.split(':');
  return { tag, message: rest.join(':').trim() };
}

/* ============================================================================
   STAT CARD
   ============================================================================ */
function StatCard({ stat }) {
  const animatedValue = useCountUp(stat.value);
  return (
    <Box
      role="group"
      aria-label={`${stat.label}: ${stat.value}, ${stat.change} change`}
      sx={{
        p: 3,
        bgcolor: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        transition: 'transform var(--duration-base) var(--ease), box-shadow var(--duration-base) var(--ease), border-color var(--duration-base) var(--ease)',
        boxShadow: 'var(--shadow-xs)',
        width: '100%',
        cursor: 'default',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: stat.color,
          boxShadow: 'var(--shadow-md)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ p: 1.25, borderRadius: 'var(--radius-md)', bgcolor: stat.bg, color: stat.color, display: 'flex' }}>
          {stat.icon}
        </Box>
        <Chip
          size="small"
          icon={stat.trend === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          label={stat.change}
          sx={{
            bgcolor: stat.bg,
            color: stat.color,
            fontWeight: 700,
            fontSize: '0.75rem',
            height: 24,
            '& .MuiChip-icon': { color: stat.color, ml: '6px' },
          }}
        />
      </Box>

      <Box>
        <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink-900)', letterSpacing: '-0.02em', lineHeight: 1.15, fontVariantNumeric: 'tabular-nums' }}>
          {animatedValue}
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', color: 'var(--ink-600)', mt: 0.5, fontWeight: 500 }}>
          {stat.label}
        </Typography>
      </Box>

      <Box sx={{ mt: 'auto', pt: 0.5 }}>
        <Sparkline data={stat.spark} color={stat.color} />
      </Box>
    </Box>
  );
}

/* ============================================================================
   PAGE
   ============================================================================ */
export default function Home() {
  const [logs, setLogs] = useState(initialLogs);
  const [dashboardStats, setDashboardStats] = useState(stats);
  const [demandProducts, setDemandProducts] = useState(mockDemand);
  const [apiError, setApiError] = useState('');
  const feedContainerRef = useRef(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLogs((prev) => {
        const next = [...prev, mockEvents[i % mockEvents.length]];
        return next.slice(-10);
      });
      i++;
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([api.listProducts(), api.listInventory(), api.topRecommended()])
      .then(([products, inventory, topRecommended]) => {
        if (!active) return;
        const categories = new Set(products.map((product) => product.category)).size;
        const inStock = inventory.filter((row) => row.availableQuantity > 0).length;
        setDashboardStats((current) => current.map((stat) => {
          if (stat.label === 'Total Products') return { ...stat, value: String(products.length) };
          if (stat.label === 'Active Categories') return { ...stat, value: String(categories) };
          if (stat.label === 'Live Sessions') return { ...stat, label: 'Products In Stock', value: String(inStock) };
          if (stat.label === 'AI Recommends') return { ...stat, value: String(topRecommended.reduce((sum, row) => sum + row.recommendationCount, 0)) };
          return stat;
        }));
        setDemandProducts(topRecommended.map((row) => ({
          id: row._id,
          name: row.product.productName,
          cat: row.product.category,
          score: Math.round(row.averageScore),
          trend: `${row.recommendationCount} recs`,
        })));
        setApiError('');
      })
      .catch((error) => active && setApiError(error.message));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (feedContainerRef.current) {
      feedContainerRef.current.scrollTop = feedContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      {apiError && <Box role="alert" sx={{ mb: 2, color: 'var(--red)', fontSize: '0.85rem' }}>{apiError}</Box>}
      {/* ================= HERO ================= */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          p: { xs: 4, md: 6 },
          mb: { xs: 4, md: 5 },
          background: 'linear-gradient(135deg, var(--green-900) 0%, var(--green-700) 45%, var(--green-600) 100%)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 4,
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Decorative background pattern — purely ambient, no semantic content */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.5,
            backgroundImage:
              'radial-gradient(circle at 85% 20%, rgba(255,255,255,0.14) 0%, transparent 45%), radial-gradient(circle at 15% 90%, rgba(255,255,255,0.10) 0%, transparent 40%)',
            pointerEvents: 'none',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 620 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.5,
              borderRadius: 'var(--radius-full)',
              bgcolor: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(6px)',
              mb: 2.5,
            }}
          >
            <Sparkles size={13} color="#fff" />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
              LIVE · ALL SYSTEMS OPERATIONAL
            </Typography>
          </Box>

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '1.9rem', sm: '2.3rem', md: '2.6rem' },
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              mb: 1.5,
            }}
          >
            Welcome back. Here's today's overview.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: 520 }}>
            Track sales, demand, and live activity across your storefront — all in one place.
          </Typography>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', gap: 1.5, flexShrink: 0 }}>
          <Link to="/shop" style={{ textDecoration: 'none' }}>
            <Box
              component="button"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#fff',
                color: 'var(--green-700)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                px: 3,
                py: 1.5,
                fontSize: '0.95rem',
                fontWeight: 700,
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'transform var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(0,0,0,0.22)' },
                '&:active': { transform: 'translateY(0)' },
                '&:focus-visible': { outline: '2px solid #fff', outlineOffset: 2 },
              }}
            >
              Open Storefront <ArrowUpRight size={18} />
            </Box>
          </Link>
        </Box>
      </Box>

      {/* ================= STAT CARDS ================= */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' },
          gap: { xs: 2, md: 3 },
          mb: { xs: 4, md: 5 },
          width: '100%',
        }}
      >
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </Box>

      {/* ================= MAIN CONTENT ================= */}
      <Grid container spacing={{ xs: 3, md: 4 }} sx={{ width: '100%', m: 0 }}>
        {/* ---------- High Demand Products ---------- */}
        <Grid item xs={12} md={7} sx={{ pl: '0 !important', pr: { xs: 0, md: 2 } }}>
          <Box
            sx={{
              bgcolor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              p: { xs: 3, md: 4 },
              height: '100%',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box sx={{ p: 1, borderRadius: 'var(--radius-md)', bgcolor: 'var(--green-50)', display: 'flex', color: 'var(--green-600)' }}>
                  <TrendingUp size={18} />
                </Box>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.01em' }}>
                  High Demand Products
                </Typography>
              </Box>
              <Chip
                label={`${demandProducts.length} tracked`}
                size="small"
                sx={{ bgcolor: 'var(--canvas-subtle)', color: 'var(--ink-600)', fontWeight: 600, fontSize: '0.75rem' }}
              />
            </Box>

            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 520 }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                    <th style={{ padding: '10px 12px', color: 'var(--ink-600)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>RANK</th>
                    <th style={{ padding: '10px 12px', color: 'var(--ink-600)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>PRODUCT</th>
                    <th style={{ padding: '10px 12px', color: 'var(--ink-600)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>CATEGORY</th>
                    <th style={{ padding: '10px 12px', color: 'var(--ink-600)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>DEMAND SCORE</th>
                    <th style={{ padding: '10px 12px', color: 'var(--ink-600)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>TREND</th>
                  </tr>
                </thead>
                <tbody>
                  {demandProducts.map((item, i) => {
                    const isTop3 = i < 3;
                    const isNegative = item.trend.startsWith('-');
                    return (
                      <tr
                        key={item.id}
                        className="demand-row"
                        style={{ borderBottom: i !== demandProducts.length - 1 ? '1px solid var(--canvas-subtle)' : 'none' }}
                      >
                        <td style={{ padding: '16px 12px' }}>
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: 'var(--radius-sm)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              bgcolor: isTop3 ? 'var(--green-50)' : 'var(--canvas-subtle)',
                              color: isTop3 ? 'var(--green-700)' : 'var(--ink-600)',
                            }}
                          >
                            {i + 1}
                          </Box>
                        </td>
                        <td style={{ padding: '16px 12px', fontWeight: 600, color: 'var(--ink-900)', fontSize: '0.9rem' }}>
                          {item.name}
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <Chip
                            label={item.cat}
                            size="small"
                            sx={{ bgcolor: 'var(--canvas-subtle)', color: 'var(--ink-700)', fontWeight: 600, fontSize: '0.72rem', height: 22 }}
                          />
                        </td>
                        <td style={{ padding: '16px 12px', minWidth: 160 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ flex: 1, height: 6, bgcolor: 'var(--canvas-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                              <Box
                                sx={{
                                  width: `${item.score}%`,
                                  height: '100%',
                                  bgcolor: 'var(--green-600)',
                                  borderRadius: 'var(--radius-full)',
                                  transition: 'width 600ms var(--ease)',
                                }}
                              />
                            </Box>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink-900)', width: 26, textAlign: 'right' }}>
                              {item.score}
                            </Typography>
                          </Box>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: isNegative ? 'var(--red)' : 'var(--green-600)', fontWeight: 700, fontSize: '0.85rem' }}>
                            {isNegative ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                            {item.trend}
                          </Box>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          </Box>
        </Grid>

        {/* ---------- Right Column ---------- */}
        <Grid item xs={12} md={5} sx={{ pl: { xs: 0, md: 2 }, pr: '0 !important', pt: { xs: 3, md: 0 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 }, height: '100%' }}>
            {/* ---------- Recent Orders ---------- */}
            <Box
              sx={{
                bgcolor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                p: { xs: 3, md: 4 },
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.01em' }}>
                  Recent Orders
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--green-600)', cursor: 'pointer' }}>
                  View all
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {recentOrders.map((order, i) => {
                  const statusStyle = STATUS_STYLES[order.status] ?? STATUS_STYLES.Processing;
                  return (
                    <Box
                      key={order.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1.75,
                        px: 1,
                        mx: -1,
                        borderRadius: 'var(--radius-md)',
                        borderBottom: i !== recentOrders.length - 1 ? '1px solid var(--canvas-subtle)' : 'none',
                        transition: 'background-color var(--duration-fast) var(--ease)',
                        '&:hover': { bgcolor: 'var(--canvas)' },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, minWidth: 0 }}>
                        <Avatar
                          sx={{
                            width: 42,
                            height: 42,
                            bgcolor: colorFromString(order.id),
                            fontSize: '0.8rem',
                            fontWeight: 700,
                          }}
                        >
                          {order.id.replace('#', '').slice(-2)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink-900)' }}>
                            {order.id}
                          </Typography>
                          <Typography sx={{ fontSize: '0.8rem', color: 'var(--ink-600)', mt: 0.25 }} noWrap>
                            {order.item} · {order.time}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right', flexShrink: 0, pl: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink-900)' }}>
                          {order.total}
                        </Typography>
                        <Chip
                          icon={statusStyle.icon}
                          label={order.status}
                          size="small"
                          sx={{
                            mt: 0.5,
                            height: 20,
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            bgcolor: statusStyle.bg,
                            color: statusStyle.color,
                            '& .MuiChip-icon': { color: statusStyle.color, ml: '6px', mr: '-4px' },
                            '& .MuiChip-label': { px: '6px' },
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* ---------- Live System Feed ---------- */}
            <Box
              sx={{
                bgcolor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                p: { xs: 3, md: 4 },
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-xs)',
                minHeight: 0,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
                <Box sx={{ position: 'relative', display: 'flex', p: 1, borderRadius: 'var(--radius-md)', bgcolor: 'var(--green-50)', color: 'var(--green-600)' }}>
                  <Activity size={18} />
                  <Box
                    aria-hidden="true"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      bgcolor: 'var(--green-600)',
                      boxShadow: '0 0 0 2px var(--surface)',
                      '@keyframes pulseDot': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.35 },
                      },
                      animation: 'pulseDot 1.6s ease-in-out infinite',
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.01em' }}>
                  Live System Feed
                </Typography>
              </Box>

              <Box
                ref={feedContainerRef}
                role="log"
                aria-live="polite"
                aria-label="Live system activity feed"
                sx={{
                  flex: 1,
                  bgcolor: 'var(--canvas)',
                  borderRadius: 'var(--radius-lg)',
                  p: 2,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  gap: 1.25,
                  border: '1px solid var(--border)',
                  maxHeight: 360,
                  position: 'relative',
                }}
              >
                {/* Reversed so most recent entry sits nearest the eye without
                    needing extra scroll logic; a connecting timeline rail runs
                    behind the dots. */}
                <Box sx={{ display: 'flex', flexDirection: 'column-reverse', gap: 0 }}>
                  {logs.map((log, i) => {
                    const { tag, message } = formatLog(log);
                    const style = getEventStyle(log);
                    const isLast = i === logs.length - 1;
                    return (
                      <Fade in key={`${i}-${log}`} timeout={400}>
                        <Box sx={{ display: 'flex', gap: 1.5, position: 'relative', pb: isLast ? 0 : 1.5 }}>
                          {/* Timeline rail */}
                          {i !== 0 && (
                            <Box
                              aria-hidden="true"
                              sx={{
                                position: 'absolute',
                                left: 13,
                                top: 26,
                                bottom: -6,
                                width: '2px',
                                bgcolor: 'var(--border)',
                              }}
                            />
                          )}
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              bgcolor: style.bg,
                              color: style.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              zIndex: 1,
                              border: '2px solid var(--canvas)',
                            }}
                          >
                            {style.icon}
                          </Box>
                          <Box
                            sx={{
                              flex: 1,
                              bgcolor: 'var(--surface)',
                              borderRadius: 'var(--radius-md)',
                              p: 1.5,
                              boxShadow: 'var(--shadow-xs)',
                              minWidth: 0,
                            }}
                          >
                            <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: style.color, letterSpacing: '0.04em', mb: 0.25 }}>
                              {tag}
                            </Typography>
                            <Typography sx={{ fontSize: '0.85rem', color: 'var(--ink-900)', lineHeight: 1.45, wordBreak: 'break-word' }}>
                              {message}
                            </Typography>
                          </Box>
                        </Box>
                      </Fade>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Row-hover affordance for the demand table, scoped locally since the
          table body is generated via plain <table> markup rather than a
          component that could take an sx prop directly on <tr>. */}
      <style>{`
        .demand-row {
          transition: background-color 120ms ease;
        }
        .demand-row:hover {
          background-color: var(--canvas);
        }
      `}</style>
    </Container>
  );
}
