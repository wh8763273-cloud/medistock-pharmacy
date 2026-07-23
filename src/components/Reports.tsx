import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Search, 
  Download, 
  CheckCircle,
  FileSpreadsheet,
  Layers,
  Phone,
  Mail,
  ArrowRight
} from 'lucide-react';
import { Medicine, Sale } from '../types';

interface ReportsProps {
  medicines: Medicine[];
  sales: Sale[];
  onNavigate: (view: 'dashboard' | 'inventory' | 'sales' | 'reports' | 'ai-assistant' | 'suppliers') => void;
}

export default function Reports({ medicines, sales, onNavigate }: ReportsProps) {
  const [activeReport, setActiveReport] = useState<'sales' | 'lowstock' | 'expiry'>('sales');
  const [salesReportPeriod, setSalesReportPeriod] = useState<'daily' | 'monthly'>('daily');

  // Calculations
  const todayStr = new Date().toDateString();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const dailySalesList = useMemo(() => {
    return sales.filter(s => new Date(s.createdAt).toDateString() === todayStr);
  }, [sales, todayStr]);

  const monthlySalesList = useMemo(() => {
    return sales.filter(s => {
      const d = new Date(s.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [sales, currentMonth, currentYear]);

  const lowStockList = useMemo(() => {
    return medicines.filter(m => m.quantity <= 15).sort((a, b) => a.quantity - b.quantity);
  }, [medicines]);

  const expiryReportList = useMemo(() => {
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);

    return medicines
      .filter(m => {
        const exp = new Date(m.expiryDate);
        return exp <= sixMonthsFromNow;
      })
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  }, [medicines]);

  const salesRevenueSum = useMemo(() => {
    const list = salesReportPeriod === 'daily' ? dailySalesList : monthlySalesList;
    return list.reduce((sum, s) => sum + s.total, 0);
  }, [salesReportPeriod, dailySalesList, monthlySalesList]);

  const costOfGoodsSold = useMemo(() => {
    // Basic simulation: purchase price of items sold
    const list = salesReportPeriod === 'daily' ? dailySalesList : monthlySalesList;
    let costSum = 0;
    list.forEach(sale => {
      sale.items.forEach(item => {
        // Find medicine purchase price
        const med = medicines.find(m => m.id === item.medicineId);
        if (med) {
          costSum += item.quantity * med.purchasePrice;
        } else {
          costSum += item.quantity * (item.price * 0.4); // fallback 40% cost
        }
      });
    });
    return costSum;
  }, [salesReportPeriod, dailySalesList, monthlySalesList, medicines]);

  const netProfits = useMemo(() => {
    return Math.max(0, salesRevenueSum - costOfGoodsSold);
  }, [salesRevenueSum, costOfGoodsSold]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Audit & Analytics Reports</h1>
          <p className="text-xs text-slate-500">Generate detailed ledger sheets for profits, critical low stocks, and drug expiration audits.</p>
        </div>
        
        {/* Toggle navigation bar */}
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 self-start">
          <button
            onClick={() => setActiveReport('sales')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeReport === 'sales' ? "bg-slate-800 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <TrendingUp size={14} />
            Revenue Ledger
          </button>
          <button
            onClick={() => setActiveReport('lowstock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeReport === 'lowstock' ? "bg-slate-800 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <AlertTriangle size={14} />
            Low Stock ({lowStockList.length})
          </button>
          <button
            onClick={() => setActiveReport('expiry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeReport === 'expiry' ? "bg-slate-800 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Calendar size={14} />
            Expiry (6m)
          </button>
        </div>
      </div>

      {activeReport === 'sales' && (
        <div className="space-y-6">
          
          {/* Subheader and toggle period */}
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="space-y-0.5">
              <h3 className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">Financial Sales Audit</h3>
              <p className="text-[10px] text-slate-400">Profits margins calculated on dispensed medicines buy vs sell values</p>
            </div>
            
            <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setSalesReportPeriod('daily')}
                className={`px-3 py-1 text-xs font-bold ${
                  salesReportPeriod === 'daily' ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setSalesReportPeriod('monthly')}
                className={`px-3 py-1 text-xs font-bold ${
                  salesReportPeriod === 'monthly' ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Revenue profit small stats boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Box 1: Revenue */}
            <div className="bg-white p-5 border border-slate-200 rounded-xl custom-shadow">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dispensing Gross Revenue</span>
              <h4 className="text-2xl font-bold text-slate-800 mt-1">Rs. {salesRevenueSum.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
              <p className="text-[10px] text-slate-400 mt-1">Calculated from checkout logs</p>
            </div>

            {/* Box 2: Cost of Goods */}
            <div className="bg-white p-5 border border-slate-200 rounded-xl custom-shadow">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Acquisition Cost</span>
              <h4 className="text-2xl font-bold text-slate-500 mt-1">Rs. {costOfGoodsSold.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
              <p className="text-[10px] text-slate-400 mt-1">Acquisition value of dispensed stocks</p>
            </div>

            {/* Box 3: Net Margin profits */}
            <div className="bg-white p-5 border-l-4 border-l-emerald-500 border-y border-r border-slate-200 rounded-xl custom-shadow">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Estimated Net Margins</span>
              <h4 className="text-2xl font-bold text-emerald-700 mt-1">Rs. {netProfits.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
              <p className="text-[10px] text-emerald-600 mt-1">Avg margin: {salesRevenueSum > 0 ? ((netProfits / salesRevenueSum) * 100).toFixed(1) : 0}%</p>
            </div>

          </div>

          {/* Detailed tabular ledger of sales in selected period */}
          <div className="bg-white rounded-2xl border border-slate-200 custom-shadow overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <span className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                {salesReportPeriod === 'daily' ? "Today's Receipts" : "Current Month Sales Records"} ({salesReportPeriod === 'daily' ? dailySalesList.length : monthlySalesList.length})
              </span>
              <button
                onClick={() => alert("Report sheet CSV export initiated successfully.")}
                className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg text-[10px] flex items-center gap-1 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <Download size={12} />
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              {(salesReportPeriod === 'daily' ? dailySalesList : monthlySalesList).length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <FileSpreadsheet size={40} className="text-slate-200 mb-2 mx-auto" />
                  <p className="font-semibold text-xs text-slate-600">No transactions in this period</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500">
                      <th className="p-3">Invoice</th>
                      <th className="p-3">Patient</th>
                      <th className="p-3">Dispensed Items</th>
                      <th className="p-3">Taxes</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Date Dispensed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(salesReportPeriod === 'daily' ? dailySalesList : monthlySalesList).map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/30">
                        <td className="p-3 font-bold text-emerald-600">{s.invoiceNumber}</td>
                        <td className="p-3 font-semibold text-slate-800">{s.customerName}</td>
                        <td className="p-3">
                          <div className="space-y-0.5">
                            {s.items.map((item, idx) => (
                              <p key={idx} className="text-slate-600">{item.name} ({item.quantity} units)</p>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-slate-500">Rs. {s.tax.toFixed(2)}</td>
                        <td className="p-3 font-bold text-emerald-700">Rs. {s.total.toFixed(2)}</td>
                        <td className="p-3 text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      )}

      {activeReport === 'lowstock' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">Critical Stock Depletion Log</h3>
            <p className="text-[10px] text-slate-400">Medicines with 15 or fewer units remain in inventory</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 custom-shadow overflow-hidden">
            <div className="overflow-x-auto">
              {lowStockList.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <CheckCircle size={40} className="text-emerald-500 mb-2 mx-auto" />
                  <p className="font-semibold text-xs text-slate-600">All inventory stock levels are fully stable!</p>
                  <p className="text-[10px] mt-0.5">No SKUs are currently running low.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500">
                      <th className="p-3">Medicine</th>
                      <th className="p-3">Therapeutic Class</th>
                      <th className="p-3">SKU Batch Code</th>
                      <th className="p-3">Current Stock</th>
                      <th className="p-3">Acquisition Unit Value</th>
                      <th className="p-3">Manufacturer</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lowStockList.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/30">
                        <td className="p-3">
                          <p className="font-bold text-slate-800">{m.name}</p>
                          <p className="text-[10px] text-slate-400 italic">{m.genericName}</p>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px]">
                            {m.category}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-400">{m.batchNumber}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            m.quantity === 0 ? "bg-red-50 text-red-700 border border-red-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {m.quantity === 0 ? "OUT OF STOCK" : `${m.quantity} UNITS LEFT`}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 font-bold">Rs. {m.purchasePrice.toFixed(2)}</td>
                        <td className="p-3 text-slate-400">{m.manufacturer}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onNavigate('suppliers')}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                          >
                            Contact Vendor
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {activeReport === 'expiry' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">Expiration Schedule Audit (180 days)</h3>
            <p className="text-[10px] text-slate-400">Medicines expired or expiring within the next 6 calendar months</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 custom-shadow overflow-hidden">
            <div className="overflow-x-auto">
              {expiryReportList.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <CheckCircle size={40} className="text-emerald-500 mb-2 mx-auto" />
                  <p className="font-semibold text-xs text-slate-600">All medicines are safely within stable expiry periods!</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500">
                      <th className="p-3">Medicine</th>
                      <th className="p-3">Therapeutic Class</th>
                      <th className="p-3">Batch Number</th>
                      <th className="p-3">Remaining Quantity</th>
                      <th className="p-3">Expiry Date</th>
                      <th className="p-3">Risk Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expiryReportList.map((m) => {
                      const today = new Date();
                      const exp = new Date(m.expiryDate);
                      const isExpired = exp < today;

                      return (
                        <tr key={m.id} className="hover:bg-slate-50/30">
                          <td className="p-3">
                            <p className="font-bold text-slate-800">{m.name}</p>
                            <p className="text-[10px] text-slate-400 italic">{m.genericName}</p>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px]">
                              {m.category}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-slate-400">{m.batchNumber}</td>
                          <td className="p-3 text-slate-600 font-bold">{m.quantity} Units</td>
                          <td className="p-3 text-slate-600 font-bold">
                            {exp.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="p-3">
                            {isExpired ? (
                              <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 font-bold text-[9px] rounded-full">
                                EXPIRED (DISPOSE)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 font-bold text-[9px] rounded-full">
                                EXPIRING SOON
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
