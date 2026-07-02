import { useState, useMemo, useId, useEffect } from 'react';
import { Box, Typography, Container, IconButton, Chip, Tooltip, InputBase } from '@mui/material';
import { Search, Plus, Minus, AlertTriangle, PackageX, PackageCheck, Boxes, Layers, X, TrendingDown } from 'lucide-react';
import { api } from './api';

const initialInventory = [
  { id: 1, name: 'Amul Milk 500ml', sku: 'DRY-001', stock: 120, status: 'Healthy', threshold: 20 },
  { id: 2, name: 'Nandini Milk 500ml', sku: 'DRY-002', stock: 90, status: 'Healthy', threshold: 20 },
  { id: 4, name: "Lay's Chips Classic 120g", sku: 'SNK-001', stock: 200, status: 'Healthy', threshold: 50 },
  { id: 5, name: 'Maggi Noodles 280g', sku: 'INS-001', stock: 15, status: 'Low Stock', threshold: 30 },
  { id: 7, name: 'Tata Tea 250g', sku: 'BEV-001', stock: 8, status: 'Critical', threshold: 25 },
  { id: 8, name: 'Parle-G 800g', sku: 'SNK-002', stock: 500, status: 'Healthy', threshold: 100 },
  { id: 9, name: 'Aashirvaad Atta 5kg', sku: 'STP-001', stock: 45, status: 'Healthy', threshold: 20 },
  { id: 11, name: 'Amul Butter 500g', sku: 'DRY-004', stock: 30, status: 'Warning', threshold: 40 },
];

/* ============================================================================
   HELPERS
   ============================================================================ */

// Status -> visual treatment. Same four states the original component
// computed in updateStock (Healthy / Warning / Low Stock / Critical) — no
// new statuses invented, just a richer presentation per status.
const STATUS_STYLES = {
  Healthy: { color: 'var(--green-700)', bg: 'var(--green-50)', icon: <PackageCheck size={13} /> },
  Warning: { color: 'var(--orange)', bg: 'var(--orange-bg)', icon: <AlertTriangle size={13} /> },
  'Low Stock': { color: 'var(--orange)', bg: 'var(--orange-bg)', icon: <AlertTriangle size={13} /> },
  Critical: { color: 'var(--red)', bg: 'var(--red-bg)', icon: <PackageX size={13} /> },
};

function getStatusStyle(status) {
  return STATUS_STYLES[status] ?? { color: 'var(--ink-600)', bg: 'var(--canvas-subtle)', icon: null };
}

/* ============================================================================
   ANALYTICS CARD
   ============================================================================ */
function AnalyticsCard({ label, value, icon, color, bg, sublabel }) {
  return (
    <Box
      role="group"
      aria-label={`${label}: ${value}`}
      sx={{
        p: 2.75,
        bgcolor: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        boxShadow: 'var(--shadow-xs)',
        transition: 'transform var(--duration-base) var(--ease), box-shadow var(--duration-base) var(--ease), border-color var(--duration-base) var(--ease)',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 'var(--shadow-md)', borderColor: color },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ p: 1.1, borderRadius: 'var(--radius-md)', bgcolor: bg, color, display: 'flex' }}>
          {icon}
        </Box>
      </Box>
      <Box>
        <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ink-900)', letterSpacing: '-0.02em', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: '0.82rem', color: 'var(--ink-600)', mt: 0.5, fontWeight: 500 }}>
          {label}
        </Typography>
        {sublabel && (
          <Typography sx={{ fontSize: '0.72rem', color, mt: 0.5, fontWeight: 600 }}>
            {sublabel}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

/* ============================================================================
   STOCK ACTION BUTTON
   ============================================================================ */
function StockButton({ label, onClick, children }) {
  return (
    <Tooltip title={label}>
      <IconButton
        size="small"
        aria-label={label}
        onClick={onClick}
        sx={{
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--ink-700)',
          transition: 'all var(--duration-fast) var(--ease)',
          '&:hover': { borderColor: 'var(--green-600)', color: 'var(--green-700)', bgcolor: 'var(--green-50)' },
        }}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}

/* ============================================================================
   EMPTY STATE
   ============================================================================ */
function EmptyState({ hasQuery, onClear }) {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 7, md: 9 }, px: 3 }}>
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: 'var(--canvas-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ink-400)',
          mx: 'auto',
          mb: 2.5,
        }}
      >
        <Boxes size={26} strokeWidth={1.5} />
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink-900)', mb: 0.75 }}>
        {hasQuery ? 'No items match your search' : 'No inventory items'}
      </Typography>
      <Typography sx={{ color: 'var(--ink-600)', fontSize: '0.88rem', mb: hasQuery ? 2.5 : 0 }}>
        {hasQuery ? 'Try a different SKU or product name.' : 'Inventory items will appear here once added.'}
      </Typography>
      {hasQuery && (
        <button className="btn-outline" onClick={onClear}>Clear search</button>
      )}
    </Box>
  );
}

/* ============================================================================
   PAGE
   ============================================================================ */
export default function Inventory() {
  const [inventory, setInventory] = useState(initialInventory);
  const [apiError, setApiError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const searchId = useId();

  useEffect(() => {
    let active = true;
    api.listInventory()
      .then((rows) => {
        if (!active) return;
        setInventory(rows.filter((row) => row.productId).map((row) => {
          const stock = row.availableQuantity;
          const threshold = 20;
          let status = 'Healthy';
          if (stock < threshold / 2) status = 'Critical';
          else if (stock < threshold) status = 'Low Stock';
          else if (stock < threshold * 1.5) status = 'Warning';
          return { id: row._id, productId: row.productId._id, name: row.productId.productName, sku: row.productId._id.slice(-6).toUpperCase(), stock, threshold, status };
        }));
        setApiError('');
      })
      .catch((error) => active && setApiError(error.message));
    return () => { active = false; };
  }, []);

  const updateStock = async (id, delta) => {
    const currentItem = inventory.find((item) => item.id === id);
    if (!currentItem) return;
    const nextStock = Math.max(0, currentItem.stock + delta);
    try {
      await api.updateInventory(id, { availableQuantity: nextStock });
      setInventory((current) => current.map((item) => {
      if (item.id === id) {
        const newStock = nextStock;
        let status = 'Healthy';
        if (newStock < item.threshold / 2) status = 'Critical';
        else if (newStock < item.threshold) status = 'Low Stock';
        else if (newStock < item.threshold * 1.5) status = 'Warning';

        return { ...item, stock: newStock, status };
      }
      return item;
      }));
      setApiError('');
    } catch (error) {
      setApiError(error.message);
    }
  };

  // ---- Derived analytics (computed from the real inventory array only —
  // no fabricated fields like warehouse/category, since the data model
  // doesn't carry them). ----
  const analytics = useMemo(() => {
    const totalProducts = inventory.length;
    const totalStock = inventory.reduce((sum, i) => sum + i.stock, 0);
    const lowStockCount = inventory.filter((i) => i.status === 'Low Stock' || i.status === 'Warning').length;
    const criticalCount = inventory.filter((i) => i.status === 'Critical').length;
    const healthyCount = inventory.filter((i) => i.status === 'Healthy').length;
    return { totalProducts, totalStock, lowStockCount, criticalCount, healthyCount };
  }, [inventory]);

  const statusCounts = useMemo(() => {
    const counts = { All: inventory.length };
    inventory.forEach((i) => { counts[i.status] = (counts[i.status] || 0) + 1; });
    return counts;
  }, [inventory]);

  const filtered = useMemo(() => {
    let result = inventory;
    if (statusFilter !== 'All') {
      result = result.filter((i) => i.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
    }
    return result;
  }, [inventory, searchQuery, statusFilter]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'All';
  const clearFilters = () => { setSearchQuery(''); setStatusFilter('All'); };

  // Items needing attention, surfaced as a dedicated alert panel so managers
  // don't have to scan the whole table to spot what's urgent.
  const alertItems = useMemo(
    () => inventory
      .filter((i) => i.status === 'Critical' || i.status === 'Low Stock')
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 4),
    [inventory]
  );

  const statusFilterOptions = ['All', 'Healthy', 'Warning', 'Low Stock', 'Critical'];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
      {apiError && <Box role="alert" sx={{ mb: 2, color: 'var(--red)', fontSize: '0.85rem' }}>{apiError}</Box>}
      {/* ================= PAGE HEADER ================= */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: { xs: 3, md: 4 },
        }}
      >
        <Box>
          <Typography component="h1" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 800, color: 'var(--ink-900)', letterSpacing: '-0.02em', mb: 0.5 }}>
            Warehouse Inventory
          </Typography>
          <Typography sx={{ color: 'var(--ink-600)', fontSize: '0.9rem' }}>
            Manage stock levels, monitor availability, and act on low-inventory alerts.
          </Typography>
        </Box>
      </Box>

      {/* ================= ANALYTICS CARDS ================= */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
          gap: { xs: 1.5, md: 2.5 },
          mb: { xs: 3, md: 4 },
        }}
      >
        <AnalyticsCard
          label="Total Products"
          value={analytics.totalProducts}
          icon={<Layers size={19} />}
          color="var(--blue)"
          bg="var(--blue-bg)"
          sublabel={`${analytics.healthyCount} healthy`}
        />
        <AnalyticsCard
          label="Total Stock Units"
          value={analytics.totalStock.toLocaleString('en-IN')}
          icon={<Boxes size={19} />}
          color="var(--green-600)"
          bg="var(--green-50)"
          sublabel="Across all SKUs"
        />
        <AnalyticsCard
          label="Low Stock Items"
          value={analytics.lowStockCount}
          icon={<TrendingDown size={19} />}
          color="var(--orange)"
          bg="var(--orange-bg)"
          sublabel={analytics.lowStockCount > 0 ? 'Needs reordering' : 'All clear'}
        />
        <AnalyticsCard
          label="Critical Stock"
          value={analytics.criticalCount}
          icon={<PackageX size={19} />}
          color="var(--red)"
          bg="var(--red-bg)"
          sublabel={analytics.criticalCount > 0 ? 'Immediate action' : 'All clear'}
        />
      </Box>

      {/* ================= ALERTS PANEL ================= */}
      {alertItems.length > 0 && (
        <Box
          sx={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            bgcolor: 'var(--surface)',
            p: { xs: 2.5, md: 3 },
            mb: { xs: 3, md: 4 },
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
            <Box sx={{ p: 0.9, borderRadius: 'var(--radius-md)', bgcolor: 'var(--red-bg)', color: 'var(--red)', display: 'flex' }}>
              <AlertTriangle size={16} />
            </Box>
            <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink-900)' }}>
              Needs Attention
            </Typography>
            <Chip
              label={`${alertItems.length}`}
              size="small"
              sx={{ bgcolor: 'var(--red-bg)', color: 'var(--red)', fontWeight: 700, height: 20, fontSize: '0.7rem' }}
            />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
            {alertItems.map((item) => {
              const style = getStatusStyle(item.status);
              return (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    borderLeft: `3px solid ${style.color}`,
                    bgcolor: 'var(--canvas)',
                  }}
                >
                  <Box sx={{ color: style.color, display: 'flex', flexShrink: 0 }}>{style.icon}</Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink-900)' }} noWrap>
                      {item.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'var(--ink-600)' }}>
                      {item.sku} · {item.stock} units left
                    </Typography>
                  </Box>
                  <button
                    className="btn-outline"
                    style={{ padding: '5px 12px', fontSize: '0.75rem', flexShrink: 0 }}
                    onClick={() => updateStock(item.id, 10)}
                  >
                    Restock
                  </button>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* ================= SEARCH & STATUS FILTERS ================= */}
      <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            px: 1.75,
            py: 1,
            transition: 'border-color 120ms ease, box-shadow 120ms ease',
            '&:focus-within': { borderColor: 'var(--green-600)', boxShadow: 'var(--shadow-focus)' },
          }}
        >
          <Search size={18} color="var(--ink-400)" style={{ flexShrink: 0 }} />
          <InputBase
            id={searchId}
            placeholder="Search by SKU or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputProps={{ 'aria-label': 'Search inventory' }}
            sx={{ flex: 1, fontSize: '0.9rem', color: 'var(--ink-900)' }}
          />
          {searchQuery && (
            <IconButton size="small" aria-label="Clear search" onClick={() => setSearchQuery('')} sx={{ p: 0.5 }}>
              <X size={14} />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
        {statusFilterOptions.map((option) => (
          <Box
            key={option}
            component="button"
            onClick={() => setStatusFilter(option)}
            className={`category-tag ${statusFilter === option ? 'active' : ''}`}
            style={{ fontFamily: 'inherit' }}
          >
            {option} <Box component="span" sx={{ opacity: 0.6, ml: 0.25 }}>({statusCounts[option] || 0})</Box>
          </Box>
        ))}
        {hasActiveFilters && (
          <Typography
            component="button"
            onClick={clearFilters}
            sx={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--ink-600)',
              bgcolor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: 'inherit',
              ml: 0.5,
              '&:hover': { color: 'var(--red)' },
            }}
          >
            Clear filters
          </Typography>
        )}
      </Box>

      {/* ================= RESULT COUNT ================= */}
      <Typography sx={{ color: 'var(--ink-600)', fontSize: '0.85rem', mb: 1.5 }}>
        <Box component="span" sx={{ color: 'var(--ink-900)', fontWeight: 700 }}>{filtered.length}</Box>{' '}
        {filtered.length === 1 ? 'item' : 'items'}
      </Typography>

      {/* ================= INVENTORY TABLE ================= */}
      <Box sx={{ bgcolor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
        {filtered.length > 0 ? (
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 640 }}>
              <thead>
                <tr>
                  <th
                    style={{
                      position: 'sticky', top: 0, zIndex: 1,
                      padding: '14px 16px', color: 'var(--ink-600)', fontSize: '0.72rem', fontWeight: 700,
                      letterSpacing: '0.05em', background: 'var(--canvas-subtle)', borderBottom: '1.5px solid var(--border)',
                    }}
                  >
                    SKU
                  </th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 1, padding: '14px 16px', color: 'var(--ink-600)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', background: 'var(--canvas-subtle)', borderBottom: '1.5px solid var(--border)' }}>
                    PRODUCT NAME
                  </th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 1, padding: '14px 16px', color: 'var(--ink-600)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', background: 'var(--canvas-subtle)', borderBottom: '1.5px solid var(--border)' }}>
                    STOCK LEVEL
                  </th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 1, padding: '14px 16px', color: 'var(--ink-600)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', background: 'var(--canvas-subtle)', borderBottom: '1.5px solid var(--border)' }}>
                    HEALTH STATUS
                  </th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 1, padding: '14px 16px', color: 'var(--ink-600)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', background: 'var(--canvas-subtle)', borderBottom: '1.5px solid var(--border)', textAlign: 'right' }}>
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  const style = getStatusStyle(item.status);
                  const percentage = Math.min(100, Math.max(5, (item.stock / (item.threshold * 3)) * 100));

                  return (
                    <tr
                      key={item.id}
                      className="inventory-row"
                      style={{ borderBottom: i !== filtered.length - 1 ? '1px solid var(--canvas-subtle)' : 'none' }}
                    >
                      <td style={{ padding: '16px', color: 'var(--ink-600)', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
                        {item.sku}
                      </td>
                      <td style={{ padding: '16px', color: 'var(--ink-900)', fontWeight: 600, fontSize: '0.9rem' }}>
                        {item.name}
                      </td>
                      <td style={{ padding: '16px', minWidth: 180 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography sx={{ fontWeight: 700, width: 42, color: 'var(--ink-900)', fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums' }}>
                            {item.stock}
                          </Typography>
                          <Box sx={{ width: 110, height: 6, bgcolor: 'var(--canvas-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                            <Box
                              sx={{
                                width: `${percentage}%`,
                                height: '100%',
                                bgcolor: style.color,
                                borderRadius: 'var(--radius-full)',
                                transition: 'width 600ms var(--ease)',
                              }}
                            />
                          </Box>
                        </Box>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <Chip
                          icon={style.icon}
                          label={item.status}
                          size="small"
                          sx={{
                            bgcolor: style.bg,
                            color: style.color,
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            height: 24,
                            '& .MuiChip-icon': { color: style.color, ml: '6px' },
                          }}
                        />
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <StockButton label={`Decrease stock of ${item.name} by 10`} onClick={() => updateStock(item.id, -10)}>
                            <Minus size={15} />
                          </StockButton>
                          <StockButton label={`Increase stock of ${item.name} by 10`} onClick={() => updateStock(item.id, 10)}>
                            <Plus size={15} />
                          </StockButton>
                        </Box>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        ) : (
          <EmptyState hasQuery={hasActiveFilters} onClear={clearFilters} />
        )}
      </Box>

      <style>{`
        .inventory-row {
          transition: background-color 120ms ease;
        }
        .inventory-row:hover {
          background-color: var(--canvas);
        }
      `}</style>
    </Container>
  );
}
