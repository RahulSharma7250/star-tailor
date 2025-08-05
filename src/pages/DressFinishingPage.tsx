import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  garmentType: string;
  deadline: string;
  status: string;
}

const DressFinishingPage = () => {
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
      // Mock API call - in real app would be: GET /api/orders?status=dress_stitched
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const dressStitchedOrders = storedOrders.filter((order: Order) => 
        order.status === 'dress_stitched'
      );
      setOrders(dressStitchedOrders);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = storedOrders.map((order: Order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      setOrders(orders.filter(order => order.orderId !== orderId));
      
      toast.success(`Order ${orderId} moved to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update order status');
      console.error('Error updating order:', err);
    }
  };

  const handleStartFinishing = (orderId: string) => {
    updateOrderStatus(orderId, 'dress_finishing_in_progress');
  };

  const handleFinishingDone = (orderId: string) => {
    updateOrderStatus(orderId, 'ready_for_ironing');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dress finishing orders...</span>
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
            <Sparkles className="h-6 w-6" />
            Dress Finishing Section
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{orders.length} dress orders ready for finishing</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No dress orders ready for finishing
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Order Type</TableHead>
                  <TableHead>Stitching Status</TableHead>
                  <TableHead>Finishing Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>Dress</TableCell>
                    <TableCell>
                      <Badge variant="default">Done</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Pending</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStartFinishing(order.orderId)}
                        >
                          Start Finishing
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleFinishingDone(order.orderId)}
                        >
                          Done
                        </Button>
                      </div>
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

export default DressFinishingPage;