
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bill } from "@/types/billing";

interface RecentBillsProps {
  bills: Bill[];
}

const RecentBills = ({ bills }: RecentBillsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {bills.slice(-5).reverse().map((bill) => (
            <div key={bill.id} className="flex justify-between items-center p-2 border rounded">
              <div>
                <div className="font-medium text-sm">{bill.id}</div>
                <div className="text-xs text-gray-600">{bill.customerName}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">₹{bill.totalAmount}</div>
                <div className="text-xs text-gray-600">{bill.date}</div>
              </div>
            </div>
          ))}
          {bills.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No bills generated yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentBills;
