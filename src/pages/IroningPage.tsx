import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  garmentType: string;
  deadline: string;
  status: string;
}

const IroningPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Mock API call - in real app would be: GET /api/orders?status=ready_for_ironing
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const ironingOrders = storedOrders.filter((order: Order) => 
        order.status === 'ready_for_ironing'
      );
      setOrders(ironingOrders);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIroned = async (orderId: string) => {
    try {
      // Update order status
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = storedOrders.map((order: Order) =>
        order.orderId === orderId ? { ...order, status: 'ironing_done' } : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Remove from current view
      setOrders(orders.filter(order => order.orderId !== orderId));
      
      // Mock API call to notify customer - in real app would be: POST /api/notify-customer
      await notifyCustomer(orderId);
      
      toast.success(`Order ${orderId} completed and customer notified!`);
    } catch (err) {
      toast.error('Failed to complete order');
      console.error('Error completing order:', err);
    }
  };

  const notifyCustomer = async (orderId: string) => {
    // Mock API call - in real app would be: POST /api/notify-customer with { orderId }
    console.log(`SMS sent to customer: Order ${orderId} is ready for pickup`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading ironing orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="m-4">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6" />
            Ironing Section
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{orders.length} orders ready for ironing</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders ready for ironing
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Garment Type</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.garmentType}</TableCell>
                    <TableCell>{order.deadline}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Ready for Ironing</Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm"
                        onClick={() => handleIroned(order.orderId)}
                      >
                        Ironed
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IroningPage;