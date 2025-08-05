import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MessageCircle, Send } from "lucide-react";
import { Bill } from "@/types/billing";
import { useToast } from "@/hooks/use-toast";

interface IroningPackingPanelProps {
  user: { id: string; name: string; role: string };
}

const IroningPackingPanel = ({ user }: IroningPackingPanelProps) => {
  const [orders, setOrders] = useState<Bill[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const loadOrders = () => {
      const savedOrders = localStorage.getItem('tailorOrders');
      const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
      
      // Filter for orders in ironing stage
      const ironingOrders = allOrders.filter((order: Bill) => 
        order.status === 'ironing'
      );
      
      setOrders(ironingOrders);
      setFilteredOrders(ironingOrders);
    };

    loadOrders();
    
    // Set up polling to refresh data
    const interval = setInterval(loadOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order => 
      order.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleStatusToggle = (orderId: string, newStatus: boolean) => {
    const savedOrders = localStorage.getItem('tailorOrders');
    const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
    
    const updatedOrders = allOrders.map((order: Bill) => {
      if (order.id === orderId) {
        const updatedOrder = { 
          ...order, 
          status: newStatus ? 'completed' : 'ironing',
          tailorId: newStatus ? undefined : user.id,
          tailorName: newStatus ? undefined : user.name,
          completedAt: newStatus ? new Date().toISOString() : undefined
        };
        return updatedOrder;
      }
      return order;
    });

    localStorage.setItem('tailorOrders', JSON.stringify(updatedOrders));
    
    if (newStatus) {
      const completedOrder = orders.find(order => order.id === orderId);
      if (completedOrder) {
        sendCustomerNotification(completedOrder);
      }
      setOrders(prev => prev.filter(order => order.id !== orderId));
      setFilteredOrders(prev => prev.filter(order => order.id !== orderId));
      toast({
        title: "Order Completed",
        description: "Customer has been notified. Order is ready for pickup.",
      });
    }
  };

  const sendCustomerNotification = (order: Bill) => {
    // Simulate SMS/WhatsApp notification
    const message = `Dear ${order.customerName}, your order #${order.billNo} is now completed and ready for pickup. Please collect it at your convenience. Thank you!`;
    
    // In a real app, this would integrate with SMS/WhatsApp APIs
    console.log(`SMS/WhatsApp sent to ${order.mobile}: ${message}`);
    
    toast({
      title: "Customer Notified",
      description: `SMS/WhatsApp sent to ${order.customerName} (${order.mobile})`,
      action: (
        <div className="flex items-center gap-1 text-green-600">
          <Send className="h-4 w-4" />
          <span>Sent</span>
        </div>
      ),
    });
  };

  const getRowClassName = (order: Bill) => {
    if (order.tailorId === user.id) {
      return "bg-yellow-50 hover:bg-yellow-100"; // Processing
    }
    return "hover:bg-muted/50";
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Ironing & Packing Department</h1>
        <p className="text-gray-600">Welcome back, {user.name}</p>
        <p className="text-sm text-gray-500 mt-1">
          <MessageCircle className="inline h-4 w-4 mr-1" />
          Customers are automatically notified when orders are completed
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by Bill No or Customer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredOrders.length} Orders
        </Badge>
      </div>

      {/* Excel-like Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Bill No</TableHead>
              <TableHead className="font-semibold">Customer Name</TableHead>
              <TableHead className="font-semibold">Mobile</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No orders in ironing & packing stage
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className={getRowClassName(order)}>
                  <TableCell className="font-medium">{order.billNo}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell className="text-sm text-gray-600">{order.mobile}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {order.items.map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {item.clothType}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>₹{order.totalAmount}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Processing</span>
                      <Switch
                        checked={false}
                        onCheckedChange={(checked) => handleStatusToggle(order.id!, checked)}
                        disabled={order.tailorId !== user.id && !!order.tailorId}
                      />
                      <span className="text-sm">Done</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {!order.tailorId ? (
                      <Button
                        size="sm"
                        onClick={() => handleStatusToggle(order.id!, false)}
                        variant="outline"
                      >
                        Accept
                      </Button>
                    ) : order.tailorId === user.id ? (
                      <Button
                        size="sm"
                        onClick={() => handleStatusToggle(order.id!, true)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Complete & Notify
                      </Button>
                    ) : (
                      <Badge variant="outline">Assigned</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default IroningPackingPanel;