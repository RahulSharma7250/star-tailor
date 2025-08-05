import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Shirt, ArrowLeft } from "lucide-react";
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

const AdminStitchingPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigningWorker, setAssigningWorker] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStitchingOrders();
    const interval = setInterval(fetchStitchingOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStitchingOrders = async () => {
    try {
      setLoading(true);
      // Mock API call - GET /api/orders?stage=stitching
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const stitchingOrders = storedOrders.filter((order: Order) => 
        order.status === 'cutting_done' || 
        order.status === 'blouse_stitching_in_progress' ||
        order.status === 'dress_stitching_in_progress'
      );
      setOrders(stitchingOrders);
      setError(null);
    } catch (err) {
      setError('Failed to fetch stitching orders');
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
        order.orderId === orderId ? { ...order, status: newStage, currentStage: 'stitching' } : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      await fetchStitchingOrders();
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
      
      await fetchStitchingOrders();
      toast.success(`Worker assigned to order ${orderId}`);
    } catch (err) {
      toast.error('Failed to assign worker');
    } finally {
      setAssigningWorker(null);
    }
  };

  const getOrderDetails = (orderId: string) => {
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
      toast.info(`Order ${orderId}: ${order.customerName} - ${order.garmentType}`);
    }
  };

  const blouseOrders = orders.filter(order => 
    order.garmentType.toLowerCase().includes('blouse') || 
    order.status === 'blouse_stitching_in_progress'
  );
  
  const dressOrders = orders.filter(order => 
    (order.garmentType.toLowerCase().includes('dress') || 
     order.garmentType.toLowerCase().includes('kurti') ||
     order.garmentType.toLowerCase().includes('saree')) &&
    !order.garmentType.toLowerCase().includes('blouse') ||
    order.status === 'dress_stitching_in_progress'
  );

  const renderOrderTable = (orderList: Order[], type: 'blouse' | 'dress') => (
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
        {orderList.map((order) => (
          <TableRow key={order.orderId}>
            <TableCell className="font-medium">{order.orderId}</TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>{order.garmentType}</TableCell>
            <TableCell>{order.deadline}</TableCell>
            <TableCell>
              <Badge 
                variant={order.status.includes('in_progress') ? 'default' : 'secondary'}
              >
                {order.status.includes('in_progress') ? 'In Progress' : 'Ready for Stitching'}
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
                {order.status === 'cutting_done' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateOrderStage(order.orderId, `${type}_stitching_in_progress`)}
                  >
                    Start Stitching
                  </Button>
                )}
                {order.status.includes('in_progress') && (
                  <Button 
                    size="sm"
                    onClick={() => updateOrderStage(order.orderId, `${type}_stitched`)}
                  >
                    Mark Complete
                  </Button>
                )}
                {!order.assignedWorker && (
                  <Button 
                    size="sm" 
                    variant="secondary"
                    disabled={assigningWorker === order.orderId}
                    onClick={() => assignWorker(order.orderId, `${type}-worker-01`)}
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
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading stitching orders...</span>
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
            <Shirt className="h-6 w-6" />
            Admin - Stitching Section Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{orders.length} orders in stitching stage</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="blouse" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="blouse">Blouse Stitching ({blouseOrders.length})</TabsTrigger>
              <TabsTrigger value="dress">Dress Stitching ({dressOrders.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="blouse" className="mt-6">
              {blouseOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No blouse orders in stitching stage
                </div>
              ) : (
                renderOrderTable(blouseOrders, 'blouse')
              )}
            </TabsContent>
            
            <TabsContent value="dress" className="mt-6">
              {dressOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No dress orders in stitching stage
                </div>
              ) : (
                renderOrderTable(dressOrders, 'dress')
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStitchingPage;