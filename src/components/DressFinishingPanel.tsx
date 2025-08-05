import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ArrowUpDown } from "lucide-react";
import { Bill } from "@/types/billing";
import { useToast } from "@/hooks/use-toast";

interface DressFinishingPanelProps {
  user: { id: string; name: string; role: string };
}

const DressFinishingPanel = ({ user }: DressFinishingPanelProps) => {
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
      
      // Filter for orders in finishing stage with dress items (Kurti, Jacket, etc.)
      const dressFinishingOrders = allOrders.filter((order: Bill) => 
        order.status === 'finishing' && 
        order.items.some(item => ['Kurti', 'Jacket'].includes(item.clothType))
      );
      
      setOrders(dressFinishingOrders);
      setFilteredOrders(dressFinishingOrders);
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

  const handleStartFinishing = (orderId: string) => {
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

    localStorage.setItem('tailorOrders', JSON.stringify(updatedOrders));
    
    // Update local state
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, tailorId: user.id, tailorName: user.name, acceptedAt: new Date().toISOString() }
        : order
    ));

    toast({
      title: "Finishing Started",
      description: "Order assigned to you for finishing",
    });
  };

  const handleMarkDone = (orderId: string) => {
    const savedOrders = localStorage.getItem('tailorOrders');
    const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
    
    const updatedOrders = allOrders.map((order: Bill) => {
      if (order.id === orderId) {
        return { 
          ...order, 
          status: 'ironing',
          completedAt: new Date().toISOString()
        };
      }
      return order;
    });

    localStorage.setItem('tailorOrders', JSON.stringify(updatedOrders));
    
    // Remove from local state
    setOrders(prev => prev.filter(order => order.id !== orderId));
    setFilteredOrders(prev => prev.filter(order => order.id !== orderId));

    toast({
      title: "Finishing Completed",
      description: "Order moved to Ironing section",
    });
  };

  const getRowClassName = (order: Bill) => {
    if (order.tailorId === user.id) {
      return "bg-purple-50 hover:bg-purple-100";
    }
    return "hover:bg-muted/50";
  };

  const getDressType = (order: Bill) => {
    const dressItems = order.items.filter(item => ['Kurti', 'Jacket'].includes(item.clothType));
    return dressItems.map(item => item.clothType).join(', ');
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
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
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
          {filteredOrders.length} Dress Orders
        </Badge>
      </div>

      {/* Orders Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <SortableHeader field="billNo">Order ID</SortableHeader>
              <SortableHeader field="customerName">Customer Name</SortableHeader>
              <TableHead className="font-semibold">Order Type</TableHead>
              <TableHead className="font-semibold">Stitching Status</TableHead>
              <TableHead className="font-semibold">Finishing Status</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No dress orders in finishing stage
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className={getRowClassName(order)}>
                  <TableCell className="font-medium">{order.billNo}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getDressType(order)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Done
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.tailorId === user.id ? (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        In Progress
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {!order.tailorId ? (
                      <Button
                        size="sm"
                        onClick={() => handleStartFinishing(order.id!)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Start Finishing
                      </Button>
                    ) : order.tailorId === user.id ? (
                      <Button
                        size="sm"
                        onClick={() => handleMarkDone(order.id!)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Done
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

export default DressFinishingPanel;