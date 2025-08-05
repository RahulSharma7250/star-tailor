
export interface BillItem {
  clothType: string;
  qty: number;
  rate: number;
  measurements: Record<string, string>;
  description?: string;
}

export interface Bill {
  billNo: string;
  customerName: string;
  mobile: string;
  previousBalance: number;
  items: BillItem[];
  deliveryDate: string;
  designImage: File | null;
  instructions: string;
  totalAmount: number;
  id?: string;
  date?: string;
  qrCode?: string;
  billDate: string;
  advance: number;
  balance: number;
  status: 'pending' | 'cutting' | 'stitching' | 'finishing' | 'ironing' | 'completed';
  tailorId?: string;
  tailorName?: string;
  acceptedAt?: string;
  completedAt?: string;
  drawing?: string | null;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  previousBalance: number;
  bills: Bill[];
}

export interface OrderStatus {
  id: string;
  label: string;
  color: string;
  bgColor: string;
}

export const orderStatuses: OrderStatus[] = [
  { id: 'pending', label: 'Pending', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  { id: 'cutting', label: 'Cutting', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  { id: 'stitching', label: 'Stitching', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  { id: 'finishing', label: 'Finishing', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  { id: 'ironing', label: 'Ironing', color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
  { id: 'completed', label: 'Completed', color: 'text-green-700', bgColor: 'bg-green-100' }
];

export interface TailorRole {
  id: string;
  name: string;
  department: 'cutting' | 'stitching' | 'finishing' | 'ironing';
  itemTypes?: string[]; // Optional filter for specific item types
}

export const tailorRoles: TailorRole[] = [
  { 
    id: 'cutting', 
    name: 'Cutting Department', 
    department: 'cutting' 
  },
  { 
    id: 'blouse-stitching', 
    name: 'Blouse Stitching', 
    department: 'stitching', 
    itemTypes: ['Blouse'] 
  },
  { 
    id: 'dress-stitching', 
    name: 'Dress Stitching', 
    department: 'stitching', 
    itemTypes: ['Kurti', 'Jacket'] 
  },
  { 
    id: 'finishing', 
    name: 'Finishing Department', 
    department: 'finishing' 
  },
  { 
    id: 'ironing', 
    name: 'Ironing Department', 
    department: 'ironing' 
  }
];

export const clothTypes = [
  "Kurti", "Pant", "Blouse", "Salwar", "Chudi", "Jacket", "Saree", "Other"
];

// Workflow helper functions
export const getNextStatus = (currentStatus: string, items: BillItem[]): string | null => {
  const hasSaree = items.some(item => item.clothType === 'Saree');
  
  switch (currentStatus) {
    case 'pending':
      return hasSaree ? 'finishing' : 'cutting';
    case 'cutting':
      return 'stitching';
    case 'stitching':
      return 'finishing';
    case 'finishing':
      return 'ironing';
    case 'ironing':
      return 'completed';
    default:
      return null;
  }
};

export const measurementFields: Record<string, string[]> = {
  "Kurti": ["Length", "Shoulder", "Sleeve", "Chest", "Waist", "Hips", "Front Neck", "Back Neck"],
  "Pant": ["Length", "Waist", "Hips", "Thigh", "Knee", "Bottom"],
  "Blouse": ["Length", "Shoulder", "Sleeve", "Chest", "Waist", "Front Neck", "Back Neck"],
  "Salwar": ["Length", "Bottom"],
  "Chudi": ["Length", "Waist", "Hips", "Thigh", "Knee", "Bottom"],
  "Jacket": ["Length", "Shoulder", "Chest", "Waist", "Hips"],
  "Other": ["Custom Measurements"]
};
