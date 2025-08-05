import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Bill, BillItem, Customer } from "@/types/billing";
import BillInformationForm from "./billing/BillInformationForm";
import ItemsForm from "./billing/ItemsForm";
import DesignInstructionsForm from "./billing/DesignInstructionsForm";
import BillSummary from "./billing/BillSummary";
import RecentBills from "./billing/RecentBills";
import CustomerSearch from "./billing/CustomerSearch";
import PrintBill from "./billing/PrintBill";
import PrintTailorTag from "./billing/PrintTailorTag";

const BillingPage = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentBill, setCurrentBill] = useState<Bill>({
    billNo: `ST${Date.now().toString().slice(-6)}`,
    customerName: "",
    mobile: "",
    previousBalance: 0,
    items: [{ clothType: "", qty: 1, rate: 0, measurements: {}, description: "" }],
    deliveryDate: "",
    designImage: null,
    instructions: "",
    totalAmount: 0,
    billDate: new Date().toISOString().split('T')[0],
    advance: 0,
    balance: 0,
    status: 'pending'
  });
  const [savedDrawing, setSavedDrawing] = useState<string | null>(null);
  const [isBulkOrder, setIsBulkOrder] = useState(false);
  const [showPrintBill, setShowPrintBill] = useState(false);
  const [showPrintTailorTag, setShowPrintTailorTag] = useState(false);
  const [billToPrint, setBillToPrint] = useState<Bill | null>(null);

  const addItem = () => {
    setCurrentBill({
      ...currentBill,
      items: [...currentBill.items, { clothType: "", qty: 1, rate: 0, measurements: {}, description: "" }]
    });
  };

  const updateItem = (index: number, field: keyof BillItem, value: any) => {
    const updatedItems = currentBill.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'clothType') {
          updatedItem.measurements = {};
        }
        return updatedItem;
      }
      return item;
    });
    setCurrentBill({ ...currentBill, items: updatedItems });
    calculateTotal(updatedItems);
  };

  const updateMeasurement = (itemIndex: number, measurementField: string, value: string) => {
    const updatedItems = currentBill.items.map((item, i) => {
      if (i === itemIndex) {
        return {
          ...item,
          measurements: {
            ...item.measurements,
            [measurementField]: value
          }
        };
      }
      return item;
    });
    setCurrentBill({ ...currentBill, items: updatedItems });
  };

  const removeItem = (index: number) => {
    const updatedItems = currentBill.items.filter((_, i) => i !== index);
    setCurrentBill({ ...currentBill, items: updatedItems });
    calculateTotal(updatedItems);
  };

  const calculateTotal = (items: BillItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
    const total = subtotal + currentBill.previousBalance;
    const balance = total - currentBill.advance;
    setCurrentBill(prev => ({ 
      ...prev, 
      totalAmount: total,
      balance: balance
    }));
  };

  const handleCustomerSelect = (customer: Customer | null) => {
    if (customer) {
      setCurrentBill({
        ...currentBill,
        customerName: customer.name,
        mobile: customer.mobile,
        previousBalance: customer.previousBalance
      });
      calculateTotal(currentBill.items);
    }
  };

  const handleBillSelect = (bill: Bill | null) => {
    if (bill) {
      setCurrentBill(bill);
    }
  };

  const saveBill = () => {
    if (!currentBill.customerName || currentBill.items.some(item => !item.clothType)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const bill: Bill = {
      id: currentBill.billNo,
      ...currentBill,
      date: new Date().toLocaleDateString(),
      qrCode: `upi://pay?pa=startailors@paytm&am=${currentBill.totalAmount}&cu=INR`,
      drawing: savedDrawing
    };

    setBills([...bills, bill]);
    
    // Update or add customer
    const existingCustomerIndex = customers.findIndex(c => c.mobile === bill.mobile);
    if (existingCustomerIndex >= 0) {
      const updatedCustomers = [...customers];
      updatedCustomers[existingCustomerIndex].bills.push(bill);
      updatedCustomers[existingCustomerIndex].previousBalance = bill.balance;
      setCustomers(updatedCustomers);
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: bill.customerName,
        mobile: bill.mobile,
        previousBalance: bill.balance,
        bills: [bill]
      };
      setCustomers([...customers, newCustomer]);
    }

    toast({
      title: "Bill Saved",
      description: `Bill ${bill.id} saved successfully`,
    });
  };

  const generateBill = () => {
    saveBill();
    toast({
      title: "Bill Generated",
      description: `Bill ${currentBill.billNo} generated successfully`,
    });
  };

  const handlePrintBill = () => {
    if (currentBill.customerName && currentBill.items.some(item => item.clothType)) {
      const bill: Bill = {
        id: currentBill.billNo,
        ...currentBill,
        date: new Date().toLocaleDateString(),
        qrCode: `upi://pay?pa=startailors@paytm&am=${currentBill.totalAmount}&cu=INR`
      };
      setBillToPrint(bill);
      setShowPrintBill(true);
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before printing",
        variant: "destructive"
      });
    }
  };

  const handlePrintTailorTag = () => {
    if (currentBill.customerName && currentBill.items.some(item => item.clothType)) {
      const bill: Bill = {
        id: currentBill.billNo,
        ...currentBill,
        date: new Date().toLocaleDateString(),
        qrCode: `upi://pay?pa=startailors@paytm&am=${currentBill.totalAmount}&cu=INR`
      };
      setBillToPrint(bill);
      setShowPrintTailorTag(true);
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before printing",
        variant: "destructive"
      });
    }
  };

  const handleSaveItems = () => {
    if (currentBill.items.some(item => !item.clothType)) {
      toast({
        title: "Missing Information",
        description: "Please select garment type for all items",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Items Saved",
      description: "Items and measurements have been saved successfully",
    });
  };

  const resetBill = () => {
    setCurrentBill({
      billNo: `ST${Date.now().toString().slice(-6)}`,
      customerName: "",
      mobile: "",
      previousBalance: 0,
      items: [{ clothType: "", qty: 1, rate: 0, measurements: {}, description: "" }],
      deliveryDate: "",
      designImage: null,
      instructions: "",
      totalAmount: 0,
      billDate: new Date().toISOString().split('T')[0],
      advance: 0,
      balance: 0,
      status: 'pending'
    });
    setSavedDrawing(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Billing System</h2>
          <Button onClick={resetBill} variant="outline">
            New Bill
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <CustomerSearch
              customers={customers}
              bills={bills}
              onCustomerSelect={handleCustomerSelect}
              onBillSelect={handleBillSelect}
            />

            <BillInformationForm
              currentBill={currentBill}
              onBillChange={setCurrentBill}
              onCalculateTotal={calculateTotal}
            />

            <ItemsForm
              items={currentBill.items}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onUpdateMeasurement={updateMeasurement}
              onRemoveItem={removeItem}
              onSaveItems={handleSaveItems}
            />

            <DesignInstructionsForm
              designImage={currentBill.designImage}
              instructions={currentBill.instructions}
              onImageUpload={(file) => setCurrentBill({ ...currentBill, designImage: file })}
              onInstructionsChange={(instructions) => setCurrentBill({ ...currentBill, instructions })}
              onDrawingSave={(dataUrl) => setSavedDrawing(dataUrl)}
            />
          </div>

          <div className="space-y-6">
            <BillSummary
              currentBill={currentBill}
              onGenerateBill={generateBill}
              onSaveBill={saveBill}
              onPrintBill={handlePrintBill}
              onPrintTailorTag={handlePrintTailorTag}
              isBulkOrder={isBulkOrder}
              onBulkOrderChange={setIsBulkOrder}
            />

            <RecentBills bills={bills} />
          </div>
        </div>
      </div>

      {/* Print Modals */}
      {showPrintBill && billToPrint && (
        <PrintBill
          bill={billToPrint}
          onClose={() => {
            setShowPrintBill(false);
            setBillToPrint(null);
          }}
        />
      )}

      {showPrintTailorTag && billToPrint && (
        <PrintTailorTag
          bill={billToPrint}
          onClose={() => {
            setShowPrintTailorTag(false);
            setBillToPrint(null);
          }}
        />
      )}
    </>
  );
};

export default BillingPage;
