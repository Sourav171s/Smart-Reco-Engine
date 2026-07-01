import React, { useState } from 'react';
import { Box, Typography, Container, IconButton } from '@mui/material';
import { Search, Plus, Minus, AlertTriangle } from 'lucide-react';

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

export default function Inventory() {
  const [inventory, setInventory] = useState(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');

  const updateStock = (id, delta) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.stock + delta);
        let status = 'Healthy';
        if (newStock < item.threshold / 2) status = 'Critical';
        else if (newStock < item.threshold) status = 'Low Stock';
        else if (newStock < item.threshold * 1.5) status = 'Warning';
        
        return { ...item, stock: newStock, status };
      }
      return item;
    }));
  };

  const filtered = inventory.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Healthy': return 'var(--green)';
      case 'Warning': return 'var(--orange)';
      case 'Low Stock': return 'var(--orange)';
      case 'Critical': return 'var(--red)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', mb: 1 }}>Warehouse Inventory</Typography>
          <Typography sx={{ color: 'var(--text-secondary)' }}>Manage stock levels and track low inventory.</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '8px', px: 2, py: 1, bgcolor: 'var(--bg-white)', minWidth: 300 }}>
          <Search size={18} color="var(--text-light)" />
          <input 
            placeholder="Search SKU or Name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-primary)', marginLeft: 8, width: '100%', fontFamily: 'Inter' }}
          />
        </Box>
      </Box>

      <Box sx={{ bgcolor: 'var(--bg-white)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', bgcolor: 'var(--bg-base)' }}>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>SKU</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>PRODUCT NAME</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>STOCK LEVEL</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>HEALTH STATUS</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const color = getStatusColor(item.status);
              const percentage = Math.min(100, Math.max(5, (item.stock / (item.threshold * 3)) * 100));
              
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{item.sku}</td>
                  <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: '16px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ fontWeight: 700, width: 40, color: 'var(--text-primary)' }}>{item.stock}</Typography>
                      <Box sx={{ width: 120, height: 6, bgcolor: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{ width: `${percentage}%`, height: '100%', bgcolor: color, borderRadius: 3 }} />
                      </Box>
                    </Box>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <Box sx={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 1, 
                      px: 1.5, py: 0.5, borderRadius: '4px', border: `1px solid ${color}`,
                      color: color, bgcolor: 'var(--bg-white)', fontSize: '0.8rem', fontWeight: 600
                    }}>
                      {item.status !== 'Healthy' && <AlertTriangle size={14} />}
                      {item.status}
                    </Box>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton size="small" onClick={() => updateStock(item.id, -10)} sx={{ border: '1px solid var(--border)', borderRadius: '6px' }}><Minus size={16} /></IconButton>
                      <IconButton size="small" onClick={() => updateStock(item.id, 10)} sx={{ border: '1px solid var(--border)', borderRadius: '6px' }}><Plus size={16} /></IconButton>
                    </Box>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'var(--text-secondary)' }}>No inventory items found matching your search.</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}
