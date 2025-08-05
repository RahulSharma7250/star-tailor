
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer, Bill } from "@/types/billing";

interface CustomerSearchProps {
  customers: Customer[];
  bills: Bill[];
  onCustomerSelect: (customer: Customer | null) => void;
  onBillSelect: (bill: Bill | null) => void;
}

const CustomerSearch = ({ customers, bills, onCustomerSelect, onBillSelect }: CustomerSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    customers: Customer[];
    bills: Bill[];
  }>({ customers: [], bills: [] });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults({ customers: [], bills: [] });
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Search customers by name or mobile
    const matchingCustomers = customers.filter(customer => 
      customer.name.toLowerCase().includes(query) ||
      customer.mobile.includes(query)
    );

    // Search bills by bill number, customer name, or mobile
    const matchingBills = bills.filter(bill => 
      bill.billNo.toLowerCase().includes(query) ||
      bill.customerName.toLowerCase().includes(query) ||
      bill.mobile.includes(query)
    );

    setSearchResults({
      customers: matchingCustomers,
      bills: matchingBills
    });
  };

  const handleCustomerClick = (customer: Customer) => {
    onCustomerSelect(customer);
    setSearchQuery("");
    setSearchResults({ customers: [], bills: [] });
  };

  const handleBillClick = (bill: Bill) => {
    onBillSelect(bill);
    setSearchQuery("");
    setSearchResults({ customers: [], bills: [] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search by name, bill number, or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {(searchResults.customers.length > 0 || searchResults.bills.length > 0) && (
          <div className="space-y-4">
            {searchResults.customers.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Customers</h4>
                <div className="space-y-2">
                  {searchResults.customers.map((customer) => (
                    <div
                      key={customer.id}
                      className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                      onClick={() => handleCustomerClick(customer)}
                    >
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-600">{customer.mobile}</div>
                      <div className="text-sm text-gray-600">Balance: ₹{customer.previousBalance}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.bills.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Bills</h4>
                <div className="space-y-2">
                  {searchResults.bills.map((bill) => (
                    <div
                      key={bill.id}
                      className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                      onClick={() => handleBillClick(bill)}
                    >
                      <div className="font-medium">{bill.billNo}</div>
                      <div className="text-sm text-gray-600">{bill.customerName} - {bill.mobile}</div>
                      <div className="text-sm text-gray-600">₹{bill.totalAmount} - {bill.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerSearch;
