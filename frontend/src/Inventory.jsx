import React, { useState } from 'react';
import { Box, Typography, IconButton, Button, Container } from '@mui/material';
import { Plus, Minus, AlertTriangle, PackageCheck, BarChart3, ArrowUpDown } from 'lucide-react';

const initialInventory = [
  { id: 1, name: 'AMUL_MILK_500ML', sku: 'DRY-001', category: 'DAIRY', stock: 120, threshold: 50, price: 30 },
  { id: 2, name: 'NANDINI_MILK_500ML', sku: 'DRY-002', category: 'DAIRY', stock: 85, threshold: 40, price: 31 },
  { id: 3, name: 'LAYS_CHIPS_120G', sku: 'SNK-001', category: 'SNACKS', stock: 200, threshold: 80, price: 40 },
  { id: 4, name: 'MAGGI_NOODLES_280G', sku: 'INS-001', category: 'INSTANT', stock: 340, threshold: 100, price: 56 },
  { id: 5, name: 'BRITANNIA_BREAD_400G', sku: 'BKR-001', category: 'BAKERY', stock: 60, threshold: 30, price: 45 },
  { id: 6, name: 'TATA_TEA_250G', sku: 'BEV-001', category: 'BEVERAGES', stock: 150, threshold: 50, price: 120 },
  { id: 7, name: 'PARLE_G_800G', sku: 'SNK-002', category: 'SNACKS', stock: 500, threshold: 100, price: 80 },
  { id: 8, name: 'AASHIRVAAD_ATTA_5KG', sku: 'STP-001', category: 'STAPLES', stock: 45, threshold: 50, price: 280 },
  { id: 9, name: 'SURF_EXCEL_1KG', sku: 'HHD-001', category: 'HOUSEHOLD', stock: 90, threshold: 40, price: 195 },
  { id: 10, name: 'AMUL_BUTTER_500G', sku: 'DRY-003', category: 'DAIRY', stock: 30, threshold: 40, price: 270 },
  { id: 11, name: 'HALDIRAM_NAMKEEN_400G', sku: 'SNK-003', category: 'SNACKS', stock: 175, threshold: 60, price: 110 },
  { id: 12, name: 'NESCAFE_COFFEE_200G', sku: 'BEV-002', category: 'BEVERAGES', stock: 65, threshold: 30, price: 350 },
];

export default function Inventory() {
  const [inventory, setInventory] = useState(initialInventory);
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  const adjustStock = (id, delta) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const newStock = item.stock + delta;
        return { ...item, stock: newStock >= 0 ? newStock : 0 };
      }
      return item;
    }));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sorted = [...inventory].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'string') return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    return sortAsc ? valA - valB : valB - valA;
  });

  const totalItems = inventory.reduce((sum, i) => sum + i.stock, 0);
  const lowStockCount = inventory.filter(i => i.stock <= i.threshold).length;
  const totalValue = inventory.reduce((sum, i) => sum + (i.stock * i.price), 0);

  const getStockStatus = (item) => {
    if (item.stock === 0) return { label: 'DEPLETED', color: 'var(--accent-red)' };
    if (item.stock <= item.threshold) return { label: 'BELOW_THRESHOLD', color: 'var(--accent-red)' };
    if (item.stock <= item.threshold * 1.5) return { label: 'WARNING', color: '#f59e0b' };
    return { label: 'NOMINAL', color: 'var(--accent-green)' };
  };

  const renderStockBar = (item) => {
    const max = item.threshold * 3;
    const percent = Math.min(100, (item.stock / max) * 100);
    const status = getStockStatus(item);
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
        <Box sx={{ flex: 1, height: 4, bgcolor: 'var(--bg-panel-light)', position: 'relative' }}>
          <Box sx={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${percent}%`, bgcolor: status.color, transition: 'width 0.3s' }} />
          {/* Threshold marker */}
          <Box sx={{
            position: 'absolute', left: `${Math.min(100, (item.threshold / max) * 100)}%`, top: -2, height: 8, width: 1,
            bgcolor: 'var(--text-tertiary)', opacity: 0.5
          }} />
        </Box>
        <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: status.color, minWidth: 80, textAlign: 'right' }}>
          {status.label}
        </Typography>
      </Box>
    );
  };

  const SortHeader = ({ field, label, align }) => (
    <Box
      onClick={() => handleSort(field)}
      sx={{
        display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer',
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        '&:hover': { color: 'var(--text-primary)' }
      }}
    >
      <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'inherit' }}>
        {label}
      </Typography>
      <ArrowUpDown size={10} style={{ opacity: sortField === field ? 1 : 0.3 }} />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 4, md: 8 }, color: 'var(--text-primary)' }}>
      <Container maxWidth="lg">

        {/* Page Title */}
        <Box sx={{ mb: 6, maxWidth: 600 }}>
          <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)', letterSpacing: '0.3em', mb: 1, textTransform: 'uppercase' }}>
            System Monitor
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 300, letterSpacing: '-0.05em', mb: 2, display: 'flex', alignItems: 'center' }}>
            Inventory_Control<span className="blink" style={{ color: 'var(--text-tertiary)', marginLeft: '4px' }}>_</span>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ width: '1px', bgcolor: 'var(--border)', my: 0.5 }} />
            <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.6 }}>
              Real-time warehouse monitoring system. Tracking {inventory.length} SKUs across supply chain nodes.
            </Typography>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 5 }}>
          {[
            { label: 'TOTAL_UNITS', value: totalItems.toLocaleString(), icon: <PackageCheck size={16} />, color: 'var(--text-primary)' },
            { label: 'ALERTS_ACTIVE', value: lowStockCount, icon: <AlertTriangle size={16} />, color: lowStockCount > 0 ? 'var(--accent-red)' : 'var(--accent-green)' },
            { label: 'INVENTORY_VALUE', value: `₹${totalValue.toLocaleString()}`, icon: <BarChart3 size={16} />, color: 'var(--text-primary)' },
          ].map((stat, i) => (
            <Box key={i} className="hud-box hud-box-tl hud-box-tr hud-box-bl hud-box-br" sx={{
              border: '1px solid var(--border)', bgcolor: 'var(--bg-panel)', p: 3,
              display: 'flex', flexDirection: 'column', gap: 1.5
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--text-tertiary)' }}>
                {stat.icon}
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {stat.label}
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>
                {stat.value}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Inventory Table */}
        <Box sx={{ border: '1px solid var(--border)', bgcolor: 'var(--bg-panel)', overflow: 'hidden' }}>
          {/* Table Header */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 80px', md: '60px 1fr 100px 100px 1.2fr 80px 120px' },
            gap: 2, px: 3, py: 2,
            borderBottom: '1px solid var(--border)', bgcolor: 'var(--bg-panel-light)',
            color: 'var(--text-tertiary)',
            display: { xs: 'none', md: 'grid' }
          }}>
            <SortHeader field="id" label="ID" />
            <SortHeader field="name" label="Product" />
            <SortHeader field="sku" label="SKU" />
            <SortHeader field="stock" label="Stock" align="right" />
            <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', letterSpacing: '0.1em' }}>STATUS</Typography>
            <SortHeader field="threshold" label="Threshold" align="right" />
            <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textAlign: 'right' }}>ACTIONS</Typography>
          </Box>

          {/* Table Rows */}
          {sorted.map((item, index) => {
            const status = getStockStatus(item);
            return (
              <Box key={item.id} sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '60px 1fr 100px 100px 1.2fr 80px 120px' },
                gap: 2, px: 3, py: 2,
                borderBottom: index < sorted.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'center',
                transition: 'background-color 0.15s',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }
              }}>
                {/* ID */}
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)', display: { xs: 'none', md: 'block' } }}>
                  {item.id.toString().padStart(3, '0')}
                </Typography>

                {/* Name */}
                <Box>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.03em' }}>
                    {item.name}
                  </Typography>
                  <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-tertiary)', mt: 0.5, display: { xs: 'block', md: 'none' } }}>
                    {item.sku} · {item.category}
                  </Typography>
                </Box>

                {/* SKU */}
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-secondary)', display: { xs: 'none', md: 'block' } }}>
                  {item.sku}
                </Typography>

                {/* Stock */}
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.95rem', fontWeight: 700, textAlign: { md: 'right' }, color: status.color }}>
                  {item.stock}
                </Typography>

                {/* Status Bar */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  {renderStockBar(item)}
                </Box>

                {/* Threshold */}
                <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: { md: 'right' }, display: { xs: 'none', md: 'block' } }}>
                  {item.threshold}
                </Typography>

                {/* Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { md: 'flex-end' } }}>
                  <IconButton
                    size="small"
                    onClick={() => adjustStock(item.id, -10)}
                    sx={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 0, width: 28, height: 28, '&:hover': { bgcolor: 'var(--accent-red)', borderColor: 'var(--accent-red)', color: '#fff' } }}
                  >
                    <Minus size={12} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => adjustStock(item.id, 10)}
                    sx={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 0, width: 28, height: 28, '&:hover': { bgcolor: 'var(--accent-green)', borderColor: 'var(--accent-green)', color: '#fff' } }}
                  >
                    <Plus size={12} />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Footer Legend */}
        <Box sx={{ display: 'flex', gap: 4, mt: 3, flexWrap: 'wrap' }}>
          {[
            { label: 'NOMINAL', color: 'var(--accent-green)' },
            { label: 'WARNING', color: '#f59e0b' },
            { label: 'BELOW_THRESHOLD', color: 'var(--accent-red)' },
          ].map(legend => (
            <Box key={legend.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, bgcolor: legend.color }} />
              <Typography sx={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-tertiary)', letterSpacing: '0.1em' }}>
                {legend.label}
              </Typography>
            </Box>
          ))}
        </Box>

      </Container>
    </Box>
  );
}
