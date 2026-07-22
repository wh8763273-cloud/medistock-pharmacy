export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  category: string;
  batchNumber: string;
  manufacturer: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  expiryDate: string; // YYYY-MM-DD
  createdAt: string;
}

export interface SaleItem {
  medicineId: string;
  name: string;
  genericName?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  customerName?: string;
  createdAt: string; // ISO String
  pharmacistId: string;
  pharmacistName: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  pharmacyName: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
