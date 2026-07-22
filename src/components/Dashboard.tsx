import React, { useMemo } from 'react';
import { 
  Plus, 
  ShoppingCart, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  Layers, 
  TrendingUp as TrendingUpIcon,
  ShoppingBag,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Medicine, Sale } from '../types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface DashboardProps {
  medicines: Medicine[];
  sales: Sale[];
  onNavigate: (view: 'dashboard' | 'inventory' | 'sales' | 'reports' | 'ai-assistant' | 'suppliers') => void;
  onOpenAddMedicine: () => void;
  onOpenCreateSale: () => void;
  onSelectMedicineContext?: (med: Medicine) => void;
}

export default function Dashboard({ 
  medicines, 
  sales, 
  onNavigate, 
  onOpenAddMedicine, 
  onOpenCreateSale,
  onSelectMedicineContext
}: DashboardProps) {

  // Dynamic calculations
  const totalMedicinesCount = useMemo(() => {
    return medicines.reduce((sum, m) => sum + m.quantity, 0);
  }, [medicines]);

  const uniqueMedicinesCount = medicines.length;

  const lowStockCount = useMemo(() => {
    return medicines.filter(m => m.quantity <= 15).length;
  }, [medicines]);

  const expiringSoonCount = useMemo(() => {
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    return medicines.filter(m => {
      if (!m.expiryDate) return false;
      const expDate = new Date(m.expiryDate);
      return expDate > today && expDate <= threeMonthsFromNow;
    }).length;
  }, [medicines]);

  const todaySalesRevenue = useMemo(() => {
    const todayStr = new Date().toDateString();
    return sales
      .filter(s => new Date(s.createdAt).toDateString() === todayStr)
      .reduce((sum, s) => sum + s.total, 0);
  }, [sales]);

  const monthlySalesRevenue = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return sales
      .filter(s => {
        const d = new Date(s.createdAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, s) => sum + s.total, 0);
  }, [sales]);

  // Chart data for last 7 days of sales
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      const dateStr = d.toDateString();

      // Find sales total for this day
      const dailyTotal = sales
        .filter(s => new Date(s.createdAt).toDateString() === dateStr)
        .reduce((sum, s) => sum + s.total, 0);

      result.push({
        name: dayName,
        Revenue: parseFloat(dailyTotal.toFixed(2)),
        date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      });
    }

    // Fallback static points if no sales recorded yet
    const hasData = result.some(item => item.Revenue > 0);
    if (!hasData) {
      return [
        { name: 'Mon', Revenue: 120 },
        { name: 'Tue', Revenue: 210 },
        { name: 'Wed', Revenue: 180 },
        { name: 'Thu', Revenue: 340 },
        { name: 'Fri', Revenue: 290 },
        { name: 'Sat', Revenue: 410 },
        { name: 'Sun', Revenue: todaySalesRevenue || 150 }
      ];
    }

    return result;
  }, [sales, todaySalesRevenue]);

  // Extract recent 5 sales transactions
  const recentSalesList = useMemo(() => {
    return [...sales].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
  }, [sales]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header section with welcome, date, and CTA buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 font-sans">Pharmacy Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">Real-time overview of your medical inventory, expiration audits, and revenue analytics.</p>
        </div>
        
        {/* Main CTA buttons */}
        <div className="flex flex-wrap gap-3">
          <button 
            id="addMedicineDashboardBtn"
            onClick={onOpenAddMedicine}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-600 active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={18} />
            Add Medicine
          </button>
          <button 
            id="createSaleDashboardBtn"
            onClick={onOpenCreateSale}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-slate-900 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingCart size={18} />
            Create Sale Invoice
          </button>
        </div>
      </div>

      {/* Summary Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        
        {/* Total Medicines Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 custom-shadow flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Layers size={24} />
            </div>
            <span className="text-emerald-700 font-bold text-xs bg-emerald-100 px-2 py-0.5 rounded-full">
              {uniqueMedicinesCount} Types
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Stock Quantity</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {totalMedicinesCount.toLocaleString()} <span className="text-xs font-medium text-slate-500">Units</span>
            </h3>
          </div>
        </div>

        {/* Low Stock alert Card */}
        <div className={`bg-white p-6 rounded-2xl border flex flex-col justify-between hover:shadow-md transition-all ${
          lowStockCount > 0 ? "border-l-4 border-l-amber-500 border-slate-200 custom-shadow" : "border-slate-200 custom-shadow"
        }`}>
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle size={24} />
            </div>
            {lowStockCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold status-pill-amber animate-pulse">
                Action Req.
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold status-pill-green">
                Safe
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Medicines</p>
            <h3 className={`text-2xl font-bold mt-1 ${lowStockCount > 0 ? "text-amber-600" : "text-slate-800"}`}>
              {lowStockCount} <span className="text-xs font-medium text-slate-500">SKUs</span>
            </h3>
          </div>
        </div>

        {/* Expiry Soon alert Card */}
        <div className={`bg-white p-6 rounded-2xl border flex flex-col justify-between hover:shadow-md transition-all ${
          expiringSoonCount > 0 ? "border-l-4 border-l-red-500 border-slate-200 custom-shadow" : "border-slate-200 custom-shadow"
        }`}>
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <Calendar size={24} />
            </div>
            {expiringSoonCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold status-pill-red">
                Urgent Audit
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold status-pill-green">
                No alerts
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expiring Soon (90d)</p>
            <h3 className={`text-2xl font-bold mt-1 ${expiringSoonCount > 0 ? "text-red-600" : "text-slate-800"}`}>
              {expiringSoonCount} <span className="text-xs font-medium text-slate-500">SKUs</span>
            </h3>
          </div>
        </div>

        {/* Today's Sales Revenue Card */}
        <div className="bg-white p-6 rounded-2xl border border-l-4 border-l-emerald-500 border-slate-200 custom-shadow flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign size={24} />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold status-pill-green">
              Live
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Sales</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              ${todaySalesRevenue.toFixed(2)}
            </h3>
          </div>
        </div>

        {/* Monthly Revenue Primary-colored Card */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-900 flex flex-col justify-between hover:shadow-xl transition-all sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <TrendingUpIcon size={24} />
            </div>
            <span className="text-emerald-400 font-bold text-xs bg-white/10 px-2.5 py-0.5 rounded-full">
              Monthly
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Total Monthly Revenue</p>
            <h3 className="text-2xl font-bold mt-1">${monthlySalesRevenue.toFixed(2)}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Sum of current calendar month</p>
          </div>
        </div>

      </div>

      {/* Main Analytical Section: Chart + Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Area Chart: Sales Performance */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 custom-shadow flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Sales Performance</h3>
              <p className="text-xs text-slate-400">Revenue trends for the last 7 active calendar days</p>
            </div>
            <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-lg">
              Live Track
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }} 
                  labelStyle={{ fontWeight: 'bold', fontSize: 12, color: '#0f172a' }}
                  itemStyle={{ fontSize: 12, color: '#10b981' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="Revenue" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table: Recent Sales List */}
        <div className="bg-white rounded-2xl border border-slate-200 custom-shadow overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Recent Sales</h3>
            <p className="text-xs text-slate-400">Recent customer checkout transactions</p>
          </div>

          <div className="overflow-x-auto flex-grow">
            {recentSalesList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShoppingBag size={32} className="mb-2 text-slate-300" />
                <p className="text-xs">No sales registered yet.</p>
                <button 
                  onClick={onOpenCreateSale}
                  className="text-emerald-600 text-xs font-semibold hover:underline mt-1"
                >
                  Checkout customer now
                </button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="p-3 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Invoice</th>
                    <th className="p-3 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Total</th>
                    <th className="p-3 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentSalesList.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <p className="font-semibold text-slate-800">{sale.invoiceNumber}</p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="p-3 font-medium text-slate-800">
                        ${sale.total.toFixed(2)}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold status-pill-green">
                          PAID
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={() => onNavigate('sales')}
              className="w-full py-2 bg-slate-50 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              View Full Transaction List
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* Quick Quicklinks Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div 
          onClick={() => onNavigate('inventory')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-slate-50 cursor-pointer transition-all flex items-center gap-4 group shadow-xs"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shadow-xs group-hover:scale-110 transition-transform">
            <Layers size={22} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800">Stock Inventory</h4>
            <p className="text-xs text-slate-400">Audit, edit, search all drugs</p>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('reports')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-slate-50 cursor-pointer transition-all flex items-center gap-4 group shadow-xs"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shadow-xs group-hover:scale-110 transition-transform">
            <TrendingUpIcon size={22} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800">Analytics Reports</h4>
            <p className="text-xs text-slate-400">Sales ledgers & stock alerts</p>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('suppliers')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-slate-50 cursor-pointer transition-all flex items-center gap-4 group shadow-xs"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shadow-xs group-hover:scale-110 transition-transform">
            <ShoppingBag size={22} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800">Suppliers List</h4>
            <p className="text-xs text-slate-400">Manage wholesale drug vendors</p>
          </div>
        </div>

      </div>

    </div>
  );
}
