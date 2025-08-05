import { useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bill } from "@/types/billing";
import { toast } from "@/hooks/use-toast";

interface OrdersTableProps {
  bills: Bill[];
  onStatusUpdate?: (billId: string, newStatus: string) => void;
}

const OrdersTable = ({ bills, onStatusUpdate }: OrdersTableProps) => {
  const [localBills, setLocalBills] = useState<Bill[]>(bills);

  const handleStatusUpdate = (billId: string, newStatus: string) => {
    const updatedBills = localBills.map(bill => 
      bill.id === billId ? { ...bill, status: newStatus as Bill['status'] } : bill
    );
    setLocalBills(updatedBills);
    
    if (onStatusUpdate) {
      onStatusUpdate(billId, newStatus);
    }

    toast({
      title: "Status Updated",
      description: `Order ${billId} status updated to ${newStatus}`,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      cutting: "bg-blue-100 text-blue-800", 
      stitching: "bg-purple-100 text-purple-800",
      finishing: "bg-orange-100 text-orange-800",
      ironing: "bg-indigo-100 text-indigo-800",
      completed: "bg-green-100 text-green-800"
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order/Bill Number</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Item/Cloth Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Assigned Tailor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localBills.map((bill) => 
                bill.items.map((item, itemIndex) => (
                  <TableRow key={`${bill.id}-${itemIndex}`}>
                    <TableCell className="font-medium">{bill.billNo}</TableCell>
                    <TableCell>{bill.customerName}</TableCell>
                    <TableCell>{item.clothType}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{bill.tailorName || 'Not Assigned'}</TableCell>
                    <TableCell>{getStatusBadge(bill.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {bill.status !== 'cutting' && bill.status !== 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(bill.id!, 'cutting')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Processing
                          </Button>
                        )}
                        {bill.status !== 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(bill.id!, 'completed')}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Done
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {localBills.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersTable;