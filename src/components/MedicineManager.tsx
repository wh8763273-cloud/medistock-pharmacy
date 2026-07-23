import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  Calendar, 
  CheckCircle,
  X,
  FileSpreadsheet,
  Info
} from 'lucide-react';
import { Medicine } from '../types';

interface MedicineManagerProps {
  medicines: Medicine[];
  onAddMedicine: (med: Omit<Medicine, "id" | "createdAt">) => Promise<any>;
  onUpdateMedicine: (id: string, updates: Partial<Medicine>) => Promise<any>;
  onDeleteMedicine: (id: string) => Promise<any>;
  isAddFormOpenByDefault: boolean;
  onCloseAddForm: () => void;
  onSelectMedicineContext?: (med: Medicine) => void;
  onOpenAssistant: () => void;
  initialStockFilter?: 'All' | 'Low' | 'Out' | 'Normal';
  initialExpiryFilter?: 'All' | 'Expired' | 'Expiring' | 'Safe';
}

export default function MedicineManager({ 
  medicines, 
  onAddMedicine, 
  onUpdateMedicine, 
  onDeleteMedicine,
  isAddFormOpenByDefault,
  onCloseAddForm,
  onSelectMedicineContext,
  onOpenAssistant,
  initialStockFilter = 'All',
  initialExpiryFilter = 'All'
}: MedicineManagerProps) {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'Low' | 'Out' | 'Normal'>(initialStockFilter);
  const [expiryFilter, setExpiryFilter] = useState<'All' | 'Expired' | 'Expiring' | 'Safe'>(initialExpiryFilter);

  // Sync initial filters when navigated from Dashboard KPI cards
  React.useEffect(() => {
    if (initialStockFilter) setStockFilter(initialStockFilter);
  }, [initialStockFilter]);

  React.useEffect(() => {
    if (initialExpiryFilter) setExpiryFilter(initialExpiryFilter);
  }, [initialExpiryFilter]);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(isAddFormOpenByDefault);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  // Input states
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Antibiotics');
  const [batchNumber, setBatchNumber] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [expiryDate, setExpiryDate] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Sync state if dashboard clicked "Add Medicine"
  React.useEffect(() => {
    if (isAddFormOpenByDefault) {
      setIsFormOpen(true);
      resetForm();
    }
  }, [isAddFormOpenByDefault]);

  const categories = useMemo(() => {
    const list = new Set(medicines.map(m => m.category));
    return ['All', ...Array.from(list)];
  }, [medicines]);

  // Filters logic
  const filteredMedicines = useMemo(() => {
    const today = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(today.getDate() + 90);

    return medicines.filter(m => {
      // 1. Search term (Name, Generic, Brand)
      const matchesSearch = 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.brand.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Category
      const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;

      // 3. Stock Level Filter
      let matchesStock = true;
      if (stockFilter === 'Low') {
        matchesStock = m.quantity > 0 && m.quantity <= 15;
      } else if (stockFilter === 'Out') {
        matchesStock = m.quantity === 0;
      } else if (stockFilter === 'Normal') {
        matchesStock = m.quantity > 15;
      }

      // 4. Expiry Filter
      let matchesExpiry = true;
      const expDate = new Date(m.expiryDate);
      if (expiryFilter === 'Expired') {
        matchesExpiry = expDate < today;
      } else if (expiryFilter === 'Expiring') {
        matchesExpiry = expDate >= today && expDate <= ninetyDaysFromNow;
      } else if (expiryFilter === 'Safe') {
        matchesExpiry = expDate > ninetyDaysFromNow;
      }

      return matchesSearch && matchesCategory && matchesStock && matchesExpiry;
    });
  }, [medicines, searchTerm, categoryFilter, stockFilter, expiryFilter]);

  const resetForm = () => {
    setEditingMedicine(null);
    setName('');
    setGenericName('');
    setBrand('');
    setCategory('Antibiotics');
    setBatchNumber('');
    setManufacturer('');
    setQuantity(0);
    setPurchasePrice(0);
    setSellingPrice(0);
    setExpiryDate('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleEditClick = (med: Medicine) => {
    setEditingMedicine(med);
    setName(med.name || '');
    setGenericName(med.genericName || '');
    setBrand(med.brand || '');
    setCategory(med.category || 'Antibiotics');
    setBatchNumber(med.batchNumber || '');
    setManufacturer(med.manufacturer || '');
    setQuantity(med.quantity ?? 0);
    setPurchasePrice(med.purchasePrice ?? 0);
    setSellingPrice(med.sellingPrice ?? 0);
    setExpiryDate(med.expiryDate || '');
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name} from your pharmacy stock?`)) {
      try {
        await onDeleteMedicine(id);
      } catch (err) {
        alert("Error deleting medicine");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const dataPayload = {
      name,
      genericName,
      brand,
      category,
      batchNumber,
      manufacturer,
      quantity: Number(quantity),
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      expiryDate
    };

    try {
      if (editingMedicine) {
        await onUpdateMedicine(editingMedicine.id, dataPayload);
      } else {
        await onAddMedicine(dataPayload);
      }
      setIsFormOpen(false);
      onCloseAddForm();
      resetForm();
    } catch (err) {
      alert("Error saving medicine");
    } finally {
      setFormLoading(false);
    }
  };

  const getStockBadge = (qty: number) => {
    if (qty === 0) {
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold status-pill-red">OUT OF STOCK</span>;
    }
    if (qty <= 15) {
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold status-pill-amber">LOW ({qty})</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold status-pill-green">IN STOCK ({qty})</span>;
  };

  const getExpiryBadge = (expiryStr: string) => {
    const today = new Date();
    const exp = new Date(expiryStr);
    const ninetyDays = new Date();
    ninetyDays.setDate(today.getDate() + 90);

    if (exp < today) {
      return (
        <span className="flex items-center gap-1 text-red-600 font-bold text-xs">
          <AlertTriangle size={14} />
          Expired
        </span>
      );
    }
    if (exp <= ninetyDays) {
      return (
        <span className="flex items-center gap-1 text-amber-600 font-bold text-xs animate-pulse">
          <Calendar size={14} />
          Expiring Soon
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
        <CheckCircle size={14} />
        Safe
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medicine Inventory</h1>
          <p className="text-xs text-slate-500">Manage your pharmacy stock, batch codes, prices, and monitor expiration timelines.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all cursor-pointer shadow-sm self-start"
        >
          <Plus size={16} />
          Add Medicine
        </button>
      </div>

      {/* Filter Toolbar Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 custom-shadow space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search field */}
          <div className="relative flex-grow">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Medicine, Generic Name, Brand..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all outline-none"
            />
          </div>

          {/* Quick Clear Filter Option */}
          {(categoryFilter !== 'All' || stockFilter !== 'All' || expiryFilter !== 'All' || searchTerm !== '') && (
            <button
              onClick={() => {
                setCategoryFilter('All');
                setStockFilter('All');
                setExpiryFilter('All');
                setSearchTerm('');
              }}
              className="px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
            >
              Reset Filters
            </button>
          )}

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          
          {/* Category Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Stock Level Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stock Level</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
            >
              <option value="All">All Stock Levels</option>
              <option value="Low">Low Stock (≤ 15 Units)</option>
              <option value="Out">Out of Stock (0 Units)</option>
              <option value="Normal">In Stock (&gt; 15 Units)</option>
            </select>
          </div>

          {/* Expiry Timeline Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expiry timeline</label>
            <select
              value={expiryFilter}
              onChange={(e) => setExpiryFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
            >
              <option value="All">All Timelines</option>
              <option value="Safe">Stable / Safe</option>
              <option value="Expiring">Expiring Soon (90 Days)</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Inventory Data Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 custom-shadow overflow-hidden">
        <div className="overflow-x-auto">
          {filteredMedicines.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 text-center">
              <FileSpreadsheet size={48} className="text-slate-300 mb-2" />
              <p className="font-semibold text-sm text-slate-700">No medicines found</p>
              <p className="text-xs mt-1">Try resetting your search query or criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Medicine details</th>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Batch & Mfg</th>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Category</th>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Stock Status</th>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Price (Purc / Sell)</th>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Expiry Timeline</th>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMedicines.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Name, Generic, Brand */}
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{med.name}</p>
                        <p className="text-slate-500 italic text-[11px] mt-0.5">Generic: {med.genericName}</p>
                        <p className="text-emerald-600 text-[10px] font-semibold mt-0.5">Brand: {med.brand}</p>
                      </div>
                    </td>

                    {/* Batch Number & Manufacturer */}
                    <td className="p-4 text-slate-600">
                      <p className="font-medium">Batch: {med.batchNumber}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{med.manufacturer}</p>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {med.category}
                      </span>
                    </td>

                    {/* Quantity & Stock status */}
                    <td className="p-4">
                      {getStockBadge(med.quantity)}
                    </td>

                    {/* Price details */}
                    <td className="p-4 text-slate-600">
                      <p className="font-medium">Buy: <span className="font-semibold">${med.purchasePrice.toFixed(2)}</span></p>
                      <p className="text-[10px] text-emerald-700 mt-0.5 font-medium">Sell: <span className="font-semibold">${med.sellingPrice.toFixed(2)}</span></p>
                    </td>

                    {/* Expiry Status */}
                    <td className="p-4">
                      <p className="font-medium text-slate-600">{new Date(med.expiryDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <div className="mt-1">{getExpiryBadge(med.expiryDate)}</div>
                    </td>

                    {/* Actions button */}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        
                        {/* Quick AI Consultant Action */}
                        <button
                          onClick={() => {
                            if (onSelectMedicineContext) {
                              onSelectMedicineContext(med);
                            }
                            onOpenAssistant();
                          }}
                          title="Ask AI Pharmacy Assistant about this medicine"
                          className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Info size={14} />
                        </button>

                        <button
                          onClick={() => handleEditClick(med)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit drug details"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(med.id, med.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete drug record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Floating Modal Form Panel for Add/Edit Medicine */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            
            {/* Modal Header */}
            <header className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {editingMedicine ? `Edit Medicine: ${editingMedicine.name}` : "Add New Medical Stock"}
              </h3>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  onCloseAddForm();
                  resetForm();
                }}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </header>

            {/* Modal Form content */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Medicine Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Medicine Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Amoxicillin"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Generic Chemical Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Generic Name (Formula)</label>
                  <input
                    type="text"
                    required
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    placeholder="Amoxicillin Trihydrate"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Brand Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Moxilen"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Therapeutic Class</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-emerald-500 outline-none"
                  >
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Analgesic">Analgesic (Pain Relief)</option>
                    <option value="Antihypertensive">Antihypertensive (BP)</option>
                    <option value="Antidiabetic">Antidiabetic</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Antihistamine">Antihistamine</option>
                    <option value="Vitamins">Vitamins / Supplements</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>

                {/* Batch Code */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Batch Number (SKU)</label>
                  <input
                    type="text"
                    required
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="AMX202611"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Manufacturer */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Manufacturer (Vendor Corp)</label>
                  <input
                    type="text"
                    required
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="GSK Pharmaceuticals"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Available Quantity (Stock Units)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Expiry Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Purchase Cost */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Purchase Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Selling Price */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Selling Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

              </div>

              {/* Form Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    onCloseAddForm();
                    resetForm();
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center"
                >
                  {formLoading ? "Saving..." : "Save Medicine"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
