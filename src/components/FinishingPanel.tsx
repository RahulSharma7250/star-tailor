import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ArrowUpDown } from "lucide-react";
import { Bill } from "@/types/billing";
import { useToast } from "@/hooks/use-toast";

interface FinishingPanelProps {
  user: { id: string; name: string; role: string };
}

const FinishingPanel = ({ user }: FinishingPanelProps) => {
  const [orders, setOrders] = useState<Bill[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  useEffect(() => {
    const loadOrders = () => {
      const savedOrders = localStorage.getItem('tailorOrders');
      const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
      
      // Filter for orders in finishing stage
      const finishingOrders = allOrders.filter((order: Bill) => 
        order.status === 'finishing'
      );
      
      setOrders(finishingOrders);
      setFilteredOrders(finishingOrders);
    };

    loadOrders();
    
    // Set up polling to refresh data
    const interval = setInterval(loadOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = orders.filter(order => 
      order.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField as keyof Bill];
        let bValue = b[sortField as keyof Bill];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredOrders(filtered);
  }, [searchTerm, orders, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusToggle = (orderId: string, newStatus: boolean) => {
    const savedOrders = localStorage.getItem('tailorOrders');
    const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
    
    const updatedOrders = allOrders.map((order: Bill) => {
      if (order.id === orderId) {
        const updatedOrder = { 
          ...order, 
          status: newStatus ? 'ironing' : 'finishing',
          tailorId: newStatus ? undefined : user.id,
          tailorName: newStatus ? undefined : user.name
        };
        return updatedOrder;
      }
      return order;
    });

    localStorage.setItem('tailorOrders', JSON.stringify(updatedOrders));
    
    if (newStatus) {
      setOrders(prev => prev.filter(order => order.id !== orderId));
      setFilteredOrders(prev => prev.filter(order => order.id !== orderId));
      toast({
        title: "Order Completed",
        description: "Order moved to Ironing & Packing Department",
      });
    }
  };

  const getRowClassName = (order: Bill) => {
    if (order.tailorId === user.id) {
      return "bg-yellow-50 hover:bg-yellow-100"; // Processing
    }
    return "hover:bg-muted/50";
  };

  const getItemTypes = (order: Bill) => {
    return order.items.map(item => item.clothType).join(', ');
  };

  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <TableHead 
      className="font-semibold cursor-pointer hover:bg-gray-100"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-4 w-4" />
      </div>
    </TableHead>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Finishing Department</h1>
        <p className="text-gray-600">Welcome back, {user.name}</p>
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
              <SortableHeader field="billNo">Bill No</SortableHeader>
              <SortableHeader field="customerName">Customer Name</SortableHeader>
              <TableHead className="font-semibold">Type</TableHead>
              <SortableHeader field="totalAmount">Amount</SortableHeader>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No orders in finishing stage
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className={getRowClassName(order)}>
                  <TableCell className="font-medium">{order.billNo}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
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
                        Mark Done
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

export default FinishingPanel;