// Shopping Cart (Section 1 — signal/set/update)
export interface ProductItem {
  id: number;
  name: string;
  price: number;
  category: string;
}

export interface CartItem extends ProductItem {
  qty: number;
}

// Employee (Section 5 — toObservable, Section 6 — linkedSignal)
export interface EmployeeItem {
  id: number;
  name: string;
  department: string;
  role: string;
  salary: number;
  bonus: number;
  deductions: number;
  yearsOfService: number;
  skills: string[];
}

// Doctor (Section 4 — toSignal)
export interface DoctorItem {
  id: number;
  name: string;
  specialty: string;
  available: boolean;
  rating: number;
  experience: number;
  nextAvailable: string;
  fee: number;
}

// Artist (Section 7 — resource)
export interface ArtistItem {
  id: number;
  name: string;
  genre: string;
  nationality: string;
  famousWork: string;
  birthYear: number;
}
