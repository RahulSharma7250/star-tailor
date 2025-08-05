
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, User, Phone, Calendar, Package } from "lucide-react";
import { Bill, orderStatuses, tailorRoles, TailorRole, getNextStatus } from "@/types/billing";
import { useToast } from "@/hooks/use-toast";

interface TailorDashboardProps {
  user: { id: string; name: string; role: string };
}

const TailorDashboard = ({ user }: TailorDashboardProps) => {
  const [availableOrders, setAvailableOrders] = useState<Bill[]>([]);
  const [myOrders, setMyOrders] = useState<Bill[]>([]);
  const { toast } = useToast();

  // Get user's tailor role configuration
  const userRole = tailorRoles.find(role => role.id === user.role) || tailorRoles[0];

  // Filter orders based on user role and department
  const filterOrdersForRole = (orders: Bill[]): Bill[] => {
    return orders.filter(order => {
      // Check if order is in the correct stage for this department
      const isCorrectStage = order.status === userRole.department;
      
      // If no item type filter, show all orders in correct stage
      if (!userRole.itemTypes) {
        return isCorrectStage;
      }
      
      // Check if any item matches the role's item types
      const hasMatchingItems = order.items.some(item => 
        userRole.itemTypes!.includes(item.clothType)
      );
      
      return isCorrectStage && hasMatchingItems;
    });
  };

  // Mock data - in real app, this would come from a database
  useEffect(() => {
    const mockOrders: Bill[] = [
      {
        id: "1",
        billNo: "ST-2024-001",
        customerName: "Priya Sharma",
        mobile: "9876543210",
        billDate: "2024-01-15",
        deliveryDate: "2024-01-25",
        status: "cutting",
        totalAmount: 1500,
        advance: 500,
        balance: 1000,
        previousBalance: 0,
        items: [
          {
            clothType: "Kurti",
            qty: 1,
            rate: 800,
            measurements: { "Length": "42", "Chest": "36", "Waist": "34" },
            description: "Cotton kurti with embroidery"
          }
        ],
        designImage: null,
        instructions: "Light embroidery on neckline"
      },
      {
        id: "2",
        billNo: "ST-2024-002",
        customerName: "Anjali Patel",
        mobile: "8765432109",
        billDate: "2024-01-16",
        deliveryDate: "2024-01-28",
        status: "stitching",
        totalAmount: 2200,
        advance: 800,
        balance: 1400,
        previousBalance: 0,
        items: [
          {
            clothType: "Blouse",
            qty: 2,
            rate: 600,
            measurements: { "Length": "15", "Chest": "34", "Sleeve": "12" },
            description: "Silk blouse for saree"
          }
        ],
        designImage: null,
        instructions: "Traditional design with mirror work"
      },
      {
        id: "3",
        billNo: "ST-2024-003",
        customerName: "Meera Reddy",
        mobile: "7654321098",
        billDate: "2024-01-17",
        deliveryDate: "2024-01-30",
        status: "stitching",
        totalAmount: 1800,
        advance: 600,
        balance: 1200,
        previousBalance: 0,
        items: [
          {
            clothType: "Jacket",
            qty: 1,
            rate: 1800,
            measurements: { "Length": "24", "Chest": "38", "Waist": "36" },
            description: "Formal blazer"
          }
        ],
        designImage: null,
        instructions: "Professional fit required"
      },
      {
        id: "4",
        billNo: "ST-2024-004",
        customerName: "Kavitha Nair",
        mobile: "6543210987",
        billDate: "2024-01-18",
        deliveryDate: "2024-02-01",
        status: "finishing",
        totalAmount: 1200,
        advance: 400,
        balance: 800,
        previousBalance: 0,
        items: [
          {
            clothType: "Saree",
            qty: 1,
            rate: 1200,
            measurements: {},
            description: "Saree blouse alteration"
          }
        ],
        designImage: null,
        instructions: "Adjust blouse fit"
      }
    ];

    const savedOrders = localStorage.getItem('tailorOrders');
    const allOrders = savedOrders ? JSON.parse(savedOrders) : mockOrders;
    
    if (!savedOrders) {
      localStorage.setItem('tailorOrders', JSON.stringify(mockOrders));
    }

    // Filter orders for current user's role
    const filtered = filterOrdersForRole(allOrders);
    setAvailableOrders(filtered.filter((order: Bill) => !order.tailorId));
    setMyOrders(allOrders.filter((order: Bill) => order.tailorId === user.id));
  }, [user.id, userRole]);

  const handleAcceptOrder = (orderId: string) => {
    const savedOrders = localStorage.getItem('tailorOrders');
    const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
    
    const updatedOrders = allOrders.map((order: Bill) => {
      if (order.id === orderId) {
        return {
          ...order,
          tailorId: user.id,
          tailorName: user.name,
          acceptedAt: new Date().toISOString()
        };
      }
      return order;
    });

    const acceptedOrder = updatedOrders.find((order: Bill) => order.id === orderId);
    if (acceptedOrder) {
      setMyOrders(prev => [...prev, acceptedOrder]);
      setAvailableOrders(prev => prev.filter(order => order.id !== orderId));
      
      // Save to localStorage
      localStorage.setItem('tailorOrders', JSON.stringify(updatedOrders));

      toast({
        title: "Order Accepted",
        description: `Order ${acceptedOrder.billNo} has been assigned to you.`,
      });
    }
  };

  const handleMarkAsDone = (orderId: string) => {
    const savedOrders = localStorage.getItem('tailorOrders');
    const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
    
    const orderToUpdate = myOrders.find(order => order.id === orderId);
    if (!orderToUpdate) return;

    const nextStatus = getNextStatus(orderToUpdate.status, orderToUpdate.items);
    if (!nextStatus) return;

    const updatedOrders = allOrders.map((order: Bill) => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: nextStatus as any };
        if (nextStatus === 'completed') {
          updatedOrder.completedAt = new Date().toISOString();
          updatedOrder.tailorId = undefined; // Release from tailor
          sendCustomerNotification(order);
        } else {
          updatedOrder.tailorId = undefined; // Release to next department
        }
        return updatedOrder;
      }
      return order;
    });

    // Remove from my orders and update available orders
    setMyOrders(prev => prev.filter(order => order.id !== orderId));
    
    // Update localStorage
    localStorage.setItem('tailorOrders', JSON.stringify(updatedOrders));

    toast({
      title: "Order Moved",
      description: `Order moved to ${nextStatus} stage.`,
    });
  };

  const sendCustomerNotification = (order: Bill) => {
    // In a real app, this would send SMS/email
    console.log(`Notification sent: Dear ${order.customerName}, your order #${order.billNo} is now completed. Please collect it.`);
    
    toast({
      title: "Customer Notified",
      description: `${order.customerName} has been notified about order completion.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = orderStatuses.find(s => s.id === status);
    if (!statusConfig) return null;
    
    return (
      <Badge className={`${statusConfig.color} ${statusConfig.bgColor} border-0`}>
        {statusConfig.label}
      </Badge>
    );
  };

  const OrderCard = ({ order, showActions = false }: { order: Bill; showActions?: boolean }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.billNo}</CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {order.customerName}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {order.mobile}
              </div>
            </div>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Delivery: {new Date(order.deliveryDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <span className="text-sm">₹{order.totalAmount} (Balance: ₹{order.balance})</span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-2">Items:</h4>
          {order.items.map((item, index) => (
            <div key={index} className="text-sm text-gray-600 mb-1">
              {item.qty}x {item.clothType} - {item.description}
            </div>
          ))}
        </div>

        {order.instructions && (
          <div className="mb-4">
            <h4 className="font-medium mb-1">Instructions:</h4>
            <p className="text-sm text-gray-600">{order.instructions}</p>
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 flex-wrap">
            {!order.tailorId && order.status === userRole.department && (
              <Button 
                onClick={() => handleAcceptOrder(order.id!)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Accept Order
              </Button>
            )}
            
            {order.tailorId === user.id && order.status !== 'completed' && (
              <Button
                onClick={() => handleMarkAsDone(order.id!)}
                className="bg-green-600 hover:bg-green-700"
              >
                Mark as Done
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{userRole.name} Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}</p>
        <p className="text-sm text-gray-500">Department: {userRole.department.toUpperCase()}</p>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Available Orders ({availableOrders.length})</TabsTrigger>
          <TabsTrigger value="myorders">My Orders ({myOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Available Orders for {userRole.name}
              {userRole.itemTypes && (
                <span className="text-sm text-gray-500 ml-2">
                  ({userRole.itemTypes.join(', ')})
                </span>
              )}
            </h2>
            {availableOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders available for your department</p>
                </CardContent>
              </Card>
            ) : (
              availableOrders.map(order => (
                <OrderCard key={order.id} order={order} showActions={true} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="myorders">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">My Active Orders</h2>
            {myOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">You haven't accepted any orders yet</p>
                </CardContent>
              </Card>
            ) : (
              myOrders.map(order => (
                <OrderCard key={order.id} order={order} showActions={true} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TailorDashboard;
