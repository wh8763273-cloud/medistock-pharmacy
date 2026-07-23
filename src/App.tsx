import React, { useState, useEffect } from 'react';
import { 
  subscribeToAuth, 
  logoutUser, 
  getMedicines, 
  getSales, 
  getSuppliers,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  addSale,
  addSupplier,
  updateSupplier,
  deleteSupplier
} from './firebase';
import { Medicine, Sale, Supplier, UserProfile, SaleItem } from './types';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import MedicineManager from './components/MedicineManager';
import SalesInvoice from './components/SalesInvoice';
import Reports from './components/Reports';
import AIAssistant from './components/AIAssistant';
import SupplierManager from './components/SupplierManager';
import { 
  LayoutDashboard, 
  Layers, 
  ShoppingCart, 
  TrendingUp, 
  Bot, 
  Users, 
  LogOut, 
  Bell, 
  ShieldCheck, 
  Menu, 
  X,
  UserCheck
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // App States
  const [activeView, setActiveView] = useState<'dashboard' | 'inventory' | 'sales' | 'reports' | 'ai-assistant' | 'suppliers'>('dashboard');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Context flags for cross-page navigation
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isCreateSaleOpen, setIsCreateSaleOpen] = useState(false);
  const [currentMedicineContext, setCurrentMedicineContext] = useState<Medicine | null>(null);
  const [inventoryStockFilter, setInventoryStockFilter] = useState<'All' | 'Low' | 'Out' | 'Normal'>('All');
  const [inventoryExpiryFilter, setInventoryExpiryFilter] = useState<'All' | 'Expired' | 'Expiring' | 'Safe'>('All');

  // Mobile navigation drawer toggle
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Notification indicator state
  const [notifications, setNotifications] = useState<string[]>([
    "Low stock warning: Lisinopril 10mg has only 8 items left.",
    "Expiry audit warning: Metformin 850mg is expiring soon (August 10)."
  ]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = subscribeToAuth((profile) => {
      setUser(profile);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  // Fetch collections if logged in
  const loadDatabaseCollections = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [medsList, salesList, supsList] = await Promise.all([
        getMedicines(),
        getSales(),
        getSuppliers()
      ]);
      setMedicines(medsList);
      setSales(salesList);
      setSuppliers(supsList);
    } catch (err) {
      console.error("Error loading pharmacy records:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDatabaseCollections();
    }
  }, [user]);

  // Auth logout
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out from MediStock system?")) {
      try {
        await logoutUser();
        setActiveView('dashboard');
      } catch (err) {
        console.error("Error logging out", err);
      }
    }
  };

  // Wrapper functions to handle states after database mutations
  const handleAddMedicine = async (med: Omit<Medicine, "id" | "createdAt">) => {
    const newMed = await addMedicine(med);
    // Reload
    await loadDatabaseCollections();
    return newMed;
  };

  const handleUpdateMedicine = async (id: string, updates: Partial<Medicine>) => {
    await updateMedicine(id, updates);
    await loadDatabaseCollections();
  };

  const handleDeleteMedicine = async (id: string) => {
    await deleteMedicine(id);
    await loadDatabaseCollections();
  };

  const handleCreateSale = async (items: SaleItem[], subtotal: number, tax: number, total: number, customerName?: string) => {
    const saleResult = await addSale(items, subtotal, tax, total, customerName);
    await loadDatabaseCollections();
    return saleResult;
  };

  const handleAddSupplier = async (sup: Omit<Supplier, "id" | "createdAt">) => {
    const newSup = await addSupplier(sup);
    await loadDatabaseCollections();
    return newSup;
  };

  const handleUpdateSupplier = async (id: string, updates: Partial<Supplier>) => {
    await updateSupplier(id, updates);
    await loadDatabaseCollections();
  };

  const handleDeleteSupplier = async (id: string) => {
    await deleteSupplier(id);
    await loadDatabaseCollections();
  };

  // Pre-load Auth verification screen
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verifying Clinical Security credentials...</p>
        </div>
      </div>
    );
  }

  // Not Authenticated -> Show beautiful auth
  if (!user) {
    return <Auth onAuthSuccess={() => setActiveView('dashboard')} />;
  }

  // Sidebar list configurations
  const navItems = [
    { view: 'dashboard' as const, label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { view: 'inventory' as const, label: 'Medicine Stock', icon: <Layers size={18} /> },
    { view: 'sales' as const, label: 'POS Billing', icon: <ShoppingCart size={18} /> },
    { view: 'reports' as const, label: 'Audit Reports', icon: <TrendingUp size={18} /> },
    { view: 'ai-assistant' as const, label: 'AI Pharmacy Assistant', icon: <Bot size={18} /> },
    { view: 'suppliers' as const, label: 'Suppliers List', icon: <Users size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col md:flex-row relative">
      
      {/* TopAppBar header (Universal on Mobile & Desktop) */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-6 h-16 bg-white border-b border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Mobile drawer trigger */}
          <button 
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-1.5 hover:bg-slate-100 text-emerald-600 rounded-lg md:hidden outline-none cursor-pointer"
          >
            {mobileDrawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="p-1 bg-emerald-500 text-white rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800">MediStock AI</span>
          </div>

          <span className="hidden lg:inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[10px] font-bold">
            🏢 {user.pharmacyName}
          </span>
        </div>

        {/* Header Right menu */}
        <div className="flex items-center gap-4 relative">
          
          {/* Notification Button */}
          <button 
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition-all outline-none cursor-pointer"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full animate-ping"></span>
            )}
          </button>

          {/* Notifications Panel Popover */}
          {showNotificationPanel && (
            <div className="absolute right-12 top-12 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Pharmacy Alerts</span>
                <button 
                  onClick={() => setNotifications([])}
                  className="text-emerald-600 font-semibold text-[10px] hover:underline"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center py-4 text-slate-500">No current stock alerts.</p>
                ) : (
                  notifications.map((note, idx) => (
                    <div key={idx} className="flex gap-2 items-start bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-[#ba1a1a] shrink-0"></span>
                      <p className="text-slate-600 leading-relaxed">{note}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* User profile details block */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-emerald-500 border border-slate-200 overflow-hidden shadow-xs flex items-center justify-center text-white font-bold text-sm">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy6M1KYYFCco376psX2KQfRoniMg5q8keCmziXj0Za52cs3WLAkGskCQ7u2P91IUy4CBqYChwc_1X-NwfPqT6x50A3tJ4OToz5alZEXWW2je-XK86MnRASkziiq710XjtKGsVxxjq8dkIc76gDQs4TmpqfoI5duyLdRNC-QmhXjLk3EqFBjVD9ZseUo9KXyIPF9pH8hQwY-zFhDoE7WTzRBshi_6Q5-mOTXh5ZlHn5ZJJ_DSPQOyh4vD-o82e9sXAc7C3LPX0sGfY" 
                alt="Pharmacist" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block text-left text-xs">
              <p className="font-bold text-slate-800">{user.displayName}</p>
              <p className="text-[10px] text-slate-500">{user.email}</p>
            </div>
          </div>

        </div>
      </header>

      {/* Persistent Sidebar drawer (Visible on MD and larger) */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[260px] bg-white border-r border-slate-200 z-30 pt-20 pb-6 shadow-xs justify-between">
        <div className="px-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 pl-4">System Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = activeView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => {
                    setActiveView(item.view);
                    setIsAddFormOpen(false);
                    setIsCreateSaleOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active 
                      ? "sidebar-active text-emerald-700 font-bold" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-4 space-y-4">
          
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2 text-xs">
            <UserCheck size={16} className="text-emerald-600" />
            <div>
              <p className="font-semibold text-slate-800">MediStock Pro</p>
              <p className="text-[9px] text-slate-500">Compliance Stable v2.4</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-[#ba1a1a] hover:bg-[#ffdad6]/40 hover:text-[#93000a] transition-all cursor-pointer outline-none"
          >
            <LogOut size={16} />
            System Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setMobileDrawerOpen(false)}></div>
          <aside className="relative w-72 bg-white h-full flex flex-col justify-between p-6 z-50 border-r border-slate-200 animate-in slide-in-from-left duration-300">
            <div className="space-y-6">
              <header className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-emerald-500 text-white rounded-lg">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="font-bold text-sm text-slate-800">MediStock AI</span>
                </div>
                <button onClick={() => setMobileDrawerOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X size={18} />
                </button>
              </header>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const active = activeView === item.view;
                  return (
                    <button
                      key={item.view}
                      onClick={() => {
                        setActiveView(item.view);
                        setMobileDrawerOpen(false);
                        setIsAddFormOpen(false);
                        setIsCreateSaleOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                        active 
                          ? "bg-emerald-50 text-emerald-700" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <button 
              onClick={() => {
                setMobileDrawerOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-all outline-none"
            >
              <LogOut size={16} />
              System Logout
            </button>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow pt-24 pb-20 md:pb-8 md:pl-[284px] pr-6 pl-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          {loadingData && (
            <div className="fixed top-20 right-8 z-50 bg-emerald-500 text-white px-3 py-1.5 rounded-lg shadow-md text-[10px] font-semibold flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              Synchronizing Ledger...
            </div>
          )}

          {/* Router Views */}
          {activeView === 'dashboard' && (
            <Dashboard 
              medicines={medicines}
              sales={sales}
              onNavigate={setActiveView}
              onOpenAddMedicine={() => {
                setIsAddFormOpen(true);
                setInventoryStockFilter('All');
                setInventoryExpiryFilter('All');
                setActiveView('inventory');
              }}
              onOpenCreateSale={() => {
                setIsCreateSaleOpen(true);
                setActiveView('sales');
              }}
              onSelectMedicineContext={setCurrentMedicineContext}
              onFilterInventory={(stock, expiry) => {
                setInventoryStockFilter(stock);
                setInventoryExpiryFilter(expiry);
                setActiveView('inventory');
              }}
            />
          )}

          {activeView === 'inventory' && (
            <MedicineManager 
              medicines={medicines}
              onAddMedicine={handleAddMedicine}
              onUpdateMedicine={handleUpdateMedicine}
              onDeleteMedicine={handleDeleteMedicine}
              isAddFormOpenByDefault={isAddFormOpen}
              onCloseAddForm={() => setIsAddFormOpen(false)}
              onSelectMedicineContext={setCurrentMedicineContext}
              onOpenAssistant={() => setActiveView('ai-assistant')}
              initialStockFilter={inventoryStockFilter}
              initialExpiryFilter={inventoryExpiryFilter}
            />
          )}

          {activeView === 'sales' && (
            <SalesInvoice 
              medicines={medicines}
              sales={sales}
              onCreateSale={handleCreateSale}
              isCreateSaleOpenByDefault={isCreateSaleOpen}
              onCloseCreateSale={() => setIsCreateSaleOpen(false)}
            />
          )}

          {activeView === 'reports' && (
            <Reports 
              medicines={medicines}
              sales={sales}
              onNavigate={setActiveView}
            />
          )}

          {activeView === 'ai-assistant' && (
            <AIAssistant 
              currentMedicineContext={currentMedicineContext}
              onClearMedicineContext={() => setCurrentMedicineContext(null)}
            />
          )}

          {activeView === 'suppliers' && (
            <SupplierManager 
              suppliers={suppliers}
              onAddSupplier={handleAddSupplier}
              onUpdateSupplier={handleUpdateSupplier}
              onDeleteSupplier={handleDeleteSupplier}
            />
          )}

        </div>
      </main>

      {/* Bottom Navigation Bar for Mobile (Visible on screens < MD) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center py-2 bg-white border-t border-slate-200 shadow-lg">
        <button
          onClick={() => {
            setActiveView('dashboard');
            setIsAddFormOpen(false);
            setIsCreateSaleOpen(false);
          }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl ${
            activeView === 'dashboard' ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          <LayoutDashboard size={18} />
          <span className="text-[9px] font-semibold mt-0.5">Home</span>
        </button>
        
        <button
          onClick={() => {
            setActiveView('inventory');
            setIsAddFormOpen(false);
            setIsCreateSaleOpen(false);
          }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl ${
            activeView === 'inventory' ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          <Layers size={18} />
          <span className="text-[9px] font-semibold mt-0.5">Stock</span>
        </button>

        <button
          onClick={() => {
            setActiveView('sales');
            setIsAddFormOpen(false);
            setIsCreateSaleOpen(true);
          }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl ${
            activeView === 'sales' ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          <ShoppingCart size={18} />
          <span className="text-[9px] font-semibold mt-0.5">Sales</span>
        </button>

        <button
          onClick={() => {
            setActiveView('ai-assistant');
            setIsAddFormOpen(false);
            setIsCreateSaleOpen(false);
          }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl ${
            activeView === 'ai-assistant' ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          <Bot size={18} />
          <span className="text-[9px] font-semibold mt-0.5">AI Assist</span>
        </button>
      </nav>

    </div>
  );
}
