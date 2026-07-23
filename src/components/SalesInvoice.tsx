import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  FileText, 
  Search, 
  ShoppingCart, 
  User, 
  Calendar, 
  CheckCircle,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  Printer
} from 'lucide-react';
import { Medicine, Sale, SaleItem } from '../types';

interface SalesInvoiceProps {
  medicines: Medicine[];
  sales: Sale[];
  onCreateSale: (items: SaleItem[], subtotal: number, tax: number, total: number, customerName?: string) => Promise<Sale>;
  isCreateSaleOpenByDefault: boolean;
  onCloseCreateSale: () => void;
}

export default function SalesInvoice({ 
  medicines, 
  sales, 
  onCreateSale,
  isCreateSaleOpenByDefault,
  onCloseCreateSale
}: SalesInvoiceProps) {
  
  const [activeTab, setActiveTab] = useState<'checkout' | 'history'>(isCreateSaleOpenByDefault ? 'checkout' : 'history');
  
  // Checkout Cart States
  const [customerName, setCustomerName] = useState('');
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [searchDrugQuery, setSearchDrugQuery] = useState('');
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [recentInvoice, setRecentInvoice] = useState<Sale | null>(null);

  // Sync state if clicked from dashboard
  React.useEffect(() => {
    if (isCreateSaleOpenByDefault) {
      setActiveTab('checkout');
    }
  }, [isCreateSaleOpenByDefault]);

  // Drug inventory filter for speedy search on POS
  const filteredPOSMedicines = useMemo(() => {
    if (!searchDrugQuery) return [];
    return medicines.filter(m => {
      const q = searchDrugQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.batchNumber.toLowerCase().includes(q)
      );
    }).slice(0, 5); // Limit list to top 5 results for sleek UI
  }, [medicines, searchDrugQuery]);

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.total, 0);
  }, [cartItems]);

  const tax = useMemo(() => {
    return subtotal * 0.08; // 8% pharmaceutical sales tax
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + tax;
  }, [subtotal, tax]);

  const addToCart = (med: Medicine) => {
    if (med.quantity <= 0) {
      alert(`Error: ${med.name} is currently out of stock.`);
      return;
    }

    const existingIndex = cartItems.findIndex(item => item.medicineId === med.id);
    if (existingIndex !== -1) {
      const currentQty = cartItems[existingIndex].quantity;
      if (currentQty >= med.quantity) {
        alert(`Cannot add more. Only ${med.quantity} units are in stock.`);
        return;
      }
      
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].total = updated[existingIndex].quantity * updated[existingIndex].price;
      setCartItems(updated);
    } else {
      const newItem: SaleItem = {
        medicineId: med.id,
        name: med.name,
        genericName: med.genericName,
        quantity: 1,
        price: med.sellingPrice,
        total: med.sellingPrice
      };
      setCartItems([...cartItems, newItem]);
    }
    setSearchDrugQuery(''); // Clear search
  };

  const updateCartQty = (medicineId: string, delta: number) => {
    const med = medicines.find(m => m.id === medicineId);
    if (!med) return;

    const existingIndex = cartItems.findIndex(item => item.medicineId === medicineId);
    if (existingIndex === -1) return;

    const updated = [...cartItems];
    const newQty = updated[existingIndex].quantity + delta;

    if (newQty <= 0) {
      // Remove item
      setCartItems(updated.filter(item => item.medicineId !== medicineId));
      return;
    }

    if (newQty > med.quantity) {
      alert(`Cannot exceed stock capacity. Max available is ${med.quantity} units.`);
      return;
    }

    updated[existingIndex].quantity = newQty;
    updated[existingIndex].total = newQty * updated[existingIndex].price;
    setCartItems(updated);
  };

  const removeCartItem = (medicineId: string) => {
    setCartItems(cartItems.filter(item => item.medicineId !== medicineId));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your invoice cart is empty.");
      return;
    }

    setLoadingCheckout(true);
    try {
      const completedSale = await onCreateSale(
        cartItems,
        subtotal,
        tax,
        total,
        customerName || "General Walk-in Patient"
      );
      setRecentInvoice(completedSale);
      // Reset checkout states
      setCartItems([]);
      setCustomerName('');
    } catch (err) {
      alert("Checkout failed. Please review stock items.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">POS Billing & Sales</h1>
          <p className="text-xs text-slate-500">Draft invoices, compile items, apply healthcare taxes, and complete sales transactions instantly.</p>
        </div>
        
        {/* Toggle navigation bar */}
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 self-start">
          <button
            onClick={() => {
              setActiveTab('checkout');
              setRecentInvoice(null);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'checkout' ? "bg-slate-800 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Create Invoice
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              onCloseCreateSale();
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history' ? "bg-slate-800 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Sales Ledger / History
          </button>
        </div>
      </div>

      {activeTab === 'checkout' ? (
        recentInvoice ? (
          /* Receipt Display Screen after transaction */
          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl custom-shadow p-6 space-y-6 text-xs animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-1 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Transaction Complete</h3>
              <p className="text-[11px] text-slate-400">Invoice generated successfully</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Invoice Number:</span>
                <span className="font-bold text-slate-800">{recentInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="text-slate-800">
                  {new Date(recentInvoice.createdAt).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer / Patient:</span>
                <span className="text-slate-800 font-medium">{recentInvoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dispensed By:</span>
                <span className="text-slate-800">{recentInvoice.pharmacistName}</span>
              </div>
            </div>

            {/* List items sold */}
            <div className="border-t border-b border-slate-100 py-3 space-y-2">
              <p className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">Dispensed Medicines</p>
              {recentInvoice.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-[11px]">
                  <div>
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.quantity} units x Rs. {item.price.toFixed(2)}</p>
                  </div>
                  <span className="font-bold text-slate-800">Rs. {item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Total prices */}
            <div className="space-y-1.5 pt-1 text-right">
              <div className="flex justify-between text-right text-slate-400">
                <span>Subtotal:</span>
                <span>Rs. {recentInvoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-right text-slate-400">
                <span>Taxes (8% Rx-sales):</span>
                <span>Rs. {recentInvoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-right text-sm font-bold text-emerald-700 border-t border-slate-100 pt-2">
                <span>Grand Total Amount Paid:</span>
                <span>Rs. {recentInvoice.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions for receipt screen */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1 hover:bg-slate-200 transition-all cursor-pointer"
              >
                <Printer size={14} />
                Print Receipt
              </button>
              <button
                onClick={() => setRecentInvoice(null)}
                className="py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all cursor-pointer"
              >
                New Checkout
              </button>
            </div>
          </div>
        ) : (
          /* Split checkout design */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left side: Invoice Compiler Card (POS basket) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 custom-shadow overflow-hidden flex flex-col justify-between">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <ShoppingCart size={16} className="text-emerald-500" />
                  Active Invoice Basket
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">
                  {cartItems.length} Products
                </span>
              </div>

              <div className="p-5 space-y-4">
                
                {/* Patient/Customer Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer / Patient Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <User size={14} />
                    </span>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Walk-in Patient (or select name)"
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Cart list items */}
                <div className="space-y-2 min-h-[160px] max-h-[300px] overflow-y-auto">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                      <ShoppingCart size={32} className="text-slate-300 mb-2" />
                      <p className="font-semibold text-xs text-slate-600">Checkout cart is empty</p>
                      <p className="text-[10px] mt-0.5">Search or select medicines on the right panel to append items.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {cartItems.map((item) => (
                        <div key={item.medicineId} className="py-3 flex justify-between items-center gap-3">
                          <div className="flex-grow">
                            <p className="font-bold text-slate-800 text-xs">{item.name}</p>
                            <p className="text-[10px] text-slate-400 italic">{item.genericName}</p>
                            <p className="text-emerald-600 font-semibold text-[10px] mt-0.5">Rs. {item.price.toFixed(2)} / unit</p>
                          </div>

                          {/* Interactive Quantity Stepper */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.medicineId, -1)}
                              className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center hover:bg-slate-200 transition-all cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-bold text-slate-800 text-xs w-6 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.medicineId, 1)}
                              className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center hover:bg-slate-200 transition-all cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-bold text-slate-800 text-xs w-16 text-right">Rs. {item.total.toFixed(2)}</span>

                          <button
                            type="button"
                            onClick={() => removeCartItem(item.medicineId)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title="Remove drug"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtotal & taxes breakdown */}
                <div className="pt-4 border-t border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Rx Sales Tax (8.0%)</span>
                    <span>Rs. {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold text-sm pt-2 border-t border-slate-100">
                    <span>Grand Total</span>
                    <span>Rs. {total.toFixed(2)}</span>
                  </div>
                </div>

              </div>

              {/* Submit Checkout Button */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCheckoutSubmit}
                  disabled={loadingCheckout || cartItems.length === 0}
                  className="w-full py-3 bg-emerald-500 text-white font-bold text-xs rounded-xl hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {loadingCheckout ? "Processing Transaction..." : "Confirm & Dispatch Medicines"}
                </button>
              </div>
            </div>

            {/* Right side: Quick Search Drug Box */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 custom-shadow p-5 space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800">Inventory Quick Addition</h3>
                <p className="text-[10px] text-slate-400">Search drug registry to append items to cart</p>
              </div>

              {/* Search Drug Input */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  value={searchDrugQuery}
                  onChange={(e) => setSearchDrugQuery(e.target.value)}
                  placeholder="Type drug name or brand..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Results dropdown or suggestions */}
              <div className="space-y-2">
                {searchDrugQuery ? (
                  filteredPOSMedicines.length === 0 ? (
                    <p className="text-center py-4 text-slate-400 text-[10px]">No medicine matching your term</p>
                  ) : (
                    <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                      {filteredPOSMedicines.map((med) => (
                        <div 
                          key={med.id} 
                          onClick={() => addToCart(med)}
                          className="p-3 bg-slate-50 hover:bg-emerald-50/50 cursor-pointer transition-colors flex justify-between items-center gap-2"
                        >
                          <div>
                            <p className="font-bold text-slate-800 text-[11px]">{med.name} ({med.brand})</p>
                            <p className="text-[9px] text-slate-400 italic">{med.genericName}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">Stock capacity: <span className={med.quantity <= 15 ? "text-amber-600 font-bold" : "font-medium"}>{med.quantity} units</span></p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-emerald-600 text-[11px]">Rs. {med.sellingPrice.toFixed(2)}</span>
                            <div className="text-[9px] text-emerald-600 font-bold mt-1 flex items-center justify-end gap-0.5">
                              Add <Plus size={10} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  /* Display top default/popular drugs for easy clicking */
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Frequently Dispensed</p>
                    <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                      {medicines.slice(0, 4).map((med) => (
                        <div
                          key={med.id}
                          onClick={() => addToCart(med)}
                          className="flex justify-between items-center p-2.5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 rounded-xl cursor-pointer transition-colors"
                        >
                          <div className="flex-grow">
                            <p className="font-bold text-slate-800 text-[11px]">{med.name}</p>
                            <p className="text-[9px] text-slate-400">{med.category} • {med.quantity} available</p>
                          </div>
                          <span className="font-bold text-emerald-600 text-xs">Rs. {med.sellingPrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        )
      ) : (
        /* History Tab list */
        <div className="bg-white rounded-2xl border border-slate-200 custom-shadow overflow-hidden animate-in fade-in duration-200">
          <div className="overflow-x-auto">
            {sales.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400 text-center">
                <FileSpreadsheet size={48} className="text-slate-300 mb-2" />
                <p className="font-semibold text-sm text-slate-700">No sales invoices found</p>
                <p className="text-xs mt-1">Dispense drugs to create invoice history logs.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Invoice No</th>
                    <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Customer / Patient</th>
                    <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Medicines Dispensed</th>
                    <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Tax (8%)</th>
                    <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Grand Total</th>
                    <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Dispensed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-emerald-600 text-sm">
                        {sale.invoiceNumber}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{sale.customerName}</p>
                        <p className="text-[10px] text-slate-400">Dispenser: {sale.pharmacistName}</p>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {sale.items.map((item, index) => (
                            <p key={index} className="text-slate-600 font-medium">
                              • {item.name} <span className="text-slate-400">({item.quantity} units)</span>
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-400">
                        Rs. {sale.tax.toFixed(2)}
                      </td>
                      <td className="p-4 font-bold text-emerald-700 text-sm">
                        Rs. {sale.total.toFixed(2)}
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(sale.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
