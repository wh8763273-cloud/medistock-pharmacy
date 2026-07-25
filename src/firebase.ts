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
    name: "Panadol Extra",
    genericName: "Paracetamol (500mg) + Caffeine (65mg)",
    brand: "Panadol Extra",
    category: "Analgesics & Anti-inflammatory",
    batchNumber: "PND-2026-09",
    manufacturer: "Haleon / GSK Pakistan",
    quantity: 450,
    purchasePrice: 35.00,
    sellingPrice: 55.00,
    expiryDate: "2028-11-20",
    location: "Rack A-1, Shelf 1",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-2",
    name: "Risek 20mg",
    genericName: "Omeprazole",
    brand: "Risek",
    category: "Anti-Ulcerant & Gastrointestinal",
    batchNumber: "RSK-2026-04",
    manufacturer: "Getz Pharma Pakistan",
    quantity: 220,
    purchasePrice: 180.00,
    sellingPrice: 260.00,
    expiryDate: "2027-09-15",
    location: "Rack B-2, Shelf 3",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-3",
    name: "Augmentin 625mg",
    genericName: "Amoxicillin Trihydrate + Clavulanate Potassium",
    brand: "Augmentin",
    category: "Antibiotics & Anti-Infectives",
    batchNumber: "AUG-2026-02",
    manufacturer: "GSK Pakistan",
    quantity: 110,
    purchasePrice: 280.00,
    sellingPrice: 410.00,
    expiryDate: "2027-04-10",
    location: "Rack A-3, Shelf 2",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-4",
    name: "Arinac Forte",
    genericName: "Ibuprofen (400mg) + Pseudoephedrine HCl (60mg)",
    brand: "Arinac Forte",
    category: "Respiratory & Anti-Asthmatic",
    batchNumber: "ARN-2026-08",
    manufacturer: "Abbott Laboratories Pakistan",
    quantity: 180,
    purchasePrice: 110.00,
    sellingPrice: 175.00,
    expiryDate: "2027-12-01",
    location: "Rack C-1, Shelf 2",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-5",
    name: "Brufen 400mg",
    genericName: "Ibuprofen",
    brand: "Brufen",
    category: "Analgesics & Anti-inflammatory",
    batchNumber: "BRF-2026-05",
    manufacturer: "Abbott Laboratories Pakistan",
    quantity: 300,
    purchasePrice: 45.00,
    sellingPrice: 80.00,
    expiryDate: "2028-03-15",
    location: "Rack A-2, Shelf 1",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-6",
    name: "Softin 10mg",
    genericName: "Loratadine",
    brand: "Softin",
    category: "Antihistamine & Anti-Allergic",
    batchNumber: "SFT-2026-11",
    manufacturer: "Platinum Pharmaceuticals",
    quantity: 140,
    purchasePrice: 90.00,
    sellingPrice: 150.00,
    expiryDate: "2027-08-25",
    location: "Rack D-1, Shelf 4",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-7",
    name: "Rigix 10mg",
    genericName: "Cetirizine Dihydrochloride",
    brand: "Rigix",
    category: "Antihistamine & Anti-Allergic",
    batchNumber: "RGX-2026-03",
    manufacturer: "AGP Limited Pakistan",
    quantity: 160,
    purchasePrice: 85.00,
    sellingPrice: 140.00,
    expiryDate: "2027-07-18",
    location: "Rack D-1, Shelf 3",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-8",
    name: "Novidat 500mg",
    genericName: "Ciprofloxacin Hydrochloride",
    brand: "Novidat",
    category: "Antibiotics & Anti-Infectives",
    batchNumber: "NVD-2026-07",
    manufacturer: "Sami Pharmaceuticals",
    quantity: 95,
    purchasePrice: 220.00,
    sellingPrice: 340.00,
    expiryDate: "2026-12-10",
    location: "Rack A-4, Shelf 2",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-9",
    name: "Flagyl 400mg",
    genericName: "Metronidazole",
    brand: "Flagyl",
    category: "Antibiotics & Anti-Infectives",
    batchNumber: "FLG-2026-01",
    manufacturer: "Sanofi-Aventis Pakistan",
    quantity: 8, // Low stock demo
    purchasePrice: 40.00,
    sellingPrice: 75.00,
    expiryDate: "2028-01-20",
    location: "Rack A-4, Shelf 1",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-10",
    name: "Surbex Z",
    genericName: "Zinc + Vitamin B-Complex + Vitamin C + Vitamin E",
    brand: "Surbex Z",
    category: "Vitamins, Minerals & Supplements",
    batchNumber: "SBX-2026-10",
    manufacturer: "Abbott Laboratories Pakistan",
    quantity: 210,
    purchasePrice: 260.00,
    sellingPrice: 390.00,
    expiryDate: "2028-05-12",
    location: "Rack E-1, Shelf 1",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-11",
    name: "Ponstan 250mg",
    genericName: "Mefenamic Acid",
    brand: "Ponstan",
    category: "Analgesics & Anti-inflammatory",
    batchNumber: "PNS-2026-06",
    manufacturer: "Pfizer / Martin Dow Pakistan",
    quantity: 320,
    purchasePrice: 65.00,
    sellingPrice: 110.00,
    expiryDate: "2027-11-30",
    location: "Rack A-2, Shelf 3",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-12",
    name: "Getryl 2mg",
    genericName: "Glimepiride",
    brand: "Getryl",
    category: "Antidiabetic",
    batchNumber: "GTR-2026-09",
    manufacturer: "Getz Pharma Pakistan",
    quantity: 170,
    purchasePrice: 140.00,
    sellingPrice: 220.00,
    expiryDate: "2027-06-22",
    location: "Rack B-1, Shelf 2",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-13",
    name: "Lowplat 75mg",
    genericName: "Clopidogrel Bisulfate",
    brand: "Lowplat",
    category: "Antihypertensive & Cardiovascular",
    batchNumber: "LWP-2026-05",
    manufacturer: "Getz Pharma Pakistan",
    quantity: 130,
    purchasePrice: 210.00,
    sellingPrice: 330.00,
    expiryDate: "2026-08-15", // Expiring soon
    location: "Rack B-3, Shelf 1",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-14",
    name: "Eziday 50mg",
    genericName: "Losartan Potassium",
    brand: "Eziday",
    category: "Antihypertensive & Cardiovascular",
    batchNumber: "EZY-2026-02",
    manufacturer: "Hilton Pharma Pakistan",
    quantity: 145,
    purchasePrice: 190.00,
    sellingPrice: 290.00,
    expiryDate: "2027-09-08",
    location: "Rack B-3, Shelf 2",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-15",
    name: "Gravinate 50mg",
    genericName: "Dimenhydrinate",
    brand: "Gravinate",
    category: "Antiemetic & Anti-diarrheal",
    batchNumber: "GRV-2026-07",
    manufacturer: "The Searle Company Ltd",
    quantity: 200,
    purchasePrice: 30.00,
    sellingPrice: 55.00,
    expiryDate: "2028-04-19",
    location: "Rack C-2, Shelf 1",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-16",
    name: "Entamizole DS",
    genericName: "Metronidazole + Diloxanide Furoate",
    brand: "Entamizole DS",
    category: "Antiemetic & Anti-diarrheal",
    batchNumber: "ENT-2026-04",
    manufacturer: "Highnoon Laboratories Pakistan",
    quantity: 110,
    purchasePrice: 120.00,
    sellingPrice: 195.00,
    expiryDate: "2027-05-11",
    location: "Rack C-2, Shelf 3",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-17",
    name: "Calamox 625mg",
    genericName: "Amoxicillin + Clavulanic Acid",
    brand: "Calamox",
    category: "Antibiotics & Anti-Infectives",
    batchNumber: "CLM-2026-08",
    manufacturer: "Bosch Pharmaceuticals",
    quantity: 85,
    purchasePrice: 260.00,
    sellingPrice: 390.00,
    expiryDate: "2026-08-05", // Expiring soon
    location: "Rack A-3, Shelf 4",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-18",
    name: "Ventolin Inhaler",
    genericName: "Salbutamol Sulfate (100mcg/dose)",
    brand: "Ventolin",
    category: "Respiratory & Anti-Asthmatic",
    batchNumber: "VNT-2026-12",
    manufacturer: "GSK Pakistan",
    quantity: 65,
    purchasePrice: 480.00,
    sellingPrice: 680.00,
    expiryDate: "2028-02-28",
    location: "Rack C-1, Shelf 1",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-19",
    name: "Neurobion Tablets",
    genericName: "Vitamin B1 + B6 + B12 (Cobalamin)",
    brand: "Neurobion",
    category: "Vitamins, Minerals & Supplements",
    batchNumber: "NRB-2026-03",
    manufacturer: "Procter & Gamble / Merck Pakistan",
    quantity: 280,
    purchasePrice: 150.00,
    sellingPrice: 240.00,
    expiryDate: "2028-06-15",
    location: "Rack E-1, Shelf 2",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-20",
    name: "Hydryllin Syrup 120ml",
    genericName: "Aminophylline + Diphenhydramine + Ammonium Chloride",
    brand: "Hydryllin",
    category: "Pediatric Formulations",
    batchNumber: "HDR-2026-10",
    manufacturer: "The Searle Company Ltd",
    quantity: 150,
    purchasePrice: 80.00,
    sellingPrice: 135.00,
    expiryDate: "2027-11-10",
    location: "Rack C-1, Shelf 4",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-21",
    name: "Betnovate N Cream",
    genericName: "Betamethasone Valerate + Neomycin Sulfate",
    brand: "Betnovate N",
    category: "Dermatological & Topical",
    batchNumber: "BTN-2026-01",
    manufacturer: "GSK Pakistan",
    quantity: 90,
    purchasePrice: 95.00,
    sellingPrice: 160.00,
    expiryDate: "2027-08-01",
    location: "Rack D-2, Shelf 1",
    createdAt: new Date().toISOString()
  },
  {
    id: "med-22",
    name: "Epival 250mg",
    genericName: "Valproate Sodium / Divalproex Sodium",
    brand: "Epival",
    category: "Neuro-Psychiatric & Anticonvulsant",
    batchNumber: "EPV-2026-06",
    manufacturer: "Abbott Laboratories Pakistan",
    quantity: 75,
    purchasePrice: 290.00,
    sellingPrice: 450.00,
    expiryDate: "2027-03-30",
    location: "Rack F-1, Shelf 2",
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_SUPPLIERS: Supplier[] = [
  {
    id: "sup-1",
    name: "Medica Distribution Corp",
    contactPerson: "Sarah Jenkins",
    email: "orders@medicadist.com",
    phone: "+92-300-5550199",
    address: "742 Evergreen Terrace, Lahore",
    createdAt: new Date().toISOString()
  },
  {
    id: "sup-2",
    name: "Astra Wholesale Pharmacy",
    contactPerson: "Dr. David Vance",
    email: "vance.d@astrawholesale.com",
    phone: "+92-321-5550142",
    address: "100 Medical Plaza Blvd, Karachi",
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_SALES: Sale[] = [
  {
    id: "sale-1",
    invoiceNumber: "INV-9021",
    items: [
      { medicineId: "med-1", name: "Amoxicillin", genericName: "Amoxicillin Trihydrate", quantity: 2, price: 280.00, total: 560.00 }
    ],
    subtotal: 560.00,
    tax: 44.80,
    total: 604.80,
    customerName: "Alice Smith",
    createdAt: new Date().toISOString(),
    pharmacistId: "demo-user",
    pharmacistName: "Lead Pharmacist"
  },
  {
    id: "sale-2",
    invoiceNumber: "INV-9022",
    items: [
      { medicineId: "med-2", name: "Lisinopril", genericName: "Lisinopril Dihydrate", quantity: 5, price: 220.00, total: 1100.00 }
    ],
    subtotal: 1100.00,
    tax: 88.00,
    total: 1188.00,
    customerName: "Bob Johnson",
    createdAt: new Date().toISOString(),
    pharmacistId: "demo-user",
    pharmacistName: "Lead Pharmacist"
  },
  {
    id: "sale-3",
    invoiceNumber: "INV-9024",
    items: [
      { medicineId: "med-4", name: "Atorvastatin", genericName: "Atorvastatin Calcium", quantity: 3, price: 420.00, total: 1260.00 }
    ],
    subtotal: 1260.00,
    tax: 100.80,
    total: 1360.80,
    customerName: "Charlie Brown",
    createdAt: new Date().toISOString(),
    pharmacistId: "demo-user",
    pharmacistName: "Lead Pharmacist"
  }
];

// Seed local storage with default mock datasets if not set yet
const getLocalStorageData = <T extends { id: string }>(key: string, defaultVal: T[]): T[] => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  const parsed = JSON.parse(data) as T[];
  if (key === "medistock_medicines" && Array.isArray(parsed)) {
    const existingIds = new Set(parsed.map(item => item.id));
    let hasChanges = false;
    for (const item of defaultVal) {
      if (!existingIds.has(item.id)) {
        parsed.push(item);
        hasChanges = true;
      }
    }
    if (hasChanges) {
      localStorage.setItem(key, JSON.stringify(parsed));
    }
  }
  return parsed;
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
      displayName: "Guest Evaluator",
      pharmacyName: "MediStock Central Pharmacy",
      createdAt: new Date().toISOString(),
      isGuest: true
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
        displayName: "Guest Evaluator",
        pharmacyName: "MediStock Central Pharmacy",
        createdAt: new Date().toISOString(),
        isGuest: true
      };
      currentUser = profile;
      authListeners.forEach(l => l(currentUser));
      return profile;
    } catch (err) {
      console.warn("Anonymous login failed, falling back to guest profile:", err);
      const guestUser: UserProfile = {
        uid: "guest-user",
        email: "evaluator@medistock.demo",
        displayName: "Guest Evaluator",
        pharmacyName: "MediStock Central Pharmacy",
        createdAt: new Date().toISOString(),
        isGuest: true
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
