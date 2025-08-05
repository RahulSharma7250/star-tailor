import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  garmentType: string;
  deadline: string;
  status: string;
  currentStage: string;
  assignedWorker?: string;
}

const AdminIroningPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigningWorker, setAssigningWorker] = useState<string | null>(null);
  const [processingNotification, setProcessingNotification] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIroningOrders();
    const interval = setInterval(fetchIroningOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchIroningOrders = async () => {
    try {
      setLoading(true);
      // Mock API call - GET /api/orders?stage=ironing
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const ironingOrders = storedOrders.filter((order: Order) => 
        order.status === 'ready_for_ironing' || 
        order.status === 'ironing_in_progress'
      );
      setOrders(ironingOrders);
      setError(null);
    } catch (err) {
      setError('Failed to fetch ironing orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStage = async (orderId: string, newStage: string) => {
    try {
      // Mock API call - PUT /api/orders/:orderId/stage
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = storedOrders.map((order: Order) =>
        order.orderId === orderId ? { ...order, status: newStage, currentStage: 'ironing' } : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      await fetchIroningOrders();
      toast.success(`Order ${orderId} moved to ${newStage}`);
    } catch (err) {
      toast.error('Failed to update order stage');
      console.error('Error updating order:', err);
    }
  };

  const assignWorker = async (orderId: string, workerId: string) => {
    try {
      setAssigningWorker(orderId);
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = storedOrders.map((order: Order) =>
        order.orderId === orderId ? { ...order, assignedWorker: workerId } : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      await fetchIroningOrders();
      toast.success(`Worker assigned to order ${orderId}`);
    } catch (err) {
      toast.error('Failed to assign worker');
    } finally {
      setAssigningWorker(null);
    }
  };

  const notifyCustomer = async (orderId: string) => {
    try {
      setProcessingNotification(orderId);
      // Mock API call - POST /api/notify-customer
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({ success: true }), 1000)
      );
      
      if (response) {
        toast.success(`Customer notified for order ${orderId} - Order ready for pickup!`);
        // Update order status to completed
        await updateOrderStage(orderId, 'ironing_done');
      }
    } catch (err) {
      toast.error('Failed to notify customer');
      console.error('Error notifying customer:', err);
    } finally {
      setProcessingNotification(null);
    }
  };

  const getOrderDetails = (orderId: string) => {
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
      toast.info(`Order ${orderId}: ${order.customerName} - ${order.garmentType}`);
    }
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
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6" />
            Admin - Ironing Section Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{orders.length} orders in ironing stage</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders in ironing stage
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
                  <TableHead>Assigned Worker</TableHead>
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
                      <Badge 
                        variant={order.status === 'ironing_in_progress' ? 'default' : 'secondary'}
                      >
                        {order.status === 'ironing_in_progress' ? 'Ironing in Progress' : 'Ready for Ironing'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.assignedWorker ? (
                        <Badge variant="outline">{order.assignedWorker}</Badge>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => getOrderDetails(order.orderId)}
                        >
                          View Details
                        </Button>
                        {order.status === 'ready_for_ironing' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateOrderStage(order.orderId, 'ironing_in_progress')}
                          >
                            Start Ironing
                          </Button>
                        )}
                        {order.status === 'ironing_in_progress' && (
                          <Button 
                            size="sm"
                            disabled={processingNotification === order.orderId}
                            onClick={() => notifyCustomer(order.orderId)}
                          >
                            {processingNotification === order.orderId ? 'Notifying...' : 'Complete & Notify'}
                          </Button>
                        )}
                        {!order.assignedWorker && (
                          <Button 
                            size="sm" 
                            variant="secondary"
                            disabled={assigningWorker === order.orderId}
                            onClick={() => assignWorker(order.orderId, 'ironing-worker-01')}
                          >
                            {assigningWorker === order.orderId ? 'Assigning...' : 'Assign Worker'}
                          </Button>
                        )}
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

export default AdminIroningPage;