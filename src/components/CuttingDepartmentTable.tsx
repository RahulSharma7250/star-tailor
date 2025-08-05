import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Upload, Eye, Filter } from "lucide-react";
import { Bill, getNextStatus } from "@/types/billing";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CuttingDepartmentTableProps {
  user: { id: string; name: string; role: string };
}

const CuttingDepartmentTable = ({ user }: CuttingDepartmentTableProps) => {
  const [orders, setOrders] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();

  // Load and filter orders for cutting department
  useEffect(() => {
    const savedOrders = localStorage.getItem('tailorOrders');
    if (savedOrders) {
      const allOrders = JSON.parse(savedOrders);
      // Filter for cutting department orders
      const cuttingOrders = allOrders.filter((order: Bill) => order.status === 'cutting');
      setOrders(cuttingOrders);
    }
  }, []);

  // Filter and search functionality
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === "all" || 
        order.items.some(item => {
          if (filterType === "blouse") return item.clothType === "Blouse";
          if (filterType === "dress") return ["Kurti", "Jacket"].includes(item.clothType);
          return true;
        });
      
      return matchesSearch && matchesType;
    });
  }, [orders, searchTerm, filterType]);

  const handleStatusChange = (orderId: string, newStatus: 'processing' | 'done') => {
    if (newStatus === 'done') {
      // Move order to next stage
      const orderToUpdate = orders.find(order => order.id === orderId);
      if (!orderToUpdate) return;

      const nextStatus = getNextStatus(orderToUpdate.status, orderToUpdate.items);
      if (!nextStatus) return;

      // Update localStorage
      const savedOrders = localStorage.getItem('tailorOrders');
      const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
      
      const updatedOrders = allOrders.map((order: Bill) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: nextStatus,
            tailorId: undefined // Release to next department
          };
        }
        return order;
      });

      localStorage.setItem('tailorOrders', JSON.stringify(updatedOrders));
      
      // Remove from current list
      setOrders(prev => prev.filter(order => order.id !== orderId));

      toast({
        title: "Order Completed",
        description: `Order moved to ${nextStatus} stage.`,
      });
    }
  };

  const getItemType = (items: any[]) => {
    if (items.some(item => item.clothType === "Blouse")) return "Blouse";
    if (items.some(item => ["Kurti", "Jacket"].includes(item.clothType))) return "Dress";
    return "Other";
  };

  const getRowClassName = (order: Bill) => {
    // For now, we'll assume all orders in cutting are "Processing"
    // In a real app, you might track individual order processing status
    return cn(
      "hover:bg-muted/50 transition-colors",
      "bg-yellow-50 border-l-4 border-l-yellow-400" // Processing state
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cutting Department</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {filteredOrders.length} Orders
        </Badge>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Bill No or Customer Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                size="sm"
              >
                All ({orders.length})
              </Button>
              <Button
                variant={filterType === "blouse" ? "default" : "outline"}
                onClick={() => setFilterType("blouse")}
                size="sm"
              >
                Blouse ({orders.filter(o => o.items.some(i => i.clothType === "Blouse")).length})
              </Button>
              <Button
                variant={filterType === "dress" ? "default" : "outline"}
                onClick={() => setFilterType("dress")}
                size="sm"
              >
                Dress ({orders.filter(o => o.items.some(i => ["Kurti", "Jacket"].includes(i.clothType))).length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Bill No</TableHead>
                  <TableHead className="font-semibold">Customer Name</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Photo</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm || filterType !== "all" 
                        ? "No orders found matching your criteria"
                        : "No orders in cutting queue"
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const itemType = getItemType(order.items);
                    const isDressType = itemType === "Dress";
                    
                    return (
                      <TableRow key={order.id} className={getRowClassName(order)}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{order.billNo}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(order.billDate).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{order.customerName}</span>
                            <span className="text-xs text-muted-foreground">{order.mobile}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge 
                            variant={itemType === "Blouse" ? "secondary" : "default"}
                            className="text-xs"
                          >
                            {itemType}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {order.items.map(item => item.clothType).join(", ")}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {isDressType ? (
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="h-7 px-2">
                                <Upload className="h-3 w-3 mr-1" />
                                Upload
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 px-2">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold">₹{order.totalAmount}</span>
                            <span className="text-xs text-muted-foreground">
                              Balance: ₹{order.balance}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <RadioGroup
                            defaultValue="processing"
                            onValueChange={(value) => handleStatusChange(order.id!, value as 'processing' | 'done')}
                            className="flex items-center gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="processing" id={`processing-${order.id}`} />
                              <Label 
                                htmlFor={`processing-${order.id}`}
                                className="text-xs cursor-pointer"
                              >
                                Processing
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="done" id={`done-${order.id}`} />
                              <Label 
                                htmlFor={`done-${order.id}`}
                                className="text-xs cursor-pointer text-green-600"
                              >
                                Done
                              </Label>
                            </div>
                          </RadioGroup>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{orders.length}</div>
            <p className="text-xs text-muted-foreground">In Processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">0</div>
            <p className="text-xs text-muted-foreground">Completed Today</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CuttingDepartmentTable;