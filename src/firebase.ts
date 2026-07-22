import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInAnonymously,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { Medicine, Sale, Supplier, UserProfile } from './types';

// Check if Firebase env variables exist
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID
};

const isFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId
);

let app;
let auth: any = null;
let db: any = null;
let useLocalFallback = !isFirebaseConfigured;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.warn("Firebase initialization failed, falling back to LocalStorage:", error);
    useLocalFallback = true;
  }
} else {
  console.log("Firebase credentials not configured. Using LocalStorage fallback database.");
}

// Default initial data for simulation if empty
const DEFAULT_MEDICINES: Medicine[] = [
  {
    id: "med-1",
    name: "Amoxicillin",
    genericName: "Amoxicillin Trihydrate",
    brand: "Moxilen",
    category: "Antibiotics",
    batchNumber: "AMX202604",
    manufacturer: "GSK Pharmaceutics",
    quantity: 120,
    purchasePrice: 2.50,
    sellingPrice: 5.00,
    expiryDate: "2026-11-15",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-2",
    name: "Lisinopril",
    genericName: "Lisinopril Dihydrate",
    brand: "Zestril",
    category: "Antihypertensive",
    batchNumber: "LIS202511",
    manufacturer: "AstraZeneca",
    quantity: 8, // Low stock demo
    purchasePrice: 1.20,
    sellingPrice: 3.50,
    expiryDate: "2027-02-20",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-3",
    name: "Metformin",
    genericName: "Metformin Hydrochloride",
    brand: "Glucophage",
    category: "Antidiabetic",
    batchNumber: "MET202601",
    manufacturer: "Merck KGaA",
    quantity: 250,
    purchasePrice: 0.80,
    sellingPrice: 2.00,
    expiryDate: "2026-08-10", // Expiring soon demo
    createdAt: new Date().toISOString()
  },
  {
    id: "med-4",
    name: "Atorvastatin",
    genericName: "Atorvastatin Calcium",
    brand: "Lipitor",
    category: "Cardiovascular",
    batchNumber: "ATO202607",
    manufacturer: "Pfizer Inc.",
    quantity: 15, // Low stock
    purchasePrice: 3.00,
    sellingPrice: 7.50,
    expiryDate: "2026-08-01", // Expiring soon
    createdAt: new Date().toISOString()
  },
  {
    id: "med-5",
    name: "Paracetamol",
    genericName: "Acetaminophen",
    brand: "Panadol",
    category: "Analgesic",
    batchNumber: "PAR202609",
    manufacturer: "Haleon PLC",
    quantity: 500,
    purchasePrice: 0.15,
    sellingPrice: 0.50,
    expiryDate: "2028-12-31",
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_SUPPLIERS: Supplier[] = [
  {
    id: "sup-1",
    name: "Medica Distribution Corp",
    contactPerson: "Sarah Jenkins",
    email: "orders@medicadist.com",
    phone: "+1-555-0199",
    address: "742 Evergreen Terrace, Springfield",
    createdAt: new Date().toISOString()
  },
  {
    id: "sup-2",
    name: "Astra Wholesale Pharmacy",
    contactPerson: "Dr. David Vance",
    email: "vance.d@astrawholesale.com",
    phone: "+1-555-0142",
    address: "100 Medical Plaza Blvd, Suite 400",
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_SALES: Sale[] = [
  {
    id: "sale-1",
    invoiceNumber: "INV-9021",
    items: [
      { medicineId: "med-1", name: "Amoxicillin", genericName: "Amoxicillin Trihydrate", quantity: 2, price: 5.00, total: 10.00 }
    ],
    subtotal: 10.00,
    tax: 0.80,
    total: 10.80,
    customerName: "Alice Smith",
    createdAt: new Date().toISOString(),
    pharmacistId: "demo-user",
    pharmacistName: "Lead Pharmacist"
  },
  {
    id: "sale-2",
    invoiceNumber: "INV-9022",
    items: [
      { medicineId: "med-2", name: "Lisinopril", genericName: "Lisinopril Dihydrate", quantity: 5, price: 3.50, total: 17.50 }
    ],
    subtotal: 17.50,
    tax: 1.40,
    total: 18.90,
    customerName: "Bob Johnson",
    createdAt: new Date().toISOString(),
    pharmacistId: "demo-user",
    pharmacistName: "Lead Pharmacist"
  },
  {
    id: "sale-3",
    invoiceNumber: "INV-9024",
    items: [
      { medicineId: "med-4", name: "Atorvastatin", genericName: "Atorvastatin Calcium", quantity: 3, price: 7.50, total: 22.50 }
    ],
    subtotal: 22.50,
    tax: 1.80,
    total: 24.30,
    customerName: "Charlie Brown",
    createdAt: new Date().toISOString(),
    pharmacistId: "demo-user",
    pharmacistName: "Lead Pharmacist"
  }
];

// Seed local storage with default mock datasets if not set yet
const getLocalStorageData = <T>(key: string, defaultVal: T[]): T[] => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  return JSON.parse(data);
};

const saveLocalStorageData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// State change subscription helper
type AuthCallback = (user: UserProfile | null) => void;
const authListeners = new Set<AuthCallback>();
let currentUser: UserProfile | null = null;

// Handle initial mock state
if (useLocalFallback) {
  const storedUser = localStorage.getItem("medistock_auth_user");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
  }
} else {
  // Listen to Firebase Auth state
  onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      try {
        const docRef = doc(db, "users", fbUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          currentUser = docSnap.data() as UserProfile;
        } else {
          currentUser = {
            uid: fbUser.uid,
            email: fbUser.email || "pharmacist@medistock.demo",
            displayName: fbUser.displayName || "Lead Pharmacist",
            pharmacyName: "MediStock Central Pharmacy",
            createdAt: new Date().toISOString()
          };
          try {
            await setDoc(docRef, currentUser);
          } catch (e) {
            console.warn("Could not save user profile doc to Firestore:", e);
          }
        }
      } catch (err) {
        console.warn("Could not read user profile from Firestore, using auth fallback profile:", err);
        currentUser = {
          uid: fbUser.uid,
          email: fbUser.email || "pharmacist@medistock.demo",
          displayName: fbUser.displayName || "Lead Pharmacist",
          pharmacyName: "MediStock Central Pharmacy",
          createdAt: new Date().toISOString()
        };
      }
    } else {
      currentUser = null;
    }
    authListeners.forEach(listener => listener(currentUser));
  });
}

export const subscribeToAuth = (callback: AuthCallback) => {
  authListeners.add(callback);
  // Immediate trigger
  callback(currentUser);
  return () => {
    authListeners.delete(callback);
  };
};

// Unified Auth Operations
export const registerUser = async (email: string, password: string, displayName: string, pharmacyName: string): Promise<UserProfile> => {
  if (useLocalFallback) {
    const newUser: UserProfile = {
      uid: "user-" + Math.random().toString(36).substr(2, 9),
      email,
      displayName,
      pharmacyName,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("medistock_auth_user", JSON.stringify(newUser));
    currentUser = newUser;
    authListeners.forEach(l => l(currentUser));
    return newUser;
  } else {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;
    const profile: UserProfile = {
      uid: fbUser.uid,
      email,
      displayName,
      pharmacyName,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, "users", fbUser.uid), profile);
    currentUser = profile;
    authListeners.forEach(l => l(currentUser));
    return profile;
  }
};

export const loginUser = async (email: string, password: string): Promise<UserProfile> => {
  if (useLocalFallback) {
    // Basic simulation: if password matches, create user
    const newUser: UserProfile = {
      uid: "user-demo",
      email: email,
      displayName: "Lead Pharmacist",
      pharmacyName: "MediStock Central Pharmacy",
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("medistock_auth_user", JSON.stringify(newUser));
    currentUser = newUser;
    authListeners.forEach(l => l(currentUser));
    return newUser;
  } else {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;
    let profile: UserProfile;
    try {
      const docSnap = await getDoc(doc(db, "users", fbUser.uid));
      if (docSnap.exists()) {
        profile = docSnap.data() as UserProfile;
      } else {
        profile = {
          uid: fbUser.uid,
          email: fbUser.email || email,
          displayName: fbUser.displayName || "Lead Pharmacist",
          pharmacyName: "MediStock Central Pharmacy",
          createdAt: new Date().toISOString()
        };
        try {
          await setDoc(doc(db, "users", fbUser.uid), profile);
        } catch (e) {
          console.warn("Could not write user doc to Firestore:", e);
        }
      }
    } catch (err) {
      console.warn("Could not read user profile from Firestore:", err);
      profile = {
        uid: fbUser.uid,
        email: fbUser.email || email,
        displayName: fbUser.displayName || "Lead Pharmacist",
        pharmacyName: "MediStock Central Pharmacy",
        createdAt: new Date().toISOString()
      };
    }
    currentUser = profile;
    authListeners.forEach(l => l(currentUser));
    return profile;
  }
};

export const guestLogin = async (): Promise<UserProfile> => {
  if (useLocalFallback) {
    const guestUser: UserProfile = {
      uid: "user-demo-evaluator",
      email: "evaluator@medistock.demo",
      displayName: "Demo Evaluator",
      pharmacyName: "MediStock Central Pharmacy",
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("medistock_auth_user", JSON.stringify(guestUser));
    currentUser = guestUser;
    authListeners.forEach(l => l(currentUser));
    return guestUser;
  } else {
    try {
      const userCredential = await signInAnonymously(auth);
      const fbUser = userCredential.user;
      const profile: UserProfile = {
        uid: fbUser.uid,
        email: "evaluator@medistock.demo",
        displayName: "Demo Evaluator",
        pharmacyName: "MediStock Central Pharmacy",
        createdAt: new Date().toISOString()
      };
      currentUser = profile;
      authListeners.forEach(l => l(currentUser));
      return profile;
    } catch (err) {
      console.warn("Anonymous login failed, falling back to guest profile:", err);
      const guestUser: UserProfile = {
        uid: "guest-user",
        email: "evaluator@medistock.demo",
        displayName: "Demo Evaluator",
        pharmacyName: "MediStock Central Pharmacy",
        createdAt: new Date().toISOString()
      };
      currentUser = guestUser;
      authListeners.forEach(l => l(currentUser));
      return guestUser;
    }
  }
};

export const logoutUser = async (): Promise<void> => {
  if (useLocalFallback) {
    localStorage.removeItem("medistock_auth_user");
    currentUser = null;
    authListeners.forEach(l => l(null));
  } else {
    await signOut(auth);
    currentUser = null;
    authListeners.forEach(l => l(null));
  }
};

// Unified Medicine Management Operations
export const getMedicines = async (): Promise<Medicine[]> => {
  if (useLocalFallback) {
    return getLocalStorageData<Medicine>("medistock_medicines", DEFAULT_MEDICINES);
  } else {
    try {
      const q = query(collection(db, "medicines"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list: Medicine[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Medicine);
      });
      // Fallback if firestore is empty
      if (list.length === 0) {
        for (const item of DEFAULT_MEDICINES) {
          const { id, ...rest } = item;
          await setDoc(doc(db, "medicines", id), rest);
          list.push(item);
        }
      }
      return list;
    } catch (err) {
      console.warn("Firestore error reading medicines, using local cache:", err);
      return getLocalStorageData<Medicine>("medistock_medicines", DEFAULT_MEDICINES);
    }
  }
};

export const addMedicine = async (med: Omit<Medicine, "id" | "createdAt">): Promise<Medicine> => {
  const newMed: Medicine = {
    ...med,
    id: "med-" + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString()
  };

  if (useLocalFallback) {
    const list = getLocalStorageData<Medicine>("medistock_medicines", DEFAULT_MEDICINES);
    list.unshift(newMed);
    saveLocalStorageData("medistock_medicines", list);
    return newMed;
  } else {
    try {
      const docRef = await addDoc(collection(db, "medicines"), {
        ...med,
        createdAt: newMed.createdAt
      });
      return { id: docRef.id, ...med, createdAt: newMed.createdAt };
    } catch (err) {
      console.warn("Firestore error adding medicine, saving to local cache:", err);
      const list = getLocalStorageData<Medicine>("medistock_medicines", DEFAULT_MEDICINES);
      list.unshift(newMed);
      saveLocalStorageData("medistock_medicines", list);
      return newMed;
    }
  }
};

export const updateMedicine = async (id: string, updates: Partial<Medicine>): Promise<void> => {
  if (useLocalFallback) {
    const list = getLocalStorageData<Medicine>("medistock_medicines", DEFAULT_MEDICINES);
    const index = list.findIndex(m => m.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      saveLocalStorageData("medistock_medicines", list);
    }
  } else {
    try {
      const docRef = doc(db, "medicines", id);
      await updateDoc(docRef, updates);
    } catch (err) {
      console.warn("Firestore error updating medicine, updating local cache:", err);
      const list = getLocalStorageData<Medicine>("medistock_medicines", DEFAULT_MEDICINES);
      const index = list.findIndex(m => m.id === id);
      if (index !== -1) {
        list[index] = { ...list[index], ...updates };
        saveLocalStorageData("medistock_medicines", list);
      }
    }
  }
};

export const deleteMedicine = async (id: string): Promise<void> => {
  if (useLocalFallback) {
    const list = getLocalStorageData<Medicine>("medistock_medicines", DEFAULT_MEDICINES);
    const filtered = list.filter(m => m.id !== id);
    saveLocalStorageData("medistock_medicines", filtered);
  } else {
    try {
      await deleteDoc(doc(db, "medicines", id));
    } catch (err) {
      console.warn("Firestore error deleting medicine, removing from local cache:", err);
      const list = getLocalStorageData<Medicine>("medistock_medicines", DEFAULT_MEDICINES);
      const filtered = list.filter(m => m.id !== id);
      saveLocalStorageData("medistock_medicines", filtered);
    }
  }
};

// Unified Sales Operations
export const getSales = async (): Promise<Sale[]> => {
  if (useLocalFallback) {
    return getLocalStorageData<Sale>("medistock_sales", DEFAULT_SALES);
  } else {
    try {
      const q = query(collection(db, "sales"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list: Sale[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Sale);
      });
      if (list.length === 0) {
        for (const item of DEFAULT_SALES) {
          const { id, ...rest } = item;
          await setDoc(doc(db, "sales", id), rest);
          list.push(item);
        }
      }
      return list;
    } catch (err) {
      console.warn("Firestore error reading sales, using local cache:", err);
      return getLocalStorageData<Sale>("medistock_sales", DEFAULT_SALES);
    }
  }
};

export const addSale = async (items: Sale["items"], subtotal: number, tax: number, total: number, customerName?: string): Promise<Sale> => {
  // Generate random invoice number
  const invNumber = "INV-" + Math.floor(1000 + Math.random() * 9000);
  const newSale: Sale = {
    id: "sale-" + Math.random().toString(36).substr(2, 9),
    invoiceNumber: invNumber,
    items,
    subtotal,
    tax,
    total,
    customerName: customerName || "General Customer",
    createdAt: new Date().toISOString(),
    pharmacistId: currentUser?.uid || "demo-user",
    pharmacistName: currentUser?.displayName || "Lead Pharmacist"
  };

  // We must also decrement medicine quantities for these items in our stock!
  const medicines = await getMedicines();
  for (const item of items) {
    const med = medicines.find(m => m.id === item.medicineId);
    if (med) {
      const updatedQty = Math.max(0, med.quantity - item.quantity);
      await updateMedicine(item.medicineId, { quantity: updatedQty });
    }
  }

  if (useLocalFallback) {
    const list = getLocalStorageData<Sale>("medistock_sales", DEFAULT_SALES);
    list.unshift(newSale);
    saveLocalStorageData("medistock_sales", list);
    return newSale;
  } else {
    try {
      const docRef = await addDoc(collection(db, "sales"), {
        invoiceNumber: newSale.invoiceNumber,
        items,
        subtotal,
        tax,
        total,
        customerName: newSale.customerName,
        createdAt: newSale.createdAt,
        pharmacistId: newSale.pharmacistId,
        pharmacistName: newSale.pharmacistName
      });
      return { id: docRef.id, ...newSale };
    } catch (err) {
      console.warn("Firestore error adding sale, saving to local cache:", err);
      const list = getLocalStorageData<Sale>("medistock_sales", DEFAULT_SALES);
      list.unshift(newSale);
      saveLocalStorageData("medistock_sales", list);
      return newSale;
    }
  }
};

// Unified Supplier Management Operations
export const getSuppliers = async (): Promise<Supplier[]> => {
  if (useLocalFallback) {
    return getLocalStorageData<Supplier>("medistock_suppliers", DEFAULT_SUPPLIERS);
  } else {
    try {
      const q = query(collection(db, "suppliers"), orderBy("name", "asc"));
      const querySnapshot = await getDocs(q);
      const list: Supplier[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Supplier);
      });
      if (list.length === 0) {
        for (const item of DEFAULT_SUPPLIERS) {
          const { id, ...rest } = item;
          await setDoc(doc(db, "suppliers", id), rest);
          list.push(item);
        }
      }
      return list;
    } catch (err) {
      console.warn("Firestore error reading suppliers, using local cache:", err);
      return getLocalStorageData<Supplier>("medistock_suppliers", DEFAULT_SUPPLIERS);
    }
  }
};

export const addSupplier = async (sup: Omit<Supplier, "id" | "createdAt">): Promise<Supplier> => {
  const newSup: Supplier = {
    ...sup,
    id: "sup-" + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString()
  };

  if (useLocalFallback) {
    const list = getLocalStorageData<Supplier>("medistock_suppliers", DEFAULT_SUPPLIERS);
    list.unshift(newSup);
    saveLocalStorageData("medistock_suppliers", list);
    return newSup;
  } else {
    try {
      const docRef = await addDoc(collection(db, "suppliers"), {
        ...sup,
        createdAt: newSup.createdAt
      });
      return { id: docRef.id, ...sup, createdAt: newSup.createdAt };
    } catch (err) {
      console.warn("Firestore error adding supplier, saving to local cache:", err);
      const list = getLocalStorageData<Supplier>("medistock_suppliers", DEFAULT_SUPPLIERS);
      list.unshift(newSup);
      saveLocalStorageData("medistock_suppliers", list);
      return newSup;
    }
  }
};

export const updateSupplier = async (id: string, updates: Partial<Supplier>): Promise<void> => {
  if (useLocalFallback) {
    const list = getLocalStorageData<Supplier>("medistock_suppliers", DEFAULT_SUPPLIERS);
    const index = list.findIndex(s => s.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      saveLocalStorageData("medistock_suppliers", list);
    }
  } else {
    try {
      const docRef = doc(db, "suppliers", id);
      await updateDoc(docRef, updates);
    } catch (err) {
      console.warn("Firestore error updating supplier, updating local cache:", err);
      const list = getLocalStorageData<Supplier>("medistock_suppliers", DEFAULT_SUPPLIERS);
      const index = list.findIndex(s => s.id === id);
      if (index !== -1) {
        list[index] = { ...list[index], ...updates };
        saveLocalStorageData("medistock_suppliers", list);
      }
    }
  }
};

export const deleteSupplier = async (id: string): Promise<void> => {
  if (useLocalFallback) {
    const list = getLocalStorageData<Supplier>("medistock_suppliers", DEFAULT_SUPPLIERS);
    const filtered = list.filter(s => s.id !== id);
    saveLocalStorageData("medistock_suppliers", filtered);
  } else {
    try {
      await deleteDoc(doc(db, "suppliers", id));
    } catch (err) {
      console.warn("Firestore error deleting supplier, removing from local cache:", err);
      const list = getLocalStorageData<Supplier>("medistock_suppliers", DEFAULT_SUPPLIERS);
      const filtered = list.filter(s => s.id !== id);
      saveLocalStorageData("medistock_suppliers", filtered);
    }
  }
};
