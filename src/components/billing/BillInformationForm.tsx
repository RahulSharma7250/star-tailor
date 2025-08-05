
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bill } from "@/types/billing";

interface BillInformationFormProps {
  currentBill: Bill;
  onBillChange: (updatedBill: Bill) => void;
  onCalculateTotal: (items: any[]) => void;
}

const BillInformationForm = ({ currentBill, onBillChange, onCalculateTotal }: BillInformationFormProps) => {
  const handleFieldChange = (field: keyof Bill, value: any) => {
    const updatedBill = { ...currentBill, [field]: value };
    onBillChange(updatedBill);
    
    if (field === 'previousBalance' || field === 'advance') {
      onCalculateTotal(currentBill.items);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bill Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="billNo">Bill Number</Label>
            <Input
              id="billNo"
              value={currentBill.billNo}
              onChange={(e) => handleFieldChange('billNo', e.target.value)}
              placeholder="Bill number"
            />
          </div>
          <div>
            <Label htmlFor="billDate">Bill Date</Label>
            <Input
              id="billDate"
              type="date"
              value={currentBill.billDate}
              onChange={(e) => handleFieldChange('billDate', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="deliveryDate">Delivery Date</Label>
            <Input
              id="deliveryDate"
              type="date"
              value={currentBill.deliveryDate}
              onChange={(e) => handleFieldChange('deliveryDate', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              value={currentBill.customerName}
              onChange={(e) => handleFieldChange('customerName', e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              value={currentBill.mobile}
              onChange={(e) => handleFieldChange('mobile', e.target.value)}
              placeholder="Enter mobile number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="previousBalance">Previous Balance (₹)</Label>
            <Input
              id="previousBalance"
              type="number"
              value={currentBill.previousBalance}
              onChange={(e) => handleFieldChange('previousBalance', parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="advance">Advance (₹)</Label>
            <Input
              id="advance"
              type="number"
              value={currentBill.advance}
              onChange={(e) => handleFieldChange('advance', parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="balance">Balance (₹)</Label>
            <Input
              id="balance"
              type="number"
              value={currentBill.balance}
              onChange={(e) => handleFieldChange('balance', parseFloat(e.target.value) || 0)}
              placeholder="0"
              readOnly
              className="bg-gray-100"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillInformationForm;
