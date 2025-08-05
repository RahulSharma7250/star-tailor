import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Order {
  orderId: string;
  customerName: string;
  type: 'blouse' | 'dress';
  status: 'pending' | 'cutting' | 'stitching' | 'finishing' | 'ironing' | 'completed';
  workerId?: string;
}

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock worker ID - in real app, this would come from auth context
  const workerId = "worker-123";

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock API call - replace with actual API endpoint
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
      
      // Mock data for development
      const mockOrders: Order[] = [
        { orderId: "ORD001", customerName: "John Doe", type: "blouse", status: "pending" },
        { orderId: "ORD002", customerName: "Jane Smith", type: "dress", status: "stitching" },
        { orderId: "ORD003", customerName: "Bob Johnson", type: "blouse", status: "finishing" },
        { orderId: "ORD004", customerName: "Alice Brown", type: "dress", status: "ironing" },
        { orderId: "ORD005", customerName: "Charlie Wilson", type: "blouse", status: "completed" },
      ];
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;
    
    if (filter === "blouse") {
      filtered = orders.filter(order => order.type === "blouse");
    } else if (filter === "dress") {
      filtered = orders.filter(order => order.type === "dress");
    }
    
    // Only show orders that haven't been accepted by others
    filtered = filtered.filter(order => !order.workerId || order.workerId === workerId);
    
    setFilteredOrders(filtered);
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      setAccepting(orderId);
      
      const response = await fetch('/api/orders/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, workerId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to accept order');
      }
      
      // Update local state to remove the order from others' view
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId 
            ? { ...order, workerId, status: 'stitching' }
            : order
        )
      );
      
      toast({
        title: "Order Accepted",
        description: `Order ${orderId} has been assigned to you.`,
      });
      
    } catch (err) {
      console.error('Error accepting order:', err);
      toast({
        title: "Error",
        description: "Failed to accept order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAccepting(null);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId 
            ? { ...order, status: newStatus as any }
            : order
        )
      );
      
      // If ironing is completed, notify customer
      if (newStatus === 'completed') {
        await notifyCustomer(orderId);
      }
      
      toast({
        title: "Status Updated",
        description: `Order ${orderId} status updated to ${newStatus}.`,
      });
      
    } catch (err) {
      console.error('Error updating status:', err);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const notifyCustomer = async (orderId: string) => {
    try {
      await fetch('/api/notify-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });
      
      toast({
        title: "Customer Notified",
        description: `Customer has been notified that order ${orderId} is ready.`,
      });
      
    } catch (err) {
      console.error('Error notifying customer:', err);
      toast({
        title: "Notification Warning",
        description: "Order completed but failed to notify customer.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      cutting: { variant: "outline" as const, label: "Cutting" },
      stitching: { variant: "default" as const, label: "Stitching" },
      finishing: { variant: "secondary" as const, label: "Finishing" },
      ironing: { variant: "outline" as const, label: "Ironing" },
      completed: { variant: "default" as const, label: "Completed" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const canAcceptOrder = (order: Order) => {
    return order.status === 'pending' && !order.workerId;
  };

  const getNextStatusAction = (order: Order) => {
    const nextActions = {
      stitching: 'Move to Finishing',
      finishing: 'Move to Ironing',
      ironing: 'Mark Complete',
    };
    
    const nextStatuses = {
      stitching: 'finishing',
      finishing: 'ironing',
      ironing: 'completed',
    };
    
    if (order.workerId === workerId && nextActions[order.status as keyof typeof nextActions]) {
      return {
        label: nextActions[order.status as keyof typeof nextActions],
        status: nextStatuses[order.status as keyof typeof nextStatuses],
      };
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
        <p className="text-gray-600">Manage and track order progress</p>
      </div>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Orders</CardTitle>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="blouse">Blouse Orders</SelectItem>
                <SelectItem value="dress">Dress Orders</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const nextAction = getNextStatusAction(order);
                  
                  return (
                    <TableRow key={order.orderId}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell className="capitalize">
                        <Badge variant="outline">
                          {order.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {canAcceptOrder(order) && (
                            <Button 
                              size="sm"
                              onClick={() => handleAcceptOrder(order.orderId)}
                              disabled={accepting === order.orderId}
                            >
                              {accepting === order.orderId ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                  Accepting...
                                </>
                              ) : (
                                "Accept"
                              )}
                            </Button>
                          )}
                          
                          {nextAction && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusUpdate(order.orderId, nextAction.status)}
                            >
                              {nextAction.label}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPage;