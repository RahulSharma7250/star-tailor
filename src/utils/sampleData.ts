// Sample data utility for testing the tailoring order management system

export const initializeSampleData = () => {
  const sampleOrders = [
    {
      id: "1",
      orderId: "ORD001",
      customerName: "Priya Sharma",
      garmentType: "Blouse",
      deadline: "2024-01-30",
      status: "pending_cutting"
    },
    {
      id: "2", 
      orderId: "ORD002",
      customerName: "Anjali Devi",
      garmentType: "Kurti",
      deadline: "2024-02-05",
      status: "pending_cutting"
    },
    {
      id: "3",
      orderId: "ORD003", 
      customerName: "Meera Singh",
      garmentType: "Blouse",
      deadline: "2024-02-10",
      status: "cutting_done"
    },
    {
      id: "4",
      orderId: "ORD004",
      customerName: "Kavya Rani",
      garmentType: "Dress",
      deadline: "2024-02-15",
      status: "cutting_done"
    },
    {
      id: "5",
      orderId: "ORD005",
      customerName: "Sita Laxmi",
      garmentType: "Blouse", 
      deadline: "2024-02-20",
      status: "blouse_stitched"
    },
    {
      id: "6",
      orderId: "ORD006",
      customerName: "Radha Krishna",
      garmentType: "Jacket",
      deadline: "2024-02-25",
      status: "dress_stitched"
    },
    {
      id: "7",
      orderId: "ORD007",
      customerName: "Geetha Bai",
      garmentType: "Blouse",
      deadline: "2024-03-01", 
      status: "ready_for_ironing"
    }
  ];

  // Only initialize if no orders exist
  const existingOrders = localStorage.getItem('orders');
  if (!existingOrders) {
    localStorage.setItem('orders', JSON.stringify(sampleOrders));
    console.log('Sample orders initialized!');
  }
};

export const clearAllOrders = () => {
  localStorage.removeItem('orders');
  console.log('All orders cleared!');
};

export const addNewOrder = (orderData: {
  customerName: string;
  garmentType: string;
  deadline: string;
}) => {
  const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  const newOrder = {
    id: Date.now().toString(),
    orderId: `ORD${String(existingOrders.length + 1).padStart(3, '0')}`,
    ...orderData,
    status: 'pending_cutting'
  };
  
  const updatedOrders = [...existingOrders, newOrder];
  localStorage.setItem('orders', JSON.stringify(updatedOrders));
  console.log('New order added:', newOrder);
  return newOrder;
};