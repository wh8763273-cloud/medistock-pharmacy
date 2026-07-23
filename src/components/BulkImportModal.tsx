import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, Download, CheckCircle2, AlertTriangle, X, Sparkles, FileText, ArrowRight, Layers } from 'lucide-react';
import { Medicine } from '../types';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkImport: (newMedicines: Omit<Medicine, 'id'>[]) => Promise<void>;
}

export default function BulkImportModal({ isOpen, onClose, onBulkImport }: BulkImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  const [parsedData, setParsedData] = useState<Omit<Medicine, 'id'>[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  if (!isOpen) return null;

  // Auto-categorize helper based on drug name keywords
  const guessCategory = (name: string, genName: string = ''): string => {
    const text = (name + ' ' + genName).toLowerCase();
    if (text.includes('cillin') || text.includes('cef') || text.includes('mycin') || text.includes('mox') || text.includes('flox') || text.includes('cyclin')) {
      return 'Antibiotics';
    }
    if (text.includes('paracetamol') || text.includes('ibuprofen') || text.includes('aspirin') || text.includes('diclo') || text.includes('tramadol') || text.includes('analgesic') || text.includes('pain')) {
      return 'Pain Relievers';
    }
    if (text.includes('statin') || text.includes('sartan') || text.includes('olol') || text.includes('pril') || text.includes('card') || text.includes('press') || text.includes('amlodip')) {
      return 'Cardiac';
    }
    if (text.includes('salbutamol') || text.includes('montelukast') || text.includes('cough') || text.includes('cold') || text.includes('resp') || text.includes('asthma') || text.includes('inhaler')) {
      return 'Respiratory';
    }
    if (text.includes('omeprazol') || text.includes('antacid') || text.includes('gastro') || text.includes('pantoprazol') || text.includes('ranitidin')) {
      return 'Gastrointestinal';
    }
    if (text.includes('vitamin') || text.includes('multivitamin') || text.includes('calcium') || text.includes('zinc') || text.includes('b-complex')) {
      return 'Vitamins & Supplements';
    }
    if (text.includes('cream') || text.includes('ointment') || text.includes('gel') || text.includes('derm') || text.includes('skin')) {
      return 'Dermatology';
    }
    return 'General Medicine';
  };

  // Helper to parse CSV string into key-value objects
  const parseCSV = (text: string): Omit<Medicine, 'id'>[] => {
    const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      throw new Error("File appears to be empty or missing header rows.");
    }

    // Header mapping
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());

    const findIndex = (possibleKeys: string[]): number => {
      return headers.findIndex(h => possibleKeys.some(k => h.includes(k)));
    };

    const nameIdx = findIndex(['name', 'drug', 'item', 'medicine', 'title']);
    const genericIdx = findIndex(['generic', 'formula', 'salt', 'chemical']);
    const brandIdx = findIndex(['brand', 'company', 'make', 'label']);
    const categoryIdx = findIndex(['category', 'group', 'type', 'class']);
    const batchIdx = findIndex(['batch', 'lot', 'serial', 'code']);
    const mfgIdx = findIndex(['manufacturer', 'maker', 'supplier', 'vendor']);
    const qtyIdx = findIndex(['quantity', 'qty', 'stock', 'count', 'units']);
    const costIdx = findIndex(['purchase', 'cost', 'buy', 'unit_cost', 'cost_price']);
    const sellIdx = findIndex(['sell', 'selling', 'price', 'rate', 'unit_price', 'mrp']);
    const expiryIdx = findIndex(['expiry', 'exp', 'expire', 'exp_date', 'valid_till']);

    if (nameIdx === -1) {
      throw new Error("Could not find a 'Name' or 'Medicine' column in the uploaded file header.");
    }

    const items: Omit<Medicine, 'id'>[] = [];
    const today = new Date();
    const defaultExpiry = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString().split('T')[0];

    for (let i = 1; i < lines.length; i++) {
      // Basic CSV split considering quotes
      const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
      const cleanRow = row.map(cell => cell.trim().replace(/^["']|["']$/g, ''));

      const nameVal = cleanRow[nameIdx] || '';
      if (!nameVal) continue; // Skip blank rows

      const genericVal = genericIdx !== -1 && cleanRow[genericIdx] ? cleanRow[genericIdx] : nameVal;
      const brandVal = brandIdx !== -1 && cleanRow[brandIdx] ? cleanRow[brandIdx] : 'Generic Pharma';
      let catVal = categoryIdx !== -1 && cleanRow[categoryIdx] ? cleanRow[categoryIdx] : '';
      if (!catVal || catVal.toLowerCase() === 'general') {
        catVal = guessCategory(nameVal, genericVal);
      }

      const batchVal = batchIdx !== -1 && cleanRow[batchIdx] ? cleanRow[batchIdx] : `BATCH-${Math.floor(100000 + Math.random() * 900000)}`;
      const mfgVal = mfgIdx !== -1 && cleanRow[mfgIdx] ? cleanRow[mfgIdx] : 'MediLabs International';

      const qtyVal = qtyIdx !== -1 ? parseInt(cleanRow[qtyIdx]) || 100 : 100;
      const costVal = costIdx !== -1 ? parseFloat(cleanRow[costIdx].replace(/[^0-9.]/g, '')) || 5.0 : 5.0;
      const sellVal = sellIdx !== -1 ? parseFloat(cleanRow[sellIdx].replace(/[^0-9.]/g, '')) || (costVal * 1.35) : (costVal * 1.35);

      let expVal = expiryIdx !== -1 && cleanRow[expiryIdx] ? cleanRow[expiryIdx] : defaultExpiry;
      // Sanitize expiry date format
      if (!expVal.match(/^\d{4}-\d{2}-\d{2}$/)) {
        expVal = defaultExpiry;
      }

      items.push({
        name: nameVal,
        genericName: genericVal,
        brand: brandVal,
        category: catVal,
        batchNumber: batchVal,
        manufacturer: mfgVal,
        quantity: qtyVal,
        purchasePrice: Number(costVal.toFixed(2)),
        sellingPrice: Number(sellVal.toFixed(2)),
        expiryDate: expVal,
        createdAt: new Date().toISOString()
      });
    }

    return items;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let items: Omit<Medicine, 'id'>[] = [];

        if (file.name.endsWith('.json')) {
          const jsonRaw = JSON.parse(text);
          const list = Array.isArray(jsonRaw) ? jsonRaw : (jsonRaw.medicines || jsonRaw.data || []);
          items = list.map((item: any) => ({
            name: item.name || item.drugName || 'Unnamed Medicine',
            genericName: item.genericName || item.name || '',
            brand: item.brand || 'Pharma',
            category: item.category || guessCategory(item.name || ''),
            batchNumber: item.batchNumber || `BATCH-${Math.floor(100000 + Math.random() * 900000)}`,
            manufacturer: item.manufacturer || 'MediLabs',
            quantity: Number(item.quantity || item.qty || 50),
            purchasePrice: Number(item.purchasePrice || item.cost || 5.0),
            sellingPrice: Number(item.sellingPrice || item.price || 8.0),
            expiryDate: item.expiryDate || new Date(Date.now() + 365*86400000).toISOString().split('T')[0],
            createdAt: item.createdAt || new Date().toISOString()
          }));
        } else {
          // CSV / Plain text file
          items = parseCSV(text);
        }

        if (items.length === 0) {
          throw new Error("No valid medicine rows found in file.");
        }

        setParsedData(items);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to process file format.");
        setParsedData([]);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setErrorMsg("Error reading file.");
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    if (parsedData.length === 0) return;
    setIsProcessing(true);
    try {
      await onBulkImport(parsedData);
      setImportedCount(parsedData.length);
      setImportSuccess(true);
    } catch (err: any) {
      setErrorMsg("Failed to import medicines to database.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Download Sample CSV template for user
  const downloadSampleCSV = () => {
    const csvHeader = "Name,Generic Name,Brand,Category,Batch Number,Manufacturer,Quantity,Purchase Price,Selling Price,Expiry Date\n";
    const csvRows = [
      "Amoxicillin 500mg,Amoxicillin,GlaxoSmithKline,Antibiotics,BN-90812,GSK Pharma,250,180.00,280.00,2027-08-15",
      "Azithromycin 250mg,Azithromycin,Pfizer,Antibiotics,BN-44321,Pfizer Ltd,120,350.00,520.00,2026-11-20",
      "Paracetamol 500mg,Acetaminophen,Panadol,Pain Relievers,BN-11204,GSK Consumer,500,20.00,40.00,2028-02-10",
      "Omeprazole 20mg,Omeprazole,Prilosec,Gastrointestinal,BN-77821,AstraZeneca,180,110.00,210.00,2027-01-30",
      "Metformin 800mg,Metformin HCl,Glucophage,Diabetic Care,BN-33910,Merck,300,80.00,150.00,2027-05-18",
      "Atorvastatin 10mg,Atorvastatin,Lipitor,Cardiac,BN-66541,Pfizer Inc,150,250.00,420.00,2026-12-05",
      "Salbutamol Inhaler 100mcg,Albuterol,Ventolin,Respiratory,BN-88210,GSK Respiratory,80,650.00,980.00,2027-09-25",
      "Vitamin C 1000mg,Ascorbic Acid,Cebion,Vitamins & Supplements,BN-22190,Procter & Gamble,400,90.00,180.00,2028-06-30"
    ].join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "medistock_sample_stock_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset modal state
  const handleResetModal = () => {
    setFileName('');
    setParsedData([]);
    setErrorMsg(null);
    setImportSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <UploadCloud size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Bulk Stock Inventory Import</h2>
              <p className="text-xs text-slate-300">Upload CSV, Excel, or JSON files to auto-add medicines to stock.</p>
            </div>
          </div>
          <button 
            onClick={() => { handleResetModal(); onClose(); }}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {importSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Bulk Stock Import Complete!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Successfully imported <span className="font-bold text-emerald-600">{importedCount} drug records</span> into your inventory. All categories, batch codes, and expiry dates have been updated.
                </p>
              </div>
              <button
                onClick={() => { handleResetModal(); onClose(); }}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <span>Done & View Inventory</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <>
              {/* File Upload Zone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50 hover:bg-emerald-50/30 transition-all group relative cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <FileSpreadsheet size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      {fileName ? fileName : 'Click or Drag & Drop Stock File Here'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Supports <span className="font-semibold text-slate-600">CSV, Excel (.csv), or JSON</span> drug files
                    </p>
                  </div>
                </div>
              </div>

              {/* Sample Template Download Box */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-amber-800">
                  <Sparkles size={18} className="text-amber-600 shrink-0" />
                  <span>Don't have a file ready? Download our sample CSV template to fill your stock data.</span>
                </div>
                <button
                  type="button"
                  onClick={downloadSampleCSV}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Download size={14} />
                  <span>Download Sample CSV</span>
                </button>
              </div>

              {/* Error Message if any */}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Data Preview Table */}
              {parsedData.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-emerald-600" />
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Parsed Stock Preview ({parsedData.length} Medicines Found)
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Total Units: {parsedData.reduce((acc, curr) => acc + curr.quantity, 0)} Units
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 font-semibold sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Medicine & Generic</th>
                          <th className="p-2.5">Category</th>
                          <th className="p-2.5">Batch</th>
                          <th className="p-2.5 text-right">Qty</th>
                          <th className="p-2.5 text-right">Cost</th>
                          <th className="p-2.5 text-right">Selling</th>
                          <th className="p-2.5">Expiry Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {parsedData.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5">
                              <p className="font-bold text-slate-800">{item.name}</p>
                              <p className="text-[10px] text-slate-400">{item.genericName} • {item.brand}</p>
                            </td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                                {item.category}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-500 font-mono text-[10px]">{item.batchNumber}</td>
                            <td className="p-2.5 text-right font-bold text-slate-800">{item.quantity}</td>
                            <td className="p-2.5 text-right text-slate-600">Rs. {item.purchasePrice.toFixed(2)}</td>
                            <td className="p-2.5 text-right font-bold text-emerald-600">Rs. {item.sellingPrice.toFixed(2)}</td>
                            <td className="p-2.5 text-slate-600 text-[11px]">{item.expiryDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Footer */}
        {!importSuccess && (
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => { handleResetModal(); onClose(); }}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmImport}
              disabled={parsedData.length === 0 || isProcessing}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-2"
            >
              {isProcessing ? (
                <span>Importing Stock Data...</span>
              ) : (
                <>
                  <UploadCloud size={16} />
                  <span>Import {parsedData.length > 0 ? `${parsedData.length} Medicines` : 'Stock File'}</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
