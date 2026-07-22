import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit2, 
  X,
  FileSpreadsheet
} from 'lucide-react';
import { Supplier } from '../types';

interface SupplierManagerProps {
  suppliers: Supplier[];
  onAddSupplier: (sup: Omit<Supplier, "id" | "createdAt">) => Promise<any>;
  onUpdateSupplier: (id: string, updates: Partial<Supplier>) => Promise<any>;
  onDeleteSupplier: (id: string) => Promise<any>;
}

export default function SupplierManager({
  suppliers,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier
}: SupplierManagerProps) {

  // Modal forms
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Inputs
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const resetForm = () => {
    setEditingSupplier(null);
    setName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setAddress('');
  };

  const handleEditClick = (sup: Supplier) => {
    setEditingSupplier(sup);
    setName(sup.name || '');
    setContactPerson(sup.contactPerson || '');
    setEmail(sup.email || '');
    setPhone(sup.phone || '');
    setAddress(sup.address || '');
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove supplier ${name}?`)) {
      try {
        await onDeleteSupplier(id);
      } catch (err) {
        alert("Error removing supplier");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const payload = {
      name,
      contactPerson,
      email,
      phone,
      address
    };

    try {
      if (editingSupplier) {
        await onUpdateSupplier(editingSupplier.id, payload);
      } else {
        await onAddSupplier(payload);
      }
      setIsFormOpen(false);
      resetForm();
    } catch (err) {
      alert("Error saving supplier");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Supplier Management</h1>
          <p className="text-xs text-slate-500">Manage wholesalers, medical distributors, contact details, and drug fulfillment accounts.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all cursor-pointer shadow-xs self-start"
        >
          <Plus size={16} />
          Register Supplier
        </button>
      </div>

      {/* Supplier Grid list */}
      {suppliers.length === 0 ? (
        <div className="bg-white p-12 text-center text-slate-400 border border-slate-200 rounded-2xl custom-shadow">
          <Building2 size={48} className="text-slate-200 mb-2 mx-auto" />
          <p className="font-semibold text-sm text-slate-600">No medical suppliers registered</p>
          <p className="text-xs mt-1">Add wholesale distributors to manage inventory replenishments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((sup) => (
            <div 
              key={sup.id} 
              className="bg-white p-5 rounded-2xl border border-slate-200 custom-shadow flex flex-col justify-between hover:shadow-md hover:border-emerald-500/50 transition-all text-xs space-y-4"
            >
              <div className="space-y-2">
                
                {/* Name */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/50">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 leading-tight">{sup.name}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Account opened: {new Date(sup.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Info block lines */}
                <div className="pt-2 space-y-2 text-slate-600">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    <span>Contact: <span className="font-semibold text-slate-700">{sup.contactPerson}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <a href={`mailto:${sup.email}`} className="hover:underline hover:text-emerald-600">{sup.email}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    <a href={`tel:${sup.phone}`} className="hover:underline hover:text-emerald-600">{sup.phone}</a>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    <span className="leading-relaxed text-slate-500">{sup.address}</span>
                  </div>
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleEditClick(sup)}
                  className="px-2.5 py-1.5 border border-slate-200 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer bg-white"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(sup.id, sup.name)}
                  className="px-2.5 py-1.5 border border-red-100 hover:bg-red-50 text-red-600 font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer bg-white"
                >
                  <Trash2 size={12} />
                  Remove
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Floating Add/Edit Supplier dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 custom-shadow border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <header className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {editingSupplier ? "Edit Distributor Account" : "Register Medical Supplier"}
              </h3>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </header>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Distributor Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Company / Distributor Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Building2 size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Wholesale Drugs Inc."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Contact Person */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Key Contact Representative</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="orders@wholesaledrugs.com"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Fulfillment Phone Line</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Phone size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1-555-0199"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">HQ / Warehouse Street Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400">
                    <MapPin size={14} />
                  </span>
                  <textarea
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="742 Evergreen Terrace, Springfield"
                    rows={2}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center shadow-xs"
                >
                  {formLoading ? "Saving..." : "Save Wholesaler"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
