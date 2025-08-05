
import { Calculator, QrCode, Printer, Send, Save, FileText, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Bill } from "@/types/billing";

interface BillSummaryProps {
  currentBill: Bill;
  onGenerateBill: () => void;
  onSaveBill: () => void;
  onPrintBill: () => void;
  onPrintTailorTag: () => void;
  isBulkOrder: boolean;
  onBulkOrderChange: (checked: boolean) => void;
}

const BillSummary = ({ 
  currentBill, 
  onGenerateBill, 
  onSaveBill,
  onPrintBill,
  onPrintTailorTag,
  isBulkOrder,
  onBulkOrderChange
}: BillSummaryProps) => {
  const subtotal = currentBill.items.reduce((sum, item) => sum + (item.qty * item.rate), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>Bill Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {currentBill.items.map((item, index) => (
            item.clothType && (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.clothType} x {item.qty}</span>
                <span>₹{item.qty * item.rate}</span>
              </div>
            )
          ))}
        </div>
        
        <div className="border-t pt-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>₹{subtotal}</span>
          </div>
          {currentBill.previousBalance > 0 && (
            <div className="flex justify-between text-sm text-orange-600">
              <span>Previous Balance:</span>
              <span>₹{currentBill.previousBalance}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-1">
            <span>Total Amount:</span>
            <span>₹{currentBill.totalAmount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Advance:</span>
            <span>₹{currentBill.advance}</span>
          </div>
          <div className="flex justify-between font-semibold text-base border-t pt-1">
            <span>Balance:</span>
            <span>₹{currentBill.balance}</span>
          </div>
        </div>

        {/* Bulk Order Checkbox */}
        <div className="flex items-center space-x-2 pt-2 border-t">
          <Checkbox 
            id="bulk-order" 
            checked={isBulkOrder}
            onCheckedChange={onBulkOrderChange}
          />
          <label htmlFor="bulk-order" className="text-sm font-medium">
            Bulk Order
          </label>
        </div>
        
        {currentBill.totalAmount > 0 && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <QrCode className="h-16 w-16 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">QR Code for Payment</p>
              <p className="text-xs text-gray-500">₹{currentBill.totalAmount}</p>
            </div>
            
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={onSaveBill} variant="outline" className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Bill
                </Button>
                <Button onClick={onGenerateBill} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Bill
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={onPrintBill} variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Bill
                </Button>
                <Button onClick={onPrintTailorTag} variant="outline" size="sm">
                  <Tag className="h-4 w-4 mr-2" />
                  Print Tailor Tag
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BillSummary;
